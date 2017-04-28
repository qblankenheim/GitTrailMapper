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

.controller('commCtrl', function($scope,$cordovaGeolocation, $q) {
  function getTrail(trailID) {
    return firebase.database().ref('/trails/' + trailID).once('value').then(function(snapshot) {
      var trailName = snapshot.val().trailName;
      var trailLength = snapshot.val().trailLength;
      var trailPath = snapshot.val().trailPath;
      });
  }
  // var options = {timeout: 10000, enableHighAccuracy: true};
  // var latLng = new google.maps.LatLng(43.071278, -89.406797);
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
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, {
                     featureType: 'transit.station',
                     stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                   }]
      };

      $scope.communitymap = new google.maps.Map(document.getElementById("map"), mapOptions);

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
      lat  = position.coords.latitude;
      long = position.coords.longitude;

      var latLng = new google.maps.LatLng(lat,long);
      // var latLng = $cordovaGeoLocation.getCurrentPosition();
      var mapOptions = {
        center: latLng,
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, {
                     featureType: 'transit.station',
                     stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                   }]
      };

      $scope.communitymap = new google.maps.Map(document.getElementById("map"), mapOptions);

    }
  );

  watch.clearWatch();

loadTrails();
  function loadTrails(){

    /// /setting up defer
    var defer = $q.defer;
    defer.resolve;
  //calling database to get all trails in db variable
    var db = firebase.database().ref('/trails/').once('value')
      .then( function (ref) {
        //for every user in database
        ref.forEach( function(user) {
          console.log(user.key);

          //for every trail in a user
          user.forEach(function(trail){
            console.log(trail.key);

            $scope.positions = [];
            $scope.information = [];

            //for every index in a trail
            trail.forEach(function(index){
              var lat;
              var lng;
              var info;

              //for each feature in an index
              index.forEach(function(value){
                console.log(value.key);
                if(value.key == "lat"){
                  lat = value.val();
                }
                else if(value.key == ("lng")){
                  lng = value.val();
                }
                else if(value.key == ("info")){
                  info = value.val();
                }
                else{
                  console.log("not good 137");
                }
              });
              console.log(lat + " " + lng);
              $scope.positions.push(new google.maps.LatLng(lat,lng));
              $scope.information.push(info);
            });

            loadOneTrail($scope.positions, $scope.information);


          });

        });





        var out = ref.val();
        return defer.resolve;
      },function (error){
        console.log(error);
        return defer.resolve;
      })
  }


  function loadOneTrail(positions, information) {
    //make markers

    $scope.polylines = new google.maps.Polyline({
        path: positions,
        geodesic: true,
        strokeColor: '#1e26ff',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    $scope.polylines.setMap($scope.communitymap);

    console.log(positions.length + "////////////////");
    var i;
    for( i = 0;i<=positions.length*2+1;i++){

      var currpos = positions.pop();

      var marker = new google.maps.Marker({
        map: $scope.communitymap,
        animation: google.maps.Animation.DROP,
        position: currpos
      });



    }




  }







})

.controller('mapsCtrl', function($scope, $state, $cordovaGeolocation, $rootScope, $q) {
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
    zoom: 17,
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
  $scope.flightPlanCoordinates = [];
  $scope.flightPaths = [];
  $scope.markers = [];
  $scope.messages = [];
  $scope.trailName = null;
  $scope.pathNames = [];
  $scope.textBox = false;

  getTrailNames().then(function(good){
    console.log('GOOD');
  },function(bad){
    console.log('BAD');
  });

  // Event listener that detects clicks on map and adds marker
  google.maps.event.addListener($scope.map, 'click', function (event) {
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: event.latLng
    });

    $scope.markers.push(marker);
    $scope.flightPlanCoordinates.push(event.latLng);
    console.log($scope.flightPlanCoordinates);

    $scope.flightPath = new google.maps.Polyline({
      path: $scope.flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#1e26ff',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    $scope.flightPath.setMap($scope.map);
    $scope.flightPaths.push($scope.flightPath);
  });

  // Checks for valid trailname
  function validTrailName(name){
    console.log("VALIDATING TRAIL NAME")
    console.log("NAME: ")
    console.log(name);
    if(name == null || name == '' || $scope.pathNames.indexOf(name)>=0)
      return false;
    else
      return true;
  }

  function createTrailPath(name, path, info) {
    console.log("CREATING PATH");
    var user = convertUser($rootScope.username);
    for(var ind in path){
      var out = path[ind];
      firebase.database().ref('trails/'+ user + '/' + name + '/' + i).set({
        lat: out.lat(),
        lng: out.lng()
      });
    }
    return true;
  }

  $scope.finishTrail = function(){
    console.log("");
    console.log("FINISH TRAIL");

    var user = convertUser($rootScope.username);

    if(user == null){
      console.log("NO USER");
      return false;
    }

    if(!validTrailName($scope.trailName)){

      if(!$scope.textBox){
        $scope.textBox = true;
      }else{
        $scope.trailName='Invalid Trail Name';
      }
      console.log('INVALID TRAIL NAME: ');

      console.log($scope.trailName);
      return false;
    }

    $scope.textBox = false;

    if(createTrailPath($scope.trailName,$scope.flightPlanCoordinates)){
      console.log('PATH ADDED');
      $scope.pathNames.push($scope.trailName);
    } else
      console.log('NO PATH ADDED');


    ///// RESET ALL TRAIL RELATED VARS ////////

    $scope.flightPlanCoordinates=[];
    $scope.trailName = "";

    // Removes polylines
    var len = $scope.flightPaths.length;
    for(i = 0 ; i < len; i++)
      $scope.flightPaths[i].setMap(null);
    $scope.flightPaths = [];

    len = $scope.markers.length;
    for(i = 0; i < len; i++)
      $scope.markers[i].setMap(null);
    $scope.markers = [];
    ////////////////////////////////////////////
  };

  function getTrailNames(){
    console.log('Getting Trail Names');
    var name = convertUser($rootScope.username);
    var defer = $q.defer();
    if(name == null)
      return defer.reject();
    return firebase.database().ref('/trails/'+name).once('value')
    .then( function (ref) {
        console.log(ref);
        var out = ref.val();
        var names = [];
        for(name in out)
          names.push(name);
        $scope.pathNames = names;
        return defer.resolve();
      },function (error){
        console.log(error);
        return defer.reject();
    })
  };

  ////////////////// Adds initial marker at CS Building  //////////////////////////
  // google.maps.event.addListenerOnce($scope.map, 'idle', function () {
  //   var marker = new google.maps.Marker({
  //     map: $scope.map,
  //     animation: google.maps.Animation.DROP,
  //     position: latLng
  //   });
  // });
  // $scope.flightPath = new google.maps.Polyline({
  //   path: $scope.flightPlanCoordinates,
  //   geodesic: true,
  //   strokeColor: '#1e26ff',
  //   strokeOpacity: 1.0,
  //   strokeWeight: 2
  // });
  // $scope.flightPath.setMap($scope.map);
  ///////////////////////////////////////////////////////////////////////////////////

  ////////////////// Description at Marker //////////////////////////////////////////
  // google.maps.event.addListenerOnce($scope.map, 'idle', function () {
  //   var marker = new google.maps.Marker({
  //     map: $scope.map,
  //     animation: google.maps.Animation.DROP,
  //     position: latLng
  //   });
  //   var infoWindow = new google.maps.InfoWindow({
  //     content: "Computer Science Building!"
  //   });
  //   google.maps.event.addListener(marker, 'click', function () {
  //     infoWindow.open($scope.map, marker);
  //   });
  // });
  ///////////////////////////////////////////////////////////////////////////////////

  //////////////  GET CURRENT POSITION  //////////////////
  // $scope.useCurrentPosition = function(){
  //   $scope.button1Click();
  //   var posOptions = {timeout: 10000, enableHighAccuracy: false};
  //   var lat;
  //   var long;
  //   console.log("looking for position");
  //   $cordovaGeolocation
  //     .getCurrentPosition(posOptions)
  //     .then(function (position) {
  //       lat = position.coords.latitude,
  //         long = position.coords.longitude,
  //       $scope.currentPath.push([lat, long]);
  //       $scope.currentPathInfo.push($scope.currentMarkerInfo);
  //       console.log(lat + "  " + long);
  //       position = null;
  //     }, function(err) {
  //       console.log(err)
  //   });
  //   var watchOptions = {timeout : 3000, enableHighAccuracy: false};
  //   var watch = $cordovaGeolocation.watchPosition(watchOptions);
  //   watch.then();
  //   lat = null;
  //   long = null;
  // };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
})

.controller('logCtrl', function($scope, $ionicLoading, $timeout, $rootScope) {
  $scope.username = "john.doe@gmail.com";
  $scope.password = "abc123";
  $scope.logoutButton = {};
  $scope.logoutButton.visibility = 'hidden';

  $rootScope.username = $scope.username;

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
        $ionicLoading.show({ template: 'Login Unsuccessful! Check credentials, check connection or create user',
          noBackdrop: true, duration: 1000 });
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

  // firebase.database().ref('/reports/' +'emergency').once('value').then(function(snapshot) {
  //   var user= snapshot.val().name;
  //   console.log(user)
  // });
})

.run(function($ionicPlatform, $rootScope, $ionicHistory) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    // $ionicHistory.clearCache();
  });
});

// Converts the users email to a firebase compatible database entry name
function convertUser(name){
  if(name == null)
    return name;
  var temp = '';
  for(i = 0; i < name.length; i++)
    if(name[i]=='.')
      temp +='_';
    else
      temp += name[i];
  return temp;
}
