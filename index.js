var MYSQL_RECONNECT_INTERVAL = 1000;

var express = require("express");
var mysql = require("mysql");

var app = express();

// Variable que indica l'estat del servidor mysql (false = caigut)
var mysqlStatus = false;

// Declarem la variable de conexio fora per que hi tingui acces
// la resta del programa
var con;

function connectaBaseDades() {
  console.log("Intentant connectar al servidor MySQL");

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

// Ruta root
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// Ruta getCars retorna les dades de la crida de la BDD en JSON
app.get("/getCars", function(req, res){
  // Comprovem que tenim conexio a mysql i en cas negatiu,
  // s'envia un missatge d'error a l'usuari
  if (!mysqlStatus) {
    res.send({err: {code: "Servidor MySQL offline!"}});
  } else { // Si hi ha conexio, continuem amb la query
    // Executa la consulta SQL
    con.query("SELECT * FROM car_table", function queryCb(err, rows) {
      if (err) {
        // En cas d'error, imprimirlo per consola
        console.error(err);
        // L'error s'enviara al client dins d'un objecte sota la key "err"
        res.send({err: err});
      } else {
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
