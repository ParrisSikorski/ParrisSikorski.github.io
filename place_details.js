//place_details.js

function initialize_details(placeId) {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(33.8, -117.9),
    zoom: 13
  });

  var request = {
    placeId: 'ChIJx6oOPoze3IAR4aCGakw8AA4',
  };

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  var photo = '';
  service.getDetails(request, function(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    	console.log(place.photos.length);
    	for (var i = 0; i < place.photos.length; i++){
    		photo = place.photos[i].getUrl({'maxWidth':50, 'maxHeight':50});
    		var img = $('<img>', {
    			src: photo,
    		});
    		console.log(place.photos[i].getUrl({'maxWidth':50, 'maxHeight':50}));
    		$('#photo-results').append(img);
    	}
        	var marker = new google.maps.Marker({
        		map: map,
        		position: place.geometry.location
        	});
        	google.maps.event.addListener(marker, 'click', function() {
        		infowindow.setContent(place.name);
        		infowindow.open(map, this);
        	});
      	}
  	});
}

google.maps.event.addDomListener(window, 'load', initialize_details);
