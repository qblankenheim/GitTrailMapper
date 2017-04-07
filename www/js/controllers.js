
module
.controller('homeCtrl', function($scope, $ionicLoading, $timeout) {

	var wordList = ['Walk','Hike','Experience','Live','Explore'];
  $scope.explore = 'Run';
  // function define($in){
  //   console.log("TEST")
  //   if($in.length == 0)
  //     return $in;
  //   $scope.explore = $in.pop();
  //   define($in).then(function(response){
  //       return define($in);
  //     },1000);
  // }

  function doSomething(input){
    return $timeout(function(){
      return $scope.explore = input;
    },1000);
  }

  function run(objects) {
      var cntr = 0;
      console.log(objects);
      function next() {
          if (cntr < objects.length) {
              doSomething(objects[cntr++]).then(next);
          }
      }
      next();
  }

  run(wordList);

	// var define = {
	// 	define = function($in,$define){
	// 		if($in.length == 0)
	// 			return;
	// 		$scope.explore = $in.pop();
	// 		define($in).then(function(response){
	// 		     if (timer === null) {
	// 		         timer = $interval(function(){
	// 		             $scope.checkNewOrders();
	// 		         }.bind(this), 1000);
	// 		     }
	// 		     define($in);
	// 		});
	// 	}
	// }





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

.controller('mapsCtrl', function($scope, $state) {

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

.controller('communityCtrl',function($scope){

})
