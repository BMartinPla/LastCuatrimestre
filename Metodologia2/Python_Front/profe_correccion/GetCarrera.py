"""Consultas de solo lectura sobre las vistas v* de db/Facultad.db.

Cada función devuelve una lista de diccionarios (uno por fila). main.py se los
devuelve a FastAPI, que los convierte a JSON respetando los acentos.
"""
import json

from sqlalchemy import func, select

from database import Session
from modelscarrera import (
    AreaAcademica, Asignatura, AsignaturaPlan, Carrera, CarreraInstitucion, Correlativa,
    Institucion, PeriodoCursado, PlanEstudio, RegimenCursado, TipoCorrelativa,
    t_vAreaAcademica,
    t_vAsignatura,
    t_vAsignaturaPlan,
    t_vCarrera,
    t_vCarreraInstitucion,
    t_vCorrelativa,
    t_vInstitucion,
    t_vPeriodoCursado,
    t_vPlanEstudio,
    t_vRegimenCursado,
    t_vTipoCorrelativa,
)

TABLAS = (Institucion, Carrera, CarreraInstitucion, RegimenCursado, PlanEstudio, AreaAcademica,
          Asignatura, PeriodoCursado, AsignaturaPlan, TipoCorrelativa, Correlativa)


class NoEncontrado(LookupError):
    """Se pidió un id que no existe; la API lo responde con un 404."""


def _consultar(vista, orden=("id",), **filtros):
    """SELECT sobre una vista, filtrando por igualdad. Los filtros en None no se aplican."""
    stmt = select(vista)
    for columna, valor in filtros.items():
        if valor is not None:
            stmt = stmt.where(vista.c[columna] == valor)
    stmt = stmt.order_by(*(vista.c[columna] for columna in orden))
    with Session() as session:
        return [dict(fila) for fila in session.execute(stmt).mappings()]


def _verificar(modelo, id_, que):
    """Lanza NoEncontrado si se pidió un id que no está en la tabla del modelo."""
    if id_ is None:
        return
    with Session() as session:
        if session.get(modelo, id_) is None:
            raise NoEncontrado(f"No existe {que} con id {id_}")


def gAreaAcademica():
    return _consultar(t_vAreaAcademica)


def gCarreraInstitucion():
    return _consultar(t_vCarreraInstitucion, orden=("institucion_id", "carrera_id"))


def gRegimenCursado():
    return _consultar(t_vRegimenCursado)


def gPlanEstudio():
    return _consultar(t_vPlanEstudio)


def gInstitucion():
    return _consultar(t_vInstitucion)


def gCarrera():
    return _consultar(t_vCarrera)


def gPeriodoCursado():
    return _consultar(t_vPeriodoCursado)


def gTipoCorrelativa():
    return _consultar(t_vTipoCorrelativa)


def gAsignatura(asignatura_id=None):
    _verificar(Asignatura, asignatura_id, "la asignatura")
    return _consultar(t_vAsignatura, id=asignatura_id)


def gAsignaturaPlan(asignatura_id=None,
                    periodo_cursado_id=None,
                    plan_estudio_id=None,
                    area_academica_id=None):
    _verificar(Asignatura, asignatura_id, "la asignatura")
    _verificar(PeriodoCursado, periodo_cursado_id, "el período de cursado")
    _verificar(PlanEstudio, plan_estudio_id, "el plan de estudio")
    _verificar(AreaAcademica, area_academica_id, "el área académica")
    return _consultar(t_vAsignaturaPlan,
                      orden=("plan_estudio_id", "periodo_cursado_id", "asignatura_id"),
                      asignatura_id=asignatura_id,
                      periodo_cursado_id=periodo_cursado_id,
                      plan_estudio_id=plan_estudio_id,
                      area_academica_id=area_academica_id)


def gCorrelativa(plan_estudio_id=None, asignatura_id=None, tipocorrelativa_id=None):
    _verificar(PlanEstudio, plan_estudio_id, "el plan de estudio")
    _verificar(Asignatura, asignatura_id, "la asignatura")
    _verificar(TipoCorrelativa, tipocorrelativa_id, "el tipo de correlativa")
    return _consultar(t_vCorrelativa,
                      orden=("plan_estudio_id", "asignatura_id", "tipocorrelativa_id",
                             "correlativa_asignatura_id"),
                      plan_estudio_id=plan_estudio_id,
                      asignatura_id=asignatura_id,
                      tipocorrelativa_id=tipocorrelativa_id)


def gEstado():
    """Cantidad de filas de cada tabla."""
    with Session() as session:
        return {modelo.__tablename__: session.scalar(select(func.count()).select_from(modelo))
                for modelo in TABLAS}


def verTodo():
    for consulta in (gAreaAcademica, gAsignatura, gRegimenCursado, gInstitucion, gCarrera,
                     gPeriodoCursado, gTipoCorrelativa, gCarreraInstitucion, gPlanEstudio,
                     gAsignaturaPlan, gCorrelativa):
        print(f"--- {consulta.__name__} ---")
        print(json.dumps(consulta(), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    verTodo()
