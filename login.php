<?php 
	session_start(); 
    require "connection.php";

	// $user_info = [
	// 		['id'=> 0, 'username'=>'dpaschal', 'password' => '2beb0192eb1ca5a8756bc89a09b93036e1854049']
	// 	];
	// 	$user_info = array_push_assoc($_POST, $_POST['username'], $_POST['password']);
	// print_r($user_info);
if(empty($_POST['username'])){
	$output = ['success'=>false,'reason'=>'no credentials supplied'];
	print(json_encode($output));
	exit();
}
$username = mysql_real_escape_string($_POST['username']);
$password = mysql_real_escape_string(sha1($_POST['password']));

$query= "SELECT * FROM `users` WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($db, $query);

$output['success']=false;
if (mysqli_num_rows($result) > 0){
	$all = mysqli_fetch_assoc($result);
	// echo '$all';
	$_SESSION['userID']= $all['userID'];
	$output['success']= true;
	$output['data'] = $all;
// foreach($query as $key =>$value){
// 	// print("\n$value[username] == $_POST[username]");

// 	if($value['username'] == $username){
// 		// print("\n$value[password] == $_POST[password]");
// 		if($value['password'] == $password)){
// 			$_SESSION['user_id'] = $value['id'];
// 			// $_SESSION = $_POST;
// 			// print("\nYou had a successful login");
// 			$output['success'] = 'true';
// 			$output['userid'] = $_POST['username'];
// 			$output['message'] = 'Succesful login';
			
		}
		else{
		$output['success'] =false;
		}	
// 	}
// }
	$output_string = json_encode($output);
	print $output_string;

?>