var MYSQL_RECONNECT_INTERVAL = 1000;

// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var _ = require("lodash");

// Rep els filtres i genera una consulta SQL
function getConsulta (filter) {
  // Consulta general
  var consulta = "SELECT * FROM car_model";

  // makersSeleccionats conte els valors de les keys dels filtres seleccionats
  var makersSeleccionats = Object.keys(filter.maker) // Object.keys retorna un array de les claus del objecte filter.maker
    .filter(function(k){  // .filter (funcio d'arrays) executa una funcio per cada element de l'array
                          // si aquesta funcio, retorna true, l'element es queda a l'array
                          // en cas contrari, l'elimina d l'array
      return filter.maker[k]; // retorna el valor que tenia la clau en el objecte original
    });

  var colorsSeleccionats = Object.keys(filter.color).filter(function(k){return filter.color[k];});

  // Si hi ha algun filtre seleccionat, s'afegeix "WHERE" a la consulta
  if (makersSeleccionats.length !== 0 || colorsSeleccionats.length !== 0)
    consulta += " WHERE ";

  // Si hi ha fabricants seeleccionats
  if (makersSeleccionats.length !== 0) {
    // .map es una funcio que executa una funcio per cada element de l'array
    // i substitueix aquest element pel valor retornat per la funcio
    makersSeleccionats = makersSeleccionats.map(function(m){
      return "name like '" + m + "'";
    });
    // _.join (lodash) converteix un array a una cadena interposant el segon parametre
    // entre els seus elements
    makersSeleccionats = _.join(makersSeleccionats, " OR ");
    console.log("Makers: " + makersSeleccionats);

    consulta += "maker in (SELECT id FROM car_maker WHERE " + makersSeleccionats + ")";
  }

  // Si els dos filtres tenen alguna cosa seleccionada, afegim "AND" a la consulta
  if (makersSeleccionats.length !== 0 && colorsSeleccionats.length !== 0)
    consulta += " AND ";

  if (colorsSeleccionats.length !== 0) {
    colorsSeleccionats = colorsSeleccionats.map(function(m){return "name like '" + m + "'"});
    colorsSeleccionats = _.join(colorsSeleccionats, " OR ");
    console.log("Colors: " + colorsSeleccionats);

    consulta += "color in (SELECT id FROM car_color WHERE " + colorsSeleccionats + ")";
  }

  //
  consulta += ";";

  return consulta;
}

var app = express();

// Variable que indica l'estat del servidor mysql (false = caigut)
var mysqlStatus = false;

// Declarem la variable de conexio fora per que hi tingui acces
// la resta del programa
var con;

function connectaBaseDades() {
  console.log("Intentant connectar al servidor MySQL");

  // La funcio connectaBaseDades inicia la conexio, per tant,
  // per definicio, la conexio esta offline fins que no tingui exit
  mysqlStatus = false;

  // Creem una conexio a la BDD
  con = mysql.createConnection({
    host: '192.168.1.43',
    user: 'root',
    password: '',
    database: 'cars'
  });

  // Ens conectem a la BDD
  con.connect(function(err) {
    if (err) {
      // En cas d'error, mostrar per consola
      console.error('Error conectant a MySql: ' + err.stack);

      // La conexio ha fallat, per tant el server esta offline
      mysqlStatus = false;

      console.log("Tornant a intentar en " + MYSQL_RECONNECT_INTERVAL + " milis");
      // Tornem a intentar la conexio cada MYSQL_RECONNECT_INTERVAL segons
      setTimeout(connectaBaseDades, MYSQL_RECONNECT_INTERVAL);
    } else {
        // Mostrem per consola que la conexio a la BDD ha sigut satisfactoria
        console.log('Conectat a MySql amb id: ' + con.threadId);

        // La conexio ha tingut exit per tant el servidor esta online
        mysqlStatus = true;
    }
  });

  // Quan la conexio a mysql pateix un error, el mostrem per consola i intentem reconectar
  con.on('error', function (err) {
    console.error("Error de conexio a la BDD");
    console.error(err);

    connectaBaseDades();
  });
}

// Iniciem la conexio a mysql
connectaBaseDades();

// Prepara el directori "app" per a recursos estatics
app.use(express.static("app"));
//Parseja el json a objectes de javascript per poder treballar amb ells
app.use(bodyParser.json());

// Ruta root
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// Ruta getCars retorna les dades de la crida de la BDD en JSON
app.post("/getCars", function(req, res){
  console.log("Peticio /getCars");

  // Comprovem que tenim conexio a mysql i en cas negatiu,
  // s'envia un missatge d'error a l'usuari
  if (!mysqlStatus) {
    res.send({err: {code: "Servidor MySQL offline!"}});
  } else { // Si hi ha conexio, continuem amb la query
    var consulta = getConsulta(req.body);

    console.log("Consulta: " + consulta);
    // Executa la consulta SQL
    con.query(consulta, function queryCb(err, rows) {
      if (err) {
        // En cas d'error, imprimirlo per consola
        console.error(err);
        // L'error s'enviara al client dins d'un objecte sota la key "err"
        res.send({err: err});
      } else {
        console.log(rows);

        // Retornem les dades de la BDD dins d'un objecte sota la key "rows"
        res.send({rows: rows});
      }
    });
  }
});

// Iniciem el servidor
app.listen(8080, function(){
  console.log("Servidor iniciat a localhost:8080");
});
