angular
  .module('carList')
  //funcio que genera la ruta de la imatge a partir de les propietats del cotxe
  .filter("getImgUrl", function () {
    return function(car){
      //objecte(car).maker + nom + color (totes les propietats del cotxe)
      return "img/cars/" + car.maker + "_" + car.name + "_" + car.color + ".jpg";
    };
  });
