<?php 
session_start();

if(file_exists("images/generic")){
$output['files'] = glob("images/generic/*.jpg");
$output['success'] = 'true';
}
else{
	$output['errors']= "no files exist";
}
	$output_string = json_encode($output);
	print $output_string;

?>

