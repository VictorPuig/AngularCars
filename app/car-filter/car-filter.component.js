angular.
  module('carFilter',[]).
  component('carFilter', {
    templateUrl: 'car-filter/car-filter.template.html',
    controller: ['Data', "$scope","$rootScope", "Auth", "$location",
    function carFilterController(Data, $scope, $rootScope, Auth, $location) {
        var self = this;

        self.auth = Auth;

        // Objecte on s'emmagatzema tota la informacio i l'estat del controlador
        self.data = {};

        // filter es un objecte buit que conte maker i color
        self.data.filter = false;
        //Angular rep les dades dels filtres de /getInfo
        Data.getInfo(function (err, info) {
          //Si arriba error de la consulta a MySQL, redirigim al usuari a /noData
          if (err)
            $location.path('/noData');
          else
            self.data.filter = info;
        });

        // Funcio que s'executa quan es fa click al link logOut
        // S'encarrega de fer logout de l'usuari
        self.onClickLogout = function (e) {
          e.preventDefault();
          self.auth.logOut();
        };

        // $watch vigila si el objecte data.filter ha sufert canvis
        $scope.$watch(function () { // funcio que retorna data.filter
          return self.data.filter;
        }, function onChangeFilter () { // funcio que s'executa cada vegada que hi ha canvis
          console.log("Model del filtre canviat");

          // Comprovar que el filtre ja s'ha descarrgat i emetem event filterChange
          if (!_.isEmpty(self.data.filter)) {
            // clonem l'objecte self.data.filter
            // per que les modificacions no afectin aquest controlador
            $rootScope.$broadcast("filterChange", _.cloneDeep(self.data.filter));
          }
        }, true);
      }
    ]
  });
