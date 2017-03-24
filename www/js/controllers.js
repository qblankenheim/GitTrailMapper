
module
.controller('homeCtrl', function($scope, $ionicLoading) {

	var wordList = ['Run','Walk','Hike','Experience','Live','Explore'];
	$scope.explore = 'another';

	var define = {
		define = function($in,$define){
			if($in.length == 0)
				return;
			$scope.explore = $in.pop();
			define($in).then(function(response){
			     if (timer === null) {
			         timer = $interval(function(){
			             $scope.checkNewOrders();
			         }.bind(this), 1000);
			     }
			     define($in);
			});
		}
	}
	define(wordList);
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
