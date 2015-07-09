<?php 
	session_start(); 
	unset($_SESSION['userID']);
	if(isset($_SESSION['userID'])){
		$output['success'] = true;
		$output['sessionid'] = $_SESSION['userID'];
	}
	else{
		$output['success'] = false;
	}
	$output_string = json_encode($output);
	print $output_string;

?>