<?php


include("conexion.php");

$sql = "SELECT * FROM reportes";
$resultado = $conexion->query($sql);

echo "<h2>Lista de Reportes</h2>";

while($fila = $resultado->fetch_assoc()) {
t    echo "ID: " . $fila['id'] . "<br>";
    echo "Servicio: " . $fila['tipo_servicio'] . "<br>";
    echo "Descripción: " . $fila['descripcion'] . "<br>";
    echo "Ubicación: " . $fila['ubicacion'] . "<br>";
    echo "Estado: " . $fila['estado'] . "<br>";

    echo "<a href='editar.php?id=".$fila['id']."'>Editar</a> | ";
    echo "<a href='eliminar.php?id=".$fila['id']."'>Eliminar</a>";

    echo "<hr>";
}
?>