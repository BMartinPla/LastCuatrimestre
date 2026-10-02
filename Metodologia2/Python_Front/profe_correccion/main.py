"""API de la carrera: expone las vistas de db/Facultad.db y sirve el front.

    fastapi dev main.py
    http://127.0.0.1:8000        el front (index.html + static/)
    http://127.0.0.1:8000/docs   la documentación interactiva (Swagger)
"""
import json

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import OperationalError

import GetCarrera
import schemas
from database import BASE_DIR, BaseNoDisponible

app = FastAPI(
    title="API Carrera",
    summary="Plan de estudio de la Tecnicatura Universitaria en Programación.",
    version="2.0",
    openapi_tags=[
        {"name": "Plan de estudio", "description": "Asignaturas dentro de cada plan."},
        {"name": "Asignaturas", "description": "Catálogo de asignaturas."},
        {"name": "Correlatividades", "description": "Qué hay que tener cursado o aprobado."},
        {"name": "Institución", "description": "Instituciones y carreras."},
        {"name": "Catálogos", "description": "Tablas de referencia."},
        {"name": "Archivos", "description": "Datos para descargar."},
        {"name": "Sistema", "description": "Estado de la API."},
    ],
)

# Permite usar la API desde un front abierto en otro origen (Live Server,
# file://...). La API es de solo lectura, así que alcanza con GET.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])

class StaticSinCache(StaticFiles):
    """Archivos del front con revalidación en cada carga: al recargar se ven los cambios."""

    def file_response(self, *args, **kwargs):
        respuesta = super().file_response(*args, **kwargs)
        respuesta.headers["Cache-Control"] = "no-cache"
        return respuesta


app.mount("/static", StaticSinCache(directory=BASE_DIR / "static"), name="static")

NO_EXISTE = {404: {"description": "No existe el id pedido"}}


@app.exception_handler(GetCarrera.NoEncontrado)
def no_encontrado(request: Request, error: GetCarrera.NoEncontrado):
    return JSONResponse(status_code=404, content={"detail": str(error)})


@app.exception_handler(BaseNoDisponible)
def base_no_disponible(request: Request, error: BaseNoDisponible):
    return JSONResponse(status_code=503, content={"detail": str(error)})


@app.exception_handler(OperationalError)
def error_de_sqlite(request: Request, error: OperationalError):
    # Lo típico es "no such table": la base existe pero no se le cargó el esquema.
    return JSONResponse(status_code=503, content={
        "detail": f"Error de SQLite: {error.orig}. ¿Ejecutaste .read db/Carrera.sql en db/Facultad.db?"
    })


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(BASE_DIR / "index.html", headers={"Cache-Control": "no-cache"})


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    # Algunos navegadores lo piden igual aunque la página declare su ícono.
    return FileResponse(BASE_DIR / "static" / "favicon.svg", media_type="image/svg+xml")


@app.get("/estado", tags=["Sistema"], summary="Estado de la base: filas por tabla")
def get_estado() -> schemas.Estado:
    return {"base": "db/Facultad.db", "tablas": GetCarrera.gEstado()}


@app.get("/asignaturas/", tags=["Asignaturas"], summary="Todas las asignaturas")
def get_asignaturas() -> list[schemas.Asignatura]:
    return GetCarrera.gAsignatura()


@app.get("/asignatura/{asignatura_id}", tags=["Asignaturas"], summary="Una asignatura",
         responses=NO_EXISTE)
def get_asignatura(asignatura_id: int) -> schemas.Asignatura:
    return GetCarrera.gAsignatura(asignatura_id)[0]


@app.get("/asignaturaplan/{asignatura_id}", tags=["Plan de estudio"],
         summary="Una asignatura en los planes que la incluyen", responses=NO_EXISTE)
def get_asignatura_plan(asignatura_id: int) -> list[schemas.AsignaturaPlan]:
    return GetCarrera.gAsignaturaPlan(asignatura_id=asignatura_id)


@app.get("/asignaturasplan/{plan_estudio_id}", tags=["Plan de estudio"],
         summary="Asignaturas de un plan de estudio", responses=NO_EXISTE)
def get_asignaturas_plan(plan_estudio_id: int) -> list[schemas.AsignaturaPlan]:
    return GetCarrera.gAsignaturaPlan(plan_estudio_id=plan_estudio_id)


@app.get("/asignaturasplan/periodo/{periodo_cursado_id}", tags=["Plan de estudio"],
         summary="Asignaturas de un período de cursado", responses=NO_EXISTE)
def get_asignaturas_periodo(periodo_cursado_id: int) -> list[schemas.AsignaturaPlan]:
    return GetCarrera.gAsignaturaPlan(periodo_cursado_id=periodo_cursado_id)


@app.get("/asignaturasplan/area/{area_academica_id}", tags=["Plan de estudio"],
         summary="Asignaturas de un área académica", responses=NO_EXISTE)
def get_asignaturas_area(area_academica_id: int) -> list[schemas.AsignaturaPlan]:
    return GetCarrera.gAsignaturaPlan(area_academica_id=area_academica_id)


@app.get("/planestudio/", tags=["Plan de estudio"], summary="Planes de estudio")
def get_plan_estudio() -> list[schemas.PlanEstudio]:
    return GetCarrera.gPlanEstudio()


@app.get("/correlativas/", tags=["Correlatividades"],
         summary="Correlatividades, filtrables por plan, asignatura y tipo", responses=NO_EXISTE)
def get_correlativas(plan_estudio_id: int | None = None,
                     asignatura_id: int | None = None,
                     tipocorrelativa_id: int | None = None) -> list[schemas.Correlativa]:
    return GetCarrera.gCorrelativa(plan_estudio_id, asignatura_id, tipocorrelativa_id)


@app.get("/tipocorrelativa/", tags=["Correlatividades"], summary="Tipos de correlatividad")
def get_tipo_correlativa() -> list[schemas.TipoCorrelativa]:
    return GetCarrera.gTipoCorrelativa()


@app.get("/institucion/", tags=["Institución"], summary="Instituciones")
def get_institucion() -> list[schemas.Institucion]:
    return GetCarrera.gInstitucion()


@app.get("/carrera/", tags=["Institución"], summary="Carreras")
def get_carrera() -> list[schemas.Carrera]:
    return GetCarrera.gCarrera()


@app.get("/carrerainstitucion/", tags=["Institución"], summary="Carreras de cada institución")
def get_carrera_institucion() -> list[schemas.CarreraInstitucion]:
    return GetCarrera.gCarreraInstitucion()


@app.get("/periodocursado/", tags=["Catálogos"], summary="Períodos de cursado")
def get_periodo_cursado() -> list[schemas.PeriodoCursado]:
    return GetCarrera.gPeriodoCursado()


@app.get("/regimencursado/", tags=["Catálogos"], summary="Regímenes de cursado")
def get_regimen_cursado() -> list[schemas.RegimenCursado]:
    return GetCarrera.gRegimenCursado()


@app.get("/areaacademica/", tags=["Catálogos"], summary="Áreas académicas")
def get_area_academica() -> list[schemas.AreaAcademica]:
    return GetCarrera.gAreaAcademica()


def _institucion_json():
    # Se genera desde la base en cada pedido: no depende de un archivo suelto.
    return json.dumps(GetCarrera.gInstitucion(), ensure_ascii=False, indent=2)


@app.get("/finstitucion", tags=["Archivos"], summary="Descargar Institucion.json")
def finstitucion():
    return Response(content=_institucion_json(), media_type="application/json",
                    headers={"Content-Disposition": 'attachment; filename="Institucion.json"'})


@app.get("/jinstitucion", tags=["Archivos"], summary="Ver Institucion.json en el navegador")
def jinstitucion():
    return Response(content=_institucion_json(), media_type="application/json")
