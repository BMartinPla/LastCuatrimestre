# Cambios respecto de `profe2` y qué muestra el front

`profe2` es la versión original del profe y quedó sin tocar. `profe_correccion` es una copia con las correcciones de abajo y un front nuevo. Para instalar y arrancar todo, ver [HowTo.md](HowTo.md).

## Resumen por archivo

| Archivo | En `profe2` | En `profe_correccion` |
|---|---|---|
| `HowTo.md` | Pasos con errores: la base quedaba en otra carpeta, `sqlcodegen` mal escrito, `C:\Usuarios` | Reescrito y probado de punta a punta en PowerShell |
| `db/Carrera.sql` | Esquema original | Vistas corregidas y restricciones completas |
| `modelscarrera.py` | Generado de un esquema al que se le escapaban restricciones | Regenerado con sqlacodegen desde el esquema corregido |
| `CargaCarrera.py` | Carga con `rollback` en cada paso | Una sola transacción, sin duplicados y con `--reset` |
| `GetCarrera.py` | 10 funciones casi iguales que devuelven texto JSON | Una consulta genérica que devuelve diccionarios |
| `main.py` | 16 rutas, sin manejo de errores | Rutas corregidas, errores 404/503, CORS, sirve el front |
| `index.html` | Lista de links, dos de ellos rotos | Front completo (ver más abajo) |
| `database.py` | No existía | Conexión única a la base |
| `schemas.py` | No existía | Formato de cada respuesta, para `/docs` |
| `static/` | No existía | Estilos, lógica e ícono del front |
| `requirements.txt` | No existía | Dependencias del proyecto |
| `venv/` | No existía: el HowTo decía cómo crearlo, pero no qué instalar | Entorno virtual con las dependencias de `requirements.txt` |
| `.gitignore` | Ignoraba `venv/` y bases viejas, pero no `Facultad.db` | Sigue ignorando `venv/` y además `db/*.db`, `models.py` y `sqlite3.exe` |

## Qué se cambió

### Entorno virtual (`venv/`)

- **Qué es:** una copia de Python solo para este proyecto, con FastAPI, SQLAlchemy y sqlacodegen instalados ahí y no en el Python de la computadora. Así distintos proyectos pueden usar versiones distintas sin pisarse.
- **Cómo se creó:** con los pasos 2 y 3 del HowTo:
  ```
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```
- **Qué cambió respecto de `profe2`:**
  - El HowTo original creaba el venv, pero no instalaba SQLAlchemy de forma explícita (llegaba como dependencia de sqlacodegen) y tenía mal escrito `sqlcodegen`.
  - Ahora todas las dependencias están en `requirements.txt`, con su versión mínima.
- **Hay que activarlo en cada terminal nueva.** Si no está activo, PowerShell responde "El término 'fastapi' no se reconoce…". Se nota que está activo porque aparece `(venv)` delante del prompt.
- **No se puede mover ni renombrar la carpeta del proyecto.** Los ejecutables del venv (`fastapi.exe`, `pip.exe`) guardan la ruta completa donde se crearon. Si la carpeta cambia de nombre o de lugar, dejan de funcionar. Esto ya pasó al renombrar `Python y Front` a `Python_Front`, y se arregló creando el venv de nuevo:
  ```
  Remove-Item -Recurse -Force .\venv
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  pip install -r requirements.txt
  ```
- **No se comparte ni se sube a git:** pesa mucho y solo funciona en la máquina y la ruta donde se creó. Por eso `.gitignore` lo ignora. Para pasar el proyecto a otra persona se comparte sin `venv/`, y esa persona lo crea con los pasos de arriba.

### HowTo

- **La base se crea en `db\Facultad.db`**, que es donde la busca el código. Antes se creaba en la raíz: la carga fallaba tabla por tabla y la API respondía 500 "no such table".
- **`pip install sqlcodegen` tenía un error de tipeo:** el paquete es `sqlacodegen`. Ahora todo se instala con `pip install -r requirements.txt`.
- **El paso de sqlacodegen es opcional**, apunta a `db/Facultad.db` y usa `--outfile`. El `>` de Windows PowerShell guarda en UTF-16 y Python no lo puede leer.
- **`CargaCarrera.py` se ejecuta con `python CargaCarrera.py`:** PowerShell no corre un `.py` de la carpeta actual sin `.\`. El paso ahora dice lo que hace: carga datos, no crea modelos.
- **`C:\Usuarios` no existe:** la ruta es `C:\Users`. Se agrega el `cd` a la carpeta del proyecto.
- **Se agregan:**
  - la versión mínima de Python (3.10);
  - cómo destrabar `Activate.ps1`;
  - cómo probar y la tabla de rutas;
  - una sección de problemas frecuentes;
  - la corrección del typo "index.hmtl".

### Base de datos (`db/Carrera.sql`)

- **`vAsignaturaPlan` muestra `id`** (el de AsignaturaPlan), que es lo que referencia la tabla `Correlativa`. Sin eso no se podían relacionar correlativas desde la API.
- **`vCorrelativa`:** la columna `nombre` pasa a llamarse `tipo_correlativa`, y se agregan `id`, `plan_estudio_id`, `asignatura_id` y `correlativa_asignatura_id`.
- **`vPlanEstudio`** agrega `fin` (año de finalización).
- **Restricciones UNIQUE:** ahora tienen nombre y están en una sola línea. Antes sqlacodegen no detectaba los `unique` de `nombre` ni `unq_correlativa`, y `modelscarrera.py` salía incompleto.
- **CHECK nuevos:** una materia no puede ser correlativa de sí misma, y el año de fin no puede ser anterior al de inicio.
- **`pragma foreign_keys = on`** al principio del script.

### Python

- **`database.py` (nuevo):** una sola conexión, compartida por la carga y la API.
  - Activa las claves foráneas en cada conexión. SQLite las trae apagadas, así que antes se podía guardar una asignatura con un área inexistente.
  - Arma la ruta a partir de la ubicación del archivo, así funciona desde cualquier carpeta.
  - Si la base no existe, avisa en lugar de crear un archivo vacío.
- **`CargaCarrera.py`:**
  - Todo va en una sola transacción. Antes cada `rollback()` deshacía también lo cargado por las funciones anteriores, y la carga podía quedar a medias.
  - Si se corre dos veces no duplica nada. Con `--reset` borra los datos y los vuelve a cargar.
  - Si algo falla, termina con código de error y un mensaje claro. Antes solo imprimía el error y seguía.
  - Busca las áreas por nombre en lugar de usar ids fijos.
  - Corrige los mensajes de error copiados mal.
  - Ya no se ejecuta al importarlo (`if __name__ == "__main__"`).
  - `PlanEstudio.periodos` vale 5 (4 cuatrimestres más el trabajo final). Antes quedaba en 1.
- **`GetCarrera.py`:**
  - Una función genérica reemplaza las 10 copias.
  - Devuelve listas de diccionarios ordenadas.
  - Valida los ids pedidos para poder responder 404.
  - Se sacaron los `print` de depuración.
- **`schemas.py` (nuevo):** modelos de respuesta, para que `/docs` muestre el formato de cada ruta.
- **`main.py`:**
  - Nombres de función únicos: había dos `get_asignaturas_plan`.
  - Se sacaron los parámetros `q` que no se usaban y los `= None` en parámetros de ruta.
  - Un id que no existe responde 404 con mensaje. Antes devolvía `[]` con 200.
  - `/asignatura/{id}` devuelve un objeto, no una lista.
  - Si falta la base o el esquema, responde 503 con instrucciones. Antes, 500.
  - `/finstitucion` y `/jinstitucion` arman el JSON desde la base. Antes leían `/home/juan/dev/profe/data/Institucion.json`, que no existe en otra máquina, y respondían 200 con un error.
  - Rutas nuevas: `/correlativas/` y `/estado`.
  - CORS habilitado, solo para GET, para poder usar la API desde un front en otro origen (Live Server, archivo abierto con doble clic).
  - Sirve el front: `index.html` en `/` y la carpeta `static/`, con `Cache-Control: no-cache` para que los cambios se vean al recargar.

### Datos

- "Ingles II" pasa a "Inglés II".
- "Disciplinas de Tecnológicas/Complementarias" pasa a "Disciplinas Tecnológicas/Complementarias".
- Acentos en "San Nicolás" y "Colón".
- **Correlativas:** la tabla, la vista y la ruta `/correlativas/` están listas, pero no se carga ningún dato, igual que en la versión del profe.

### Cambios de formato a tener en cuenta

Si algo consumía la API original, estos dos cambios pueden afectarlo:

- `/asignatura/{id}` devuelve un objeto (`{...}`), no una lista (`[{...}]`).
- En `vCorrelativa` y `/correlativas/`, la columna `nombre` se llama `tipo_correlativa`.

## Qué muestra el front

Se abre en http://127.0.0.1:8000 con la API corriendo. No usa librerías externas: es `index.html` más `static/styles.css` y `static/app.js`. Todos los datos salen en vivo de la API.

### Barra superior

- Las secciones: Plan, Mi progreso, Datos y API. Se marca la sección que se está viendo.
- El botón **Buscar** (o **Ctrl+K**, o la tecla **/**) abre un buscador de materias, secciones, endpoints y acciones.
- El botón de **tema claro u oscuro**. Por defecto usa el del sistema y recuerda la elección.
- El **estado de la API**: punto verde, cuántas consultas hizo y cuánto tardó.

### Inicio

- **Nombre de la carrera**, con la institución, el plan, el régimen y la vigencia (de `/carrera/` y `/planestudio/`).
- **Cuatro números:** materias, períodos, áreas académicas e inicio del plan.
- **Mapa del plan** al estilo de un mapa de subte:
  - Cada período es una línea y cada materia una estación, coloreada según su área.
  - Al pasar el mouse sobre una estación se ve su nombre; con un clic se abre su ficha.

### 01 · Plan de estudio

- Un tablero con una columna por período (1° a 4° cuatrimestre y trabajo final) y una tarjeta por materia, con su número, área y estado.
- **Filtros** por área y por nombre.
- El encabezado de cada período abre en el explorador la consulta `/asignaturasplan/periodo/{id}`.
- **Modo progreso:** cada clic en una materia la pasa a cursada, aprobada o pendiente.
- **Correlatividades:** hoy la base no tiene ninguna, y el tablero lo avisa. Si se cargan, al pasar el mouse sobre una materia se dibujan curvas hacia sus correlativas. La línea llena indica que se pide aprobada y la punteada que se pide cursada. También aparece el interruptor "Todas las correlatividades".

### Ficha de una materia

Se abre al hacer clic en una materia, en el tablero, el mapa o el buscador, y muestra:

- el número, el nombre, el área, el período y el plan;
- **Mi estado:** pendiente, cursada o aprobada, y si está disponible o qué correlativas le faltan;
- qué necesita para cursarla y rendirla, qué materias habilita y el camino completo (estas tres partes solo si hay correlatividades);
- **En la API:** las respuestas en vivo de `/asignatura/{id}`, `/asignaturaplan/{id}` y `/correlativas/?asignatura_id={id}`, con un botón para abrirlas en el explorador.

Se cierra con Esc, con la X o haciendo clic afuera.

### 02 · Mi progreso

- El **porcentaje de la carrera aprobada** y una barra con aprobadas, cursadas y pendientes.
- Tres listas:
  - **Podés cursar:** las pendientes que tienen todas sus correlativas.
  - **Podés rendir:** las que ya cursaste y te falta aprobar.
  - **Todavía no:** las bloqueadas por alguna correlativa.
- Botones para activar el modo progreso y para reiniciar, con opción de deshacer.
- Al aprobar todas las materias aparece un festejo con papelitos.
- El progreso se guarda solo en ese navegador (localStorage), no en la base.

### 03 · Datos

Cada tarjeta indica de qué endpoint salen sus datos; al tocarlo, se prueba en el explorador.

| Tarjeta | Qué muestra | Endpoint |
|---|---|---|
| Materias por período | Columnas apiladas por área | `/asignaturasplan/periodo/{id}` |
| Materias por área | Barra de proporción con cantidad y porcentaje | `/asignaturasplan/{plan_id}` |
| Filas por tabla | Cuántas filas tiene cada tabla de la base | `/estado` |
| Correlatividades | Los tipos (Cursada y Aprobada) y cuántas hay de cada uno | `/tipocorrelativa/`, `/correlativas/` |
| Archivos | Botones para descargar y para ver `Institucion.json` | `/finstitucion`, `/jinstitucion` |
| Institución | Nombre, domicilio y enlace al mapa | `/institucion/` |
| Carrera | Nombre y descripción | `/carrera/` |
| Plan de estudio | Régimen, períodos, inicio y fin | `/planestudio/` |
| Períodos de cursado | Lista con cantidad de materias de cada uno | `/periodocursado/` |
| Áreas académicas | Lista con su color y su cantidad de materias | `/areaacademica/` |
| Régimen de cursado | Los tres regímenes, con el del plan resaltado | `/regimencursado/` |
| Carreras por institución | Qué carrera dicta cada institución | `/carrerainstitucion/` |

Los gráficos tienen un botón **Ver tabla** con los mismos datos, y muestran el valor al pasar el mouse.

### 04 · API: explorador de servicios

- **Lista de endpoints** agrupada por tema, leída de `/openapi.json`, así que siempre coincide con `main.py`. Se puede filtrar.
- **Parámetros:** campos con sugerencias tomadas de la base; por ejemplo, para `asignatura_id` aparecen los nombres de las materias. Si el id no existe, el campo avisa que va a dar 404.
- **Envío:** con el botón **Enviar** o con Enter. También se puede copiar la URL o abrirla en otra pestaña.
- **Respuesta:**
  - el código HTTP con su color (200 verde, 4xx naranja, 5xx rojo), el tiempo y el tamaño;
  - el contenido en cuatro vistas: JSON con colores, tabla, comando `curl` y código `fetch`, cada una con botón para copiar;
  - para `/finstitucion`, un botón de descarga.
- **Historial** con las últimas 6 consultas.

### Pie de página

Enlaces a la documentación automática de FastAPI: Swagger (`/docs`), ReDoc (`/redoc`) y `openapi.json`.

### Si algo no está listo

En lugar de una página vacía, el front muestra qué falta y los comandos para copiar:

| Situación | Mensaje |
|---|---|
| La API no responde | "No encuentro la API" |
| Falta la base o su esquema | "La base de datos no está lista" |
| La base no tiene datos | "Faltan los datos" |

### Otros detalles

- **Se adapta a celular:** el tablero se desplaza de costado y la ficha ocupa toda la pantalla.
- **Se puede usar con teclado:** foco visible, Esc para cerrar y flechas en el buscador.
- **Respeta "reducir movimiento"** del sistema: en ese caso desactiva las animaciones.
- **Funciona servido desde otro lugar** (Live Server, otro puerto): busca la API sola en `http://127.0.0.1:8000`.
