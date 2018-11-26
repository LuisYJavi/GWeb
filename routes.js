const routes = require("next-routes")();

routes
  .add("/Clases/:address", "/Clases/clase")
  .add("/Clases/nuevaClase", "Clases/nuevaClase")
  .add("/Profesores/nuevo", "/Profesores/nuevoProfesor")
  .add("/Profesores/verProfe", "/Profesores/verProfesor")
  .add("/Tipos/nuevoTipo", "Tipos/nuevoTipo")
  .add("/Tipos/verTipo", "Tipos/verTipo")
  .add("/Alumnos/Alumno", "Alumnos/Alumno")
  .add("/Alumnos/nuevoAlumno", "Alumnos/nuevoAlumno")
;

module.exports = routes;