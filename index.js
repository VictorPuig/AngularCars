var express = require("express");
var mysql = require("mysql");

var app = express();

// Creem una conexio a la BDD
var con = mysql.createConnection({
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
    return;
  }
  // Mostrem per consola que la conexio a la BDD ha sigut satisfactoria
  console.log('Conectat a MySql amb id: ' + con.threadId);
});

// Prepara el directori "app" per a recursos estatics
app.use(express.static("app"));

// Ruta root
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// Ruta getCars retorna les dades de la crida de la BDD en JSON
app.get("/getCars", function(req, res){
  // Executa la consulta SQL
  con.query("SELECT * FROM car_table", function queryCb(err, rows) {
    if (err) {
      // En cas d'error, imprimirlo per consola i respondre un JSON
      // amb una key "err" amb una descripcio
      console.err(err);
      throw err;
    }

    // Retornem les dades de la BDD
    res.send(rows);
  });
});

// Iniciem el servidor
app.listen(8080, function(){
  console.log("Servidor iniciat a localhost:8080");
});
