angular
  .module('carApp')
  //funcio que genera la ruta de la imatge a partir de les propietats del cotxe
  .filter("getImgUrl", ['Data',
    function (Data) {
      return function(car){
        //color es una array .find itera sobre cada element de la array i executa la funcio
        var color = Data.filter.color.find(function(el){
          // Si la id del element de la array de colors es la mateixa que que conté car.color,
          //retorna l'objecte del color
          return el.id === car.color;
        });

        var maker = Data.filter.maker.find(function(el){
          return el.id === car.maker;
        });

        //retorna la url de la imatge
        return "img/cars/" + maker.name + "_" + car.name + "_" + color.name + ".jpg";
      };
    }
  ]);
