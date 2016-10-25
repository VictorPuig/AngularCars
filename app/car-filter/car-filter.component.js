angular.
  module('carFilter').
  component('carFilter', {
    templateUrl: 'car-filter/car-filter.template.html',
    controller: ['$http', 'Data', "$scope", "$window", "$timeout",
      function carFilterController($http, Data, $scope, $window, $timeout) {
        var self = this;

        // Variable que representa error de servidor
        self.err = false;

        // Watch vigila el valor d'una variable (self.err)
        $scope.$watch(function () { // Funcio que retorna self.err
          return self.err;
        }, function () { // Funcio quan el valor de self.err canvia
          // Si hi ha error, es mostra un alert a l'usuari amb una descripcio
          if (self.err) {
            alert(self.err);
            self.err = false; // Ja hem tractat l'error, assignem false
          }
        });

        // Objecte on s'emmagatzema tota la informacio i l'estat de l'app
        self.data = Data;

        // S'inicialitza self.filter.cars a un vector buit
        self.data.cars = [];

        // filter es un objecte buit que conte maker i color
        self.data.filter = {};

        //Angular rep les dades dels filtres de /getInfo
        $http.get('/getInfo').then(function(res){
          //executa una funcio que afegeix l'atribut seleccionat a cada element de self.data.filter.maker
          self.data.filter.maker = res.data.maker.map(function(el){
            //s'inicialitza el valor a false
            el.seleccionat = false;
            return el;
          })
          self.data.filter.color = res.data.color.map(function(el){
            el.seleccionat = false;
            return el;
          })
        });

        // Aquesta funcio comprova si hi ha espai per afegir mes imatges
        function checkBottom () {
          // galleryBottom es la distancia en px desde la part de dalt de la web
          // fins a la part de baix de la galeria
          var galleryBottom = $window.document.querySelector(".gallery").getBoundingClientRect().bottom;
          // retornem true si la pagina es mes alta que la galeria
          return galleryBottom - $window.innerHeight <= 0;
        }

        function getCars(reset) {
          // Si no es pasa cap argument, posem reset a false.
          if (reset === undefined) reset = false;

          // Si reset es pasa com a true, vol dir que el filtre ha canviat.
          // Per tant, esborrem tots els cotxes i començem desde 0.
          if (reset) {
            self.data.cars = [];
          }

          // Clonem el filter per no interferir amb la resta de la app
          var filter = _.cloneDeep(self.data.filter);

          // Configurem l'objecte filter per que la consulta SQL ens retorni
          // el nombre de cotxes desitjat a partir de l'ultim que es mostra. (self.data.cars.length)
          filter.offset = self.data.cars.length;

          // Si es la primera vegada que s'executa la web o algun filtre canvia,
          // la query demana 6 cotxes. En cas contrari demana 3.
          filter.limit = reset ? 6 : 3;

          // Fa una peticio POST al servidor amb les dades de data.filter
          // en el cos de la peticio
          $http.post("/getCars", filter)
          .then(function(res){
            if (res.data.err) { // Si l'objecte que rebem (json servidor) conte err
                                // l'imprimim per consola i l'assignem a self.err
              console.log(res.data.err);
              self.err = res.data.err.code;
            } else { // En cas contrari, es guarden les dades
              // Concatenem les noves dades de cotxes rebudes a les que ja tenim
              self.data.cars = self.data.cars.concat(res.data.rows);

              // Espera a que angular dibuixi la pagina i despres comprova
              // si hi ha espai suficient per mostrar mes cotxes i els demana.
              $timeout(function(){
                if (checkBottom()) getCars();
              }, 0);

            }
          });
        };

        // addEventListener ens permet especificar una funcio que s'executara
        // quan es produeixi un event (en aquest cas "scroll")
        // _.debounce s'espera a que es deixin de produir events per cridar la funcio
        $window.addEventListener("scroll", _.debounce(function(e){
          if (checkBottom())
            getCars();
        }, 100));

        // $watch vigila si el objecte data.filter ha sufert canvis
        $scope.$watch(function () { // funcio que retorna data.filter
          return self.data.filter;
        }, function onChangeFilter () { // funcio que s'executa cada vegada que hi ha canvis
          console.log("Model del filtre canviat");

          // Comprovar que el filtre ja s'ha descarrgat i descarreguem els cotxes
          if (!_.isEmpty(self.data.filter))
            getCars(true);

        }, true);
      }
    ]
  });
