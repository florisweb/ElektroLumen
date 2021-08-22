<?php
  require_once __DIR__ . '/modules/deviceManager.php';
  $_id = (int)$_POST['id'];
  $device = $DeviceManager->getDeviceById($_id);
  if (is_string($device)) die(json_encode(array(
    "result" => false,
    "error" => $device
  )));
  if (!$device->curUserIsOwner()) die(json_encode(array(
    "result" => false,
    "error" => "E_notAllowed"
  )));


  $newDevice = $device->getMetaData();
  $newDevice['onSameNetwork'] = $device->isOnSameNetwork();
  $newDevice['status']        = $device->getConnectionStatus();

  $filledInUI = $newDevice["UIDefinition"];
  for ($i = 0; $i < sizeof($filledInUI); $i++)
  {
    if (!$filledInUI[$i]["parameters"]) continue;
    for ($p = 0; $p < sizeof($filledInUI[$i]["parameters"]); $p++)
    {
      $filledInUI[$i]["parameters"][$p] = resolveParameter($filledInUI[$i]["parameters"][$p]);
    }
  }
  $newDevice['UIDefinition'] = $filledInUI;


  
  function resolveParameter($_parameter) {
    return $_parameter . '123';
  }

  
  
  
  $output = array(
    "error" => false,
    "result" => $newDevice
  );

  echo json_encode($output);  
?>
