var express = require("express");
var app = express();

app.use(express.static("app"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/dades", function(req, res){
  res.send("dades");
});

app.listen(8080, function(){
  console.log("Servidor iniciat a localhost:8080");
});
