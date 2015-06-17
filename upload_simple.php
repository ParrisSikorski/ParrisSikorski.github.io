<?php
    include "connection.php";//Connect to the Database
    $deleterecords = "TRUNCATE TABLE zip_code"; // empty the table of its contentes
    mysqli_query($db,$deleterecords);
    $file="free-zipcode-database.csv";

    $handle = fopen($file, "r");
    $headers = trim(fgets($handle));
    
    print("base query = $base_query");exit();
    $query = $base_query . implode($headers,',');
    $values = [];
    while (($data = fgetcsv($handle)) !== FALSE) {
        // $import= "INSERT into zip_code (RecordNumber, Zipcode, ZipCodeType, City, State, LocationType, 
        //     Lat, `Long`, Xaxis, Yaxis, Zaxis, WorldRegion, Country, LocationText, Location, Decommisioned, 
        //     TaxReturnsFiled, EstimatedPopulation, TotalWages, Notes)
        //                                 values('$data[0]','$data[1]','$data[2]','$data[3]','$data[4]',
        //                                     '$data[5]','$data[6]','$data[7]','$data[8]','$data[9]',
        //                                     '$data[10]','$data[11]','$data[12]','$data[13]','$data[14]',
        //                                     '$data[15]','$data[16]','$data[17]','$data[18]','$data[19]')";
    	foreach($data as $key=>$value){
    		if($value==''){
    			$data[$key]='NULL';
    		}
    	}
    	$values .= '('.implode($data,',').'),'
        print('<br>Query: '.$import.'<br>');
        mysqli_query($db, $import) or die(mysqli_error($db));

    }
	$base_query = "INSERT into zip_code ($headers) VALUES ($values)";
        fclose($handle);

        print "Import done";