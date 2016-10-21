angular.
  module('carFilter').
  component('carFilter', {
    templateUrl: 'car-filter/car-filter.template.html',
    controller: ['$http', 'Data', "$scope",
      function carFilterController($http, Data, $scope) {
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

        self.data = Data;

        // filter es un objecte buit que conte maker i color
        self.data.filter = {};
        self.data.filter.maker = {
          "ford": false,
          "toyota": false,
          "subaru": false
        };

        self.data.filter.color = {
          "white": false,
          "black": false,
          "silver": false,
          "red": false,
          "blue": false
        };

        // $watch vigila si el objecte data.filter ha sufert canvis
        $scope.$watch(function () { // funcio que retorna data.filter
          return self.data.filter;
        }, function onChangeFilter () { // funcio que s'executa cada vegada que hi ha canvis
          console.log("Model del filtre canviat");

          // Fa una peticio POST al servidor amb les dades de data.filter
          // en el cos de la peticio
          $http.post("/getCars", self.data.filter)
          .then(function(res){
            if (res.data.err) { // Si l'objecte que rebem (json servidor) conte err
                                // l'imprimim per consola i l'assignem a self.err
              console.log(res.data.err);
              self.err = res.data.err.code;
            } else { // En cas contrari, es guarden les dades
              self.data.cars = res.data.rows;
            }
          });
        }, true);
      }
    ]
  });
