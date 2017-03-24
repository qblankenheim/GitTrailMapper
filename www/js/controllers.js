
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





})

.controller('mapsCtrl', function($scope, $ionicLoading) {
	var mapOptions = {
	    center: new google.maps.LatLng(37.7831,-122.4039),
	    zoom: 12,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	new google.maps.Map(document.getElementById('map'), mapOptions);
})

.controller('communityCtrl',function($scope){

})
