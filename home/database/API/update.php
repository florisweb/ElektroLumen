<?php
	require_once __DIR__ . '/../modules/databaseHelper.php';

	$_name = (string)$_GET['name'];
	if (!isset($_GET['name'])) $_name = '';

	$token = $DBHelper->registerDevice(
		array(
			'name' => $_name
		)
	);
	
	$response = array(
		"error" => false,
		"result" => $token,
	);

	if (!$token) $response = array(
		"error" => 'E_Internal',
		"result" => false,
	);

	echo json_encode($response);
?>
