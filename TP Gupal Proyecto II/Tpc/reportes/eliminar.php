<?php

include("conexion.php");

$id = $_GET['id'];

$sql = "DELETE FROM reportes WHERE id=$id";

if ($conexion->query($sql)) {
    echo "Reporte eliminado";
} 
else {
    echo "Error: " . $conexion->error;
}
?>