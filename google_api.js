// GOOGLE API ///////////////////////////////

var map;
var infowindow;
var photo;
var restaurant_id = [];

function initialize() {
    var center = new google.maps.LatLng(33.6483323, -117.754918);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: center,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: 10000,
        types: ['cafe', 'meal_takeaway', 'restaurant', 'bakery', 'food', 'meal_delivery'],
        keyword: 'chinese|pizza|steak|italian',
        // zagatselected: true,
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            restaurant_id.push(results[i].place_id);
            console.log(restaurant_id);
            console.log(results[i]);
            createMarker(results[i]);
        }
    }
    call_details(restaurant_id);
}

function call_details(restaurant_id) {
    for (var i = 0; i < restaurant_id.length; i++) {
        initialize_details(restaurant_id[i]);
        console.log("inside call details: ", restaurant_id[i]);
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);



function initialize_details(place_Id) {
    // var map = new google.maps.Map(document.getElementById('map-canvas'), {
    //   center: new google.maps.LatLng(33.8, -117.9),
    //   zoom: 13
    // });

    var request = {
        placeId: place_Id,
    };

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(place.photos);
            for (var i = 0; i < place.photos.length; i++) {
                var photo = place.photos[i].getUrl({
                    'maxWidth': 200,
                    'maxHeight': 200
                });

                (function(url) {
                    var urlValidatePromise = validate_url(url);
                    urlValidatePromise.then(function() {
                        var img = $('<img>', {
                            src: url,
                        });
                        $('#photo-results').append(img);
                    }).fail(function() {
                        console.log("img doesnt exist");
                    });

                })(photo);
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

function validate_url(url) {
    return $.ajax({
        url: url
    })
}

// google.maps.event.addDomListener(window, 'load', initialize_details);
