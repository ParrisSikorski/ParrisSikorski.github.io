// landing_page.js
var image_array = [];
var current_image_index = 0;
var img_array = [];
var next_img_index = 1;
var new_img_index = 0;
var search_array = [];
var click_array = [];
var string_array = [];

function load_landing_page() {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'dir_listing.php',
        cache: false,
        crossDomain: true,
        success: function(response) {
            files_response = response['files'];
            for (var i = 0; i < files_response.length; i++) {

                var file_name = files_response[i].substring(files_response[i].lastIndexOf('/') + 1, files_response[i].lastIndexOf('.'));
                console.log(file_name);

                var img_div = $('<div>', {
                    class: 'img_div_class col-xs-4 col-md-2 img-responsive img-center'
                });

                var div_container = $('<div>', {
                    class: 'div_container_class col-xs-4 col-md-2 img-responsive img-center'
                });

                var img = $("<img>", {
                    src: files_response[i],
                    data: {
                        type: file_name
                    },
                    class: 'img_class',
                    id: 'img-' + i,
                    title: files_response[i]
                });

                var title = $('<h6>', {
                    text: file_name,
                    class: 'text-center'
                })

                img.click(function() {
                    // $(this).data('type');
                    var type = $(this).data('type');
                    console.log(type);
                    string_array.push(type);
                    check_clicks();
                    $(this).addClass('selected_food_type');
                    // google_search(type);
                });

                img_div.append(img, title);
                div_container.append(img_div);
                image_array.push(img);
                $('#lnd_img_cntnr').append(div_container);

            }
            // initialize_images();
        }
    });
}

function google_search(type) {
    var base_url = 'https://www.googleapis.com/customsearch/v1?';
    var search_obj = {
        key: 'AIzaSyAXLTFyGsVrz9jpTYt23D6Dh3pvvLPGxAY',
        cx: '003998773720353916744:1vnmbnhccze',
        q: type + ' food',
        callback: 'hndlr',
        searchType: 'image',
        imgSize: 'medium',
        rights: 'cc_publicdomain,cc_attribute, cc_sharealike,cc_noncommercial,cc_nonderived',
        imgType: 'photo'
    }
    var query_str = build_query_string(search_obj);
    console.log(query_str);
    var script_search = $('<script>', {
        src: base_url + query_str
    });
    $('body').append(script_search);
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function build_query_string(search_obj) {
    var url_str = '';
    for (var index in search_obj) {
        url_str += index + '=' + search_obj[index] + '&';
    }
    return url_str;
}

function check_clicks() {
    if (string_array.length > 4) {
        query_button_selected();
    }
}

function hndlr(response) {
    console.log(response);
    click_array.push(1);
    // for (var i = 0; i < response.items.length; i++) {
    //     var item = response.items[i];
    //     var img = $('<img>', {
    //         src: item.link,
    //         class: 'initialize',
    //         id: 'img-'+i
    //     });
    //     search_array.push(img);
    // }
    for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        search_array.push(item.link);
    }
    $('#search_container').html('');
    $('#lnd_img_cntnr').html('');
    shuffle(search_array);
    send_to_swipe_page(search_array);
    // for (i = 0; i < search_array.length; i++) {
    //     $('#lnd_img_cntnr').append(search_array[i]);
    // }
}

function query_button_selected() {
    if (string_array.length == 0) {
        $('#search_container').append(' Please click on at least 1 food image before starting search');
    } else {
        for (var i = 0; i < string_array.length; i++) {
            google_search(string_array[i]);
        }
    }
}

function send_to_swipe_page(search_array) {
	$.ajax({
        dataType: 'html',
        url: 'swipe_page.html',
        cache: false,
        success: function(response) {
            $('#landing_container').html(response);
            load_swipe_pages(search_array);
        }
    })
}
/////////// swipe pages /////////////


function load_swipe_pages(search_array) {
	console.log("in load swipe page search array: ", search_array);
    for (var i = 0; i < search_array.length; i++) {
    	console.log(search_array[i].src);
        var img = $("<img>", {
            src: search_array[i],
            class: 'initialize',
            id: 'img-' + i
        });

        // var dots = $('<div>', {
        //     data_index: i,
        //     class: "dot_c"
        // });
        img_array.push(search_array[i]);
        $('#image_container').append(img);
        // $('#image_container').append(search_array[i]);

    }
    initialize_images();
}


function initialize_images() {
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
    // img_array[next_img_index].removeClass('img_hide');
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

/////////// swipe functionality ending ///////




$(document).ready(function() {
    load_landing_page();

    $('#start_query_button').click(function() {
        query_button_selected()
    });

    // $('#prev_button').click(function() {
    //     prev_image();
    // });

    // $('#next_button').click(function() {
    //     next_image();
    // });

    // $("body").on('swiperight', '.initialize', function() {
    //         next_image();
    //     })
    //     .on('swipeleft', '.initialize', function() {
    //         prev_image();
    //     });
});
