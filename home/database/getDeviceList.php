<?php
  require_once __DIR__ . '/modules/deviceManager.php';

  $devices = $DeviceManager->getDevicesByOwnerId($DBHelper->getUserId());

  $output = [];
  foreach ($devices as $device)
  {
    $newDevice = $device->getMetaData();
    $newDevice['onSameNetwork'] = $device->isOnSameNetwork();
    $newDevice['status']        = $device->getConnectionStatus();
    array_push($output, $newDevice);
  }

  echo json_encode($output);  
?>
