// landing_page.js
var storage_array = [];
var image_array = [];
var current_image_index = 0;
var img_array = [];
var next_img_index = 1;
var new_img_index = 0;
var search_array = [];
var click_array = [];
var string_array = [];
var next_img_index = 1;
var new_img_index = 0;
// var dots_array = [];
var yes_array = [];
var no_array = [];
var valid_array = [];
// var type = '';
var gbl_type = '';


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
                // console.log(file_name);

                var img_div = $('<div>', {
                    class: 'img_div_class img-center'
                });

                var div_container = $('<div>', {
                    class: 'div_container_class col-xs-4 col-md-2 img-center'
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
                });

                img.click(function() {
                    // $(this).data('type');
                    gbl_type = '';
                    var type = $(this).data('type');
                    click_array.push(type);
                    if (click_array.length <= 5) {
                        // var type = $(this).data('type');
                        console.log(type);
                        gbl_type = type;
                        string_array.push(type);
                        check_db_for_images(gbl_type);
                        // google_search(gbl_type);
                        $(this).addClass('selected_food_type');
                    }
                });

                img_div.append(img, title);
                div_container.append(img_div);
                image_array.push(img);
                // $('#lnd_img_cntnr').append(div_container);
     			$('#landing_container').append(div_container);
            }
            // initialize_images();
        }
    });
}

/////////// USER LOG IN / OUT FUNCTIONALITY /////////////////////

function logout_to_mainpage() {
    $.ajax({
        dataType: 'html',
        url: 'login.html',
        cache: false,
        success: function(response) {
            $('#landing_container').html('');
            $('#landing_container').html(response);
            $('#login_button').click(function() {

                login_to_server();
                // console.log('after login call');
            });
            $('#create_account_button').click(function() {
                log_to_creation_page();
            })
        }
    })
}

function logout(){
	console.log("inside the logout function");
	$.ajax({
		dataType: 'JSON',
		url: 'log_out.php',
		method: 'POST',
		success: function(response){
			console.log('response: ', response);
			if (response.success){
				load_user_data();
			}
			else {
				logout_to_mainpage();
			}
		}
	})
}

function load_user_data() {
    $.ajax({
        dataType: 'html',
        url: 'landing_template.html',
        cache: false,
        success: function(response) {
            $('#landing_container').html('');
            $('#landing_container').html(response);
            load_landing_page();
            $('#start_query_button').click(function() {
                console.log('button clicked');
                query_button_selected();
            });
            $('#logout_button').click(function() {
                console.log('button clicked');
                $('#logout_button').click(logout());

            });

            // populate_success_data();
        }
    })
}


function log_to_creation_page() {
    $.ajax({
        dataType: 'html',
        url: 'creation_page.html',
        cache: false,
        success: function(response) {
            $('#landing_container').html('');
            $('#landing_container').html(response);
            $("form input").change(function() {
                validate_create();
            });
            $('#validate_new_account').click(function() {
                create_account();
            })
        }
    })
}

function load_login_page() {

}

function validate_create() {
    $.ajax({
        dataType: 'json',
        data: {
            username: $('#N_user_name').val(),
            password: $('#N_password1').val(),
            password2: $('#N_password2').val(),
            email: $('#N_user_email').val(),
            firstName: $('#N_first_name').val(),
            lastName: $('#N_last_name').val()
        },
        method: 'POST',
        url: "http://s-apis.learningfuze.com/todo/validateUserInfo",
        cache: false,
        crossDomain: true,
        success: function(response) {
            $("form").change(function() {
                $('form span').addClass('glyphicon glyphicon-check')
            });
            window.validate_response = response;
            if (validate_response.success == true) {
                $("form input").change(function() {
                    $('form span').addClass('glyphicon glyphicon-check green')
                });
                console.log('validate:', validate_response)
            } else if (validate_response.success == false) {
                $('form span').addClass('glyphicon glyphicon-check')
                console.log('validate:', validate_response)
            }
        }
    });
}

function create_account() {
    $.ajax({
        dataType: 'json',
        data: {
            username: $('#N_user_name').val().toLowerCase(),
            password: $('#N_password1').val(),
            password2: $('#N_password2').val(),
            email: $('#N_user_email').val(),
            firstName: $('#N_first_name').val(),
            lastName: $('#N_last_name').val(),
        },
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/todo/newAccount',
        cache: false,
        crossDomain: true,
        success: function(response) {
            window.response = response;
            if (response.success) {
                console.log('Success:', response.success);
                logout_to_mainpage();

            } else if (!response.success) {
                console.log('failed:', response.errors);
                $('.alert').remove();
                var alert = $('<div>').addClass('alert alert-danger').html(response.errors[0]);
                $('#creation_div > form').append(alert);
            }
        }
    });
}

function keep_user_logged_in() {
    $.ajax({
        dataType: 'json',
        data: {
            session_id: getCookie('sessionid'),
        },
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/todo/getLoggedInUserInfo',
        cache: false,
        crossDomain: true,
        success: function(response) {
            window.response = response;
            if (response.success) {
                console.log(response);
                load_user_data();

            } else if (!response.success) {

                logout_to_mainpage();

            }
        }
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}




function login_to_server() {
    // console.log("login_to_server ajax call");
    $.ajax({
        dataType: 'json',
        url: 'login.php',
        method: 'POST',
        data: {
            username: $('#user_name').val(),
            password: $('#password').val()
        },
        cache: false,
        crossDomain: true,
        success: function(response) {
            // console.log("ajax call success");
            console.log(response);
            window.response = response;
            if (response.success) {
                // console.log("great success");
                load_user_data();
                document.cookie = 'sessionid=' + response.session_id;
                document.cookie = 'username=' + response.username;
                // load_landing_page();
                $('.alert').remove();
            } else if (!response.success) {
                $('.alert').remove();
                var alert = $('<div>').addClass('alert alert-danger').html(response.errors[0]);
                $('body').append(alert);

            }
        }
    });
}

function check_login() {
	$.ajax({
		dataType: 'JSON',
		url: 'logged_in.php',
		method: 'POST',
		success: function(response){
			// if (response.success){
				console.log('response: ', response);

			// }
			if (response.success){
				load_user_data();
			}
			else {
				logout_to_mainpage();
			}
		}
	})
}


/////////// END USER LOG IN / OUT FUNCTIONALITY /////////////////////

function google_search(type) {
    var base_url = 'https://www.googleapis.com/customsearch/v1?';
    var search_obj = {
        key: 'AIzaSyAXLTFyGsVrz9jpTYt23D6Dh3pvvLPGxAY',
        cx: '003998773720353916744:1vnmbnhccze',
        q: type + ' food',
        callback: 'hndlr',
        searchType: 'image',
        imgSize: 'xxlarge',
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
    console.log('type: ', gbl_type);
    var insert_array = [];
    // var valid_array = [];
    // var invalid_img = [];
    for (var i = 0; i < response.items.length; i++) {
        var link = response.items[i].link;
        /////////////////////////////
        /*(function(url) {
            var urlValidatePromise = validate_url(url);

            urlValidatePromise.then(function() {
                search_array.push(url);  
                console.log("Search array: ", search_array.length); 
            }).fail(function() {
                console.log("img doesnt exist");
            }).always(function() {
                validate_finished(url, response, search_array);
            });
        })(link);*/
        ////////////////////////////
        search_array.push(link);
        insert_array.push(link);

    }

    insert_images_to_db(gbl_type, insert_array);

    // check_clicks(search_array);

    // send_to_swipe_page(search_array);
    // for (i = 0; i < search_array.length; i++) {
    //     $('#lnd_img_cntnr').append(search_array[i]);
    // }
    // checked_clicks();
}

// function get_type(type) {
// 	return type;
// }

function insert_images_to_db(gbl_type, insert_array) {
    console.log("this is being called");
    $.ajax({
        dataType: 'json',
        url: 'query_type.php',
        method: 'POST',
        data: {
            type: gbl_type,
            insert_array: insert_array,
        },
        cache: true,
        crossDomain: true,
        success: function(response) {
            console.log("ajax call success");
            console.log(response);
            window.response = response;
            if (response.success) {
                response_array = response;
                for (var i = 0; i < response_array.length; i++) {
                    search_array.push(response_array[i]);
                    console.log('search array: ', search_array[i]);
                }
                console.log("search array: ", search_array);
                check_clicks();
                // query_button_selected(search_array);
            } else if (!response.success) {

            }
        }
    });
}


function check_db_for_images(gbl_type) {
	// console.log('i am being called');
	$.ajax({
		dataType: 'json',
		method: 'POST',
		data: {
			type: gbl_type,
		},
		url: 'check_db_for_images.php',
		cache: true,
		crossDomain: true,
		success: function(response){
			if (response.success){
				response_array = response.links;
				for(var i = 0; i < response_array.length; i++){

					search_array.push(response_array[i].img_src);
					console.log(search_array[i]);

				}
				console.log("search_array: ",search_array);
				// check_clicks();
			}
				// query_button_selected(search_array);
			else{
				// google_search(gbl_type);
			}
		}
	})
}


// function query_food_types(type){
// 	$.ajax({
// 	dataType: 'json',
//         url: 'type_query.php',
//         method: 'POST',
//         data: {
//         	type: type,
//         },
//         cache: true,
//         crossDomain: true,
//         success: function(response) {
//             console.log("ajax call success");
//             console.log(response);
//             window.response = response;
//             if (response.success) {
//             	response_array = response;
//                for(var i = 0; response_array.length){
//                		search_array.push(response_array[i]);
//                }
//             query_button_selected(search_array);
//             } else if (!response.success) {

//             }
//         }
//     });
// }

// function validate_finished(url, response, search_array) {
//     console.log("validate_finished is called");
//     valid_array.push(url);
//     console.log("valid_array length: ", valid_array.length);
//     if (valid_array.length == response.items.length) {
//         $('#search_container').html('');
//         $('#lnd_img_cntnr').html('');
//         shuffle(search_array);
//         send_to_swipe_page(search_array);
//     } else {
//         return;
//     }
// }

function query_button_selected() {
    if (string_array.length == 0) {
        $('#search_container').append(' Please click on at least 1 food image before starting search');
    } else {
        // for (var i = 0; i < string_array.length; i++) {
        //     google_search(string_array[i]);
        // }
        shuffle(search_array);
        // google_search().then(function(){
        send_to_swipe_page();
        // } 
        //);
    }
}

function validate_url(url) {
    return $.ajax({
        url: url
    })
}

// function array_storage(search_array) {
//     storage_array = storage_array.concat(search_array);
// }
// return storage_array;

function send_to_swipe_page() {
        $.ajax({
            dataType: 'html',
            url: 'swipe_page.html',
            cache: false,
            success: function(response) {

                $('body').html(response);
                load_swipe_pages();


                $('#prev_button').click(function() {
                    prev_image();
                });

                $('#next_button').click(function() {
                    next_image();
                });

                $("body").on('swiperight', '.initialize', function() {
                        next_image();
                    })
                    .on('swipeleft', '.initialize', function() {
                        prev_image();
                    });
            }
        })
    }
    /////////// swipe pages /////////////


function load_swipe_pages() {
    console.log("in load swipe page search array: ", search_array);
    // array_storage();
    $('#search_container').html('');
    $('#lnd_img_cntnr').html('');
    for (var i = 0; i < search_array.length; i++) {
        var img = $("<img>", {
            src: search_array[i],
            class: 'initialize',
            id: 'img-' + i
        });

        // var dots = $('<div>', {
        //     data_index: i,
        //     class: "dot_c"
        // });

        img_array.push(img);
        $('#image_container').append(img);

    }
    initialize_images(img_array);
}


function initialize_images(img_array) {

    for (var i = 1; i < img_array.length; i++) {
        img_array[i].css({
            left: "-100%"
        })
    }
    // img_array[current_image_index].css({
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

    // logout_to_mainpage();
    check_login();


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
