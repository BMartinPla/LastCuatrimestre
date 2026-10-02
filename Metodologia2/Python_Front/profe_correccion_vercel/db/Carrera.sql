-- Esquema de db/Facultad.db
--
-- Uso, desde la carpeta del proyecto (la que tiene main.py):
--     .\sqlite3.exe .\db\Facultad.db
--     sqlite> .read db/Carrera.sql
--
-- Convención: se escribe en las tablas y se lee desde las vistas v*.
-- Las restricciones van con nombre y en una sola línea: así sqlacodegen
-- las detecta al generar modelscarrera.py.

-- SQLite trae las claves foráneas apagadas y hay que prenderlas en cada
-- conexión. Esto vale para esta sesión de sqlite3; database.py lo hace
-- para Python.
pragma foreign_keys = on;

create table Institucion (
    id integer not null primary key autoincrement,
    nombre varchar(128) not null,
    domicilio varchar(256) not null,
    constraint unq_institucion unique(nombre)
);

create view vInstitucion as
select id as id, nombre as nombre, domicilio as domicilio
from Institucion;

create table AreaAcademica (
    id integer not null primary key autoincrement,
    nombre varchar(128) not null,
    constraint unq_area_academica unique(nombre)
);

create view vAreaAcademica as
select id as id, nombre as nombre
from AreaAcademica;

create table Carrera (
    id integer not null primary key autoincrement,
    nombre varchar(128) not null,
    descripcion text,
    constraint unq_carrera unique(nombre)
);

create view vCarrera as
select id as id, nombre as nombre,
ifnull(descripcion,'Sin Información') as descripcion
from Carrera;

create table CarreraInstitucion (
    id integer not null primary key autoincrement,
    institucion_id integer not null,
    carrera_id integer not null,
    constraint fk_institucion_carrera foreign key (institucion_id) references Institucion(id),
    constraint fk_carrera_institucion foreign key (carrera_id) references Carrera(id),
    constraint unq_carrera_institucion unique(institucion_id, carrera_id)
);

create view vCarreraInstitucion as
select i.id as institucion_id, i.nombre as institucion,
    c.id as carrera_id, c.nombre as carrera
from CarreraInstitucion ci
inner join Institucion i
    on i.id = ci.institucion_id
inner join Carrera c
    on c.id = ci.carrera_id;

create table RegimenCursado (
    id integer not null primary key autoincrement,
    nombre varchar(256) not null,
    constraint unq_regimen_cursado unique(nombre)
);

create view vRegimenCursado as
select id as id, nombre as nombre
from RegimenCursado;

create table PlanEstudio (
    id integer not null primary key autoincrement,
    carrera_institucion_id integer not null,
    nombre varchar(256) not null,
    regimen_cursado_id integer not null,
    periodos integer not null default 1 check(periodos >= 1),
    anio_inicio integer not null,
    anio_finalizacion integer,
    constraint fk_plan_carrera foreign key (carrera_institucion_id) references CarreraInstitucion(id),
    constraint fk_regimen_cursado foreign key (regimen_cursado_id) references RegimenCursado(id),
    constraint unq_plan unique(carrera_institucion_id, nombre),
    constraint chk_plan_anios check(anio_finalizacion is null or anio_finalizacion >= anio_inicio)
);

create view vPlanEstudio as
select pe.id as id, pe.nombre as plan_estudio,
i.id as institucion_id, i.nombre as institucion,
c.id as carrera_id, c.nombre as carrera,
rc.id as regimen_cursado_id, rc.nombre as regimen_cursado,
pe.periodos as periodos,
pe.anio_inicio as inicio,
pe.anio_finalizacion as fin
from PlanEstudio pe
inner join CarreraInstitucion ci
    on ci.id = pe.carrera_institucion_id
inner join Institucion i
    on i.id = ci.institucion_id
inner join Carrera c
    on c.id = ci.carrera_id
inner join RegimenCursado rc
    on rc.id = pe.regimen_cursado_id;

create table Asignatura (
    id integer not null primary key autoincrement,
    area_academica_id integer not null,
    nombre varchar(256) not null,
    constraint fk_area_academica foreign key (area_academica_id) references AreaAcademica(id),
    constraint unq_asignatura unique(area_academica_id, nombre)
);

create view vAsignatura as
select a.id as id, a.nombre as nombre,
aa.id as area_academica_id, aa.nombre as area_academica
from Asignatura a
inner join AreaAcademica aa
    on aa.id = a.area_academica_id;

create table PeriodoCursado (
    id integer not null primary key autoincrement,
    nombre varchar(256) not null,
    constraint unq_periodo_cursado unique(nombre)
);

create view vPeriodoCursado as
select id as id, nombre as nombre
from PeriodoCursado;

create table AsignaturaPlan (
    id integer not null primary key autoincrement,
    plan_estudio_id integer not null,
    asignatura_id integer not null,
    periodo_cursado_id integer not null,
    constraint fk_asignatura_plan foreign key (asignatura_id) references Asignatura(id),
    constraint fk_plan_asignatura foreign key (plan_estudio_id) references PlanEstudio(id),
    constraint fk_asignatura_periodo foreign key (periodo_cursado_id) references PeriodoCursado(id),
    constraint unq_asignatura_plan unique(plan_estudio_id, asignatura_id, periodo_cursado_id)
);

-- id es el de AsignaturaPlan: es el que referencia la tabla Correlativa.
create view vAsignaturaPlan as
select ap.id as id,
p.id as plan_estudio_id, p.nombre as plan_estudio,
a.id as asignatura_id, a.nombre as asignatura,
aa.id as area_academica_id, aa.nombre as area_academica,
pc.id as periodo_cursado_id, pc.nombre as periodo_cursado
from AsignaturaPlan ap
inner join PlanEstudio p
    on p.id = ap.plan_estudio_id
inner join Asignatura a
    on a.id = ap.asignatura_id
inner join AreaAcademica aa
    on aa.id = a.area_academica_id
inner join PeriodoCursado pc
    on pc.id = ap.periodo_cursado_id;

create table TipoCorrelativa (
    id integer not null primary key autoincrement,
    nombre varchar(128) not null,
    constraint unq_tipo_correlativa unique(nombre)
);

create view vTipoCorrelativa as
select id as id, nombre as nombre
from TipoCorrelativa;

-- Una fila significa: para cursar y rendir "asignaturaplan" hay que tener
-- "correlativa" en el estado que indica el tipo (Cursada o Aprobada).
create table Correlativa (
    id integer not null primary key autoincrement,
    tipocorrelativa_id integer not null,
    asignaturaplan_id integer not null,
    correlativa_id integer not null,
    constraint fk_tipocorrelativa foreign key (tipocorrelativa_id) references TipoCorrelativa(id),
    constraint fk_asignaturaplan_correlativa foreign key (asignaturaplan_id) references AsignaturaPlan(id),
    constraint fk_correlativa_asignaturaplan foreign key (correlativa_id) references AsignaturaPlan(id),
    constraint unq_correlativa unique(tipocorrelativa_id, asignaturaplan_id, correlativa_id),
    constraint chk_correlativa_distinta check(asignaturaplan_id <> correlativa_id)
);

create view vCorrelativa as
select co.id as id, ap.plan_estudio_id as plan_estudio_id,
tc.id as tipocorrelativa_id, tc.nombre as tipo_correlativa,
ap.id as asignaturaplan_id, a.id as asignatura_id, a.nombre as asignatura,
ap2.id as correlativa_id, a2.id as correlativa_asignatura_id, a2.nombre as correlativa
from Correlativa co
inner join TipoCorrelativa tc
    on tc.id = co.tipocorrelativa_id
inner join AsignaturaPlan ap
    on ap.id = co.asignaturaplan_id
inner join Asignatura a
    on a.id = ap.asignatura_id
inner join AsignaturaPlan ap2
    on ap2.id = co.correlativa_id
inner join Asignatura a2
    on a2.id = ap2.asignatura_id;
