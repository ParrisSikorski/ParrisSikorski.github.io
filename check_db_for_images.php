<?php 
	session_start(); 
    require "connection.php";

    $type = mysql_real_escape_string($_POST['type']);
    // print_r("I am inside check db for images.php");
    if(empty($_POST['type'])){
    	$output = ['success'=>false,'reason'=>'no type supplied'];
    	print(json_encode($output));
    	exit();
    }
    // print_r($type);
	

	// $key_values = "'".implode("','",$file_md5s)."'";
	// SELECT * FROM `food_images` WHERE type = 'BBQ'
	$query = "SELECT img_src FROM `food_images` WHERE `type` = '$type'";
	// print_r($query);

	$result = mysqli_query($db,$query);

	// print_r($result);
	// print_r($output);
	// print_r('mysqli_num_rows: '. mysqli_num_rows($result));
	// print_r($to_insert);
	if(mysqli_num_rows($result)>0){
		// print('mysqli_num_rows inside true: '. mysqli_num_rows($result));
		// print_r($result);
		while($row = mysqli_fetch_assoc($result)){
			// print_r($row);
			$output['success']=true;
			$output['links'][]=$row;
	// 		unset($to_insert[$row['key']]);
		}
	}
	else{
		// print('mysqli_num_rows in false: '. mysqli_num_rows($result));
		$output['success'] = false;
	}

	$output_string = json_encode($output);
	print($output_string);

?>