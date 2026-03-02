const PLAYERS_DB = [
  {
    nombre: "Lionel Messi",
    equipo: "Inter Miami",
    nacionalidad: "Argentina",
    posicion: "Delantero",
    pistas: [
      "Gan\u00f3 8 Balones de Oro",
      "Jug\u00f3 la mayor parte de su carrera en el Barcelona",
      "Campe\u00f3n del Mundo en Qatar 2022",
      "Mide 1.70m",
      "N\u00famero de camiseta: 10"
    ]
  },
  {
    nombre: "Cristiano Ronaldo",
    equipo: "Al Nassr",
    nacionalidad: "Portugal",
    posicion: "Delantero",
    pistas: [
      "Gan\u00f3 5 Balones de Oro",
      "Jug\u00f3 en Manchester United, Real Madrid y Juventus",
      "M\u00e1ximo goleador hist\u00f3rico en partidos internacionales",
      "Famoso por su celebraci\u00f3n 'SIUUU'",
      "N\u00famero de camiseta: 7"
    ]
  },
  {
    nombre: "Neymar Jr",
    equipo: "Santos",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Jug\u00f3 junto a Messi en el Barcelona",
      "Fichaje m\u00e1s caro de la historia al ir al PSG",
      "Conocido por sus regates y habilidades",
      "Campe\u00f3n de la Champions League en 2015",
      "N\u00famero de camiseta: 10"
    ]
  },
  {
    nombre: "Kylian Mbapp\u00e9",
    equipo: "Real Madrid",
    nacionalidad: "Francia",
    posicion: "Delantero",
    pistas: [
      "Campe\u00f3n del Mundo con Francia en 2018",
      "Hizo un hat-trick en la final del Mundial 2022",
      "Comenz\u00f3 su carrera profesional en el M\u00f3naco",
      "Uno de los jugadores m\u00e1s r\u00e1pidos del mundo",
      "Fich\u00f3 por el Real Madrid en 2024"
    ]
  },
  {
    nombre: "Erling Haaland",
    equipo: "Manchester City",
    nacionalidad: "Noruega",
    posicion: "Delantero",
    pistas: [
      "Bati\u00f3 el r\u00e9cord de goles en una temporada de Premier League",
      "Su padre tambi\u00e9n fue futbolista profesional",
      "Jug\u00f3 en el Borussia Dortmund antes del City",
      "Conocido por su celebraci\u00f3n de meditaci\u00f3n",
      "Mide m\u00e1s de 1.90m"
    ]
  },
  {
    nombre: "Luka Modri\u0107",
    equipo: "Real Madrid",
    nacionalidad: "Croacia",
    posicion: "Mediocampista",
    pistas: [
      "Gan\u00f3 el Bal\u00f3n de Oro en 2018",
      "Llev\u00f3 a Croacia a la final del Mundial 2018",
      "Jug\u00f3 en el Tottenham antes del Real Madrid",
      "Considerado uno de los mejores mediocampistas de la historia",
      "Gan\u00f3 m\u00faltiples Champions League con el Real Madrid"
    ]
  },
  {
    nombre: "Diego Maradona",
    equipo: "Napoli / Argentina",
    nacionalidad: "Argentina",
    posicion: "Mediocampista ofensivo",
    pistas: [
      "Famoso por la 'Mano de Dios'",
      "Marc\u00f3 el 'Gol del Siglo' contra Inglaterra en 1986",
      "Campe\u00f3n del Mundo en M\u00e9xico 1986",
      "\u00cddolo del Napoli en Italia",
      "N\u00famero de camiseta: 10"
    ]
  },
  {
    nombre: "Pel\u00e9",
    equipo: "Santos / Brasil",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Gan\u00f3 3 Copas del Mundo (1958, 1962, 1970)",
      "Conocido como 'O Rei' (El Rey)",
      "Marc\u00f3 m\u00e1s de 1000 goles en su carrera",
      "Debut\u00f3 profesionalmente a los 15 a\u00f1os",
      "Jug\u00f3 la mayor parte de su carrera en el Santos"
    ]
  },
  {
    nombre: "Zinedine Zidane",
    equipo: "Real Madrid / Francia",
    nacionalidad: "Francia",
    posicion: "Mediocampista",
    pistas: [
      "Famoso por el cabezazo a Materazzi en la final del Mundial 2006",
      "Campe\u00f3n del Mundo en 1998",
      "Gan\u00f3 3 Champions League como entrenador del Real Madrid",
      "Marc\u00f3 un gol de volea ic\u00f3nico en la final de Champions 2002",
      "Gan\u00f3 el Bal\u00f3n de Oro en 1998"
    ]
  },
  {
    nombre: "Ronaldinho",
    equipo: "Barcelona / Brasil",
    nacionalidad: "Brasil",
    posicion: "Mediocampista ofensivo",
    pistas: [
      "Conocido por jugar siempre con una sonrisa",
      "Gan\u00f3 el Bal\u00f3n de Oro en 2005",
      "El Camp Nou le dio una ovaci\u00f3n de pie siendo del Barcelona",
      "Famoso por sus ca\u00f1os y jugadas de fantas\u00eda",
      "Campe\u00f3n del Mundo en 2002"
    ]
  },
  {
    nombre: "Virgil van Dijk",
    equipo: "Liverpool",
    nacionalidad: "Pa\u00edses Bajos",
    posicion: "Defensor central",
    pistas: [
      "Considerado el mejor defensor del mundo en su \u00e9poca",
      "Fichaje r\u00e9cord para un defensor cuando lleg\u00f3 al Liverpool",
      "Gan\u00f3 la Champions League con el Liverpool en 2019",
      "Mide 1.93m",
      "Capit\u00e1n de la selecci\u00f3n de Pa\u00edses Bajos"
    ]
  },
  {
    nombre: "Manuel Neuer",
    equipo: "Bayern M\u00fanich",
    nacionalidad: "Alemania",
    posicion: "Portero",
    pistas: [
      "Revolucion\u00f3 la posici\u00f3n de portero con su estilo 'l\u00edbero'",
      "Campe\u00f3n del Mundo en 2014 con Alemania",
      "Jug\u00f3 toda su carrera en el Bayern M\u00fanich y Schalke 04",
      "Gan\u00f3 m\u00faltiples Champions League",
      "Conocido por salir lejos de su arco"
    ]
  },
  {
    nombre: "Robert Lewandowski",
    equipo: "Barcelona",
    nacionalidad: "Polonia",
    posicion: "Delantero",
    pistas: [
      "Marc\u00f3 5 goles en 9 minutos con el Bayern M\u00fanich",
      "M\u00e1ximo goleador hist\u00f3rico de la Bundesliga extranjero",
      "Fich\u00f3 por el Barcelona en 2022",
      "Gan\u00f3 la Champions League con el Bayern en 2020",
      "Capit\u00e1n de la selecci\u00f3n de Polonia"
    ]
  },
  {
    nombre: "Mohamed Salah",
    equipo: "Liverpool",
    nacionalidad: "Egipto",
    posicion: "Delantero",
    pistas: [
      "Conocido como 'El Fara\u00f3n Egipcio'",
      "Jug\u00f3 en la Roma antes de ir al Liverpool",
      "Gan\u00f3 la Champions League con el Liverpool en 2019",
      "Uno de los m\u00e1ximos goleadores en la historia de la Premier League",
      "Juega habitualmente por la banda derecha"
    ]
  },
  {
    nombre: "Sergio Ramos",
    equipo: "Sevilla",
    nacionalidad: "Espa\u00f1a",
    posicion: "Defensor central",
    pistas: [
      "Gan\u00f3 4 Champions League con el Real Madrid",
      "Famoso por marcar goles de cabeza en los \u00faltimos minutos",
      "Campe\u00f3n del Mundo en 2010 y de la Euro 2008 y 2012",
      "Uno de los defensores con m\u00e1s goles en la historia",
      "Conocido por recibir muchas tarjetas amarillas y rojas"
    ]
  },
  {
    nombre: "Andr\u00e9s Iniesta",
    equipo: "Barcelona / Espa\u00f1a",
    nacionalidad: "Espa\u00f1a",
    posicion: "Mediocampista",
    pistas: [
      "Marc\u00f3 el gol de la final del Mundial 2010",
      "Jug\u00f3 casi toda su carrera en el Barcelona",
      "Form\u00f3 parte del famoso tridente con Xavi y Busquets",
      "Gan\u00f3 la Champions League 4 veces",
      "Conocido por su elegancia con el bal\u00f3n"
    ]
  },
  {
    nombre: "Xavi Hern\u00e1ndez",
    equipo: "Barcelona / Espa\u00f1a",
    nacionalidad: "Espa\u00f1a",
    posicion: "Mediocampista",
    pistas: [
      "Considerado el mejor pasador de la historia",
      "Fue entrenador del Barcelona",
      "Gan\u00f3 el Mundial 2010 y las Euros 2008 y 2012",
      "Jug\u00f3 en el Al Sadd de Qatar antes de retirarse",
      "S\u00edmbolo del tiki-taka del Barcelona"
    ]
  },
  {
    nombre: "Gianluigi Buffon",
    equipo: "Juventus / Italia",
    nacionalidad: "Italia",
    posicion: "Portero",
    pistas: [
      "Campe\u00f3n del Mundo en 2006 con Italia",
      "Jug\u00f3 profesionalmente hasta los 45 a\u00f1os",
      "Considerado uno de los mejores porteros de todos los tiempos",
      "Pas\u00f3 la mayor parte de su carrera en la Juventus",
      "Fue el fichaje m\u00e1s caro para un portero durante muchos a\u00f1os"
    ]
  },
  {
    nombre: "Thierry Henry",
    equipo: "Arsenal / Francia",
    nacionalidad: "Francia",
    posicion: "Delantero",
    pistas: [
      "M\u00e1ximo goleador hist\u00f3rico del Arsenal",
      "Parte del Arsenal 'Invencible' que no perdi\u00f3 en toda la liga",
      "Campe\u00f3n del Mundo en 1998 con Francia",
      "Jug\u00f3 tambi\u00e9n en el Barcelona y New York Red Bulls",
      "Famoso por su velocidad y elegancia"
    ]
  },
  {
    nombre: "Ronaldo Naz\u00e1rio",
    equipo: "Real Madrid / Brasil",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Conocido como 'El Fen\u00f3meno'",
      "Gan\u00f3 2 Copas del Mundo (1994 y 2002)",
      "Gan\u00f3 2 Balones de Oro",
      "Jug\u00f3 en Barcelona, Inter, Real Madrid y Milan",
      "Famoso por su corte de pelo en el Mundial 2002"
    ]
  },
  {
    nombre: "Vinicius Jr",
    equipo: "Real Madrid",
    nacionalidad: "Brasil",
    posicion: "Delantero",
    pistas: [
      "Fich\u00f3 por el Real Madrid desde el Flamengo",
      "Conocido por su velocidad y regate",
      "Marc\u00f3 en la final de la Champions League 2024",
      "Juega habitualmente por la banda izquierda",
      "Uno de los jugadores m\u00e1s j\u00f3venes del Real Madrid en debutar"
    ]
  },
  {
    nombre: "Jude Bellingham",
    equipo: "Real Madrid",
    nacionalidad: "Inglaterra",
    posicion: "Mediocampista",
    pistas: [
      "Fich\u00f3 por el Real Madrid desde el Borussia Dortmund",
      "Debut\u00f3 profesionalmente a los 16 a\u00f1os en el Birmingham City",
      "Fue nombrado mejor jugador joven de la Bundesliga",
      "Marc\u00f3 en su debut con el Real Madrid",
      "N\u00famero de camiseta: 5"
    ]
  },
  {
    nombre: "Lionel Scaloni",
    equipo: "Selecci\u00f3n Argentina (DT)",
    nacionalidad: "Argentina",
    posicion: "Director T\u00e9cnico",
    pistas: [
      "Dirigi\u00f3 a Argentina al t\u00edtulo del Mundial 2022",
      "Fue jugador del Deportivo La Coru\u00f1a",
      "Antes de ser DT principal fue asistente de Sampaoli",
      "Gan\u00f3 tambi\u00e9n la Copa Am\u00e9rica 2021",
      "No era la primera opci\u00f3n para dirigir la selecci\u00f3n"
    ]
  },
  {
    nombre: "Pep Guardiola",
    equipo: "Manchester City (DT)",
    nacionalidad: "Espa\u00f1a",
    posicion: "Director T\u00e9cnico",
    pistas: [
      "Considerado uno de los mejores entrenadores de la historia",
      "Gan\u00f3 el triplete con el Barcelona en 2009",
      "Dirigi\u00f3 al Manchester City al triplete en 2023",
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
      "Gan\u00f3 5 Champions League con el Real Madrid",
      "Considerado uno de los mejores laterales izquierdos de la historia",
      "Conocido por su estilo ofensivo y alegre de jugar",
      "Pas\u00f3 m\u00e1s de 15 a\u00f1os en el Real Madrid",
      "Compa\u00f1ero de Cristiano Ronaldo durante muchos a\u00f1os"
    ]
  },
  {
    nombre: "Dani Alves",
    equipo: "Barcelona / Brasil",
    nacionalidad: "Brasil",
    posicion: "Lateral derecho",
    pistas: [
      "El jugador con m\u00e1s t\u00edtulos en la historia del f\u00fatbol",
      "Jug\u00f3 en Sevilla, Barcelona, Juventus, PSG y m\u00e1s",
      "Famoso por comer una banana que le tiraron desde la tribuna",
      "Compa\u00f1ero de Messi en el Barcelona durante a\u00f1os",
      "Gan\u00f3 3 Champions League"
    ]
  },
  {
    nombre: "Sergio Ag\u00fcero",
    equipo: "Manchester City / Argentina",
    nacionalidad: "Argentina",
    posicion: "Delantero",
    pistas: [
      "Marc\u00f3 el gol m\u00e1s famoso de la Premier League en el minuto 94",
      "M\u00e1ximo goleador hist\u00f3rico del Manchester City",
      "Se retir\u00f3 por un problema card\u00edaco",
      "Es amigo cercano de Lionel Messi",
      "Debut\u00f3 en Independiente de Argentina a los 15 a\u00f1os"
    ]
  },
  {
    nombre: "Lamine Yamal",
    equipo: "Barcelona",
    nacionalidad: "Espa\u00f1a",
    posicion: "Delantero",
    pistas: [
      "Debut\u00f3 profesionalmente a los 15 a\u00f1os en el Barcelona",
      "El jugador m\u00e1s joven en marcar en una Eurocopa",
      "Campe\u00f3n de la Euro 2024 con Espa\u00f1a",
      "Juega habitualmente por la banda derecha",
      "Nacido en 2007"
    ]
  },
  {
    nombre: "Emiliano Mart\u00ednez",
    equipo: "Aston Villa",
    nacionalidad: "Argentina",
    posicion: "Portero",
    pistas: [
      "H\u00e9roe en la tanda de penales de la final del Mundial 2022",
      "Conocido como 'Dibu'",
      "Jug\u00f3 muchos a\u00f1os en el Arsenal sin ser titular",
      "Gan\u00f3 el premio al mejor portero del Mundial 2022",
      "Famoso por sus gestos para desconcentrar a los tiradores de penales"
    ]
  },
  {
    nombre: "Zlatan Ibrahimovi\u0107",
    equipo: "AC Milan / Suecia",
    nacionalidad: "Suecia",
    posicion: "Delantero",
    pistas: [
      "Conocido por su personalidad y frases pol\u00e9micas",
      "Jug\u00f3 en Ajax, Juventus, Inter, Barcelona, Milan, PSG, y m\u00e1s",
      "Famoso por sus goles de chilena y acrob\u00e1ticos",
      "Mide 1.95m",
      "Practic\u00f3 taekwondo de joven"
    ]
  }
];

module.exports = PLAYERS_DB;
