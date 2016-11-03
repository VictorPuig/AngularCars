angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    //Utilitza el factory per aixo s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ["$http", "$location", "Auth", "$route",
      function loginController($http, $location, Auth, $route) {
        var self = this;

      self.sendUser = function () {
        $http.post("/login",self.user)
        .then(function(res){
          if (res.data.err) {
            alert(res.data.err);
          } else {
            //Auth es un factory que executa una funcio (setUser)
            //que retorna l'objecte del factory
            Auth.setUser(res.data.user);
            //envia al usuari a la pagina principal
            $location.path('/');
          }
        });
      };

      self.sendNewUser = function () {
        $http.post("/signup",self.newUser)
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
