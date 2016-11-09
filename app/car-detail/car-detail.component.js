angular.
  module('carDetail').
  component('carDetail', {
    templateUrl: 'car-detail/car-detail.template.html',
    // $routeParams es un servei que ens permet accedir al parametres de la url
    controller: ['Data', '$routeParams',
      function carListController(Data, $routeParams) {
        var self = this;

        // guardem en una variable el parametre de la url amb nom carId
        var carId = $routeParams.carId;

        Data.getCarDetail(carId, function (err, car) {
          console.log("rebit", car);
          self.car = car;
        });
      }]
    }
  );
