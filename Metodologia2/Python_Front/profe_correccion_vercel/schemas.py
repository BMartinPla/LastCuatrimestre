"""Forma de las respuestas de la API: FastAPI las usa para validar y para /docs.

Hay un modelo por vista de db/Carrera.sql, con las mismas columnas.
"""
from pydantic import BaseModel


class AreaAcademica(BaseModel):
    id: int
    nombre: str


class Asignatura(BaseModel):
    id: int
    nombre: str
    area_academica_id: int
    area_academica: str


class AsignaturaPlan(BaseModel):
    id: int
    plan_estudio_id: int
    plan_estudio: str
    asignatura_id: int
    asignatura: str
    area_academica_id: int
    area_academica: str
    periodo_cursado_id: int
    periodo_cursado: str


class Carrera(BaseModel):
    id: int
    nombre: str
    descripcion: str


class CarreraInstitucion(BaseModel):
    institucion_id: int
    institucion: str
    carrera_id: int
    carrera: str


class Correlativa(BaseModel):
    id: int
    plan_estudio_id: int
    tipocorrelativa_id: int
    tipo_correlativa: str
    asignaturaplan_id: int
    asignatura_id: int
    asignatura: str
    correlativa_id: int
    correlativa_asignatura_id: int
    correlativa: str


class Institucion(BaseModel):
    id: int
    nombre: str
    domicilio: str


class PeriodoCursado(BaseModel):
    id: int
    nombre: str


class PlanEstudio(BaseModel):
    id: int
    plan_estudio: str
    institucion_id: int
    institucion: str
    carrera_id: int
    carrera: str
    regimen_cursado_id: int
    regimen_cursado: str
    periodos: int
    inicio: int
    fin: int | None


class RegimenCursado(BaseModel):
    id: int
    nombre: str


class TipoCorrelativa(BaseModel):
    id: int
    nombre: str


class Estado(BaseModel):
    base: str
    tablas: dict[str, int]
