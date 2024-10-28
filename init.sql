USE dbDemo;

CREATE TABLE IF NOT EXISTS person (
  cedula INT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  edad INT
);
