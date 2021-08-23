<?php
	require_once __DIR__ . '/../modules/deviceManager.php';
	
	$_token = (string)$_GET['token'];
	$_data = json_decode($_GET['data'], true);
	if (!isset($_GET['data']) || !is_array($_data) || sizeof($_data) == 0) die('E_invalidData');

	$device = $DeviceManager->getDeviceByToken($_token);
	if (!$device || is_string($device)) die($device);

	echo $device->addDataRow($_data) ? 'true' : 'false';
?>
