<?php
	require_once __DIR__ . '/../modules/deviceManager.php';

	$_token = (string)$_GET['token'];

	$device = $DeviceManager->getDeviceByToken($_token);
	
	if (!$device || is_string($device)) 
	{
		$response = array(
			"error" => $device,
			"result" => false,
		);
	} else {
		$response = array(
			"error" => false,
			"result" => $device->getStatus(),
		);
	}

	echo json_encode($response);
?>
