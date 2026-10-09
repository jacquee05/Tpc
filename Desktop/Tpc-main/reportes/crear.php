<?php

include("conexion.php");

if ($_POST) {
    $tipo = $_POST['tipo_servicio'];
    $descripcion = $_POST['descripcion'];
    $ubicacion = $_POST['ubicacion'];
    $estado = $_POST['estado'];

    $sql = "INSERT INTO reportes
    (tipo_servicio, descripcion, ubicacion, urgencia, estado)
    VALUES
    ('$tipo', '$descripcion', '$ubicacion', '$estado')";

    if ($conexion->query($sql)) {
        echo "Reporte agregado correctamente";
    } else {
        echo "Error: " . $conexion->error;
    }
}
?>

<form method="POST">
    tipo Servicio:
    <input type="text" name="tipo_servicio"><br><br>

    descripcion:
    <input type="text" name="descripcion"><br><br>

    ubicacion:
    <input type="text" name="ubicacion"><br><br>

    estado:
    <input type="text" name="estado"><br><br>

    <button type="submit">Guardar</button>
</form>
