angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    //Utilitza el factory per aixo s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ['Data', "$http", "$location", "Auth",
      function loginController(Data, $http, $location, Auth) {
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
      }
    }]
  }
);
