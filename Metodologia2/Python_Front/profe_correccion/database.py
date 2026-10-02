"""Conexión a db/Facultad.db, compartida por CargaCarrera.py y la API.

La ruta se arma desde la ubicación de este archivo, así funciona sin importar
desde qué carpeta se ejecute el programa.
"""
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "db" / "Facultad.db"

engine = create_engine(f"sqlite:///{DB_PATH.as_posix()}", echo=False)

# Session() abre una sesión. Session.begin() además hace commit al salir del
# with, o rollback si hubo una excepción.
Session = sessionmaker(bind=engine)


class BaseNoDisponible(RuntimeError):
    """db/Facultad.db no existe: hay que crearla con sqlite3 (paso 4 del HowTo)."""


@event.listens_for(engine, "do_connect")
def _no_crear_base_vacia(dialect, conn_rec, cargs, cparams):
    # sqlite3.connect() crea un archivo vacío si no existe; preferimos avisar.
    if not DB_PATH.exists():
        raise BaseNoDisponible(
            "No existe db/Facultad.db. Creala desde la carpeta del proyecto con "
            ".\\sqlite3.exe .\\db\\Facultad.db y, dentro de sqlite3, .read db/Carrera.sql"
        )


@event.listens_for(engine, "connect")
def _activar_foreign_keys(dbapi_connection, connection_record):
    # SQLite trae las claves foráneas apagadas: hay que prenderlas en cada conexión.
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.close()
