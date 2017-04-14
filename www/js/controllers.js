
module

.controller('homeCtrl', function($scope, $ionicLoading) {
})

.controller('commCtrl', function($scope,$cordovaGeolocation) {

console.log(9);
  // var options = {timeout: 10000, enableHighAccuracy: true};
   //var latLng = new google.maps.LatLng(43.071278, -89.406797);
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  var lat;
  var long;

  $cordovaGeolocation
    .getCurrentPosition(posOptions)

    .then(function (position) {
       lat  = position.coords.latitude,
      long = position.coords.longitude,
      console.log(lat + '   ' + long)
      console.log(45);
      var latLng = new google.maps.LatLng(lat,long);
      console.log(47);
      // var latLng = $cordovaGeoLocation.getCurrentPosition();
      var mapOptions = {
        center: latLng,
        zoom: 30,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      console.log(54);
      $scope.communitymap = new google.maps.Map(document.getElementById("map"), mapOptions);
      console.log(56);
    }, function(err) {
      console.log(err)
    });

  var watchOptions = {timeout : 3000, enableHighAccuracy: false};
  var watch = $cordovaGeolocation.watchPosition(watchOptions);

  watch.then(
    null,

    function(err) {
      console.log(err)
    },

    function(position) {
      lat  = position.coords.latitude,
      long = position.coords.longitude,
      console.log(lat + '' + long)
      console.log(45);
      var latLng = new google.maps.LatLng(lat,long);
      console.log(47);
      // var latLng = $cordovaGeoLocation.getCurrentPosition();
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      console.log(54);
      $scope.communitymap = new google.maps.Map(document.getElementById("map"), mapOptions);
      console.log(56);
    }
  );

  watch.clearWatch();

})

.controller('mapsCtrl', function($scope, $state, $rootScope) {

  var options = {timeout: 10000, enableHighAccuracy: true};
  var latLng = new google.maps.LatLng(43.071278, -89.406797);


    var mapOptions = {
      center: latLng,
      zoom: 21,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map1"), mapOptions);


  google.maps.event.addListenerOnce($scope.map, 'idle', function () {
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
  });

  $scope.flightPlanCoordinates = [
    latLng
  ];
  $scope.flightPath = new google.maps.Polyline({
    path: $scope.flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#1e26ff',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  $scope.flightPath.setMap($scope.map);

  google.maps.event.addListenerOnce($scope.map, 'idle', function () {
    var initMarker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });


    var initInfoWindow = new google.maps.InfoWindow({
      content: "Computer Science Building!"
    });


    google.maps.event.addListener(initMarker, 'click', function ($scope) {

      initInfoWindow.open($scope.map, initMarker);
    });

    google.maps.event.addListener($scope.map, 'click', function (event) {
      var newMarker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: event.latLng
      });


      console.log($rootScope.info);

      var newMarkerInfo = new google.maps.InfoWindow({
        content:$scope.info
      });



      google.maps.event.addListener(newMarker,'click', function($scope) {
        newMarkerInfo.open($scope.map, newMarker);
      });




      $scope.flightPlanCoordinates.push(event.latLng);

      $scope.flightPath = new google.maps.Polyline({
        path: $scope.flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#1e26ff',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      $scope.flightPath.setMap($scope.map);

    });
  });

 $scope.onSubmit = function($rootScope,$state, info){
    $rootScope.info = info;
    console.log(info);
    console.log($rootScope.info);
 }

});

