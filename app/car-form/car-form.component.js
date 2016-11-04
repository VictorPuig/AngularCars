//constant per inicialitzar l'objecte form
var DEFAULT_FORM = {
  maker: {
    name: "Select a maker"
  },
  color: {
    name: "Select a color"
  }
};

angular.
  module('carForm').
  component('carForm', {
    templateUrl: 'car-form/car-form.template.html',
    //Utilitza el factory per aixó s'inclou la dependencia
    //Com l'objecte Data (factory) es unic, aquesta funcio mostra la llista de cotxes ja filtrats per el controlador car-filter
    controller: ['Data', "$http", "$scope",
      function carListController(Data, $http, $scope) {
        var self = this;

       self.filter = Data.filter;

        self.form = _.cloneDeep(DEFAULT_FORM);

        //funcio que retorna true si l'usuari no ha escollit totes les propietats.
        self.shouldDisable = function () {
          return (
            self.form.maker.id === undefined ||
            self.form.color.id === undefined ||
            self.form.name === undefined ||
            self.form.img === undefined
          );
        }
        //funcio que s'executa quan es fa clic a un maker de la llista
        //asigna al maker del formulari, el maker que s'ha clickat
        self.onClickMaker = function (maker) {
          //console.log(maker);
          self.form.maker = maker;
        };

        self.onClickColor = function (color) {
          //console.log(color);
          self.form.color = color;
        };

        // Funcio que converteix un arrayBuffer en una cadena codificada amb base64
        // http://stackoverflow.com/a/9458996
        function arrayBufferToBase64( buffer ) {
            var binary = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return window.btoa( binary );
        }

        // document.querySelector rep un selector CSS i retorna l'element HTML
        // .onchange es un callback que s'executa quan la seleccio d'arxiu canvia
        document.querySelector("input[type=file]").onchange = function (event) {
            // FileReader ens permet llegir arxius locals
            var reader = new FileReader();

            // .onload es un callback que s'executa quan l'arxiu s'ha llegit correctament
            reader.onload = function () {
              // guarda en self.form.img la imatge convertida a base64
              self.form.img = arrayBufferToBase64(reader.result);

              // $scope.$apply() es una funcio que fa que angular comprovi els models
              $scope.$apply();
            };

            // iniciem la lectura de l'arxiu seleccionat
            // (en aquest cas: event.target.files[0])
            reader.readAsArrayBuffer(event.target.files[0]);
          };

        //funcio per a crear el nou fabricant
        self.sendMaker = function () {
          console.log(self.newMaker);
          //enviem al servidor el nom del nou fabricant
          $http.post(Data.baseUrl + "/addMaker", {name: self.newMaker})
            .then(function(res){
              console.log(res);
              if (res.data.errdup) {
                alert("This maker already exists.")
              }
              if (res.data.err) {
                alert("Unexpected error")
              }
              //Si data conte la propietat "id", la peticio ha funcionat
              if (res.data.id) {
                //seleccionat = false per simular que la pagina es descarrega el filtre de nou
                res.data.seleccionat = false;
                //enviem les dades al servidor
                self.filter.maker.push(res.data);
                //inicialitzem a null
                self.newMaker = "";
                console.log("Maker added");
              }
            });
        }

        self.sendColor = function () {
          console.log(self.newColor);
          $http.post(Data.baseUrl + "/addColor", {name: self.newColor})
            .then(function(res){
              console.log(res);
              if (res.data.errdup) {
                alert("This color already exists.")
              }
              if (res.data.err) {
                alert("Unexpected error")
              }
              if (res.data.id) {
                res.data.seleccionat = false;
                self.filter.color.push(res.data);
                self.newColor = "";
                console.log("Color added");
              }
          });
        }

        //funcio que crea un nou model de cotxe
        self.sendForm = function () {
          $http.post(Data.baseUrl + "/addCar", self.form)
            .then(function(res){
              console.log(res);
              if (res.data.errdup) {
                alert("This car already exists.")
              }
              if (res.data.err) {
                alert("Unexpected error")
              }
              if (res.data.success) {
                console.log("Car added");
                //inicialitzem l'objecte form amb el valor per defecte (buit)
                self.form = _.cloneDeep(DEFAULT_FORM);
              }
          });
        };
      }]
    }
  );
