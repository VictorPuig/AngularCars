angular
  .module('carList')
  //Funcio (filtre) guarda en una variable una array buida (old). Agafa per parametre la array de cotxes (despres de ser filtrada en el template.html)
  // i retorna una array que dintre conté arrays de 3 elements
  .filter("galleryFilter", function () {
    var oldArray = [];
    return function(arr) {
      //_. (llibreria lodash) -> _.chunk (talla la array pasada per parametre en el numero del 2n parametre)
        var res = _.chunk(arr, 3);
        //_.isEqual compara element per element dintre de les arrays del array (deep_comparison)
        // i si l'antic ( que angular ja coneix ) es igual que el que retorna el chunk, la funcio retorna l'array antic (perque angular no se lie)
        if (_.isEqual(oldArray, res))
          return oldArray

      //si no son iguals, es copia la array resultant del chunk en la array antiga per mantenir la integritat i retorna la actual (chunked)
        oldArray = res;
        return res;
      };
    });
