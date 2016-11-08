angular
  .module('carApp')
  //funcio que genera la ruta de la imatge a partir de les propietats del cotxe
  .filter("getImgUrl", ['Data',
    function (Data) {
      return function(car){
        return car.url;
      };
    }
  ]);
