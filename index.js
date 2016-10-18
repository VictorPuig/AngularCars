var express = require("express");
var mysql = require("mysql");

var app = express();

var con = mysql.createConnection({
  host: '192.168.1.43',
  user: 'root',
  password: '',
  database: 'cars'
});

con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + con.threadId);
});

app.use(express.static("app"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/getCars", function(req, res){
  con.query("SELECT * FROM car_table", function queryCb(err, rows) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log("peticio");
    res.send(rows);
  });
});

app.listen(8080, function(){
  console.log("Servidor iniciat a localhost:8080");
});
