angular.
  module('carFilter').
  component('carFilter', {
    templateUrl: 'car-filter/car-filter.template.html',
    controller: ['$http', 'Data',
      function carFilterController($http, Data) {
        var self = this;

        self.data = Data;

        self.data.maker = {
          "ford": false,
          "toyota": false,
          "subaru": false
        };

        self.data.color = {
          "white": false,
          "black": false,
          "silver": false,
          "red": false,
          "blue": false
        };

        //.keys (funcio que agafa un objecte (self.data.maker) i retorna una array amb totes les keys (Marcas))
        //.every (funcio de arrays que pregunta a cada element i comprova que cada element sigui true, retorna true, en el cas contrari, retorna false)
        //Funcio filterCars s'executa per cada cotxe comprovant si s'ha de mostrar o no
        self.data.filterCars = function filterCars(el) {
          var makerEmpty = Object
            .keys(self.data.maker)
            .every(function (key) { return !self.data.maker[key]; });
          var colorEmpty = Object
            .keys(self.data.color)
            .every(function (key) { return !self.data.color[key]; });

            //si cap está marcat, retorna true (Es mostten tots)
          if (makerEmpty && colorEmpty)
            return true;

            //si algun dels fabricants no esta marcat i els colors estan marcats, filtra pels colors
          if (makerEmpty && !colorEmpty)
            return self.data.color[el.color];

            //si algun dels colors no esta marcat i els fabricants estan marcats, filtra pels fabricants
          if (!makerEmpty && colorEmpty)
            return self.data.maker[el.maker];

          return self.data.maker[el.maker] && self.data.color[el.color];
        };

        //Accedeix al json i el guarda al factory per poder compartirlo entre car-filter i car-list
        $http.get("/getCars")
        .then(function(response){
          self.data.cars = response.data;
        });
      }
    ]
  });
