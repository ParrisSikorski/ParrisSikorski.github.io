<?php 
	session_start(); 
	if(isset($_SESSION['userID'])){
		$output['success'] = true;
	}
	else{
		$output['success'] = false;
	}

	$output['sessionid'] = $_SESSION['userID'];

	$output_string = json_encode($output);
	print $output_string;

?>