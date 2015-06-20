var files_response;
var current_image_index = 0;
var img_array = [];
var next_img_index = 1;
var new_img_index = 0;
var dots_array = [];
var yes_array = [];
var no_array = [];

// GOOGLE API ///////////////////////////////


var map;
var infowindow;

function initialize() {
  var pyrmont = new google.maps.LatLng(33.6483323,-117.754918);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: pyrmont,
    zoom: 15
  });

  var request = {
    location: pyrmont,
    radius: 500,
    types: ['store']
  };
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
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







/////////// GOOGLE API END 
function load_files() {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'dir_listing.php',
        cache: false,
        crossDomain: true,
        success: function(response) {
            files_response = response['files'];
            for (var i = 0; i < files_response.length; i++) {

                var img = $("<img>", {
                    src: files_response[i],
                    class: 'initialize',
                    id: 'img-'+i
                });

                var dots = $('<div>', {
                    data_index: i,
                    class: "dot_c"

                });

                img_array.push(img);
                $('#image_container').append(img);
            }
            initialize();
        }
    });
}

function initialize() {
    for (var i = 1; i < img_array.length; i++) {
        img_array[i].css({
            left: "-100%"
        })
    }
    img_array[current_image_index].css({
        'left': "0%"
    });

}

function yes_animation() {
    img_array[next_img_index].css({
        'left': "-100%"
    });
    img_array[next_img_index].animate({
        left: "0"
    }, 500);
    img_array[current_image_index].animate({
        left: "100%"
    }, 500, function() {
        yes_display();
    });
    yes_array.push(img_array[current_image_index]);
    img_array.splice(current_image_index, 1);
    $('#image_container').find('img').eq(current_image_index).remove();
}

function no_animation() {
    img_array[next_img_index].css({
        left: "100%"
    });
    img_array[current_image_index].animate({
        left: "-100%"
    });
    img_array[next_img_index].removeClass('img_hide');
    img_array[next_img_index].animate({
        left: "0"
    });

    no_array.push(img_array[current_image_index]);
    img_array.splice(current_image_index, 1);
    $('#image_container').find('img').eq(current_image_index).remove();
}

function yes_display() {

    if (yes_array.length < 6) {
        return;
    } else {
        $('#wrapper').html('');
        for (var i = 0; i < yes_array.length; i++) {
            yes_array[i].removeClass('initialize');
            yes_array[i].css({
                left: 0
            });
            yes_array[i].addClass('yes_initialize col-xs-4 col-md-4');
            console.log(yes_array[i], " is num ", i);
            yes_array[i].attr('data-id', i);
            $('#wrapper').append(yes_array[i]);

            (function() {
                var self = $(yes_array[i]); //

                self.click(function() {
                    console.log("the click handler is working");
                    self.addClass('no_choice');
                    self.text('X');
                });
            })();
        }
    }
}

function next_image() {
    console.log("Next image called");

    if (current_image_index == img_array.length - 1) {
        next_img_index = 0;
        yes_animation();
        current_image_index = next_img_index;
    } else {
        next_img_index = current_image_index + 1;
        yes_animation();
        current_image_index = next_img_index - 1;
    }
}

function prev_image() {

    if (current_image_index == 0) {
        next_img_index = img_array.length - 1;
        no_animation();
        current_image_index = next_img_index - 1;
    } else {
        next_img_index = current_image_index - 1;
        no_animation();
        current_image_index = next_img_index;
        console.log("current image index: ", current_image_index);
    }
}

function

$(document).ready(function() {
    load_files();


    $('#prev_button').click(function() {
        prev_image();
    });

    $('#next_button').click(function() {
        next_image();
    });

    $("body").on('swiperight', '.initialize', function(){
        next_image();
    })
    .on('swipeleft', '.initialize', function(){
        prev_image();
    });    

});
