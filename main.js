var files_response;
var current_image_index = 0;
var img_array = [];
var next_img_index = 1;
var new_img_index = 0;
var dots_array = [];
var yes_array = [];
var no_array = [];

// function load_landing_page() {
//     $.ajax({
//         dataType: 'json',
//         method: 'GET',
//         url: 'dir_listing.php',
//         cache: false,
//         crossDomain: true,
//         success: function(response) {
//             files_response = response['files'];
//             for (var i = 0; i < files_response.length; i++) {

//                 var img = $("<img>", {
//                     src: files_response[i],
//                     class: 'initialize',
//                     id: 'img-'+i
//                 });

//                 var dots = $('<div>', {
//                     data_index: i,
//                     class: "dot_c"
//                 });

//                 img_array.push(img);
//                 $('#lnd_img_cntnr').append(img);

//             }
//             initialize_images();
//         }
//     });
// }


function load_files() {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'directory_listing.php',
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
            initialize_images();
        }
    });
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

////////// keep user logged in ////////////////////

//runs on document ready
//input: uses the function getCookie to check the sessionid and compares to server of current session id using an ajax call
//output: if sessionids match then it will call function load_user_data upon response.success to reveal multiple_todo_list. If it doesn't match
//then it will call logout_to_mainpage which will load the login.html page for the user to login.
/*function keep_user_logged_in() {
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
}*/


///////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////

//upon clicking logout button the ajax call will use the login.html page to fill in the index.html container with response
/*function logout_to_mainpage() {
        $.ajax({
            dataType: 'html',
            url: 'login.html',
            cache: false,
            success: function(response) {
                $('.container').html('');
                $('.container').html(response);
                $('#login_button').click(login_to_server);
                $('#create_account_button').click(function() {
                    log_to_creation_page();
                })
            }*/
/////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

//input: takes in cookie key of sessionid 
//output: returns the value of the cookie name
/*function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}*/


//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////

//adding glyph color to create page
//input: when clicking create account the user will be redirected to a new page
//output: new page loaded with creation_page.html
/*function log_to_creation_page() {
    $.ajax({
        dataType: 'html',
        url: 'creation_page.html',
        cache: false,
        success: function(response) {
            $('.container').html('');
            $('.container').html(response);
            $("form input").change(function() {
                validate_create();
            });
            $('#validate_new_account').click(function() {
                create_account();
            })
        }
    })
}*/

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
