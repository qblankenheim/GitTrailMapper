
module

.controller('homeCtrl', function($scope, $ionicLoading) {

})

.controller('mapsCtrl', function($scope, $state) {

  var options = {timeout: 10000, enableHighAccuracy: true};



    var latLng = new google.maps.LatLng(43.071278, -89.406797);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);



    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });


  var infoWindow = new google.maps.InfoWindow({
    content: "Computer Science Building!"
  });

    google.maps.event.addListener(marker,'click', function(){
      infoWindow.open($scope.map, marker);
    }),

      google.maps.event.addListener($scope.map, 'click', function(event) {



        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: event.latLng
        });
      });
    });



  });
