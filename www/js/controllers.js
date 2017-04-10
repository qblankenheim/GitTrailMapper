
module

.controller('homeCtrl', function($scope, $ionicLoading) {
})

.controller('commCtrl', function($scope,$cordovaGeolocation) {

  function getTrail(trailID) {
    return firebase.database().ref('/trails/' + trailID).once('value').then(function(snapshot) {
      var trailName = snapshot.val().trailName;
      var trailLength = snapshot.val().trailLength;
      var trailPath = snapshot.val().trailPath;
      });
  }

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
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, {
                     featureType: 'transit.station',
                     stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                   }]
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
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, {
                     featureType: 'transit.station',
                     stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                   }]
      };
      console.log(54);
      $scope.communitymap = new google.maps.Map(document.getElementById("map"), mapOptions);
      console.log(56);
    }
  );

  watch.clearWatch();

})

.controller('mapsCtrl', function($scope, $state) {

  function writeTrailData(id,name,length,path) {
    firebase.database().ref('trails/' +id).set({
      trailName: name,
      trailLength: length,
      trailPath: path
    });
  }


  var options = {timeout: 10000, enableHighAccuracy: true};
  var latLng = new google.maps.LatLng(43.071278, -89.406797);


  var mapOptions = {
    center: latLng,
    zoom: 21,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]  // Turn off points of interest.
        }, {
               featureType: 'transit.station',
               stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
             }]
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
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });


    var infoWindow = new google.maps.InfoWindow({
      content: "Computer Science Building!"
    });


    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
    });

    google.maps.event.addListener($scope.map, 'click', function (event) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: event.latLng
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

})
