angular
  .module('carApp')
  // Filtre que converteix una "cadena" a "Cadena"
  .filter("titleCase", function () {
    return function(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      };
    });
