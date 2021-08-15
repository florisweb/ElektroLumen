<?php
	require_once __DIR__ . '/../modules/deviceManager.php';

	$_token = (string)$_GET['token'];

	$device = $DeviceManager->getDeviceByToken($_token);
	
	if (!$device || is_string($device)) 
	{
		echo $device;
	} else {
		$device->updateUpdateTime();
		$status = $device->getStatus();
		echo $status["isBound"] ? 'true' : 'false';
	}
?>
