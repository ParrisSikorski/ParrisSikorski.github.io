<?php 
	session_start(); 
    include "connection.php";

    $output = ['success'];


	// $user_info = [
	// 		['id'=> 0, 'username'=>'dpaschal', 'password' => '2beb0192eb1ca5a8756bc89a09b93036e1854049']
	// 	];
	// 	$user_info = array_push_assoc($_POST, $_POST['username'], $_POST['password']);
	// print_r($user_info);
		$sql = "SELECT password, username FROM users";
$username = mysql_real_escape_string($_POST['username']);
$password = mysql_real_escape_string(sha1($_POST['password']));

$query= "SELECT * FROM `users` WHERE username = '$username' AND password = '$password'";
foreach($sql as $key =>$value){
	// print("\n$value[username] == $_POST[username]");

	if($value['username'] == $username){
		// print("\n$value[password] == $_POST[password]");
		if($value['password'] == $password)){
			$_SESSION['user_id']=$value['id'];
			// $_SESSION = $_POST;
			// print("\nYou had a successful login");
			$output['success'] = 'true';
			$output['userid'] = $_POST['username'];
			$output['message'] = 'Succesful login';
			
		}
		else{
		$output['!success'] ='false';
		}	
	}
}
	$output_string = json_encode($output);
	print $output_string;

?>