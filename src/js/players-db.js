const PLAYERS_DB = [
  {
    nombre: "Lionel Messi",
    equipo: "Inter Miami",
    nacionalidad: "Argentina",
    posicion: "Delantero",
    pistas: [
      "Ganó 8 Balones de Oro",
      "Jugó la mayor parte de su carrera en el Barcelona",
      "Campeón del Mundo en Qatar 2022",
      "Mide 1.70m",
      "Número de camiseta: 10"
    ]
  },
  {
    nombre: "Cristiano Ronaldo",
    equipo: "Al Nassr",
    nacionalidad: "Portugal",
    posicion: "Delantero",
    pistas: [
      "Ganó 5 Balones de Oro",
      "Jugó en Manchester United, Real Madrid y Juventus",
      "Máximo goleador histórico en partidos internacionales",
      "Famoso por su celebración 'SIUUU'",
      "Número de camiseta: 7"
    ]
  },
  {
    nombre: "Neymar Jr",
    equipo: "Santos",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Jugó junto a Messi en el Barcelona",
      "Fichaje más caro de la historia al ir al PSG",
      "Conocido por sus regates y habilidades",
      "Campeón de la Champions League en 2015",
      "Número de camiseta: 10"
    ]
  },
  {
    nombre: "Kylian Mbappé",
    equipo: "Real Madrid",
    nacionalidad: "Francia",
    posicion: "Delantero",
    pistas: [
      "Campeón del Mundo con Francia en 2018",
      "Hizo un hat-trick en la final del Mundial 2022",
      "Comenzó su carrera profesional en el Mónaco",
      "Uno de los jugadores más rápidos del mundo",
      "Fichó por el Real Madrid en 2024"
    ]
  },
  {
    nombre: "Erling Haaland",
    equipo: "Manchester City",
    nacionalidad: "Noruega",
    posicion: "Delantero",
    pistas: [
      "Batió el récord de goles en una temporada de Premier League",
      "Su padre también fue futbolista profesional",
      "Jugó en el Borussia Dortmund antes del City",
      "Conocido por su celebración de meditación",
      "Mide más de 1.90m"
    ]
  },
  {
    nombre: "Luka Modrić",
    equipo: "Real Madrid",
    nacionalidad: "Croacia",
    posicion: "Mediocampista",
    pistas: [
      "Ganó el Balón de Oro en 2018",
      "Llevó a Croacia a la final del Mundial 2018",
      "Jugó en el Tottenham antes del Real Madrid",
      "Considerado uno de los mejores mediocampistas de la historia",
      "Ganó múltiples Champions League con el Real Madrid"
    ]
  },
  {
    nombre: "Diego Maradona",
    equipo: "Napoli / Argentina",
    nacionalidad: "Argentina",
    posicion: "Mediocampista ofensivo",
    pistas: [
      "Famoso por la 'Mano de Dios'",
      "Marcó el 'Gol del Siglo' contra Inglaterra en 1986",
      "Campeón del Mundo en México 1986",
      "Ídolo del Napoli en Italia",
      "Número de camiseta: 10"
    ]
  },
  {
    nombre: "Pelé",
    equipo: "Santos / Brasil",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Ganó 3 Copas del Mundo (1958, 1962, 1970)",
      "Conocido como 'O Rei' (El Rey)",
      "Marcó más de 1000 goles en su carrera",
      "Debutó profesionalmente a los 15 años",
      "Jugó la mayor parte de su carrera en el Santos"
    ]
  },
  {
    nombre: "Zinedine Zidane",
    equipo: "Real Madrid / Francia",
    nacionalidad: "Francia",
    posicion: "Mediocampista",
    pistas: [
      "Famoso por el cabezazo a Materazzi en la final del Mundial 2006",
      "Campeón del Mundo en 1998",
      "Ganó 3 Champions League como entrenador del Real Madrid",
      "Marcó un gol de volea icónico en la final de Champions 2002",
      "Ganó el Balón de Oro en 1998"
    ]
  },
  {
    nombre: "Ronaldinho",
    equipo: "Barcelona / Brasil",
    nacionalidad: "Brasil",
    posicion: "Mediocampista ofensivo",
    pistas: [
      "Conocido por jugar siempre con una sonrisa",
      "Ganó el Balón de Oro en 2005",
      "El Camp Nou le dio una ovación de pie siendo del Barcelona",
      "Famoso por sus caños y jugadas de fantasía",
      "Campeón del Mundo en 2002"
    ]
  },
  {
    nombre: "Virgil van Dijk",
    equipo: "Liverpool",
    nacionalidad: "Países Bajos",
    posicion: "Defensor central",
    pistas: [
      "Considerado el mejor defensor del mundo en su época",
      "Fichaje récord para un defensor cuando llegó al Liverpool",
      "Ganó la Champions League con el Liverpool en 2019",
      "Mide 1.93m",
      "Capitán de la selección de Países Bajos"
    ]
  },
  {
    nombre: "Manuel Neuer",
    equipo: "Bayern Múnich",
    nacionalidad: "Alemania",
    posicion: "Portero",
    pistas: [
      "Revolucionó la posición de portero con su estilo 'líbero'",
      "Campeón del Mundo en 2014 con Alemania",
      "Jugó toda su carrera en el Bayern Múnich y Schalke 04",
      "Ganó múltiples Champions League",
      "Conocido por salir lejos de su arco"
    ]
  },
  {
    nombre: "Robert Lewandowski",
    equipo: "Barcelona",
    nacionalidad: "Polonia",
    posicion: "Delantero",
    pistas: [
      "Marcó 5 goles en 9 minutos con el Bayern Múnich",
      "Máximo goleador histórico de la Bundesliga extranjero",
      "Fichó por el Barcelona en 2022",
      "Ganó la Champions League con el Bayern en 2020",
      "Capitán de la selección de Polonia"
    ]
  },
  {
    nombre: "Mohamed Salah",
    equipo: "Liverpool",
    nacionalidad: "Egipto",
    posicion: "Delantero",
    pistas: [
      "Conocido como 'El Faraón Egipcio'",
      "Jugó en la Roma antes de ir al Liverpool",
      "Ganó la Champions League con el Liverpool en 2019",
      "Uno de los máximos goleadores en la historia de la Premier League",
      "Juega habitualmente por la banda derecha"
    ]
  },
  {
    nombre: "Sergio Ramos",
    equipo: "Sevilla",
    nacionalidad: "España",
    posicion: "Defensor central",
    pistas: [
      "Ganó 4 Champions League con el Real Madrid",
      "Famoso por marcar goles de cabeza en los últimos minutos",
      "Campeón del Mundo en 2010 y de la Euro 2008 y 2012",
      "Uno de los defensores con más goles en la historia",
      "Conocido por recibir muchas tarjetas amarillas y rojas"
    ]
  },
  {
    nombre: "Andrés Iniesta",
    equipo: "Barcelona / España",
    nacionalidad: "España",
    posicion: "Mediocampista",
    pistas: [
      "Marcó el gol de la final del Mundial 2010",
      "Jugó casi toda su carrera en el Barcelona",
      "Formó parte del famoso tridente con Xavi y Busquets",
      "Ganó la Champions League 4 veces",
      "Conocido por su elegancia con el balón"
    ]
  },
  {
    nombre: "Xavi Hernández",
    equipo: "Barcelona / España",
    nacionalidad: "España",
    posicion: "Mediocampista",
    pistas: [
      "Considerado el mejor pasador de la historia",
      "Fue entrenador del Barcelona",
      "Ganó el Mundial 2010 y las Euros 2008 y 2012",
      "Jugó en el Al Sadd de Qatar antes de retirarse",
      "Símbolo del tiki-taka del Barcelona"
    ]
  },
  {
    nombre: "Gianluigi Buffon",
    equipo: "Juventus / Italia",
    nacionalidad: "Italia",
    posicion: "Portero",
    pistas: [
      "Campeón del Mundo en 2006 con Italia",
      "Jugó profesionalmente hasta los 45 años",
      "Considerado uno de los mejores porteros de todos los tiempos",
      "Pasó la mayor parte de su carrera en la Juventus",
      "Fue el fichaje más caro para un portero durante muchos años"
    ]
  },
  {
    nombre: "Thierry Henry",
    equipo: "Arsenal / Francia",
    nacionalidad: "Francia",
    posicion: "Delantero",
    pistas: [
      "Máximo goleador histórico del Arsenal",
      "Parte del Arsenal 'Invencible' que no perdió en toda la liga",
      "Campeón del Mundo en 1998 con Francia",
      "Jugó también en el Barcelona y New York Red Bulls",
      "Famoso por su velocidad y elegancia"
    ]
  },
  {
    nombre: "Ronaldo Nazário",
    equipo: "Real Madrid / Brasil",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Conocido como 'El Fenómeno'",
      "Ganó 2 Copas del Mundo (1994 y 2002)",
      "Ganó 2 Balones de Oro",
      "Jugó en Barcelona, Inter, Real Madrid y Milan",
      "Famoso por su corte de pelo en el Mundial 2002"
    ]
  },
  {
    nombre: "Vinicius Jr",
    equipo: "Real Madrid",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Fichó por el Real Madrid desde el Flamengo",
      "Conocido por su velocidad y regate",
      "Marcó en la final de la Champions League 2024",
      "Juega habitualmente por la banda izquierda",
      "Uno de los jugadores más jóvenes del Real Madrid en debutar"
    ]
  },
  {
    nombre: "Jude Bellingham",
    equipo: "Real Madrid",
    nacionalidad: "Inglaterra",
    posicion: "Mediocampista",
    pistas: [
      "Fichó por el Real Madrid desde el Borussia Dortmund",
      "Debutó profesionalmente a los 16 años en el Birmingham City",
      "Fue nombrado mejor jugador joven de la Bundesliga",
      "Marcó en su debut con el Real Madrid",
      "Número de camiseta: 5"
    ]
  },
  {
    nombre: "Lionel Scaloni",
    equipo: "Selección Argentina (DT)",
    nacionalidad: "Argentina",
    posicion: "Director Técnico",
    pistas: [
      "Dirigió a Argentina al título del Mundial 2022",
      "Fue jugador del Deportivo La Coruña",
      "Antes de ser DT principal fue asistente de Sampaoli",
      "Ganó también la Copa América 2021",
      "No era la primera opción para dirigir la selección"
    ]
  },
  {
    nombre: "Pep Guardiola",
    equipo: "Manchester City (DT)",
    nacionalidad: "España",
    posicion: "Director Técnico",
    pistas: [
      "Considerado uno de los mejores entrenadores de la historia",
      "Ganó el triplete con el Barcelona en 2009",
      "Dirigió al Manchester City al triplete en 2023",
      "Fue mediocampista del Barcelona como jugador",
      "Impulsor del estilo de juego tiki-taka"
    ]
  },
  {
    nombre: "Marcelo",
    equipo: "Fluminense",
    nacionalidad: "Brasil",
    posicion: "Lateral izquierdo",
    pistas: [
      "Ganó 5 Champions League con el Real Madrid",
      "Considerado uno de los mejores laterales izquierdos de la historia",
      "Conocido por su estilo ofensivo y alegre de jugar",
      "Pasó más de 15 años en el Real Madrid",
      "Compañero de Cristiano Ronaldo durante muchos años"
    ]
  },
  {
    nombre: "Dani Alves",
    equipo: "Barcelona / Brasil",
    nacionalidad: "Brasil",
    posicion: "Lateral derecho",
    pistas: [
      "El jugador con más títulos en la historia del fútbol",
      "Jugó en Sevilla, Barcelona, Juventus, PSG y más",
      "Famoso por comer una banana que le tiraron desde la tribuna",
      "Compañero de Messi en el Barcelona durante años",
      "Ganó 3 Champions League"
    ]
  },
  {
    nombre: "Sergio Agüero",
    equipo: "Manchester City / Argentina",
    nacionalidad: "Argentina",
    posicion: "Delantero",
    pistas: [
      "Marcó el gol más famoso de la Premier League en el minuto 94",
      "Máximo goleador histórico del Manchester City",
      "Se retiró por un problema cardíaco",
      "Es amigo cercano de Lionel Messi",
      "Debutó en Independiente de Argentina a los 15 años"
    ]
  },
  {
    nombre: "Lamine Yamal",
    equipo: "Barcelona",
    nacionalidad: "España",
    posicion: "Delantero",
    pistas: [
      "Debutó profesionalmente a los 15 años en el Barcelona",
      "El jugador más joven en marcar en una Eurocopa",
      "Campeón de la Euro 2024 con España",
      "Juega habitualmente por la banda derecha",
      "Nacido en 2007"
    ]
  },
  {
    nombre: "Emiliano Martínez",
    equipo: "Aston Villa",
    nacionalidad: "Argentina",
    posicion: "Portero",
    pistas: [
      "Héroe en la tanda de penales de la final del Mundial 2022",
      "Conocido como 'Dibu'",
      "Jugó muchos años en el Arsenal sin ser titular",
      "Ganó el premio al mejor portero del Mundial 2022",
      "Famoso por sus gestos para desconcentrar a los tiradores de penales"
    ]
  },
  {
    nombre: "Zlatan Ibrahimović",
    equipo: "AC Milan / Suecia",
    nacionalidad: "Suecia",
    posicion: "Delantero",
    pistas: [
      "Conocido por su personalidad y frases polémicas",
      "Jugó en Ajax, Juventus, Inter, Barcelona, Milan, PSG, y más",
      "Famoso por sus goles de chilena y acrobáticos",
      "Mide 1.95m",
      "Practicó taekwondo de joven"
    ]
  }
];
