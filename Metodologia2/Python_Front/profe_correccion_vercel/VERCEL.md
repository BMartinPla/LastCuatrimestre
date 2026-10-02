# Subir el proyecto a Vercel

Esta carpeta es una copia de `profe_correccion` preparada para Vercel. La API y el front funcionan en **modo solo lectura**: se ven todas las materias, el plan, los datos y el explorador. El progreso de cada usuario se guarda en su propio navegador.

## Qué cambia respecto de `profe_correccion`

| Archivo | Cambio | Por qué |
|---|---|---|
| `db/Facultad.db` | Viene incluida y ya cargada (18 materias). | Vercel no puede ejecutar `sqlite3.exe` ni `CargaCarrera.py`: la base tiene que subirse lista. |
| `.gitignore` | Ya no ignora `db/*.db`. Ignora `.vercel/`. | Si se sube desde GitHub, la base tiene que estar en el repo. |
| `.vercelignore` | Nuevo. | Evita subir `venv/`, `__pycache__/`, `sqlite3.exe` y `models.py`. |
| `.python-version` | Nuevo: `3.12`. | Fija la versión de Python que usa Vercel. Puede ser 3.12, 3.13 o 3.14. |
| `requirements.txt` | Sin `sqlacodegen`. | Solo se usa en la computadora y haría más pesado el despliegue. |
| `database.py` | Si existe la variable `VERCEL=1` (Vercel la define sola), abre la base con `mode=ro&immutable=1`. | En Vercel el disco es de solo lectura. Así SQLite no intenta crear archivos de bloqueo ni de journal. |
| `sqlite3.exe`, `venv/` | No están. | El ejecutable es de Windows y el venv solo sirve en la máquina donde se creó. |

El resto del código es igual. Vercel detecta solo que es FastAPI, porque `main.py` define `app` y `requirements.txt` incluye `fastapi`, así que no hace falta `vercel.json`.

## Opción A: con la CLI de Vercel

Hace falta Node.js (`node --version`) y una cuenta en vercel.com.

```
npm install -g vercel
```

```
cd "$HOME\Desktop\LastCuatrimestre\Metodologia2\Python_Front\profe_correccion_vercel"
```

```
vercel login
```

```
vercel
```

La primera vez hace unas preguntas: aceptar las respuestas propuestas alcanza. Al final da una URL de prueba. Para publicar la versión definitiva:

```
vercel --prod
```

## Opción B: desde GitHub

1. Crear un repositorio nuevo que tenga **el contenido de esta carpeta** en la raíz (con `main.py` arriba de todo).
2. Subir los archivos, incluido `db/Facultad.db`.
3. En vercel.com, entrar a **Add New → Project**, elegir el repositorio y tocar **Deploy**. Vercel detecta FastAPI solo.

A partir de ahí, cada push a la rama principal vuelve a publicar el sitio.

## Probarla en la computadora antes de subirla

Esta carpeta no trae venv:

```
python -m venv venv
```

```
.\venv\Scripts\Activate.ps1
```

```
pip install -r requirements.txt
```

```
fastapi dev main.py
```

Para probar el mismo modo de solo lectura que usa Vercel, antes de `fastapi dev main.py`:

```
$env:SOLO_LECTURA = "1"
```

## Cambiar los datos

En Vercel la base no se puede modificar. Para cambiar algo:

1. Modificar `db/Facultad.db` en la computadora, por ejemplo en `profe_correccion` con `python CargaCarrera.py --reset`, y copiarla a `db/` de esta carpeta.
2. Volver a publicar con `vercel --prod`, o con un push si se usa GitHub.

## Limitaciones

- **Solo lectura.** Las rutas `POST`, `PUT` y `DELETE` que se describen en `ComoSeguir.md` no funcionarían con SQLite en Vercel. Para eso hace falta una base hosteada, por ejemplo Postgres (Neon) o Turso. Con SQLAlchemy, el cambio principal es la URL de conexión en `database.py`.
- **El progreso es de cada navegador.** Se guarda en el localStorage de quien visita el sitio. No se comparte entre dispositivos ni entre usuarios.
- **La primera visita puede tardar un poco.** Si nadie usó el sitio por un rato, Vercel tiene que arrancar la función.
