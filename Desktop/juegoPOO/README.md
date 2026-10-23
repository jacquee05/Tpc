# juegoPOO — ENTROPY ATROPHY (bajo flores)) / XNA

Proyecto de juego de lucha en 2D desarrollado en C# utilizando la librería Microsoft.Xna.Framework (MonoGame/XNA).

---

## 👥 Integrantes del Equipo

* **Hyun Chacon**
* **Lionel Aluci**
* **Jose Luis Mendoza**

---

## 🎮 Explicación del Juego

Este proyecto es un juego de pelea versus estilo arcade local (1v1) en dos dimensiones. Dos personajes, **Player1** y **Player2**, se enfrentan en un escenario cerrado a rondas de 99 segundos.

### Características Principales

1. **Mecánica de Rondas:**
   * El combate finaliza cuando la salud de un jugador llega a 0 o se acaba el tiempo (99 segundos por ronda).
   * El jugador con más vida al finalizar el tiempo gana la ronda.
   * El primer jugador en conseguir **2 victorias** se corona ganador del combate (*FATALITY*).

2. **Acciones de Combate:**
   * **Movimiento y Salto:** Los luchadores pueden desplazarse horizontalmente y saltar aplicando física de gravedad.
   * **Ataque Ligero (Golpe):** Ataque rápido de bajo daño (5 pts de daño, 12 cuadros de duración).
   * **Ataque Pesado (Patada):** Ataque más lento pero potente (10 pts de daño, 20 cuadros de duración).
   * **Bloqueo:** Permite reducir el daño recibido a una quinta parte ($\frac{1}{5}$) mientras se mantenga presionada la tecla de bloqueo en el suelo.
   * **Colisión y Empuje:** Los personajes no pueden atravesarse y sufren un ligero retroceso (*knockback*) al recibir un impacto.

---

## ⌨️ Controles del Juego

| Acción | Jugador 1 | Jugador 2 |
| :--- | :---: | :---: |
| **Izquierda** | `Flecha Izquierda` | `A` |
| **Derecha** | `Flecha Derecha` | `D` |
| **Saltar** | `Flecha Arriba` | `W` |
| **Bloquear** | `Flecha Abajo` | `S` |
| **Golpe (Rápido)** | `Z` | `F` |
| **Patada (Fuerte)** | `X` | `G` |

> **Reiniciar / Salir:**
> * Presiona **Enter** al finalizar la partida para iniciar una revancha.
> * Presiona **Escape** en cualquier momento para salir del juego.



