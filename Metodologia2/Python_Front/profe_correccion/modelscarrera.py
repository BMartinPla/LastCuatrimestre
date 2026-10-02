from typing import Optional

from sqlalchemy import CheckConstraint, Column, ForeignKeyConstraint, Integer, String, Table, Text, UniqueConstraint, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import NullType

class Base(DeclarativeBase):
    pass


class AreaAcademica(Base):
    __tablename__ = 'AreaAcademica'
    __table_args__ = (
        UniqueConstraint('nombre', name='unq_area_academica'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(128), nullable=False)

    Asignatura: Mapped[list['Asignatura']] = relationship('Asignatura', back_populates='area_academica')


class Carrera(Base):
    __tablename__ = 'Carrera'
    __table_args__ = (
        UniqueConstraint('nombre', name='unq_carrera'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(128), nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(Text)

    CarreraInstitucion: Mapped[list['CarreraInstitucion']] = relationship('CarreraInstitucion', back_populates='carrera')


class Institucion(Base):
    __tablename__ = 'Institucion'
    __table_args__ = (
        UniqueConstraint('nombre', name='unq_institucion'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(128), nullable=False)
    domicilio: Mapped[str] = mapped_column(String(256), nullable=False)

    CarreraInstitucion: Mapped[list['CarreraInstitucion']] = relationship('CarreraInstitucion', back_populates='institucion')


class PeriodoCursado(Base):
    __tablename__ = 'PeriodoCursado'
    __table_args__ = (
        UniqueConstraint('nombre', name='unq_periodo_cursado'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(256), nullable=False)

    AsignaturaPlan: Mapped[list['AsignaturaPlan']] = relationship('AsignaturaPlan', back_populates='periodo_cursado')


class RegimenCursado(Base):
    __tablename__ = 'RegimenCursado'
    __table_args__ = (
        UniqueConstraint('nombre', name='unq_regimen_cursado'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(256), nullable=False)

    PlanEstudio: Mapped[list['PlanEstudio']] = relationship('PlanEstudio', back_populates='regimen_cursado')


class TipoCorrelativa(Base):
    __tablename__ = 'TipoCorrelativa'
    __table_args__ = (
        UniqueConstraint('nombre', name='unq_tipo_correlativa'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(128), nullable=False)

    Correlativa: Mapped[list['Correlativa']] = relationship('Correlativa', back_populates='tipocorrelativa')


t_vAreaAcademica = Table(
    'vAreaAcademica', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(128))
)


t_vAsignatura = Table(
    'vAsignatura', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(256)),
    Column('area_academica_id', Integer),
    Column('area_academica', String(128))
)


t_vAsignaturaPlan = Table(
    'vAsignaturaPlan', Base.metadata,
    Column('id', Integer),
    Column('plan_estudio_id', Integer),
    Column('plan_estudio', String(256)),
    Column('asignatura_id', Integer),
    Column('asignatura', String(256)),
    Column('area_academica_id', Integer),
    Column('area_academica', String(128)),
    Column('periodo_cursado_id', Integer),
    Column('periodo_cursado', String(256))
)


t_vCarrera = Table(
    'vCarrera', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(128)),
    Column('descripcion', NullType)
)


t_vCarreraInstitucion = Table(
    'vCarreraInstitucion', Base.metadata,
    Column('institucion_id', Integer),
    Column('institucion', String(128)),
    Column('carrera_id', Integer),
    Column('carrera', String(128))
)


t_vCorrelativa = Table(
    'vCorrelativa', Base.metadata,
    Column('id', Integer),
    Column('plan_estudio_id', Integer),
    Column('tipocorrelativa_id', Integer),
    Column('tipo_correlativa', String(128)),
    Column('asignaturaplan_id', Integer),
    Column('asignatura_id', Integer),
    Column('asignatura', String(256)),
    Column('correlativa_id', Integer),
    Column('correlativa_asignatura_id', Integer),
    Column('correlativa', String(256))
)


t_vInstitucion = Table(
    'vInstitucion', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(128)),
    Column('domicilio', String(256))
)


t_vPeriodoCursado = Table(
    'vPeriodoCursado', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(256))
)


t_vPlanEstudio = Table(
    'vPlanEstudio', Base.metadata,
    Column('id', Integer),
    Column('plan_estudio', String(256)),
    Column('institucion_id', Integer),
    Column('institucion', String(128)),
    Column('carrera_id', Integer),
    Column('carrera', String(128)),
    Column('regimen_cursado_id', Integer),
    Column('regimen_cursado', String(256)),
    Column('periodos', Integer),
    Column('inicio', Integer),
    Column('fin', Integer)
)


t_vRegimenCursado = Table(
    'vRegimenCursado', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(256))
)


t_vTipoCorrelativa = Table(
    'vTipoCorrelativa', Base.metadata,
    Column('id', Integer),
    Column('nombre', String(128))
)


class Asignatura(Base):
    __tablename__ = 'Asignatura'
    __table_args__ = (
        ForeignKeyConstraint(['area_academica_id'], ['AreaAcademica.id'], name='fk_area_academica'),
        UniqueConstraint('area_academica_id', 'nombre', name='unq_asignatura')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    area_academica_id: Mapped[int] = mapped_column(Integer, nullable=False)
    nombre: Mapped[str] = mapped_column(String(256), nullable=False)

    area_academica: Mapped['AreaAcademica'] = relationship('AreaAcademica', back_populates='Asignatura')
    AsignaturaPlan: Mapped[list['AsignaturaPlan']] = relationship('AsignaturaPlan', back_populates='asignatura')


class CarreraInstitucion(Base):
    __tablename__ = 'CarreraInstitucion'
    __table_args__ = (
        ForeignKeyConstraint(['carrera_id'], ['Carrera.id'], name='fk_carrera_institucion'),
        ForeignKeyConstraint(['institucion_id'], ['Institucion.id'], name='fk_institucion_carrera'),
        UniqueConstraint('institucion_id', 'carrera_id', name='unq_carrera_institucion')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    institucion_id: Mapped[int] = mapped_column(Integer, nullable=False)
    carrera_id: Mapped[int] = mapped_column(Integer, nullable=False)

    carrera: Mapped['Carrera'] = relationship('Carrera', back_populates='CarreraInstitucion')
    institucion: Mapped['Institucion'] = relationship('Institucion', back_populates='CarreraInstitucion')
    PlanEstudio: Mapped[list['PlanEstudio']] = relationship('PlanEstudio', back_populates='carrera_institucion')


class PlanEstudio(Base):
    __tablename__ = 'PlanEstudio'
    __table_args__ = (
        CheckConstraint('anio_finalizacion is null or anio_finalizacion >= anio_inicio', name='chk_plan_anios'),
        CheckConstraint('periodos >= 1'),
        ForeignKeyConstraint(['carrera_institucion_id'], ['CarreraInstitucion.id'], name='fk_plan_carrera'),
        ForeignKeyConstraint(['regimen_cursado_id'], ['RegimenCursado.id'], name='fk_regimen_cursado'),
        UniqueConstraint('carrera_institucion_id', 'nombre', name='unq_plan')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    carrera_institucion_id: Mapped[int] = mapped_column(Integer, nullable=False)
    nombre: Mapped[str] = mapped_column(String(256), nullable=False)
    regimen_cursado_id: Mapped[int] = mapped_column(Integer, nullable=False)
    periodos: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('1'))
    anio_inicio: Mapped[int] = mapped_column(Integer, nullable=False)
    anio_finalizacion: Mapped[Optional[int]] = mapped_column(Integer)

    carrera_institucion: Mapped['CarreraInstitucion'] = relationship('CarreraInstitucion', back_populates='PlanEstudio')
    regimen_cursado: Mapped['RegimenCursado'] = relationship('RegimenCursado', back_populates='PlanEstudio')
    AsignaturaPlan: Mapped[list['AsignaturaPlan']] = relationship('AsignaturaPlan', back_populates='plan_estudio')


class AsignaturaPlan(Base):
    __tablename__ = 'AsignaturaPlan'
    __table_args__ = (
        ForeignKeyConstraint(['asignatura_id'], ['Asignatura.id'], name='fk_asignatura_plan'),
        ForeignKeyConstraint(['periodo_cursado_id'], ['PeriodoCursado.id'], name='fk_asignatura_periodo'),
        ForeignKeyConstraint(['plan_estudio_id'], ['PlanEstudio.id'], name='fk_plan_asignatura'),
        UniqueConstraint('plan_estudio_id', 'asignatura_id', 'periodo_cursado_id', name='unq_asignatura_plan')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    plan_estudio_id: Mapped[int] = mapped_column(Integer, nullable=False)
    asignatura_id: Mapped[int] = mapped_column(Integer, nullable=False)
    periodo_cursado_id: Mapped[int] = mapped_column(Integer, nullable=False)

    asignatura: Mapped['Asignatura'] = relationship('Asignatura', back_populates='AsignaturaPlan')
    periodo_cursado: Mapped['PeriodoCursado'] = relationship('PeriodoCursado', back_populates='AsignaturaPlan')
    plan_estudio: Mapped['PlanEstudio'] = relationship('PlanEstudio', back_populates='AsignaturaPlan')
    Correlativa_asignaturaplan: Mapped[list['Correlativa']] = relationship('Correlativa', foreign_keys='[Correlativa.asignaturaplan_id]', back_populates='asignaturaplan')
    Correlativa_correlativa: Mapped[list['Correlativa']] = relationship('Correlativa', foreign_keys='[Correlativa.correlativa_id]', back_populates='correlativa')


class Correlativa(Base):
    __tablename__ = 'Correlativa'
    __table_args__ = (
        CheckConstraint('asignaturaplan_id <> correlativa_id', name='chk_correlativa_distinta'),
        ForeignKeyConstraint(['asignaturaplan_id'], ['AsignaturaPlan.id'], name='fk_asignaturaplan_correlativa'),
        ForeignKeyConstraint(['correlativa_id'], ['AsignaturaPlan.id'], name='fk_correlativa_asignaturaplan'),
        ForeignKeyConstraint(['tipocorrelativa_id'], ['TipoCorrelativa.id'], name='fk_tipocorrelativa'),
        UniqueConstraint('tipocorrelativa_id', 'asignaturaplan_id', 'correlativa_id', name='unq_correlativa')
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tipocorrelativa_id: Mapped[int] = mapped_column(Integer, nullable=False)
    asignaturaplan_id: Mapped[int] = mapped_column(Integer, nullable=False)
    correlativa_id: Mapped[int] = mapped_column(Integer, nullable=False)

    asignaturaplan: Mapped['AsignaturaPlan'] = relationship('AsignaturaPlan', foreign_keys=[asignaturaplan_id], back_populates='Correlativa_asignaturaplan')
    correlativa: Mapped['AsignaturaPlan'] = relationship('AsignaturaPlan', foreign_keys=[correlativa_id], back_populates='Correlativa_correlativa')
    tipocorrelativa: Mapped['TipoCorrelativa'] = relationship('TipoCorrelativa', back_populates='Correlativa')
