module


.controller('homeCtrl', function($scope, $ionicLoading, $timeout) {

	var wordList = ['Walk','Hike','Experience','Live','Explore'];
  $scope.explore = 'Run';

  function printList(input){
    return $timeout(function(){
      return $scope.explore = input;
    },1000);
  }

  function run(objects) {
      var cntr = 0;
      function next() {
          if (cntr < objects.length) {
              printList(objects[cntr++]).then(next);
          }
      }
      next();
  }
  run(wordList);
})


.controller('commCtrl', function($scope,$cordovaGeolocation) {

  function getTrail(trailID) {
    return firebase.database().ref('/trails/' + trailID).once('value').then(function(snapshot) {
      var trailName = snapshot.val().trailName;
      var trailLength = snapshot.val().trailLength;
      var trailPath = snapshot.val().trailPath;
      });
  }

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
      latLng = new google.maps.LatLng(lat,long);
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
      var latLng = new google.maps.LatLng(lat,long);
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

.controller('mapsCtrl', function($scope, $state, $cordovaGeolocation) {

  function initAuthentication(onAuthSuccess) {
    firebase.authAnonymously(function(error, authData) {
      if (error) {
        console.log('Login Failed!', error);
      } else {
        data.sender = authData.uid;
        onAuthSuccess();
      }
    }, {remember: 'sessionOnly'});  // Users will get a new id for every session.
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

  /*google.maps.event.addListenerOnce($scope.map, 'idle', function () {
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
      console.log($scope.flightPath);

    });
  });
*/
$scope.currentPath = [];
$scope.isWaiting = false;
$scope.currentMarkerInfo = "";
$scope.currentPathInfo = [];
///////////////////////////////////////////////////////////////////////////////////////////////////////
  $scope.createTrailName = function(name) {
    $scope.button1Click();
    firebase.database().ref('trails/' + name).set({
      trailName: name,
    });
  };
///////////////////////////////////////////////////////////////////////////////////////////////////////
  function createTrailPath(name, path, info) {
    var length = path.length;
    for (i=0; i<length; i++) {
      firebase.database().ref('trails/' + name + '/coords/' + i).set({
        // lat: path.lat,
        // lng: path.lng
        coords: path.pop(),
        info: info.pop()
      });
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////
  // $scope.trailCreation = function() {
  //   $scope.button1Click();
  //   console.log("attempting to create trail");
  //   var trailName = $scope.trailName;
  //   var trailPath = $scope.flightPlanCoordinates;
  //   createTrailName(trailName);
  //   createTrailPath(trailName, trailPath)
  // };
///////////////////////////////////////////////////////////////////////////////////////////////////////
  $scope.newMarker = function(){
$scope.button2Click();
  };

///////////////////////////////////////////////////////////////////////////////////////////////////////
  $scope.finishTrail = function(){
$scope.button3Click();
createTrailPath($scope.trailName, $scope.currentPath, $scope.currentPathInfo);

$scope.currentPath.clear();
$scope.currentPathInfo.clear();
  };


///////////////////////////////////////////////////////////////////////////////////////////////////////

  $scope.useCurrentPosition = function(){

    $scope.button1Click();

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    var lat;
    var long;
    console.log("looking for position");
    $cordovaGeolocation
      .getCurrentPosition(posOptions)

      .then(function (position) {
        lat = position.coords.latitude,
          long = position.coords.longitude,
        $scope.currentPath.push([lat, long]);
        $scope.currentPathInfo.push($scope.currentMarkerInfo);
        console.log(lat + "  " + long);
        position = null;
      }, function(err) {
    console.log(err)
  });

    var watchOptions = {timeout : 3000, enableHighAccuracy: false};
    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    watch.then();



    lat = null;
    long = null;
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  $scope.useManualPosition = function(){
//
$scope.isWaiting = true;
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////


  google.maps.event.addListener($scope.map, 'click', function (event) {
   if($scope.isWaiting) {
     var lat;
     var long;

     lat = event.latLng.lat();
     long = event.latLng.lng();

     $scope.currentPath.push([lat, long]);
     $scope.currentPathInfo.push($scope.currentMarkerInfo);
console.log(lat + "  " + long);
     $scope.isWaiting = false;
     $scope.button1Click();
   }
   else{

   }
  });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
  $scope.button1Click = function(){
    document.getElementById('menu1').style.visibility = 'hidden';
    document.getElementById('menu1').style.display = "none";
    document.getElementById('menu2').style.display = "block";
    document.getElementById('menu2').style.visibility = 'visible';
    document.getElementById('menu3').style.visibility = 'hidden';
  };
  $scope.button2Click = function(){
    document.getElementById('menu1').style.visibility = 'hidden';
    document.getElementById('menu2').style.visibility = 'hidden';
    document.getElementById('menu2').style.display = "none";
    document.getElementById('menu3').style.display = "block";
    document.getElementById('menu3').style.visibility = 'visible';
  };
  $scope.button3Click = function(){
    document.getElementById('menu1').style.visibility = 'visible';
    document.getElementById('menu2').style.visibility = 'hidden';
    document.getElementById('menu3').style.visibility = 'hidden';
    document.getElementById('menu3').style.display = "none";
    document.getElementById('menu1').style.display = "block";
  }
})

.controller('communityCtrl',function($scope){

})


.controller('logCtrl', function($scope, $ionicLoading, $timeout) {
console.log("in logctrl");
  $scope.username = "john.doe@gmail.com";
  $scope.password = "abc123";
  $scope.logoutButton = {};
  $scope.logoutButton.visibility = 'hidden';

  $scope.createFirebaseUser = function(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
      $ionicLoading.show({ template: 'Created Firebase User!', noBackdrop: true, duration: 1000 });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      $ionicLoading.show({ template: 'Creation of user unsuccessful! Try again!', noBackdrop: true, duration: 1000 });
    });
  };

  $scope.loginFirebaseUser = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  };

  $scope.logoutFirebaseUser = function () {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out Firebase user');
      $ionicLoading.show({ template: 'Logout successful!', noBackdrop: true, duration: 1000 });
      $scope.logoutButton.visibility = 'hidden';
    }, function(error) {
      console.error('Sign Out Error', error);
      $ionicLoading.show({ template: 'Logout Unsuccessful!', noBackdrop: true, duration: 1000 });
    });
  }

  $scope.init = function () {

    if (!firebase.auth().currentUser) {
        // Show modal with description of events
        $ionicLoading.show({ template: 'Please log in', noBackdrop: true, duration: 1000 });
      } else {
        // If successful login, then currentUser is set and display event modal
        // Show modal with description of events
        $scope.logoutButton.username = firebase.auth().currentUser.email;
        $scope.logoutButton.visibility = 'visible';
      }
  }

  $scope.init();

  $scope.attemptFirebaseLogin = function () {
    console.log("Attempting firebase login with username: "+$scope.username+" | password: "+$scope.password);
    $scope.loginFirebaseUser($scope.username, $scope.password).then(function () {
      // Check if currentUser is set (we were succesfully able to login)
      if (!firebase.auth().currentUser) {
        // Show modal with description of events
        $ionicLoading.show({ template: 'Login Unsuccessful! Check credentials, check connection or create user', noBackdrop: true, duration: 1000 });
      } else {
        // If successful login, then currentUser is set and display event modal
        // Show modal with description of events
        $ionicLoading.show({ template: 'Sucessful login with existing user', noBackdrop: true, duration: 1000 });
        $scope.logoutButton.username = firebase.auth().currentUser.email;
        $scope.logoutButton.visibility = 'visible';
      }
    });
  };

  $scope.attemptCreateFirebaseUser = function () {
    $scope.createFirebaseUser($scope.username, $scope.password);
  }
});

module.run(function($ionicPlatform, $rootScope, $ionicHistory) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $ionicHistory.clearCache();
  });







});
