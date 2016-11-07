var MAX_SESSION_TIME = 1000 * 60 * 5; //5 minuts

var app = angular.module('carApp', [
  'carFilter',
  'carList',
  'ngRoute',
  'carForm',
  'carDetail',
  'login'
]);

//Factory crea un objecte únic (Singeltone) per compartir dades entre controladors
// baseUrl es la direccio del servidor node. Es genera dinamicament a partir de
// la url del navegador
app.factory("Data", function () {
  return {
    baseUrl: "http://" + window.location.hostname + ":8080"
  };
});

//http://stackoverflow.com/q/20969835
app.factory('Auth', function(){
  //factory retorna un objecte amb 3 funcions
  return {
    //Funcio que rep un usuari i l'asigna al localStorage de la pagina
    setUser: function (aUser) {
      // JSON.stringify converteix objectes javascript a json.
      // localStorage.setItem guarda sota una key, una cadena de text (json)
      localStorage.setItem("user", JSON.stringify({user: aUser, time: Date.now()}));
    },
    //Funcio que retorna true o false depenent de si user te valor o no
    isLoggedIn: function () {
      // localStorage.getItem recupera la cadena que s'ha guardat (setItem)
      // Si no existeix la key, retorna null.
      var user = localStorage.getItem("user");

      // Si getItem ha retornat algo, ho convertim a un objecte a partir de json
      if (user)
        user = JSON.parse(user);

      // Si el temps que el usuari porta connectat es de menys de MAX_SESSION_TIME
      // l'usuari esta loguejat. En cas contrari fem logOut de l'usuari.
      if (user && (Date.now() - user.time) < MAX_SESSION_TIME)
        return true;
      else {
        // this es refereix a l'objecte que retorna el factory
        this.logOut();
        return false;
      }
    },
    //Funcio que posa user a null per a fer logout
    logOut: function () {
      localStorage.removeItem("user");
    },
    path: null
  }
});

//Array per les rutas a les que nomes els usuaris loguejats tindran acces
var PROTECTED_PATHS = ["/carForm"];

//app.run s'executa quan angular esta carregat
app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    //$rootScope.$on afegeix un listener al event $routeChangeStart
    $rootScope.$on('$routeChangeStart', function (event) {
      //Guardar la ruta actual de la pagina
      var path = $location.path();
      //Auth.path pren el valor de path (ruta a la que estem canviant)
      Auth.path = path;
      //funcio que busca dins l'array PROTECTED_PATHS, els elements que concordin
      //amb la ruta actual i la guarda en isProtected que conte un element de l'array
      var isProtected = PROTECTED_PATHS.find(function (pp) {return pp === path});
      //Si la pagina actual es una de les protegides i l'usuari no esta loguejat
      //Prevenim el canvi de ruta i enviem a l'usuari a la pagina de login
      if (isProtected && !Auth.isLoggedIn()) {
        event.preventDefault();
        //per despres redirigir a l'usuari a la ruta on volia anar abans de fer login
        $location.path('/login');
      }
    });
}]);
