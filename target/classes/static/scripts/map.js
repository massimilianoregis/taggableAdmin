var style=[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
angular.module("map",["google-maps".ns()])
.directive('reverseGeocode', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            element.text(results[1].formatted_address);
                        } else {
                            element.text('Location not found');
                        }
                    } else {
                        element.text('Geocoder failed due to: ' + status);
                    }
                });
            },
            replace: true
        }
    })
.controller('mapCtrl', ["$scope",function($scope) {
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4, bounds: {}, options:{styles: style}};
    $scope.options = {scrollwheel: false};
    var createRandomMarker = function (i, bounds, idKey) {
        var lat_min = bounds.southwest.latitude,
            lat_range = bounds.northeast.latitude - lat_min,
            lng_min = bounds.southwest.longitude,
            lng_range = bounds.northeast.longitude - lng_min;

        if (idKey == null) {
            idKey = "id";
        }

        var latitude = lat_min + (Math.random() * lat_range);
        var longitude = lng_min + (Math.random() * lng_range);
        var ret = {
            latitude: latitude,
            longitude: longitude,
            title: 'm' + i
        };
        ret[idKey] = i;
        return ret;
    };
    $scope.addRandom=function()
    	{
    	$scope.randomMarkers.push(createRandomMarker(Math.random(), $scope.map.bounds))
    	}
    $scope.removeItem=function(index)
    	{
    	$scope.randomMarkers.splice(index,1)
    	}
    $scope.randomMarkers = 
    	[   
{
    latitude: 45,
    longitude: -74
},
{
    latitude: 45,
    longitude: -74
}
    	];
  
    // Get the bounds from the map once it's loaded
//    $scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {
//        // Only need to regenerate once
//        if (!ov.southwest && nv.southwest) {
//            var markers = [];
//            for (var i = 0; i < 10; i++) {
//                markers.push(createRandomMarker(i, $scope.map.bounds))
//            }
//            
//            $scope.randomMarkers = markers;
//        }
//    }, true);
}])