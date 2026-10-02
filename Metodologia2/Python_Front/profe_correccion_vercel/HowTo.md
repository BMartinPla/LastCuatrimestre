### Nota: todos los **Ejecutar** son en PowerShell, dentro de la carpeta del proyecto (la que tiene `main.py`).

### 0. Abrir PowerShell en la carpeta del proyecto

- Descomprimir el zip recibido, por ejemplo en `Escritorio\Facultad`.
- La carpeta de usuario es `C:\Users\TuUsuario`. El Explorador de Windows la muestra como "Usuarios", pero en PowerShell la ruta es `C:\Users`. `$HOME` apunta ahí.
- Ejecutar (ajustando la ruta a donde quedó el proyecto):
  ```
  cd "$HOME\Desktop\Facultad\profe_correccion"
  ```
- Verificar con `ls` que estén `main.py`, `CargaCarrera.py`, la carpeta `db` y `sqlite3.exe`.

### 1. Python 3.10 o más nuevo

- Ejecutar: `python --version`
- Si no está instalado o abre la Microsoft Store: instalarlo desde python.org y marcar "Add python.exe to PATH".

### 2. Crear el entorno virtual

- Ejecutar: `python -m venv venv`
- Ejecutar: `.\venv\Scripts\Activate.ps1`
- En la terminal debería verse `(venv)` delante del prompt.
- Si PowerShell dice que la ejecución de scripts está deshabilitada, habilitarla solo para esa ventana y volver a activar:
  ```
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

### 3. Instalar las dependencias

- Ejecutar: `pip install -r requirements.txt`
- Instala FastAPI, SQLAlchemy y sqlacodegen.

### 4. Crear la base

- Ejecutar: `.\sqlite3.exe .\db\Facultad.db`
- Dentro de sqlite:
  - `.read db/Carrera.sql`
  - `.tables` (tienen que aparecer 11 tablas y 11 vistas `v...`)
  - `.quit`
- Atajo en una sola línea: `.\sqlite3.exe .\db\Facultad.db ".read db/Carrera.sql"`
- Si la base ya existía, `.read` falla con "table ... already exists". Borrarla antes con `Remove-Item .\db\Facultad.db`.

### 5. (Opcional) Generar las clases Python desde la base con sqlacodegen

- Ejecutar: `sqlacodegen sqlite:///db/Facultad.db --outfile models.py`
- Es el mismo código que ya trae `modelscarrera.py`, que es el que usa el proyecto. Para compararlos:
  ```
  fc.exe models.py modelscarrera.py
  ```
  En PowerShell hay que escribir `fc.exe`: `fc` solo es un alias de `Format-Custom`. Puede haber diferencias mínimas si tu versión de sqlacodegen es distinta.
- Se usa `--outfile` y no `> models.py` porque en Windows PowerShell el `>` guarda el archivo en UTF-16 y Python no lo puede leer.

### 6. Cargar los datos

- Ejecutar: `python CargaCarrera.py`
- Tiene que terminar con "Carga completa." y la cantidad de filas de cada tabla.
- Si se ejecuta de nuevo, avisa que la base ya tiene datos y no carga nada.
- Para borrar los datos y cargarlos de nuevo: `python CargaCarrera.py --reset`

### 7. Arrancar FastAPI

- Ejecutar: `fastapi dev main.py`
- Para cortarlo: Ctrl+C.

### 8. Probar

- En el navegador: http://127.0.0.1:8000/ muestra el front (Mapa de Carrera).
- http://127.0.0.1:8000/docs muestra la documentación interactiva de todas las rutas.
- Rutas:

| Ruta | Devuelve |
|---|---|
| `/estado` | Filas de cada tabla |
| `/asignaturas/` | Todas las asignaturas |
| `/asignatura/{asignatura_id}` | Una asignatura (404 si no existe) |
| `/asignaturaplan/{asignatura_id}` | Esa asignatura en los planes que la incluyen |
| `/asignaturasplan/{plan_estudio_id}` | Las asignaturas de un plan |
| `/asignaturasplan/periodo/{periodo_cursado_id}` | Las asignaturas de un período |
| `/asignaturasplan/area/{area_academica_id}` | Las asignaturas de un área |
| `/planestudio/` | Planes de estudio |
| `/correlativas/` | Correlatividades. Filtros opcionales: `?plan_estudio_id=1`, `?asignatura_id=9`, `?tipocorrelativa_id=2` |
| `/tipocorrelativa/` | Tipos de correlatividad |
| `/institucion/` | Instituciones |
| `/carrera/` | Carreras |
| `/carrerainstitucion/` | Qué carreras dicta cada institución |
| `/periodocursado/` | Períodos de cursado |
| `/regimencursado/` | Regímenes de cursado |
| `/areaacademica/` | Áreas académicas |
| `/finstitucion` | Descarga `Institucion.json` |
| `/jinstitucion` | `Institucion.json` para ver en el navegador |

### Problemas frecuentes

- **"El término 'fastapi' no se reconoce…":** el entorno virtual no está activado en esa terminal. Ejecutar `.\venv\Scripts\Activate.ps1` (paso 2) y verificar que aparezca `(venv)`.
- **Moví o renombré la carpeta y el venv dejó de andar:** el venv guarda la ruta donde se creó. Borrarlo con `Remove-Item -Recurse -Force .\venv` y repetir los pasos 2 y 3.
- **El front dice "La base de datos no está lista" o la API responde 503:** falta el paso 4, o la base se creó sin el esquema.
- **El front dice "Faltan los datos":** falta el paso 6.
- **El front dice "No encuentro la API":** la API no está corriendo (paso 7).
- **Error de puerto ocupado al arrancar:** ya hay algo en el 8000. Usar otro puerto: `fastapi dev main.py --port 8001`
- **`python CargaCarrera.py` dice "no such table":** se cargó una base sin esquema. Borrarla y repetir el paso 4.
- **Cambié el front y no veo los cambios:** recargar la página con Ctrl+F5.
- **Cambié un `.py` y la API no toma los cambios:** en Windows, a veces la recarga automática de `fastapi dev` se traba después de "Reloading...". Cortar con Ctrl+C y volver a ejecutar `fastapi dev main.py`.
