
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




  var flightPlanCoordinates = [
    {lat: 37.772, lng: -122.214},
    {lat: 21.291, lng: -157.821},
    {lat: -18.142, lng: 178.431},
    {lat: -27.467, lng: 153.027}
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#1e26ff',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap($scope.map);

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
