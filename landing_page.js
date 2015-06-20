// landing_page.js

var img_array = [];
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
                    $(this).data('type');
                    var type = $(this).data('type');
                    console.log(type);
                    string_array.push(type);
                    check_clicks();
                    $(this).addClass('selected_food_type');
                    // google_search(type);
                });

                img_div.append(img, title);
                div_container.append(img_div);
                img_array.push(img);
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
  var currentIndex = array.length, temporaryValue, randomIndex ;

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
	if (string_array.length > 4){
		query_button_selected();
	}
}

function hndlr(response) {
    console.log(response);
    click_array.push(1);
    for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        var img = $('<img>', {
            src: item.link
        });
        search_array.push(img);
    }
    $('#search_container').html('');
    $('#lnd_img_cntnr').html('');
    shuffle(search_array);
    for (i = 0; i < search_array.length; i++) {
        $('#lnd_img_cntnr').append(search_array[i]);
    }
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

$(document).ready(function() {
    load_landing_page();

    $('#start_query_button').click(function() {
    	query_button_selected()
    });
})
