using System.Collections.Generic;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using static Mortal.Game1;

namespace Mortal
{
    public struct Controles
    {
        public Keys Izquierda;
        public Keys Derecha;
        public Keys Saltar;
        public Keys Agachar;
        public Keys Bloquear;
        public Keys Golpe;
        public Keys Patada;

        public Controles(Keys izquierda, Keys derecha, Keys saltar, Keys agachar, Keys bloquear, Keys golpe, Keys patada)
        {
            Izquierda = izquierda;
            Derecha = derecha;
            Saltar = saltar;
            Agachar = agachar;
            Bloquear = bloquear;
            Golpe = golpe;
            Patada = patada;
        }
    }

    public enum TipoPersonaje
    {
        FalseLight,
        MonsterX,
        Goku,
        Cr7
    }

    public struct DatosPersonaje
    {
        public string Nombre;
        public Color ColorBase;
        public int Velocidad;
        public float FuerzaSalto;
        public int DanioGolpe;
        public int DanioPatada; // Daño de patada independiente por personaje
        public int DanioEspecial;
        public int CargaPorGolpe;

        public DatosPersonaje(string nombre, Color color, int velocidad, float salto, int dGolpe, int dPatada, int dEspecial, int carga)
        {
            Nombre = nombre;
            ColorBase = color;
            Velocidad = velocidad;
            FuerzaSalto = salto;
            DanioGolpe = dGolpe;
            DanioPatada = dPatada;
            DanioEspecial = dEspecial;
            CargaPorGolpe = carga;
        }
    }

    public struct Proyectil
    {
        public Rectangle Area;
        public Vector2 Velocidad;
        public bool Activo;
        public Color ColorEspecial;
        public bool YaGolpeo;
    }

    public class Luchador
    {
        public const int AnchoPantalla = 800;
        public const int Suelo = 500;

        const int Ancho = 72;
        const int Alto = 144;
        const float Gravedad = 0.9f;

        public string Nombre = "False Light";
        public int Vida = 150;
        public int EnergiaEspecial = 0;
        public int Victorias = 0;
        public Vector2 Posicion;
        public Rectangle Cuerpo;
        public Rectangle ZonaAtaque;
        public Proyectil AtaqueEspecialProyectil;
        public bool MirandoDerecha;
        public bool Bloqueando;
        public bool Agachado;
        public bool EsEspecial;

        public Texture2D TexturaIdle;
        public Texture2D TexturaCaminar;
        public Texture2D TexturaSalto;
        public Texture2D TexturaAtaque;
        public Texture2D TexturaDanio;
        public Texture2D TexturaDefensa;
        public Texture2D TexturaAgacharse;

        public Texture2D TexturaMonsterXIdle;
        public Texture2D TexturaMonsterXCaminar;
        public Texture2D TexturaMonsterXSalto;
        public Texture2D TexturaMonsterXAtaque;
        public Texture2D TexturaMonsterXDanio;
        public Texture2D TexturaMonsterXDefensa;
        public Texture2D TexturaMonsterXAgacharse;
        public Texture2D TexturaMonsterXPatada;

        public int TemporizadorTransformacion = 0;
        public bool EstaTransformado => TemporizadorTransformacion > 0;

        public DatosPersonaje Stats;
        public TipoPersonaje Tipo;

        Vector2 posInicial;
        Controles teclas;
        float velocidadY;
        bool enSuelo = true;
        bool puedeDobleSalto = false;
        int tiempoAtaque;
        int danioAtaque;
        int alturaAtaque;
        bool yaGolpeo;
        int tiempoGolpeado;

        public Texture2D TexturaExplosion;
        public List<ParticulaExplosion> rastroExplosiones = new List<ParticulaExplosion>();
        private int contadorRastro = 0;

        KeyboardState tecladoAnterior;
        List<Keys> historialTeclas = new List<Keys>();
        int temporizadorHistorial = 0;

        public bool Atacando => tiempoAtaque > 0;

        public Luchador(int posX, bool miraDerechaInicial, Controles teclas)
        {
            this.teclas = teclas;
            MirandoDerecha = miraDerechaInicial;
            ConfigurarPersonaje(TipoPersonaje.FalseLight);

            posInicial = new Vector2(posX, Suelo - Alto);
            Posicion = posInicial;
            ActualizarCuerpo();
        }

        public void ConfigurarPersonaje(TipoPersonaje tipo)
        {
            Tipo = tipo;
            switch (tipo)
            {
                case TipoPersonaje.FalseLight:
                    Stats = new DatosPersonaje("False Light", Color.Green, velocidad: 9, salto: -18f, dGolpe: 4, dPatada: 0, dEspecial: 20, carga: 25);
                    break;
                case TipoPersonaje.MonsterX:
                    Stats = new DatosPersonaje("MonsterX", Color.Red, velocidad: 6, salto: -19f, dGolpe: 5, dPatada: 4, dEspecial: 25, carga: 15);
                    break;
                case TipoPersonaje.Goku:
                    Stats = new DatosPersonaje("Goku", Color.Gray, velocidad: 7, salto: -17f, dGolpe: 5, dPatada: 9, dEspecial: 18, carga: 15);
                    break;
                case TipoPersonaje.Cr7:
                    Stats = new DatosPersonaje("CR7", Color.Crimson, velocidad: 10, salto: -20f, dGolpe: 7, dPatada: 12, dEspecial: 22, carga: 20);
                    break;
            }
            Nombre = Stats.Nombre;
        }

        public void Actualizar(KeyboardState teclado, Luchador rival)
        {
            MirandoDerecha = Posicion.X < rival.Posicion.X;
            Bloqueando = false;
            Agachado = false;

            if (tiempoGolpeado > 0)
                tiempoGolpeado--;

            if (historialTeclas.Count > 0)
            {
                temporizadorHistorial++;
                if (temporizadorHistorial > 30)
                {
                    historialTeclas.Clear();
                    temporizadorHistorial = 0;
                }
            }

            if (TemporizadorTransformacion > 0)
            {
                TemporizadorTransformacion--;

                if (TemporizadorTransformacion == 0)
                {
                    Stats.Velocidad -= 4;
                    Stats.FuerzaSalto += 3f;
                    Stats.DanioGolpe -= 2;
                    Stats.DanioPatada -= 2;
                }
            }
            RegistrarEntrada(teclado);

            if (Atacando)
            {
                tiempoAtaque--;
            }
            else if (teclado.IsKeyDown(teclas.Bloquear) && enSuelo)
            {
                Bloqueando = true;
            }
            else if (teclado.IsKeyDown(teclas.Agachar) && enSuelo)
            {
                Agachado = true;
            }
            else
            {
                if (ValidarAtaqueEspecial(teclado) && EnergiaEspecial >= 100)
                {
                    LanzarEspecial();
                    EnergiaEspecial = 0;
                    historialTeclas.Clear();
                }
                else if (teclado.IsKeyDown(teclas.Golpe))
                {
                    IniciarAtaque(Stats.DanioGolpe, 10, 30, false);
                }
                else if (teclado.IsKeyDown(teclas.Patada))
                {
                    if (Tipo != TipoPersonaje.FalseLight)
                    {
                        IniciarAtaque(Stats.DanioPatada, 14, 110, false);
                    }
                }
                else
                {
                    if (teclado.IsKeyDown(teclas.Izquierda))
                        Posicion.X -= Stats.Velocidad;
                    if (teclado.IsKeyDown(teclas.Derecha))
                        Posicion.X += Stats.Velocidad;

                    if (teclado.IsKeyDown(teclas.Saltar) && tecladoAnterior.IsKeyUp(teclas.Saltar))
                    {
                        if (enSuelo)
                        {
                            velocidadY = Stats.FuerzaSalto;
                            enSuelo = false;
                            puedeDobleSalto = (Tipo == TipoPersonaje.FalseLight);
                        }
                        else if (puedeDobleSalto)
                        {
                            velocidadY = Stats.FuerzaSalto * 0.85f;
                            puedeDobleSalto = false;
                        }
                    }
                }
            }

            velocidadY += Gravedad;
            Posicion.Y += velocidadY;

            if (Posicion.Y >= Suelo - Alto)
            {
                Posicion.Y = Suelo - Alto;
                velocidadY = 0;
                enSuelo = true;
                puedeDobleSalto = false;
            }

            ActualizarCuerpo();
            if (Cuerpo.Intersects(rival.Cuerpo))
            {
                if (!Atacando && !rival.Atacando)
                {
                    if (MirandoDerecha)
                        Posicion.X -= Stats.Velocidad;
                    else
                        Posicion.X += Stats.Velocidad;
                }
            }

            if (Posicion.X < 0) Posicion.X = 0;
            if (Posicion.X > AnchoPantalla - Ancho) Posicion.X = AnchoPantalla - Ancho;

            ActualizarCuerpo();

            if (Atacando && !EsEspecial)
            {
                int alcance = 60;
                int x = MirandoDerecha ? Cuerpo.Right : Cuerpo.Left - alcance;
                ZonaAtaque = new Rectangle(x, Cuerpo.Y + alturaAtaque, alcance, 30);

                if (!yaGolpeo && ZonaAtaque.Intersects(rival.Cuerpo))
                {
                    if (rival.RecibirDanio(danioAtaque, MirandoDerecha))
                    {
                        CargarEnergia(Stats.CargaPorGolpe);
                    }
                    yaGolpeo = true;
                }
            }

            ActualizarEspecial(rival);
            tecladoAnterior = teclado;
        }

        private void LanzarEspecial()
        {
            EsEspecial = true;
            tiempoAtaque = 15;

            if (Tipo == TipoPersonaje.MonsterX)
            {
                TemporizadorTransformacion = 240;
                Stats.Velocidad += 4;
                Stats.FuerzaSalto -= 3f;
                Stats.DanioGolpe += 2;
                Stats.DanioPatada += 2;
            }
            else
            {
                int dir = MirandoDerecha ? 1 : -1;
                int posXProyectil = MirandoDerecha ? (int)Posicion.X + Ancho : (int)Posicion.X;

                AtaqueEspecialProyectil = new Proyectil
                {
                    Area = new Rectangle(posXProyectil, (int)Posicion.Y + 20, 100, 100),
                    Velocidad = new Vector2(13 * dir, 0),
                    Activo = true,
                    ColorEspecial = Color.LightSkyBlue,
                    YaGolpeo = false
                };
            }
        }

        private void ActualizarEspecial(Luchador rival)
        {
            if (AtaqueEspecialProyectil.Activo)
            {
                AtaqueEspecialProyectil.Area.X += (int)AtaqueEspecialProyectil.Velocidad.X;

                contadorRastro++;
                if (contadorRastro >= 7)
                {
                    int dir = AtaqueEspecialProyectil.Velocidad.X > 0 ? 1 : -1;

                    rastroExplosiones.Add(new ParticulaExplosion
                    {
                        Posicion = new Vector2(AtaqueEspecialProyectil.Area.Center.X + (dir * 45) - 90, AtaqueEspecialProyectil.Area.Center.Y - 100),
                        FrameActual = 0,
                        TemporizadorAnimacion = 0,
                        Activa = true
                    });
                    contadorRastro = 0;
                }

                if (AtaqueEspecialProyectil.Area.Intersects(rival.Cuerpo))
                {
                    if (!AtaqueEspecialProyectil.YaGolpeo)
                    {
                        rival.RecibirDanio(Stats.DanioEspecial, MirandoDerecha);
                        AtaqueEspecialProyectil.YaGolpeo = true;
                    }
                }

                if (AtaqueEspecialProyectil.Area.X < -150 || AtaqueEspecialProyectil.Area.X > AnchoPantalla + 150)
                {
                    AtaqueEspecialProyectil.Activo = false;
                }
            }

            for (int i = rastroExplosiones.Count - 1; i >= 0; i--)
            {
                var p = rastroExplosiones[i];
                p.TemporizadorAnimacion++;

                if (p.TemporizadorAnimacion >= 2)
                {
                    p.FrameActual++;
                    p.TemporizadorAnimacion = 0;
                    if (p.FrameActual >= 23)
                    {
                        p.Activa = false;
                    }
                }
                rastroExplosiones[i] = p;

                if (!p.Activa)
                {
                    rastroExplosiones.RemoveAt(i);
                }
            }
        }

        public void CargarEnergia(int cantidad)
        {
            if (Tipo == TipoPersonaje.MonsterX && TemporizadorTransformacion > 0)
            {
                return;
            }

            EnergiaEspecial += cantidad;
            if (EnergiaEspecial > 100) EnergiaEspecial = 100;
        }

        private void RegistrarEntrada(KeyboardState teclado)
        {
            Keys[] teclasAnotar = { teclas.Izquierda, teclas.Derecha, teclas.Golpe, teclas.Patada };

            foreach (var k in teclasAnotar)
            {
                if (teclado.IsKeyDown(k) && tecladoAnterior.IsKeyUp(k))
                {
                    historialTeclas.Add(k);
                    temporizadorHistorial = 0;
                    if (historialTeclas.Count > 5)
                        historialTeclas.RemoveAt(0);
                }
            }
        }

        private bool ValidarAtaqueEspecial(KeyboardState teclado)
        {
            Keys botonAtaque = teclas.Golpe;

            if (!teclado.IsKeyDown(botonAtaque) || !tecladoAnterior.IsKeyUp(botonAtaque))
                return false;

            Keys teclaAtras = MirandoDerecha ? teclas.Izquierda : teclas.Derecha;
            Keys teclaAdelante = MirandoDerecha ? teclas.Derecha : teclas.Izquierda;

            int n = historialTeclas.Count;
            if (n >= 3)
            {
                return historialTeclas[n - 3] == teclaAtras &&
                       historialTeclas[n - 2] == teclaAdelante &&
                       historialTeclas[n - 1] == botonAtaque;
            }

            return false;
        }

        void ActualizarCuerpo()
        {
            int anchoFisico = 72;
            int altoFisico = 144;

            if (!enSuelo)
            {
                altoFisico = 130;
            }
            else if (Agachado)
            {
                altoFisico = 72;
                anchoFisico = 100;
            }

            int posYReal = (int)Posicion.Y + (144 - altoFisico);
            Cuerpo = new Rectangle((int)Posicion.X, posYReal, anchoFisico, altoFisico);
        }

        void IniciarAtaque(int danio, int duracion, int altura, bool especial)
        {
            danioAtaque = danio;
            tiempoAtaque = duracion;
            alturaAtaque = altura;
            EsEspecial = especial;
            yaGolpeo = false;
        }

        public bool RecibirDanio(int danio, bool empujarDerecha)
        {
            if (Bloqueando)
                danio /= 2;

            Vida -= danio;
            if (Vida < 0) Vida = 0;

            tiempoGolpeado = 8;
            Posicion.X += empujarDerecha ? 12 : -12;
            return true;
        }

        public void Reiniciar(bool partidaNueva)
        {
            Vida = 150;
            Posicion = posInicial;
            velocidadY = 0;
            enSuelo = true;
            puedeDobleSalto = false;
            tiempoAtaque = 0;
            tiempoGolpeado = 0;
            historialTeclas.Clear();
            AtaqueEspecialProyectil.Activo = false;

            rastroExplosiones.Clear();

            if (partidaNueva)
            {
                Victorias = 0;
                EnergiaEspecial = 0;
            }
            ActualizarCuerpo();
        }

        public void Dibujar(SpriteBatch spriteBatch, Texture2D pixel)
        {
            if (Tipo == TipoPersonaje.FalseLight || Tipo == TipoPersonaje.MonsterX)
            {
                Texture2D texturaAUsar = TexturaIdle;

                if (Tipo == TipoPersonaje.FalseLight)
                    texturaAUsar = TexturaIdle;
                else if (Tipo == TipoPersonaje.MonsterX)
                    texturaAUsar = TexturaMonsterXIdle;

                int wIdle = 90, hIdle = 150;
                int wCaminar = 95, hCaminar = 145;
                int wSalto = 170, hSalto = 190;
                int wAtaque = 200, hAtaque = 140;
                int wDanio = 120, hDanio = 150;
                int wDefensa = 80, hDefensa = 120;
                int wAgachado = 150, hAgachado = 100;
                int wPatada = 160, hPatada = 165;

                if (Tipo == TipoPersonaje.MonsterX)
                {
                    wIdle = 150; hIdle = 165;
                    wCaminar = 250; hCaminar = 145;
                    wSalto = 180; hSalto = 190;
                    wAtaque = 200; hAtaque = 170;
                    wPatada = 200; hPatada = 175;
                    wDanio = 180; hDanio = 150;
                    wDefensa = 160; hDefensa = 170;
                    wAgachado = 200; hAgachado = 140;
                }

                int anchoActual = wIdle;
                int altoActual = hIdle;

                if (Bloqueando)
                {
                    texturaAUsar = (Tipo == TipoPersonaje.FalseLight) ? TexturaDefensa : TexturaMonsterXDefensa;
                    anchoActual = wDefensa;
                    altoActual = hDefensa;
                }
                else if (Agachado && TexturaAgacharse != null)
                {
                    texturaAUsar = (Tipo == TipoPersonaje.FalseLight) ? TexturaAgacharse : TexturaMonsterXAgacharse;
                    anchoActual = wAgachado;
                    altoActual = hAgachado;
                }
                else if (tiempoGolpeado > 0)
                {
                    texturaAUsar = (Tipo == TipoPersonaje.FalseLight) ? TexturaDanio : TexturaMonsterXDanio;
                    anchoActual = wDanio;
                    altoActual = hDanio;
                }
                else if (Atacando)
                {
                    if (Tipo == TipoPersonaje.FalseLight)
                    {
                        texturaAUsar = TexturaAtaque;
                        anchoActual = wAtaque;
                        altoActual = hAtaque;
                    }
                    else if (Tipo == TipoPersonaje.MonsterX)
                    {
                        if (alturaAtaque > 50)
                        {
                            texturaAUsar = TexturaMonsterXPatada;
                            anchoActual = wPatada;
                            altoActual = hPatada;
                        }
                        else
                        {
                            texturaAUsar = TexturaMonsterXAtaque;
                            anchoActual = wAtaque;
                            altoActual = hAtaque;
                        }
                    }
                }
                else if (!enSuelo)
                {
                    texturaAUsar = (Tipo == TipoPersonaje.FalseLight) ? TexturaSalto : TexturaMonsterXSalto;
                    anchoActual = wSalto;
                    altoActual = hSalto;
                }
                else if ((Keyboard.GetState().IsKeyDown(teclas.Izquierda) || Keyboard.GetState().IsKeyDown(teclas.Derecha)) && enSuelo)
                {
                    texturaAUsar = (Tipo == TipoPersonaje.FalseLight) ? TexturaCaminar : TexturaMonsterXCaminar;
                    anchoActual = wCaminar;
                    altoActual = hCaminar;
                }

                if (texturaAUsar != null)
                {
                    int offsetAncho = (anchoActual - Ancho) / 2;
                    int offsetAltoMonsterX = (Tipo == TipoPersonaje.MonsterX) ? -12 : 0;

                    Rectangle rectDibujo = new Rectangle(
                        (int)Posicion.X - offsetAncho,
                        (int)Posicion.Y + (Alto - altoActual) + offsetAltoMonsterX,
                        anchoActual,
                        altoActual
                    );

                    SpriteEffects efecto = MirandoDerecha ? SpriteEffects.FlipHorizontally : SpriteEffects.None;

                    // --- CONTORNO ROJO TRASLÚCIDO DETRÁS ---
                    if (Tipo == TipoPersonaje.MonsterX && EstaTransformado)
                    {
                        int grosor = 4;
                        Color colorRastroRojo = new Color(255, 0, 0, 150);

                        spriteBatch.Draw(texturaAUsar, new Rectangle(rectDibujo.X - grosor, rectDibujo.Y, rectDibujo.Width, rectDibujo.Height), null, colorRastroRojo, 0f, Vector2.Zero, efecto, 0f);
                        spriteBatch.Draw(texturaAUsar, new Rectangle(rectDibujo.X + grosor, rectDibujo.Y, rectDibujo.Width, rectDibujo.Height), null, colorRastroRojo, 0f, Vector2.Zero, efecto, 0f);
                        spriteBatch.Draw(texturaAUsar, new Rectangle(rectDibujo.X, rectDibujo.Y - grosor, rectDibujo.Width, rectDibujo.Height), null, colorRastroRojo, 0f, Vector2.Zero, efecto, 0f);
                        spriteBatch.Draw(texturaAUsar, new Rectangle(rectDibujo.X, rectDibujo.Y + grosor, rectDibujo.Width, rectDibujo.Height), null, colorRastroRojo, 0f, Vector2.Zero, efecto, 0f);
                    }

                    // Dibuja el sprite original encima con total normalidad
                    spriteBatch.Draw(texturaAUsar, rectDibujo, null, Color.White, 0f, Vector2.Zero, efecto, 0f);
                }
                else
                {
                    DibujarCuadroColor(spriteBatch, pixel);
                }
            }
            else
            {
                DibujarCuadroColor(spriteBatch, pixel);
            }

            if (TexturaExplosion != null)
            {
                int columnas = 5;
                int anchoSprite = TexturaExplosion.Width / 5;
                int altoSprite = TexturaExplosion.Height / 5;

                foreach (var p in rastroExplosiones)
                {
                    int fila = p.FrameActual / columnas;
                    int columna = p.FrameActual % columnas;

                    Rectangle rectOrigen = new Rectangle(columna * anchoSprite, fila * altoSprite, anchoSprite, altoSprite);
                    Rectangle rectDestino = new Rectangle((int)p.Posicion.X, (int)p.Posicion.Y, 180, 180);

                    spriteBatch.Draw(TexturaExplosion, rectDestino, rectOrigen, Color.White);
                }
            }
        }

        private void DibujarCuadroColor(SpriteBatch spriteBatch, Texture2D pixel)
        {
            Color colorFallback = tiempoGolpeado > 0 ? Color.White : Stats.ColorBase;
            spriteBatch.Draw(pixel, Cuerpo, colorFallback);
            int ojoX = MirandoDerecha ? Cuerpo.Right - 22 : Cuerpo.Left + 8;
            spriteBatch.Draw(pixel, new Rectangle(ojoX, Cuerpo.Y + 18, 12, 8), Color.Black);
        }
    }

    public enum Estado
    {
        MenuPrincipal,
        SeleccionPersonajes,
        ContadorInicio,
        Peleando,
        FinRonda,
        FinPartida
    }

    public class Game1 : Game
    {
        Luchador jugador1, jugador2;
        Texture2D pixel;

        SpriteFont fuenteGrande;
        SpriteFont fuentePequena;

        Texture2D[] iconoSeleccion = new Texture2D[4];
        Texture2D texturaFondo;

        MenuPrincipal menuPrincipal = new MenuPrincipal();

        int temporizadorContador = 0;
        string textoContador = "";

        Estado estado = Estado.MenuPrincipal;
        int tiempoRonda = 99 * 60;
        int esperaFin;
        int ronda = 1;
        string mensaje = "";

        int selJ1 = 0;
        int selJ2 = 1;
        bool listoJ1 = false;
        bool listoJ2 = false;
        KeyboardState tecladoAnterior;

        private GraphicsDeviceManager _graphics;
        private SpriteBatch _spriteBatch;

        public Game1()
        {
            _graphics = new GraphicsDeviceManager(this);
            _graphics.PreferredBackBufferWidth = 800;
            _graphics.PreferredBackBufferHeight = 600;
            Content.RootDirectory = "Content";
            IsMouseVisible = true;
        }

        public struct ParticulaExplosion
        {
            public Vector2 Posicion;
            public int FrameActual;
            public int TemporizadorAnimacion;
            public bool Activa;
        }

        void IniciarCuentaRegresiva()
        {
            temporizadorContador = 180;
            estado = Estado.ContadorInicio;
        }

        protected override void Initialize()
        {
            jugador1 = new Luchador(180, true, new Controles(Keys.Left, Keys.Right, Keys.Up, Keys.Down, Keys.Space, Keys.N, Keys.M));
            jugador2 = new Luchador(560, false, new Controles(Keys.A, Keys.D, Keys.W, Keys.S, Keys.H, Keys.F, Keys.G));

            base.Initialize();
        }

        protected override void LoadContent()
        {
            _spriteBatch = new SpriteBatch(GraphicsDevice);

            pixel = new Texture2D(GraphicsDevice, 1, 1);
            pixel.SetData(new Color[] { Color.White });

            texturaFondo = Content.Load<Texture2D>("Fondos/Arena");

            fuenteGrande = Content.Load<SpriteFont>("Fuentes/FuenteTexto");
            fuentePequena = Content.Load<SpriteFont>("Fuentes/FuenteTextoPequeña");

            iconoSeleccion[0] = Content.Load<Texture2D>("Personajes/Seleccion/FalselightIcon");
            iconoSeleccion[2] = Content.Load<Texture2D>("Personajes/Seleccion/Gokuicon");
            iconoSeleccion[1] = Content.Load<Texture2D>("Personajes/Seleccion/MonsterXicon");
            iconoSeleccion[3] = Content.Load<Texture2D>("Personajes/Seleccion/Cr7icon");

            CargarTexturasFalseLight(jugador1);
            CargarTexturasMonsterX(jugador1);

            CargarTexturasFalseLight(jugador2);
            CargarTexturasMonsterX(jugador2);
        }

        void CargarTexturasFalseLight(Luchador l)
        {
            l.TexturaIdle = Content.Load<Texture2D>("Personajes/FalseLight/Idle");
            l.TexturaCaminar = Content.Load<Texture2D>("Personajes/FalseLight/Caminar");
            l.TexturaSalto = Content.Load<Texture2D>("Personajes/FalseLight/Salto");
            l.TexturaAtaque = Content.Load<Texture2D>("Personajes/FalseLight/Ataque");
            l.TexturaDanio = Content.Load<Texture2D>("Personajes/FalseLight/Danio");
            l.TexturaDefensa = Content.Load<Texture2D>("Personajes/FalseLight/Defensa");
            l.TexturaAgacharse = Content.Load<Texture2D>("Personajes/FalseLight/Agacharse");
            l.TexturaExplosion = Content.Load<Texture2D>("Personajes/FalseLight/Explosion");
        }

        void CargarTexturasMonsterX(Luchador l)
        {
            l.TexturaMonsterXIdle = Content.Load<Texture2D>("Personajes/MonsterX/XIdle");
            l.TexturaMonsterXCaminar = Content.Load<Texture2D>("Personajes/MonsterX/XCaminar");
            l.TexturaMonsterXSalto = Content.Load<Texture2D>("Personajes/MonsterX/XSalto");
            l.TexturaMonsterXAtaque = Content.Load<Texture2D>("Personajes/MonsterX/XAtaque");
            l.TexturaMonsterXDanio = Content.Load<Texture2D>("Personajes/MonsterX/XDanio");
            l.TexturaMonsterXDefensa = Content.Load<Texture2D>("Personajes/MonsterX/XDefensa");
            l.TexturaMonsterXAgacharse = Content.Load<Texture2D>("Personajes/MonsterX/XAgacharse");
            l.TexturaMonsterXPatada = Content.Load<Texture2D>("Personajes/MonsterX/XPatada");
        }

        protected override void Update(GameTime gameTime)
        {
            KeyboardState teclado = Keyboard.GetState();
            MouseState mouse = Mouse.GetState();

            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || teclado.IsKeyDown(Keys.Escape) && estado == Estado.MenuPrincipal)
                Exit();

            switch (estado)
            {
                case Estado.MenuPrincipal:
                    menuPrincipal.Actualizar(teclado, mouse, ref estado, this);
                    break;

                case Estado.SeleccionPersonajes:
                    ActualizarSeleccion(teclado);
                    break;

                case Estado.ContadorInicio:
                    temporizadorContador--;

                    if (temporizadorContador > 120)
                        textoContador = "READY...";
                    else if (temporizadorContador > 60)
                        textoContador = "SET...";
                    else if (temporizadorContador > 0)
                        textoContador = "FIGHT!";
                    else
                    {
                        estado = Estado.Peleando;
                    }
                    break;

                case Estado.Peleando:
                    jugador1.Actualizar(teclado, jugador2);
                    jugador2.Actualizar(teclado, jugador1);
                    tiempoRonda--;

                    if (jugador1.Vida <= 0 || jugador2.Vida <= 0 || tiempoRonda <= 0)
                        TerminarRonda();
                    break;

                case Estado.FinRonda:
                    esperaFin--;
                    if (esperaFin <= 0)
                        NuevaRonda();
                    break;

                case Estado.FinPartida:
                    if (teclado.IsKeyDown(Keys.Enter))
                    {
                        estado = Estado.MenuPrincipal;
                        listoJ1 = false;
                        listoJ2 = false;
                    }
                    break;
            }

            tecladoAnterior = teclado;
            base.Update(gameTime);
        }

        void ActualizarSeleccion(KeyboardState teclado)
        {
            if (!listoJ1)
            {
                if (teclado.IsKeyDown(Keys.Left) && tecladoAnterior.IsKeyUp(Keys.Left))
                    selJ1 = (selJ1 - 1 + 4) % 4;
                if (teclado.IsKeyDown(Keys.Right) && tecladoAnterior.IsKeyUp(Keys.Right))
                    selJ1 = (selJ1 + 1) % 4;
                if (teclado.IsKeyDown(Keys.Z) && tecladoAnterior.IsKeyUp(Keys.Z))
                    listoJ1 = true;
            }

            if (!listoJ2)
            {
                if (teclado.IsKeyDown(Keys.A) && tecladoAnterior.IsKeyUp(Keys.A))
                    selJ2 = (selJ2 - 1 + 4) % 4;
                if (teclado.IsKeyDown(Keys.D) && tecladoAnterior.IsKeyUp(Keys.D))
                    selJ2 = (selJ2 + 1) % 4;
                if (teclado.IsKeyDown(Keys.F) && tecladoAnterior.IsKeyUp(Keys.F))
                    listoJ2 = true;
            }

            if (listoJ1 && listoJ2)
            {
                jugador1.ConfigurarPersonaje((TipoPersonaje)selJ1);
                jugador2.ConfigurarPersonaje((TipoPersonaje)selJ2);
                NuevaPartida();
            }
        }

        void TerminarRonda()
        {
            Luchador ganador = null;
            if (jugador1.Vida > jugador2.Vida)
                ganador = jugador1;
            else if (jugador2.Vida > jugador1.Vida)
                ganador = jugador2;

            if (ganador != null)
                ganador.Victorias++;

            if (ganador != null && ganador.Victorias == 2)
            {
                estado = Estado.FinPartida;
                mensaje = "FATALITY!";
            }
            else
            {
                estado = Estado.FinRonda;
                esperaFin = 120;
                ronda++;
                mensaje = "Ronda terminada";
            }
        }

        void NuevaRonda()
        {
            jugador1.Reiniciar(false);
            jugador2.Reiniciar(false);
            tiempoRonda = 99 * 60;
            IniciarCuentaRegresiva();
        }

        void NuevaPartida()
        {
            jugador1.Reiniciar(true);
            jugador2.Reiniciar(true);
            ronda = 1;
            tiempoRonda = 99 * 60;
            IniciarCuentaRegresiva();
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Black);
            _spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, SamplerState.PointClamp);

            if (estado == Estado.MenuPrincipal)
            {
                menuPrincipal.Dibujar(_spriteBatch, pixel, fuenteGrande, fuentePequena, iconoSeleccion, texturaFondo);
            }
            else if (estado == Estado.SeleccionPersonajes)
            {
                DibujarMenuSeleccion();
            }
            else
            {
                _spriteBatch.Draw(texturaFondo, new Rectangle(0, 0, 800, 600), Color.White);

                jugador1.Dibujar(_spriteBatch, pixel);
                jugador2.Dibujar(_spriteBatch, pixel);

                DibujarBarraVida(jugador1, 20, false);
                DibujarBarraVida(jugador2, 800 - 320, true);

                int segundosRestantes = MathHelper.Max(0, tiempoRonda / 60);
                string textoReloj = segundosRestantes.ToString();
                Vector2 tamReloj = fuentePequena.MeasureString(textoReloj);
                Vector2 posReloj = new Vector2(400 - (tamReloj.X / 2), 22);

                _spriteBatch.DrawString(fuentePequena, textoReloj, posReloj + new Vector2(2, 2), Color.Black);
                _spriteBatch.DrawString(fuentePequena, textoReloj, posReloj, Color.Yellow);

                if (estado == Estado.ContadorInicio)
                {
                    float escalaContador = 0.5f;

                    Vector2 tamañoTexto = fuenteGrande.MeasureString(textoContador) * escalaContador;
                    Vector2 posicionTexto = new Vector2(
                        (800 / 2) - (tamañoTexto.X / 2),
                        (600 / 2) - (tamañoTexto.Y / 2) - 40
                    );

                    Color colorTexto = (textoContador == "FIGHT!") ? Color.Red : Color.Yellow;

                    _spriteBatch.DrawString(fuenteGrande, textoContador, posicionTexto + new Vector2(3, 3), Color.Black, 0f, Vector2.Zero, escalaContador, SpriteEffects.None, 0f);
                    _spriteBatch.DrawString(fuenteGrande, textoContador, posicionTexto, colorTexto, 0f, Vector2.Zero, escalaContador, SpriteEffects.None, 0f);
                }
            }

            _spriteBatch.End();
            base.Draw(gameTime);
        }

        void DibujarMenuSeleccion()
        {
            _spriteBatch.Draw(pixel, new Rectangle(15, 40, 770, 520), Color.DarkGray);
            _spriteBatch.Draw(pixel, new Rectangle(25, 50, 750, 500), Color.Black);

            int anchoCasilla = 170;
            int altoCasilla = 220;
            int inicioX = 38;
            int inicioY = 180;

            for (int i = 0; i < 4; i++)
            {
                int x = inicioX + (i * (anchoCasilla + 15));
                Rectangle rectCasilla = new Rectangle(x, inicioY, anchoCasilla, altoCasilla);

                _spriteBatch.Draw(iconoSeleccion[i], rectCasilla, Color.White);

                if (selJ1 == i)
                {
                    _spriteBatch.Draw(pixel, new Rectangle(x - 4, inicioY - 4, anchoCasilla + 8, 4), Color.Cyan);
                    _spriteBatch.Draw(pixel, new Rectangle(x - 4, inicioY + altoCasilla, anchoCasilla + 8, 4), Color.Cyan);
                    _spriteBatch.Draw(pixel, new Rectangle(x - 4, inicioY - 4, 4, altoCasilla + 8), Color.Cyan);
                    _spriteBatch.Draw(pixel, new Rectangle(x + anchoCasilla, inicioY - 4, 4, altoCasilla + 8), Color.Cyan);
                }

                if (selJ2 == i)
                {
                    _spriteBatch.Draw(pixel, new Rectangle(x - 8, inicioY - 8, anchoCasilla + 16, 4), Color.Red);
                    _spriteBatch.Draw(pixel, new Rectangle(x - 8, inicioY + altoCasilla + 4, anchoCasilla + 16, 4), Color.Red);
                    _spriteBatch.Draw(pixel, new Rectangle(x - 8, inicioY - 8, 4, altoCasilla + 16), Color.Red);
                    _spriteBatch.Draw(pixel, new Rectangle(x + anchoCasilla + 4, inicioY - 8, 4, altoCasilla + 16), Color.Red);
                }

                if (listoJ1 && selJ1 == i)
                    _spriteBatch.Draw(pixel, new Rectangle(x + 10, inicioY + 10, 25, 25), Color.Cyan);
                if (listoJ2 && selJ2 == i)
                    _spriteBatch.Draw(pixel, new Rectangle(x + anchoCasilla - 35, inicioY + 10, 25, 25), Color.Red);
            }
        }

        void DibujarBarraVida(Luchador luchador, int x, bool alineadaDerecha)
        {
            int anchoTotal = 300;
            int anchoVida = (int)((luchador.Vida / 150f) * anchoTotal);

            _spriteBatch.Draw(pixel, new Rectangle(x, 20, anchoTotal, 22), Color.DarkRed);
            int xVida = alineadaDerecha ? x + (anchoTotal - anchoVida) : x;
            _spriteBatch.Draw(pixel, new Rectangle(xVida, 20, anchoVida, 22), Color.Yellow);

            int anchoEnergia = (int)(anchoTotal * (luchador.EnergiaEspecial / 100f));
            _spriteBatch.Draw(pixel, new Rectangle(x, 46, anchoTotal, 8), Color.Gray);
            int xEnergia = alineadaDerecha ? x + (anchoTotal - anchoEnergia) : x;
            _spriteBatch.Draw(pixel, new Rectangle(xEnergia, 46, anchoEnergia, 8), Color.Cyan);

            for (int i = 0; i < luchador.Victorias; i++)
            {
                int xMarca = alineadaDerecha ? x + anchoTotal - 15 - (i * 22) : x + (i * 22);
                _spriteBatch.Draw(pixel, new Rectangle(xMarca, 58, 15, 15), Color.Gold);
            }
        }
    }
}