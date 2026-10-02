"""Carga inicial de db/Facultad.db (la base tiene que existir: paso 4 del HowTo).

    python CargaCarrera.py            carga los datos si la base está vacía
    python CargaCarrera.py --reset    borra los datos y los vuelve a cargar

Todo va en una sola transacción: si algo falla, no queda nada a medio cargar.
Las asignaturas se insertan en el orden oficial del plan, así su id coincide
con el número de la materia en el plan (1 a 18).
"""
import argparse
import sys

from sqlalchemy import delete, func, insert, select, text
from sqlalchemy.exc import OperationalError, SQLAlchemyError

import GetCarrera
from database import BaseNoDisponible, Session
from modelscarrera import (
    AreaAcademica, Asignatura, AsignaturaPlan, Carrera, CarreraInstitucion, Correlativa,
    Institucion, PeriodoCursado, PlanEstudio, RegimenCursado, TipoCorrelativa,
)

INSTITUCION = {"nombre": "UTN Regional San Nicolás",
               "domicilio": "Colón 332 San Nicolás Bs. As. CP:2900"}
CARRERA = "Tecnicatura Universitaria en Programación"
PLAN = {"nombre": "Plan 2024", "regimen": "Cuatrimestral", "anio_inicio": 2024}
REGIMENES = ["Anual", "Semestral", "Cuatrimestral"]
TIPOS_CORRELATIVA = ["Cursada", "Aprobada"]

BASICAS = "Ciencias Básicas"
TECNOLOGICAS = "Disciplinas Tecnológicas"
COMPLEMENTARIAS = "Disciplinas Complementarias"
AREAS = [BASICAS, TECNOLOGICAS, COMPLEMENTARIAS]

# Período -> asignaturas (nombre, área), en el orden oficial del plan.
ASIGNATURAS_POR_PERIODO = {
    "Primer Cuatrimestre": [
        ("Programación I", TECNOLOGICAS),
        ("Arquitectura y Sistemas Operativos", TECNOLOGICAS),
        ("Matemática", BASICAS),
        ("Organización Empresarial", COMPLEMENTARIAS),
    ],
    "Segundo Cuatrimestre": [
        ("Programación II", TECNOLOGICAS),
        ("Probabilidad y Estadística", BASICAS),
        ("Bases de Datos I", TECNOLOGICAS),
        ("Inglés I", COMPLEMENTARIAS),
    ],
    "Tercer Cuatrimestre": [
        ("Programación III", TECNOLOGICAS),
        ("Bases de Datos II", TECNOLOGICAS),
        ("Metodología de Sistemas I", TECNOLOGICAS),
        ("Inglés II", COMPLEMENTARIAS),
    ],
    "Cuarto Cuatrimestre": [
        ("Programación IV", TECNOLOGICAS),
        ("Metodología de Sistemas II", TECNOLOGICAS),
        ("Introducción al Análisis de Datos", BASICAS),
        ("Legislación", COMPLEMENTARIAS),
        ("Gestión de Desarrollo de Software", TECNOLOGICAS),
    ],
    "Trabajo Final": [
        ("Trabajo Final", TECNOLOGICAS),
    ],
}

# Orden para borrar con --reset: primero las tablas que referencian a otras.
TABLAS_A_BORRAR = [Correlativa, AsignaturaPlan, PlanEstudio, CarreraInstitucion, Asignatura,
                   TipoCorrelativa, PeriodoCursado, Carrera, Institucion, RegimenCursado,
                   AreaAcademica]


def _insertar(session, modelo, filas):
    session.execute(insert(modelo), filas)


def _ids_por_nombre(session, modelo):
    return dict(session.execute(select(modelo.nombre, modelo.id)).all())


def cargar_todo(session):
    _insertar(session, AreaAcademica, [{"nombre": area} for area in AREAS])
    area_id = _ids_por_nombre(session, AreaAcademica)
    _insertar(session, Asignatura, [
        {"nombre": nombre, "area_academica_id": area_id[area]}
        for asignaturas in ASIGNATURAS_POR_PERIODO.values()
        for nombre, area in asignaturas
    ])
    _insertar(session, RegimenCursado, [{"nombre": regimen} for regimen in REGIMENES])
    _insertar(session, Institucion, [INSTITUCION])
    _insertar(session, Carrera, [{"nombre": CARRERA}])
    _insertar(session, PeriodoCursado, [{"nombre": periodo} for periodo in ASIGNATURAS_POR_PERIODO])
    _insertar(session, TipoCorrelativa, [{"nombre": tipo} for tipo in TIPOS_CORRELATIVA])

    institucion_id = _ids_por_nombre(session, Institucion)[INSTITUCION["nombre"]]
    carrera_id = _ids_por_nombre(session, Carrera)[CARRERA]
    _insertar(session, CarreraInstitucion, [{"institucion_id": institucion_id, "carrera_id": carrera_id}])
    carrera_institucion_id = session.scalar(
        select(CarreraInstitucion.id).where(CarreraInstitucion.institucion_id == institucion_id,
                                            CarreraInstitucion.carrera_id == carrera_id))

    _insertar(session, PlanEstudio, [{
        "carrera_institucion_id": carrera_institucion_id,
        "nombre": PLAN["nombre"],
        "regimen_cursado_id": _ids_por_nombre(session, RegimenCursado)[PLAN["regimen"]],
        "periodos": len(ASIGNATURAS_POR_PERIODO),  # 4 cuatrimestres + Trabajo Final
        "anio_inicio": PLAN["anio_inicio"],
    }])
    plan_id = session.scalar(
        select(PlanEstudio.id).where(PlanEstudio.carrera_institucion_id == carrera_institucion_id,
                                     PlanEstudio.nombre == PLAN["nombre"]))

    asignatura_id = _ids_por_nombre(session, Asignatura)
    periodo_id = _ids_por_nombre(session, PeriodoCursado)
    _insertar(session, AsignaturaPlan, [
        {"plan_estudio_id": plan_id,
         "asignatura_id": asignatura_id[nombre],
         "periodo_cursado_id": periodo_id[periodo]}
        for periodo, asignaturas in ASIGNATURAS_POR_PERIODO.items()
        for nombre, _ in asignaturas
    ])


def tiene_datos(session):
    return any(session.scalar(select(func.count()).select_from(modelo)) for modelo in TABLAS_A_BORRAR)


def borrar_todo(session):
    for modelo in TABLAS_A_BORRAR:
        session.execute(delete(modelo))
    # Las tablas usan autoincrement: así los id vuelven a empezar en 1.
    session.execute(text("delete from sqlite_sequence"))


def main():
    parser = argparse.ArgumentParser(description="Carga los datos iniciales en db/Facultad.db.")
    parser.add_argument("--reset", action="store_true",
                        help="borra los datos cargados y los vuelve a cargar")
    args = parser.parse_args()

    try:
        with Session.begin() as session:  # commit al final, rollback si algo falla
            if args.reset:
                borrar_todo(session)
            elif tiene_datos(session):
                print("La base ya tiene datos, no se cargó nada.")
                print("Para borrarlos y cargarlos de nuevo: python CargaCarrera.py --reset")
                return 0
            cargar_todo(session)
    except BaseNoDisponible as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    except OperationalError as error:
        print(f"ERROR: {error.orig}. ¿Ejecutaste .read db/Carrera.sql en db/Facultad.db?",
              file=sys.stderr)
        return 1
    except KeyError as error:
        print(f"ERROR: {error} no está entre los nombres cargados. No se guardó nada.", file=sys.stderr)
        return 1
    except SQLAlchemyError as error:
        print(f"ERROR: no se guardó nada.\n{error}", file=sys.stderr)
        return 1

    print("Carga completa. Filas por tabla:")
    for tabla, filas in GetCarrera.gEstado().items():
        print(f"  {tabla:<20}{filas:>4}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
