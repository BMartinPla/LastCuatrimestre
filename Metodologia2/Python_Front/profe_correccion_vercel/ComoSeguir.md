# Cómo seguir: POST, PUT y DELETE

Hoy la API es de solo lectura: todas las rutas son `GET`. Esta guía explica qué hay que agregar para crear, modificar y borrar datos, y para que el front lo muestre. Los pasos están en el orden en que conviene hacerlos y nombran los archivos y funciones que ya existen.

## 0. Antes de empezar

### Qué se va a poder modificar

No hace falta hacerlo todo de una vez. Conviene arrancar por una sola entidad, completar el circuito entero (API, pruebas y front) y después repetir con las demás.

| Prioridad | Entidad | Para qué sirve |
|---|---|---|
| 1 | `Asignatura` | Alta, edición y baja de materias. Es la más simple y la que más se ve en el front. |
| 2 | `AsignaturaPlan` | Agregar una materia a un plan, cambiarla de período o sacarla del plan. |
| 3 | `Correlativa` | Cargar correlatividades. El tablero ya sabe dibujarlas y el progreso ya las respeta. |
| 4 | Catálogos (`AreaAcademica`, `PeriodoCursado`, `RegimenCursado`, `TipoCorrelativa`) | Mantenimiento de las tablas de referencia. |
| 5 | `Institucion`, `Carrera`, `CarreraInstitucion`, `PlanEstudio` | Solo si el proyecto va a manejar más de una carrera o plan. |

### Convenciones REST

Para que todas las rutas se comporten igual:

| Operación | Método y ruta | Respuesta si sale bien |
|---|---|---|
| Crear | `POST /asignaturas/` con el cuerpo en JSON | `201 Created` y el objeto creado (con su `id`) |
| Modificar | `PUT /asignatura/{id}` con el objeto completo | `200 OK` y el objeto actualizado |
| Borrar | `DELETE /asignatura/{id}` | `204 No Content`, sin cuerpo |

Y para los errores:

| Código | Cuándo |
|---|---|
| `404` | El id de la ruta no existe. Ya está resuelto con `GetCarrera.NoEncontrado`. |
| `409 Conflict` | Se viola una regla de la base: nombre repetido, o borrar algo que otra tabla usa. |
| `422` | El cuerpo no tiene el formato correcto. FastAPI lo responde solo, a partir de los modelos de `schemas.py`. |

Las rutas actuales mezclan singular y plural (`/asignaturas/` para la lista y `/asignatura/{id}` para una). Conviene mantener ese mismo esquema para no romper lo que ya existe: `POST` va sobre la ruta en plural y `PUT`/`DELETE` sobre la ruta con id.

### Una regla clave: qué pasa al borrar

`database.py` activa las claves foráneas, así que SQLite no deja borrar una asignatura que está en un plan, ni una fila de `AsignaturaPlan` que tiene correlativas. Hay dos opciones:

- **Bloquear (recomendado):** responder `409` con un mensaje que explique por qué ("la asignatura está en el Plan 2024: sacala del plan primero").
- **Borrar en cascada:** borrar también todo lo que depende. Es más cómodo, pero un clic puede borrar mucho sin aviso.

Los ejemplos de abajo bloquean.

## 1. Backend

### 1.1 Modelos de entrada en `schemas.py`

Los modelos que hay hoy describen lo que la API **devuelve**. Para lo que **recibe** hacen falta modelos nuevos, sin `id` (lo pone la base) y con validaciones:

```python
from pydantic import BaseModel, Field


class AsignaturaEntrada(BaseModel):
    nombre: str = Field(min_length=1, max_length=256)
    area_academica_id: int


class AsignaturaPlanEntrada(BaseModel):
    plan_estudio_id: int
    asignatura_id: int
    periodo_cursado_id: int


class CorrelativaEntrada(BaseModel):
    plan_estudio_id: int
    asignatura_id: int               # la materia que pide la correlativa
    correlativa_asignatura_id: int   # la materia que hay que tener
    tipocorrelativa_id: int          # Cursada o Aprobada
```

Con eso, `/docs` muestra un formulario para cada `POST` y `PUT`, y FastAPI responde `422` si falta un campo o tiene el tipo equivocado.

### 1.2 Un módulo de escritura: `EscriboCarrera.py`

Así como `GetCarrera.py` agrupa las lecturas, conviene un archivo aparte para las escrituras. Cada función usa `Session.begin()`, que hace commit al salir del `with` o rollback si hay un error, igual que `CargaCarrera.py`.

```python
"""Altas, modificaciones y bajas en db/Facultad.db."""
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

import GetCarrera
from database import Session
from modelscarrera import AreaAcademica, Asignatura, AsignaturaPlan


class Conflicto(Exception):
    """La operación viola una regla de la base; la API lo responde con un 409."""


def _buscar(session, modelo, id_, que):
    objeto = session.get(modelo, id_)
    if objeto is None:
        raise GetCarrera.NoEncontrado(f"No existe {que} con id {id_}")
    return objeto


def crearAsignatura(datos):
    try:
        with Session.begin() as session:
            _buscar(session, AreaAcademica, datos.area_academica_id, "el área académica")
            asignatura = Asignatura(nombre=datos.nombre, area_academica_id=datos.area_academica_id)
            session.add(asignatura)
            session.flush()  # para que la base le asigne el id
            nuevo_id = asignatura.id
    except IntegrityError as error:
        raise Conflicto(f"Ya existe una asignatura llamada {datos.nombre} en esa área") from error
    return GetCarrera.gAsignatura(nuevo_id)[0]


def actualizarAsignatura(asignatura_id, datos):
    try:
        with Session.begin() as session:
            asignatura = _buscar(session, Asignatura, asignatura_id, "la asignatura")
            _buscar(session, AreaAcademica, datos.area_academica_id, "el área académica")
            asignatura.nombre = datos.nombre
            asignatura.area_academica_id = datos.area_academica_id
    except IntegrityError as error:
        raise Conflicto(f"Ya existe una asignatura llamada {datos.nombre} en esa área") from error
    return GetCarrera.gAsignatura(asignatura_id)[0]


def borrarAsignatura(asignatura_id):
    with Session.begin() as session:
        asignatura = _buscar(session, Asignatura, asignatura_id, "la asignatura")
        en_planes = session.scalar(select(func.count()).select_from(AsignaturaPlan)
                                   .where(AsignaturaPlan.asignatura_id == asignatura_id))
        if en_planes:
            raise Conflicto(f"{asignatura.nombre} está en {en_planes} plan(es): sacala del plan primero")
        session.delete(asignatura)
```

Tres cosas que conviene revisar con cuidado:

- **Comprobar antes de borrar, no esperar el error de la base.** Sin la consulta de `borrarAsignatura`, SQLAlchemy intentaría poner en `NULL` el `asignatura_id` de las filas relacionadas, y el error sería "NOT NULL constraint failed": confuso para el usuario.
- **Validar los ids que vienen en el cuerpo**, como el área en el ejemplo. Si no, un área inexistente termina en un error genérico de clave foránea.
- **Correlativas:** `crearCorrelativa` tiene que traducir los dos `asignatura_id` del cuerpo a filas de `AsignaturaPlan` del plan indicado, igual que hacía la carga original. Reglas que vale la pena validar:
  - las dos materias tienen que estar en ese plan;
  - una materia no puede ser correlativa de sí misma (la base ya lo impide con un `CHECK`);
  - la correlativa tendría que estar en un período anterior;
  - no se deberían formar ciclos (A pide B y B pide A).

### 1.3 Rutas en `main.py`

```python
import EscriboCarrera

CONFLICTO = {409: {"description": "Viola una regla de la base"}}


@app.exception_handler(EscriboCarrera.Conflicto)
def conflicto(request: Request, error: EscriboCarrera.Conflicto):
    return JSONResponse(status_code=409, content={"detail": str(error)})


@app.post("/asignaturas/", status_code=201, tags=["Asignaturas"], summary="Crear una asignatura",
          responses={**NO_EXISTE, **CONFLICTO})
def post_asignatura(datos: schemas.AsignaturaEntrada) -> schemas.Asignatura:
    return EscriboCarrera.crearAsignatura(datos)


@app.put("/asignatura/{asignatura_id}", tags=["Asignaturas"], summary="Modificar una asignatura",
         responses={**NO_EXISTE, **CONFLICTO})
def put_asignatura(asignatura_id: int, datos: schemas.AsignaturaEntrada) -> schemas.Asignatura:
    return EscriboCarrera.actualizarAsignatura(asignatura_id, datos)


@app.delete("/asignatura/{asignatura_id}", status_code=204, tags=["Asignaturas"],
            summary="Borrar una asignatura", responses={**NO_EXISTE, **CONFLICTO})
def delete_asignatura(asignatura_id: int) -> None:
    EscriboCarrera.borrarAsignatura(asignatura_id)
```

Rutas equivalentes para el resto:

| Método y ruta | Cuerpo | Qué hace |
|---|---|---|
| `POST /asignaturasplan/` | `AsignaturaPlanEntrada` | Agrega una materia a un plan |
| `PUT /asignaturaplan/{id}` | `AsignaturaPlanEntrada` | La cambia de período |
| `DELETE /asignaturaplan/{id}` | — | La saca del plan (409 si tiene correlativas) |
| `POST /correlativas/` | `CorrelativaEntrada` | Agrega una correlatividad |
| `DELETE /correlativa/{id}` | — | Borra una correlatividad |

Ojo: hoy `/asignaturaplan/{asignatura_id}` (GET) usa el id de la **asignatura**, pero para `PUT` y `DELETE` hace falta el id de la fila de **AsignaturaPlan** (el `id` de `vAsignaturaPlan`). Para no confundirlos, se puede usar otra ruta, por ejemplo `/plan/materia/{id}`, o documentar bien la diferencia.

### 1.4 CORS

En `main.py`, la línea 36 solo permite `GET`:

```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])
```

Hay que agregar los métodos nuevos. Además, ahora que la API puede modificar datos, conviene dejar de aceptar cualquier origen y limitarlo a los del front:

```python
ORIGENES = ["http://127.0.0.1:8000", "http://localhost:8000", "http://127.0.0.1:5500", "http://localhost:5500"]
app.add_middleware(CORSMiddleware, allow_origins=ORIGENES,
                   allow_methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type"])
```

Con esto, abrir `index.html` con doble clic (`file://`) deja de funcionar para escribir, porque ese origen es `null`. Hay que abrir el front desde la API o desde Live Server.

### 1.5 Probar el backend antes de tocar el front

- **En `/docs`:** cada ruta nueva tiene el botón "Try it out".
- **Desde PowerShell:**
  ```
  Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/asignaturas/ -ContentType "application/json" -Body '{"nombre": "Prueba", "area_academica_id": 2}'
  Invoke-RestMethod -Method Delete -Uri http://127.0.0.1:8000/asignatura/19
  ```
- **Con pruebas automáticas (`pytest` y `fastapi.testclient.TestClient`):** hoy `database.py` siempre apunta a `db/Facultad.db`, y las pruebas no tendrían que tocar la base real. Conviene que la ruta se pueda cambiar con una variable de entorno:
  ```python
  import os
  DB_PATH = Path(os.environ.get("FACULTAD_DB", BASE_DIR / "db" / "Facultad.db"))
  ```
  Así cada prueba crea una base temporal con `db/Carrera.sql`, carga los datos y la descarta al terminar.

Casos que vale la pena probar:
- crear y leer lo creado;
- crear un nombre repetido (409);
- modificar un id inexistente (404);
- mandar un cuerpo sin `nombre` (422);
- borrar una materia que está en un plan (409);
- borrar una que no está en ningún plan (204, y después un `GET` da 404).

### 1.6 Ojo con `CargaCarrera.py --reset`

`--reset` borra **todo** y vuelve a cargar los datos iniciales, así que se pierde lo que se haya creado desde la API. Antes de usarlo, guardar una copia: `Copy-Item .\db\Facultad.db .\db\Facultad.respaldo.db`.

## 2. Front

### 2.1 Mandar datos: `API.enviar` en `static/app.js`

Hoy `API.pedir(ruta)` (línea 214) solo hace `GET`. Hay que agregar un método que mande JSON y entienda las respuestas nuevas:

```js
async enviar(metodo, ruta, cuerpo) {
  const res = await fetch(this.base + ruta, {
    method: metodo,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });
  if (res.status === 204) return null;            // DELETE: no hay cuerpo
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    // El 422 trae una lista de errores, el 404 y el 409 traen un texto.
    const detalle = datos && datos.detail;
    const mensaje = Array.isArray(detalle)
      ? detalle.map((e) => `${e.loc.at(-1)}: ${e.msg}`).join(". ")
      : detalle || `${res.status} ${res.statusText}`;
    throw Object.assign(new Error(mensaje), { status: res.status });
  }
  return datos;
},
```

### 2.2 Recargar los datos sin duplicar nada

Después de cada cambio, lo más simple y seguro es volver a pedir todo y redibujar:

```js
async function recargar() {
  const fichaAbierta = S.ficha && S.ficha.id;
  await cargarDatos();
  renderTodo();
  const m = fichaAbierta && S.M.materias.find((x) => x.id === fichaAbierta);
  if (m) abrirFicha(m); else cerrarFicha();
}
```

Pero hoy `renderTodo()` (línea 1911) está pensada para correr una sola vez, y llamarla de nuevo duplica cosas:

- `renderExplorador()` agrega otra vez el listener de `#ex-filtro` (línea 1339). Hay que moverlo a `conectarEventos()`.
- `activarScrollSpy()` crea un `IntersectionObserver` nuevo cada vez. Hay que llamarla una sola vez desde `iniciar()`.
- `renderTablero()` crea un `ResizeObserver` nuevo (línea 630). Hay que guardarlo en `S` y crearlo solo si no existe.
- El selector de plan (línea 1924) se vuelve a agregar si hay más de un plan. Hay que crearlo una vez y solo actualizar sus opciones.
- `renderExplorador()` vuelve a seleccionar y enviar el endpoint inicial. Si ya había uno elegido, hay que mantenerlo.
- `S.panelApi` guarda la respuesta vieja de la ficha. Hay que ponerlo en `null` en `recargar()`.

Además, el progreso del alumno (`mapa.progreso` en localStorage) está guardado por id de asignatura. Si se borra una materia, queda una entrada huérfana: al cargar, conviene descartar los ids que ya no existen.

### 2.3 Dónde se ve cada operación

| Operación | Dónde | Cómo |
|---|---|---|
| Crear materia | Plan de estudio, barra de herramientas | Botón **Nueva materia** que abre un formulario: nombre, área (select desde `/areaacademica/`) y período (select desde `/periodocursado/`). Hace `POST /asignaturas/` y después `POST /asignaturasplan/`. |
| Editar materia | Ficha de la materia | Botón **Editar**: el título y el área pasan a ser campos. Al guardar hace `PUT /asignatura/{id}`. |
| Cambiar de período | Ficha (y como extra, arrastrar la tarjeta a otra columna) | `PUT` sobre la fila de AsignaturaPlan |
| Sacar del plan / borrar | Ficha | Botones **Sacar del plan** y **Eliminar**, con confirmación. Si la API responde 409, mostrar su mensaje. |
| Agregar correlativa | Ficha, sección "Para cursarla y rendirla" | Botón **Agregar**: select con las materias de períodos anteriores y el tipo (Cursada o Aprobada). Hace `POST /correlativas/`. |
| Quitar correlativa | Ficha, en cada requisito | Botón **×** que hace `DELETE /correlativa/{id}` |
| Catálogos | Tarjetas de la sección Datos | Edición en línea: lápiz para renombrar, **+** para agregar, papelera para borrar |

Para que las correlativas se puedan quitar desde la ficha, `construirModelo()` tiene que guardar también el `id` de cada correlativa (hoy guarda solo `ap` y `tipo` en `reqs`). Ese `id` ya viene en `/correlativas/`.

Cuando se carga la primera correlativa, `S.hayCorrelativas` pasa a `true` y, después de `recargar()`, el tablero empieza a dibujar las curvas solo: no hace falta tocar esa parte.

### 2.4 Detalles que hacen la diferencia

- **Confirmar antes de borrar**, nombrando qué se borra: "¿Eliminar Programación IV? No se puede deshacer."
- **Desactivar el botón mientras viaja el pedido**, para que un doble clic no cree la materia dos veces.
- **Mostrar el resultado** con `avisar()`: "Materia creada" en verde, o el mensaje del 409 o el 422 en rojo.
- **Validar en el formulario** lo mismo que valida la API (nombre obligatorio, máximo 256 caracteres), para avisar antes de enviar. La validación de la API se mantiene igual, porque se la puede llamar sin el front.
- **Mantener el foco del teclado** donde estaba después de guardar (por ejemplo, en el botón Editar de la ficha).

### 2.5 El explorador de la API

El explorador ya lee todos los endpoints de `/openapi.json`, así que las rutas nuevas aparecen solas en la lista. Pero hoy solo sabe mandar `GET` con parámetros de ruta y de query. Para el resto:

1. En `renderExplorador()` (línea 1318), guardar también `op.requestBody`. El esquema del cuerpo está en `spec.components.schemas`, apuntado por `requestBody.content["application/json"].schema.$ref`.
2. En `seleccionarEndpoint()` (línea 1394), si hay cuerpo, mostrar un `<textarea>` con un JSON de ejemplo armado a partir de las propiedades del esquema (`{"nombre": "", "area_academica_id": 0}`).
3. En `enviar()` (línea 1434), usar `API.enviar(ep.metodo, ruta, cuerpo)` para todo lo que no sea `GET`, y pedir confirmación antes de un `DELETE`.
4. Darle un color a cada método en la lista: hoy `.metodo` es siempre verde. Por ejemplo, `POST` azul, `PUT` naranja y `DELETE` rojo, siempre con el nombre escrito.
5. Mostrar bien el `204`: "Sin contenido (se borró correctamente)" en lugar de un JSON vacío.
6. Actualizar los ejemplos de **cURL** y **fetch** para que incluyan `-X POST`, la cabecera y el cuerpo.

## 3. Seguridad, cuando la API escribe

- Hoy cualquiera que llegue al puerto 8000 puede leer. Con `POST`, `PUT` y `DELETE` también podría borrar. Mientras corra solo en `127.0.0.1` alcanza, pero no hay que exponerla en la red tal como está.
- El siguiente paso sería autenticación. FastAPI trae `fastapi.security` (por ejemplo, `OAuth2PasswordBearer`), y los apuntes de usuarios que el profe tenía en versiones anteriores (`git show 8da2aeb:db/Usuarios.sql` en `profe2`) pueden servir de base para la tabla.
- Nunca armar SQL concatenando texto que viene del usuario. Con SQLAlchemy, como en los ejemplos, eso ya está resuelto.

## 4. Lista de tareas

Backend:
- [ ] Modelos de entrada en `schemas.py`
- [ ] `EscriboCarrera.py` con `Conflicto` y las funciones de `Asignatura`
- [ ] Rutas `POST`, `PUT` y `DELETE` de asignaturas y el manejador del 409 en `main.py`
- [ ] CORS con los métodos nuevos y los orígenes limitados
- [ ] Probar en `/docs` y con `Invoke-RestMethod`
- [ ] `FACULTAD_DB` en `database.py` y pruebas con `pytest`
- [ ] Repetir para `AsignaturaPlan` y `Correlativa`, y después los catálogos

Front:
- [ ] `API.enviar` en `static/app.js`
- [ ] Hacer que `renderTodo()` se pueda llamar varias veces sin duplicar nada, y crear `recargar()`
- [ ] Formulario **Nueva materia** y botones **Editar**, **Sacar del plan** y **Eliminar** en la ficha
- [ ] Agregar y quitar correlativas desde la ficha (guardar el `id` en `construirModelo()`)
- [ ] Edición de catálogos en la sección Datos
- [ ] Explorador con cuerpo JSON, confirmación de `DELETE` y colores por método
- [ ] Limpiar del progreso los ids que ya no existen

Documentación:
- [ ] Agregar las rutas nuevas a la tabla del `HowTo.md`
- [ ] Anotar en `CAMBIOS.md` qué se agregó
