angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    //Utilitza el factory per aixo s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ["$http", "$location", "Auth", "$route", "Data",
      function loginController($http, $location, Auth, $route, Data) {
        var self = this;

      self.sendUser = function () {
        Auth.logIn(self.user, function (err, user) {
          if (err)
            console.log(err);
          else {
            if (Auth.path && Auth.path !== "/login") {
              $location.path(Auth.path);
              Auth.path = null;
            } else {
              //ruta per defecte
              $location.path("/");
            }
          }
        });
      };

      self.sendNewUser = function () {
        $http.post(Data.baseUrl + "/signup",self.newUser)
        .then(function(res){
          if (res.data.err) {
            alert(res.data.err);
          }
          else if (res.data.errdup) {
            alert("User already exists!")
          }
          else {
            alert("User succesfully create. You can logn now");
            //$route.reload() refresca la pagina actual
            //usuari creat correctament, torna a fer login per entrar
            $route.reload();
          }
        });
      };
    }]
  }
);
