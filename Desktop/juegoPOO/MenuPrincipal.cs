using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace Mortal
{
    public enum OpcionMenu
    {
        Modo1vs1,
        VerPersonajes,
        Salir
    }

    public class MenuPrincipal
    {
        private OpcionMenu opcionSeleccionada = OpcionMenu.Modo1vs1;
        private bool viendoInformacionPersonajes = false;
        private int personajeInfoIndice = 0;

        private MouseState mouseAnterior;
        private KeyboardState tecladoAnterior;

        private class InfoPersonaje
        {
            public string Nombre;
            public int IconoIndice;
            public int Vida;
            public int Velocidad;
            public int Salto;
            public int Danio;
            public string Descripcion;
            public string UltiDesc;

            public InfoPersonaje(string nombre, int icono, int vida, int velocidad, int salto, int danio, string descripcion, string ultiDesc)
            {
                Nombre = nombre;
                IconoIndice = icono;
                Vida = vida;
                Velocidad = velocidad;
                Salto = salto;
                Danio = danio;
                Descripcion = descripcion;
                UltiDesc = ultiDesc;
            }
        }

        private List<InfoPersonaje> listaPersonajes = new List<InfoPersonaje>
        {
            new InfoPersonaje("FALSE LIGHT", 0, 150, 8, 18, 3, "Luchador equilibrado con doble salto.", "ULTI: Disparo energetico a distancia."),
            new InfoPersonaje("MONSTERX", 1, 150, 5, 19, 4, "Bruto cuerpo a cuerpo letal.", "ULTI: Transformacion con mas poder."),
            new InfoPersonaje("GOKU", 2, 150, 7, 17, 5, "Experto en combos rapidos y agilidad.", "ULTI: Rafaga veloz de golpes ritmicos."),
            new InfoPersonaje("CR7", 3, 150, 10, 20, 7, "El mas veloz con alta movilidad.", "ULTI: Ataque fulminante e imparable.")
        };

        public void Actualizar(KeyboardState teclado, MouseState mouse, ref Estado estadoJuego, Game game)
        {
            if (viendoInformacionPersonajes)
            {
                if ((teclado.IsKeyDown(Keys.Left) && tecladoAnterior.IsKeyUp(Keys.Left)) ||
                    (teclado.IsKeyDown(Keys.A) && tecladoAnterior.IsKeyUp(Keys.A)))
                {
                    personajeInfoIndice = (personajeInfoIndice - 1 + listaPersonajes.Count) % listaPersonajes.Count;
                }
                if ((teclado.IsKeyDown(Keys.Right) && tecladoAnterior.IsKeyUp(Keys.Right)) ||
                    (teclado.IsKeyDown(Keys.D) && tecladoAnterior.IsKeyUp(Keys.D)))
                {
                    personajeInfoIndice = (personajeInfoIndice + 1) % listaPersonajes.Count;
                }

                if ((teclado.IsKeyDown(Keys.Escape) && tecladoAnterior.IsKeyUp(Keys.Escape)) ||
                    (teclado.IsKeyDown(Keys.Back) && tecladoAnterior.IsKeyUp(Keys.Back)))
                {
                    viendoInformacionPersonajes = false;
                }
            }
            else
            {
                if (teclado.IsKeyDown(Keys.Up) && tecladoAnterior.IsKeyUp(Keys.Up))
                {
                    opcionSeleccionada = (OpcionMenu)(((int)opcionSeleccionada - 1 + 3) % 3);
                }
                if (teclado.IsKeyDown(Keys.Down) && tecladoAnterior.IsKeyUp(Keys.Down))
                {
                    opcionSeleccionada = (OpcionMenu)(((int)opcionSeleccionada + 1) % 3);
                }

                // BOTONES MUY GRANDES (Ancho: 420, Alto: 70)
                Rectangle rectBtn1 = new Rectangle(190, 250, 420, 70);
                Rectangle rectBtn2 = new Rectangle(190, 340, 420, 70);
                Rectangle rectBtn3 = new Rectangle(190, 430, 420, 70);

                Point posMouse = mouse.Position;

                if (rectBtn1.Contains(posMouse)) opcionSeleccionada = OpcionMenu.Modo1vs1;
                if (rectBtn2.Contains(posMouse)) opcionSeleccionada = OpcionMenu.VerPersonajes;
                if (rectBtn3.Contains(posMouse)) opcionSeleccionada = OpcionMenu.Salir;

                bool clicMouse = mouse.LeftButton == ButtonState.Pressed && mouseAnterior.LeftButton == ButtonState.Released;
                bool presionoEnter = teclado.IsKeyDown(Keys.Enter) && tecladoAnterior.IsKeyUp(Keys.Enter);

                if (clicMouse || presionoEnter)
                {
                    EjecutarOpcion(opcionSeleccionada, ref estadoJuego, game);
                }
            }

            tecladoAnterior = teclado;
            mouseAnterior = mouse;
        }

        private void EjecutarOpcion(OpcionMenu opcion, ref Estado estadoJuego, Game game)
        {
            switch (opcion)
            {
                case OpcionMenu.Modo1vs1:
                    estadoJuego = Estado.SeleccionPersonajes;
                    break;
                case OpcionMenu.VerPersonajes:
                    viendoInformacionPersonajes = true;
                    personajeInfoIndice = 0;
                    break;
                case OpcionMenu.Salir:
                    game.Exit();
                    break;
            }
        }

        public void Dibujar(SpriteBatch spriteBatch, Texture2D pixel, SpriteFont fuenteGrande, SpriteFont fuentePequena, Texture2D[] iconosPersonajes, Texture2D fondo)
        {
            int anchoPantalla = 800;
            int altoPantalla = 600;

            if (fondo != null)
                spriteBatch.Draw(fondo, new Rectangle(0, 0, anchoPantalla, altoPantalla), Color.DarkGray);

            if (viendoInformacionPersonajes)
            {
                DibujarVisorPersonajes(spriteBatch, pixel, fuenteGrande, iconosPersonajes);
            }
            else
            {
                // --- TÍTULO EN 2 LÍNEAS GIGANTES ---
                string linea1 = "ENTROPY";
                string linea2 = "ATROPHY";
                float escalaTitulo = 0.85f; // Letra MUY GRANDE

                Vector2 tamL1 = fuenteGrande.MeasureString(linea1) * escalaTitulo;
                Vector2 posL1 = new Vector2((anchoPantalla - tamL1.X) / 2, 40);

                Vector2 tamL2 = fuenteGrande.MeasureString(linea2) * escalaTitulo;
                Vector2 posL2 = new Vector2((anchoPantalla - tamL2.X) / 2, 125);

                // Sombra y Texto Línea 1
                spriteBatch.DrawString(fuenteGrande, linea1, posL1 + new Vector2(4, 4), Color.Black, 0f, Vector2.Zero, escalaTitulo, SpriteEffects.None, 0f);
                spriteBatch.DrawString(fuenteGrande, linea1, posL1, Color.Crimson, 0f, Vector2.Zero, escalaTitulo, SpriteEffects.None, 0f);

                // Sombra y Texto Línea 2
                spriteBatch.DrawString(fuenteGrande, linea2, posL2 + new Vector2(4, 4), Color.Black, 0f, Vector2.Zero, escalaTitulo, SpriteEffects.None, 0f);
                spriteBatch.DrawString(fuenteGrande, linea2, posL2, Color.Crimson, 0f, Vector2.Zero, escalaTitulo, SpriteEffects.None, 0f);

                // --- BOTONES BASTANTE MÁS GRANDES ---
                DibujarBoton(spriteBatch, pixel, fuenteGrande, "1 VS 1", 250, opcionSeleccionada == OpcionMenu.Modo1vs1);
                DibujarBoton(spriteBatch, pixel, fuenteGrande, "PERSONAJES", 340, opcionSeleccionada == OpcionMenu.VerPersonajes);
                DibujarBoton(spriteBatch, pixel, fuenteGrande, "EXIT", 430, opcionSeleccionada == OpcionMenu.Salir);
            }
        }

        private void DibujarBoton(SpriteBatch spriteBatch, Texture2D pixel, SpriteFont fuente, string texto, int posY, bool seleccionado)
        {
            // Medidas enormes para los botones (Ancho: 420, Alto: 70)
            Rectangle rectBtn = new Rectangle(120, posY, 550, 75);

            Color colorFondo = seleccionado ? Color.DarkRed : Color.Black * 0.85f;
            Color colorBorde = seleccionado ? Color.Red : Color.Gray;
            Color colorTexto = seleccionado ? Color.Yellow : Color.White;

            spriteBatch.Draw(pixel, new Rectangle(rectBtn.X - 4, rectBtn.Y - 4, rectBtn.Width + 8, rectBtn.Height + 8), colorBorde);
            spriteBatch.Draw(pixel, rectBtn, colorFondo);

            float escalaBoton = 0.4f; // Texto gigante dentro del botón
            Vector2 tamTexto = fuente.MeasureString(texto) * escalaBoton;
            Vector2 posTexto = new Vector2(rectBtn.X + (rectBtn.Width - tamTexto.X) / 2, rectBtn.Y + (rectBtn.Height - tamTexto.Y) / 2);

            spriteBatch.DrawString(fuente, texto, posTexto, colorTexto, 0f, Vector2.Zero, escalaBoton, SpriteEffects.None, 0f);
        }

        private void DibujarVisorPersonajes(SpriteBatch spriteBatch, Texture2D pixel, SpriteFont fuente, Texture2D[] iconos)
        {
            InfoPersonaje p = listaPersonajes[personajeInfoIndice];

            Rectangle rectPrincipal = new Rectangle(50, 40, 700, 520);
            spriteBatch.Draw(pixel, new Rectangle(rectPrincipal.X - 4, rectPrincipal.Y - 4, rectPrincipal.Width + 8, rectPrincipal.Height + 8), Color.Crimson);
            spriteBatch.Draw(pixel, rectPrincipal, Color.Black * 0.95f);

            // 1. Cabecera (Achicada a 0.22f)
            string header = $"DETALLES DE PERSONAJE ({personajeInfoIndice + 1}/{listaPersonajes.Count})";
            spriteBatch.DrawString(fuente, header, new Vector2(70, 58), Color.Yellow, 0f, Vector2.Zero, 0.22f, SpriteEffects.None, 0f);

            // 2. Nombre Personaje (Achicado a 0.38f)
            spriteBatch.DrawString(fuente, p.Nombre, new Vector2(70, 85), Color.White, 0f, Vector2.Zero, 0.38f, SpriteEffects.None, 0f);

            // 3. Icono del personaje
            Rectangle rectIconoFrame = new Rectangle(70, 130, 140, 160);
            spriteBatch.Draw(pixel, new Rectangle(rectIconoFrame.X - 2, rectIconoFrame.Y - 2, rectIconoFrame.Width + 4, rectIconoFrame.Height + 4), Color.Gold);

            if (p.IconoIndice < iconos.Length && iconos[p.IconoIndice] != null)
            {
                spriteBatch.Draw(iconos[p.IconoIndice], rectIconoFrame, Color.White);
            }
            else
            {
                spriteBatch.Draw(pixel, rectIconoFrame, Color.DarkGray);
            }

            // 4. Barras de Estadísticas
            int posXBarras = 230;
            int posYBarras = 130;

            DibujarBarraStat(spriteBatch, pixel, fuente, "VIDA", p.Vida, 200, posXBarras, posYBarras, Color.Green);
            DibujarBarraStat(spriteBatch, pixel, fuente, "VELOC", p.Velocidad, 12, posXBarras, posYBarras + 38, Color.Cyan);
            DibujarBarraStat(spriteBatch, pixel, fuente, "SALTO", p.Salto, 25, posXBarras, posYBarras + 76, Color.Orange);
            DibujarBarraStat(spriteBatch, pixel, fuente, "DANIO", p.Danio, 10, posXBarras, posYBarras + 114, Color.Red);

            // 5. ULTI y Descripción (Achicadas a 0.21f para que no se corten)
            spriteBatch.DrawString(fuente, p.UltiDesc, new Vector2(70, 315), Color.Cyan, 0f, Vector2.Zero, 0.21f, SpriteEffects.None, 0f);

            spriteBatch.DrawString(fuente, "DESCRIPCION:", new Vector2(70, 355), Color.Yellow, 0f, Vector2.Zero, 0.21f, SpriteEffects.None, 0f);
            spriteBatch.DrawString(fuente, p.Descripcion, new Vector2(70, 385), Color.LightGray, 0f, Vector2.Zero, 0.21f, SpriteEffects.None, 0f);

            // 6. Pie de Controles (Achicado a 0.20f)
            spriteBatch.DrawString(fuente, "< A / D > Cambiar Personaje   |   [ESC / BACK] Volver", new Vector2(100, 520), Color.Gold, 0f, Vector2.Zero, 0.20f, SpriteEffects.None, 0f);
        }

        private void DibujarBarraStat(SpriteBatch spriteBatch, Texture2D pixel, SpriteFont fuente, string etiqueta, int valor, int maxValor, int x, int y, Color colorBarra)
        {
            float escalaTexto = 0.22f; // Etiqueta más pequeña
            spriteBatch.DrawString(fuente, etiqueta, new Vector2(x, y), Color.White, 0f, Vector2.Zero, escalaTexto, SpriteEffects.None, 0f);

            int anchoMaximoBarra = 240;
            int anchoRelleno = (int)((float)valor / maxValor * anchoMaximoBarra);

            Rectangle rectFondo = new Rectangle(x + 110, y + 2, anchoMaximoBarra, 18);
            Rectangle rectRelleno = new Rectangle(x + 110, y + 2, anchoRelleno, 18);

            spriteBatch.Draw(pixel, new Rectangle(rectFondo.X - 2, rectFondo.Y - 2, rectFondo.Width + 4, rectFondo.Height + 4), Color.DarkGray);
            spriteBatch.Draw(pixel, rectFondo, Color.Black);
            spriteBatch.Draw(pixel, rectRelleno, colorBarra);
        }
    }
}