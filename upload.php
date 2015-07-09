<!DOCTYPE html>
<html>
<head>

    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="index.css">
    <script type="text/javascript" src="index.js"></script>
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <link href='http://fonts.googleapis.com/css?family=Playball' rel='stylesheet' type='text/css'>
    <script type="text/javascript">
    </script>
    <title></title>
</head>
<body>
    <div id="upload_container">
        <div id="inner_container">
        <div id="form">
<?php 
    include "connection.php";//Connect to the Database
    $deleterecords = "TRUNCATE TABLE zip_code"; // empty the table of its contentes

    //Upload file
    if (isset($_POST['submit'])) {
        if (is_uploaded_file($_FILES['filename']['tmp_name'])) {
            echo "<h1>" . " File ". $_FILES['filename']['name'] . "uploaded successfully." . "</h1>"; 
            echo "<h2>Displaying contents:</h2>";
            readfile($_FILES['filename']['tmp_name']);
            
        }


        //Import uploaded file to Database
        $handle = fopen($_FILES['filename']['tmp_name'], "r");
        $headers = trim(fgets($handle));
        $base_query = 'INSERT into zip_code ($headers)';
        print("base query = $base_query");exit();
        $query = $base_query . implode($headers,',');
        while (($data = fgetcsv($handle)) !== FALSE) {
            // $import= "INSERT into zip_code (RecordNumber, Zipcode, ZipCodeType, City, State, LocationType, 
            //     Lat, `Long`, Xaxis, Yaxis, Zaxis, WorldRegion, Country, LocationText, Location, Decommisioned, 
            //     TaxReturnsFiled, EstimatedPopulation, TotalWages, Notes)
            //                                 values('$data[0]','$data[1]','$data[2]','$data[3]','$data[4]',
            //                                     '$data[5]','$data[6]','$data[7]','$data[8]','$data[9]',
            //                                     '$data[10]','$data[11]','$data[12]','$data[13]','$data[14]',
            //                                     '$data[15]','$data[16]','$data[17]','$data[18]','$data[19]')";

            print('<br>Query: '.$import.'<br>');
            mysqli_query($db, $import) or die(mysqli_error($db));

    }

        fclose($handle);

        print "Import done";

        //view upload form
}else {

        print "Upload new csv by browsing to file and clicking on Upload<br />\n";

        print "<form enctype='multipart/form-data' action='upload.php' method='post'>";

        print "File name to import:<br />\n";

        print "<input size='50' type='file' name='filename'><br />\n";

        print "<input type='submit' name='submit' value='Upload'></form>";

}

?>
    </div>
    </div>
</body>
</html>