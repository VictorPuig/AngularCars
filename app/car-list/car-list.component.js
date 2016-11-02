angular.
  module('carList').
  component('carList', {
    templateUrl: 'car-list/car-list.template.html',
    //Utilitza el factory per aixó s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ['Data', '$location',
      function carListController(Data, $location) {
        var self = this;

        self.data = Data;

        // Aquesta funcio s'executa quan es fa click a una imatge de la llista
        self.onImgClick = function (car) {
          // $location ens permete interactuar amb la url
          // .path ens permet modificar la url per el parametre
          $location.path("/carDetail/" + car.id);
        }
      }
    ]
  });
