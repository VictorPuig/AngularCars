angular.
  module('carList').
  component('carList', {
    templateUrl: 'car-list/car-list.template.html',
    //Utilitza el factory per aixó s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ['Data',
      function carListController(Data) {
        var self = this;

        self.data = Data;
      }
    ]
  });
