<?php
  require_once __DIR__ . '/modules/deviceManager.php';

  $GLOBALS['DBHelper']->removeInActiveUnboundDevices();
  $devices = $DeviceManager->getUnBoundDevices();

  $output = [];
  foreach ($devices as $device)
  {
    $newDevice = $device->getMetaData();
    $newDevice['onSameNetwork'] = $device->isOnSameNetwork();
    array_push($output, $newDevice);
  }

  echo json_encode($output);  
?>
