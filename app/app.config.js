//Configuracio de les rutes de la web
angular
  .module('carApp')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template: '<car-filter></car-filter><car-list></car-list>'
        }).
        when('/carForm', {
          template: '<car-form></car-form>'
        }).
        when('/carDetail', {
          template: '<car-detail></car-detail>'
        }).
        otherwise('/');
    }
  ]);
