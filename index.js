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
    // Sortim del programa amb codi d'error 1
    process.exit(1);
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
      // En cas d'error, imprimirlo per consola
      console.error(err);
      // L'error s'enviara al client dins d'un objecte sota la key "err"
      res.send({err: err});
    } else {
      // Retornem les dades de la BDD dins d'un objecte sota la key "rows"
      res.send({rows: rows});
    }
  });
});

// Iniciem el servidor
app.listen(8080, function(){
  console.log("Servidor iniciat a localhost:8080");
});
