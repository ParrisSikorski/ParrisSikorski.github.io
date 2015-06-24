<?php 
	session_start(); 
    require "connection.php";

    if(empty($_POST['type'])){
    	$output = ['success'=>false,'reason'=>'no type supplied'];
    	print(json_encode($output));
    	exit();
    }

    $type = mysql_real_escape_string($_POST['type']);
	$src_array = ($_POST['insert_array']);

	// foreach()
	// $insert = "INSERT INTO `food_images`(`type`, `img_src`)
	// 	VALUES ('$type','$src_array[i])";

	// if(mysqli_affected_rows($db) > 0) {
	// 	// $all = mysqli_fetch_assoc($result);
	// 	$output['success']= true;
	// }
	// else{
	// 	$output['success'] = false;
	// }	

	// $output_string = json_encode($output);
	// print $output_string;

	foreach($src_array as $key=> $value){
		$md5 = md5($value);
		$file_md5s[] = $md5;
		$to_insert[$md5] = $value;
	}

	$key_values = "'".implode("','",$file_md5s)."'";
	$query = "SELECT key FROM `food_images` WHERE key IN ($key_values)";
	$result = mysqli_query($db,$query);

	// if(mysqli_num_rows($result)>0){
	// 	while($row = mysqli_fetch_assoc($results)){
	// 		unset($to_insert[$row['key']]);
	// 	}
	// }
	// else {
		foreach($to_insert as $key=>$val){
			$insert = "INSERT INTO `food_images`(`type`,`img_src`,`key`) VALUES ('$type','$val', '$key')";
			$result = mysqli_query($db,$insert);
			print_r($insert.";");
		}
			
			if(mysqli_affected_rows($db)>0){
				$output['success']=true;
			}
			else{
				$output['success'] = false;
			}
		
	// }


	// $output_string = json_encode($output);
	// print($output_string);

?>