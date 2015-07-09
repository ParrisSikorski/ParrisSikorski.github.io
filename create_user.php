<?php 
	session_start(); 
    require "connection.php";

    if(empty($_POST['type'])){
    	$output = ['success'=>false,'reason'=>'no type supplied'];
    	print(json_encode($output));
    	exit();
    }

    $username = mysql_real_escape_string($_POST['username']);
	$password = mysql_real_escape_string(sha1($_POST['password']));
 	$firstname = mysql_real_escape_string($_POST['firstname']));
	$lastname = mysql_real_escape_string($_POST['lastname']));
	$email = mysql_real_escape_string($_POST['email']));
	
	$insert = "INSERT INTO `users`(`email`, `first_name`, `last_name`, `password`, `username`)
		VALUES ('$email','$firstname','$lastname','$password','$username')";

	if(mysqli_affected_rows($db) > 0) {
		$all = mysqli_fetch_assoc($result);
		// echo '$all';
		$_SESSION['userID']= $all['userID'];
		$output['success']= true;
		$output['data'] = $all;
	}
	else{
		$output['success'] =false;
	}	

	$output_string = json_encode($output);
	print $output_string;
?>