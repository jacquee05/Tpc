<?php

include("conexion.php");

$id = $_GET['id'];

$sql = "SELECT * FROM reportes WHERE id=$id";
$resultado = $conexion->query($sql);

$fila = $resultado->fetch_assoc();

if ($_POST) {

    $tipo = $_POST['tipo_servicio'];
    $descripcion = $_POST['descripcion'];
    $ubicacion = $_POST['ubicacion'];
    $estado = $_POST['estado'];

    $update = "UPDATE reportes SET
    tipo_servicio='$tipo',
    descripcion='$descripcion',
    ubicacion='$ubicacion',
    estado='$estado'
    WHERE id=$id";

    if ($conexion->query($update)) {
        echo "Reporte actualizado";
    } else {
        echo "Error: " . $conexion->error;
    }
}
?>

<form method="POST">

    tipo Servicio:
    <input type="text" name="tipo_servicio"
    value="<?php echo $fila['tipo_servicio']; ?>"><br><br>

    desacripcion:
    <input type="text" name="descripcion"
    value="<?php echo $fila['descripcion']; ?>"><br><br>

    ubicacion:
    <input type="text" name="ubicacion"
    value="<?php echo $fila['ubicacion']; ?>"><br><br>

    estado:
    <input type="text" name="estado"
    value="<?php echo $fila['estado']; ?>"><br><br>

    <button type="submit">Actualizar</button>

</form>