angular.module('university', ['angular.filter'])
	.controller('SchoolController', ['$http', '$scope', function($http, $scope){
		$scope.myState = "Alabama";
    	$scope.schools = [ ];
    	$http.get('ncaa.json').success(function(data){
      		$scope.schools = data;

      		var mapOptions = {
	        	center: new google.maps.LatLng(42.330, -71.166),
	        	zoom: 6,
	        	mapTypeId: google.maps.MapTypeId.TERRAIN
	    	}

	    	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	  		var bounds = new google.maps.LatLngBounds();
	  		
	  		var infoWindow = new google.maps.InfoWindow();

	  		$scope.gmarkers = [];

	  		for (i = 0; i < $scope.schools.length; i++) {
	  			if ($scope.schools[i].state == $scope.myState) {
		  			var marker = new google.maps.Marker({
	    				position: new google.maps.LatLng($scope.schools[i].latitude, $scope.schools[i].longitude),
	    				map: map,
	    				title: $scope.schools[i].school,
	    				name: $scope.schools[i].name,
	    				primaryColor: $scope.schools[i].primaryColor,
	    				image: $scope.schools[i].image
	  				});

	  				bounds.extend(marker.position);
	  				

	  				google.maps.event.addListener(marker, 'click', (function (marker, i) {
			            return function () {
			                infoWindow.setContent(marker.title);
			                infoWindow.open(map, marker);
			            }
			        })(marker, i));

			        $scope.gmarkers.push(marker);
	  			}
	  		}


	  		$scope.update = function() {

	  			for(i=0; i<$scope.gmarkers.length; i++){
        		   $scope.gmarkers[i].setMap(null);
    			}
    			$scope.gmarkers = [];
    			bounds = new google.maps.LatLngBounds();

   				for (i = 0; i < $scope.schools.length; i++) {
		  			if ($scope.schools[i].state == $scope.myState) {
			  			var marker = new google.maps.Marker({
		    				position: new google.maps.LatLng($scope.schools[i].latitude, $scope.schools[i].longitude),
		    				map: map,
		    				title: $scope.schools[i].school,
		    				name: $scope.schools[i].name,
		    				primaryColor: $scope.schools[i].primaryColor
		  				});

		  				bounds.extend(marker.position);
		  				$scope.gmarkers.push(marker);

		  				google.maps.event.addListener(marker, 'click', (function (marker, i) {
				            return function () {
				                infoWindow.setContent(marker.title);
				                infoWindow.open(map, marker);
				            }
				        })(marker, i));
	  				}
	  			}

	  			map.fitBounds(bounds);

	  			google.maps.event.trigger(map, 'resize');
	  			
			}

			$scope.openInfoWindow = function(e, selectedMarker) {
          		console.log('show something');
          		e.preventDefault();
          		google.maps.event.trigger(selectedMarker, 'click');
        	};
	  		map.fitBounds(bounds);



    	});
  	}])
  	.filter('listToMatrix', function() {
	    function listToMatrix(list, elementsPerSubArray) {
	        var matrix = [], i, k;

	        for (i = 0, k = -1; i < list.length; i++) {
	            if (i % elementsPerSubArray === 0) {
	                k++;
	                matrix[k] = [];
	            }

	            matrix[k].push(list[i]);
	        }

	        return matrix;
	    }
	    return function(list, elementsPerSubArray) {
	        return listToMatrix(list, elementsPerSubArray);
	    };
	});