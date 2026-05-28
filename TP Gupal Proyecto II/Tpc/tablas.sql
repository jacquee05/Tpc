CREATE DATABASE luz_alerta;

CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,
    tipo_servicio VARCHAR(50),
    descripcion TEXT,
    ubicacion VARCHAR(100),
    urgencia VARCHAR(20),
    estado VARCHAR(30)
);
CREATE TABLE responsables (
    id SERIAL PRIMARY KEY,
    tipo_servicio VARCHAR(50),
    descripcion TEXT,
    ubicacion VARCHAR(100),
    urgencia VARCHAR(20),
    estado VARCHAR(30)
);
CREATE TABLE solucion (
    id SERIAL PRIMARY KEY,
    tipo_servicio VARCHAR(50),
    descripcion TEXT,
    ubicacion VARCHAR(100),
    urgencia VARCHAR(20),
    estado VARCHAR(30)
);