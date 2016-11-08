angular.
  module('carList').
  component('carList', {
    templateUrl: 'car-list/car-list.template.html',
    //Utilitza el factory per aixó s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ['Data', '$location', '$scope', "$window", "$timeout",
      function carListController(Data, $location, $scope, $window, $timeout) {
        var self = this;

        self.data = {};

        // S'inicialitza self.filter.cars a un vector buit
        self.data.cars = [];

        //Propietat que diu si hi no queden mes cotxes a mostrar (true)
        self.data.final = false;

        // Aquesta funcio s'executa quan es fa click a una imatge de la llista
        self.onImgClick = function (car) {
          // $location ens permete interactuar amb la url
          // .path ens permet modificar la url per el parametre
          $location.path("/carDetail/" + car.id);
        }

        // Aquesta funcio comprova si hi ha espai per afegir mes imatges
        function checkBottom () {
          // galleryBottom es la distancia en px desde la part de dalt de la web
          // fins a la part de baix de la galeria
          var galleryBottom = $window.document.querySelector(".gallery").getBoundingClientRect().bottom;
          // retornem true si la pagina es mes alta que la galeria
          // i hi ha cotxes per mostrar
          var hiHaEspai = galleryBottom - $window.innerHeight <= 0;
          return hiHaEspai;
        }

        // _.debounce s'espera a que es deixin de produir events per cridar la funcio
        var debounced = _.debounce(function(){
          if (checkBottom())
            getCars();
        }, 100);

        function getCars(reset) {
          // Si no es pasa cap argument, posem reset a false.
          if (reset === undefined) reset = false;

          // Si reset es pasa com a true, vol dir que el filtre ha canviat.
          // Per tant, esborrem tots els cotxes i començem desde 0.
          // Asignem false a self.data.final per amagar el missatge de "no more cars"
          if (reset) {
            self.data.cars = [];
            self.data.final = false;
          }

          // asignem a la variable filter per no repetir self.data.filter a tot arreu
          var filter = self.data.filter;

          // Configurem l'objecte filter per que la consulta SQL ens retorni
          // el nombre de cotxes desitjat a partir de l'ultim que es mostra. (self.data.cars.length)
          filter.offset = self.data.cars.length;

          // Si es la primera vegada que s'executa la web o algun filtre canvia,
          // la query demana 6 cotxes. En cas contrari demana 3.
          filter.limit = reset ? 6 : 3;

          // Fa una peticio POST al servidor amb les dades de data.filter
          // en el cos de la peticio
          Data.getCars(filter, function (err, rows) {
            if (err) {
              console.log(err);

            } else { // En cas contrari, es guarden les dades
              // Concatenem les noves dades de cotxes rebudes a les que ja tenim
              self.data.cars = self.data.cars.concat(rows);

              // Si rebem menys de 3 cotxes per mostrar destruim
              // l'EventListener d'events "scroll"
              if (rows.length < 3) {
                $window.removeEventListener('scroll', debounced);
                console.log("scroll listener destruit");
                self.data.final = true;
              } else {
                // Espera a que angular dibuixi la pagina i despres comprova
                // si hi ha espai suficient per mostrar mes cotxes i els demana.
                $timeout(function(){
                  if (checkBottom()) getCars();
                }, 0);
              }
            }
          });
        }

        // Quan salta l'event filterChange actualitzem la llista de cotxes
        $scope.$on("filterChange", function(event, filter){
          // addEventListener ens permet especificar una funcio que s'executara
          // quan es produeixi un event (en aquest cas "scroll")
          $window.addEventListener("scroll", debounced);
          console.log("scroll listener creat");

          // Asignem el filter que rebem de car-filter a self.data
          self.data.filter = filter;

          // Actualitzem la llista de cotxes desde 0 (reset = true)
          getCars(true);
        })
      }
    ]
  });
