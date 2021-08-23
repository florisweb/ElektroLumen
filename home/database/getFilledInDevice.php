<?php
  require_once __DIR__ . '/modules/deviceManager.php';
  $_id = (int)$_POST['id'];
  global $device;
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
    $newString = replacePlaceHolderWithIndex('[STATE', $_parameter);
    $newString = replacePlaceHolderWithIndex('[DATA_COLUMN', $newString);
    return $newString;
  }

  function replacePlaceHolderWithIndex($_type, $_parameter) {
    $parts = explode($_type, $_parameter);
    $newString = $parts[0];
    for ($i = 1; $i < sizeof($parts); $i++)
    {
      $subParts = explode(']', $parts[$i]);  
      if (sizeof($subParts) < 2) 
      {
        $newString .= $_type . $parts[$i];
        continue;
      }

      $index = (int)$subParts[0];
      $value = getValueByTypeAndIndex($_type, $index);
      $newString .= $value . join(array_splice($subParts, 1, 1000), ']');
    }

    return $newString;
  }

  function getValueByTypeAndIndex($_type, $_index) {
      if ($_type == '[DATA_COLUMN') 
      {
        return json_encode($GLOBALS['device']->getDataByColumn($_index));
      }
      // Get state
      if (!isset($GLOBALS['device']->getStateValues()[$_index])) return "[E_InvalidStateIndex]";
      return $GLOBALS['device']->getStateValues()[$_index];
  }



  
  
  $output = array(
    "error" => false,
    "result" => $newDevice
  );

  echo json_encode($output);  
?>
