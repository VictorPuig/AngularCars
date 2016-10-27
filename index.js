var MYSQL_RECONNECT_INTERVAL = 1000;
var MEMCACHED_LIFETIME = 10;
var MEMCACHED_TIMEOUT = 100;

var ERR_MEMCACHED_DEAD = "Error: memcached dead";

// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var Memcached = require('memcached');
var _ = require("lodash");

// Rep els filtres i genera les consultes SQL
function getConsulta (filter) {
  // Valors per defecte de offset i limit si aquests no es proporcionen
  if (filter.offset === undefined) filter.offset = 1;
  if (filter.limit === undefined) filter.limit = 6;

  // Objecte que contindra les dos querys
  var querys = {};

  // Variable on es guarda la consulta general
  var consulta = "";

  // makersSeleccionats conte les id's dels makers seleccionats
  var makersSeleccionats = filter.maker
    .filter(function (el){ //.filter (funcio d'arrays) executa una funcio per cada element de l'array
                           // si aquesta funcio, retorna true, l'element es queda a l'array
                           // en cas contrari, l'elimina d l'array
      return el.seleccionat; //retorna el valor .seleccionat de cada element
    })
    .map(function (el){ //.map executa la funcio per a cada element
      // i el substitueix per el valor que retorna la funcio (id del maker)
      return el.id;
    });

  var colorsSeleccionats = filter.color
    .filter(function (el){
        return el.seleccionat;
    })
    .map(function (el){
      return el.id;
    });

  // Si hi ha algun filtre seleccionat, s'afegeix "WHERE" a la consulta
  if (makersSeleccionats.length !== 0 || colorsSeleccionats.length !== 0)
    consulta += " WHERE ";

  // Si hi ha fabricants seeleccionats
  if (makersSeleccionats.length !== 0) {
    // _.join (lodash) converteix un array a una cadena interposant el segon parametre
    // entre els seus elements
    makersSeleccionats = _.join(makersSeleccionats, ", ");
    console.log("Makers: " + makersSeleccionats);

    consulta += "maker in (" + makersSeleccionats + ")";
  }

  // Si els dos filtres tenen alguna cosa seleccionada, afegim "AND" a la consulta
  if (makersSeleccionats.length !== 0 && colorsSeleccionats.length !== 0)
    consulta += " AND ";

  if (colorsSeleccionats.length !== 0) {
    colorsSeleccionats = _.join(colorsSeleccionats, ", ");
    console.log("Colors: " + colorsSeleccionats);

    consulta += "color in (" + colorsSeleccionats + ")";
  }

  // Querys.data conte la consulta que demana les dades
  querys.data = "SELECT * FROM car_model" + consulta;

  // Afegir a la consulta limit i offset per a que els cotxes es mostrin de 3 en 3
  querys.data += " LIMIT " + filter.limit + " OFFSET " + filter.offset;
  querys.data += ";";

  // Querys.count conte la consulta que retorna el nombre de rows sense limitar (LIMIT i OFFSET)
  querys.count = "SELECT COUNT(*) as count FROM car_model" + consulta;
  querys.count += ";";

  // Retornem l'objecte que conte les dos consultes
  return querys;
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

// Iniciem la conexio a memcached
var mem = new Memcached("localhost:11211");
console.log("Conectat a memcached");

// queryDB es una funcio d'alt nivell que demana les dades de una consulta
// poden venir tant de memcached com de SQL
// query es la consulta SQL
// cb es la funcio (callback) que s'executa quan es te una resposta
function queryDB (query, cb) {
  // key es la query sense espais, per que memcached es queixa
  var key = query.replace(/\s/g, '');

  var memcachedGetCb = function (err, data) {
    var memcachedStatus = true;

    // si err es ERR_MEMCACHED_DEAD, vol dir que memcached
    // ha trigat massa en contestar i considerem que esta mort
    if (err === ERR_MEMCACHED_DEAD)
      memcachedStatus = false;
    else if (err)
      console.err("queryDB: memcached: ", err);

    // si la resposta esta a cache, la retornem
    if (data !== undefined) {
      console.log("queryDB: memcached te la resposta. executant cb");
      return cb(undefined, data);
    }

    console.log("queryDB: memcached no te la resposta")
    console.log("queryDB: Demanant la resposta a SQL");
    // en cas de que no tingui la resposta, demanem la resposta a SQL
    con.query(query, function (err, rows) {
      if (err)
        return cb(err);

      if (memcachedStatus) {
        console.log("queryDB: guardant resposta a memcached");
        // guardem la resposta de la consulta SQL a memcached
        mem.set(key, rows, MEMCACHED_LIFETIME, function (err) {
          if (err)
            console.error("queryDB: guardar a memcached ha fallat");
        });
      }

      console.log("queryDB: executant cb");
      // retornem la resposta
      cb(undefined, rows);
    });
  };

  var aux = true;

  console.log("queryDB: demanant resposta a memcached");
  // Demanem a memcached el resultat de la consulta (data)
  //mem.get es una funcio que pregunta al servidor memcached per la key ( query )
  //Si memcached li respon en menys temps del especificat en el timeout
  //executa la funcio memcachedGetCb que continua el proces de la query
  //marca aux a false perque no es torni a executar la funcio memcachedGetCb
  mem.get(key, function(err, data) {
    if (aux) {
      aux = false;
      //Execucio de memcachedGetCb
      //amb parametres que el servidor memcached ha proporcionat com a respostes
      memcachedGetCb(err, data);
    }
  });

  //Si ha passat el temps especificat en el timeot i mem.get no ha rebut resposta
  // del servidor memcached, executa la funcio memcachedGetCb sense parametres
  // per continuar el proces
  setTimeout(function () {
    if (aux) {
      aux = false;
      console.error("queryDB: memcached ha trigat massa en respondre!");

      // cridem el callback amb un missatge d'error
      memcachedGetCb(ERR_MEMCACHED_DEAD);
    }
  }, MEMCACHED_TIMEOUT);
}

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

    // Hem de fer dos consultes per cada peticio a /getCars
    // infoCars es l'objecte que contindra el resultat de les dues
    var infoCars = {};
    var estatQuery = 0;

    //Funcio que s'executa sempre que acaba 1 query,
    //pero només enviará les dades a angular quan hagin finalitzat les 3 querys
    function estatCheck () {
      if (estatQuery === 2) {
        res.send(infoCars);
      }
    }

    // Executa la consulta SQL
    queryDB(consulta.data, function queryCb(err, rows) {
      console.log("Consulta: " + consulta.data);
      if (err) {
        // En cas d'error, imprimirlo per consola
        console.error(err);
        // L'error s'enviara al client dins d'un objecte sota la key "err"
        res.send({err: err});
      } else {
        //console.log(rows);
        infoCars.rows = rows;
        estatQuery++;
        estatCheck();
      }
    });

    queryDB(consulta.count, function queryCb(err, count) {
      console.log("ConsultaCount: " + consulta.count);
      if (err) {
        // En cas d'error, imprimirlo per consola
        console.error(err);
        // L'error s'enviara al client dins d'un objecte sota la key "err"
        res.send({err: err});
      } else {
        //console.log(count);
        infoCars.count = count[0].count;
        estatQuery++;
        estatCheck();
      }
    });
  }
});

//app.get defineix la ruta del servidor
//(/getInfo) retorna les dades del servidor per dibuixar els filtres
app.get("/getInfo", function(req, res){
  console.log("Peticio informacio");

  if (!mysqlStatus) {
    res.send({err: {code: "Servidor MySQL offline!"}});
  } else {
    //objecte que conté els valors dels filtres
    var info = {};
    //variable auxiliar per saber quan les dues querys han finalitzat
    var estatQuery = 0;

    //Funcio que s'executa sempre que acaba 1 query,
    //pero només enviará les dades a angular quan hagin finalitzat les 2 querys
    function estatCheck () {
      if (estatQuery === 2) {
        res.send(info);
      }
    }

    //Una vegada la query ha finalitzat, s'executa una funció que guarda el resultat de la query
    //en info.maker
    queryDB('SELECT * FROM car_maker', function queryCIM(err, rows){
      if (err) {
        // En cas d'error, imprimirlo per consola
        console.error(err);
        // L'error s'enviara al client dins d'un objecte sota la key "err"
        res.send({err: err});
      } else {
        //console.log(rows);
        info.maker = rows;
        estatQuery++;
        estatCheck();
      }
    });

    queryDB('SELECT * FROM car_color', function queryCIC(err, rows){
      if (err) {
        // En cas d'error, imprimirlo per consola
        console.error(err);
        // L'error s'enviara al client dins d'un objecte sota la key "err"
        res.send({err: err});
      } else {
        //console.log(rows);
        info.color = rows;
        estatQuery++;
        estatCheck();
      }
    });
  }
});

// Iniciem el servidor
app.listen(8080, function(){
  console.log("Servidor iniciat a localhost:8080");
});
