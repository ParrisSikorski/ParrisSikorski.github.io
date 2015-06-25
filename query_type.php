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

	foreach($src_array as $key=> $value){
		$md5 = md5($value);
		$file_md5s[] = $md5;
		$to_insert[$md5] = $value;
	}

	$key_values = "'".implode("','",$file_md5s)."'";
	$query = "SELECT `key` FROM `food_images` WHERE `key` IN ($key_values)";
	// print_r($query);

	$result = mysqli_query($db,$query);

	// print_r($result);
	print_r($to_insert);
	if(mysqli_num_rows($result)>0){
	// if($result = mysqli_query($db,$query)){
		while($row = mysqli_fetch_assoc($result)){
			// $row = mysqli_num_rows($result);
			// print_r($row);
			//print("#########");var_dump($row);
			//print("\nrow to delete **".$row['key']."**\n");
			unset($to_insert[$row['key']]);
		}
	}
	//print_r($to_insert);
	// else {
	if(count($to_insert)>0){
		$insert = "INSERT INTO `food_images`(`type`,`img_src`,`key`) VALUES ";
		foreach($to_insert as $key=>$val){
			$insert .= "('$type','$val', '$key'),";

		}
		$insert = substr($insert,0,-1);
		print("insert query = $insert");
		//$result = mysqli_query($db,$insert);
		print_r($insert.";");
	}
			
	// 		if(mysqli_affected_rows($db)>0){
	// 			$output['success']=true;
	// 		}
	// 		else{
	// 			$output['success'] = false;
	// 		}
		
	// }


	// $output_string = json_encode($output);
	// print($output_string);

?>