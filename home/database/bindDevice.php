<?php
  require_once __DIR__ . '/modules/deviceManager.php';

  $_id = (int)$_POST['id'];
  if (!isset($_POST['id'])) die(json_encode(array(
    "error" => "E_invalidData",
    "result" => false,
  )));

  $device = $DeviceManager->getDeviceById($_id);  
  if (!$device || is_string($device)) die(
    json_encode(array(
      "error" => $device,
      "result" => false,
    ))
  );

  if ($device->getStatus()['isBound'] === true) die(
    json_encode(array(
      "error" => "E_deviceAlreadyBound",
      "result" => false,
    ))
  );

  echo json_encode(array(
    "error" => false,
    "result" => $device->bind(),
  ));
?>
