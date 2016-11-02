angular.
  module('carDetail').
  component('carDetail', {
    templateUrl: 'car-detail/car-detail.template.html',
    // $routeParams es un servei que ens permet accedir al parametres de la url
    controller: ['Data', '$routeParams',
      function carListController(Data, $routeParams) {
        var self = this;

        self.data = Data;

        // guardem en una variable el parametre de la url amb nom carId
        var carId = $routeParams.carId;

        // Busquem a l'array Data.cars el cotxe que tingui la mateixa id
        // que la que es pasa per el parametre de la url
        self.car = self.data.cars.find(function (car) {
          return car.id == carId;
        });

        self.carMaker = self.data.filter.maker.find(function (maker) {
          return maker.id === self.car.maker;
        });
        self.carColor = self.data.filter.color.find(function (color) {
          return color.id === self.car.color;
        });
      }]
    }
  );
