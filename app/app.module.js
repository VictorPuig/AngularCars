var app = angular.module('carApp', [
  'carFilter',
  'carList'
]);

//Factory crea un objecte únic (Singeltone) per compartir dades entre controladors
app.factory("Data", function () {
  return {};
});
