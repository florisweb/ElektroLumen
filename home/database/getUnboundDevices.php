<?php
  require_once __DIR__ . '/modules/deviceManager.php';

  $devices = $DeviceManager->getUnBoundDevices();


  $output = [];
  foreach ($devices as $device)
  {
    array_push($output, $device->getMetaData());
  }

  echo json_encode($output);  
?>
