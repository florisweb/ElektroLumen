<?php
  require_once __DIR__ . "/databaseHelper.php";

  global $DeviceManager;
  $DeviceManager = new DeviceManager;

  class DeviceManager {
    public function __construct() {
    }

    public function registerDevice($_data) {
      return $GLOBALS['DBHelper']->registerDevice($_data);
    }

    public function getDeviceById($_id) {
      $device = new _Device($_id);
      if ($device->errorOnCreation) return $device->errorOnCreation;
      return $device;
    }

    public function getDeviceByToken($_token) {
      $id = $GLOBALS['DBHelper']->getDeviceIdByToken($_token);
      if (is_string($id)) return $id;
      return $this->getDeviceById($id);
    }

    public function getDevicesByOwnerId($_ownerId) {
      $ids = $GLOBALS['DBHelper']->getDevicesIdsByOwnerId($_ownerId);
      $devices = [];
      foreach ($ids as $id) 
      {
        array_push($devices, $this->getDeviceById($id));
      }
      return $devices;
    }

    public function getUnBoundDevices() {
      $ids = $GLOBALS['DBHelper']->getAllUnboundDevicesIds();
      $devices = [];
      foreach ($ids as $id) 
      {
        array_push($devices, $this->getDeviceById($id));
      }
      return $devices;
    }
  }


  class _Device {
    private $DBTableName = "deviceList";
    private $DBDataTableName = 'deviceData';

    private $DBHelper;
    public $id;

    public $errorOnCreation = false;

    public function __construct($_id) {
      $this->id       = (int)$_id;
      $this->DBHelper = $GLOBALS['DBHelper']->getDeviceDBInstance($this->id);
      if (is_string($this->DBHelper)) $this->errorOnCreation = $this->DBHelper;
    }

    public function curUserIsOwner() {
      return $this->getOwnerId() == $this->DBHelper->ownerId;
    }

    public function getOwnerId() {
      return $this->DBHelper->ownerId;
    }
    public function isOnSameNetwork() {
      return $this->DBHelper->ip === getIP();
    }

    public function getConnectionStatus() {
      $dt = time() - $this->DBHelper->lastUpdateTime;
      return $dt < 30 * 60; // s = deviceConnectionTimeout
    }

    public function getMetaData() {
      return array(
        "id"            => $this->id,
        "name"          => $this->DBHelper->name,
        "registerTime"  => $this->DBHelper->registerTime,
        "UIDefinition"  => $this->DBHelper->UIDefinition
      );
    }

    public function getStatus() {
      return array(
        "isBound" => !!$this->DBHelper->ownerId
      );
    }
    public function getStateValues() {
      return $this->DBHelper->stateValues;
    }

    public function getDataByColumn($_index, $_dateIndexed = false) {
      $allData = $this->DBHelper->getLatestNRows(5000);
      $columnData = [];
      for ($i = 0; $i < sizeof($allData); $i++)
      {
        $data = json_decode($allData[$i]["deviceData"], true);
        if (!isset($data[$_index])) return "E_InvalidColumnIndex";

        $curIndex = $i;
        if ($_dateIndexed)
        {
          $curIndex = $allData[$i]["createTime"];
        }

        $obj = array(
          $curIndex,
          $data[$_index]
        );

        array_push($columnData, $obj);
      }
      return $columnData;
    }

    public function updateUpdateTime() {
      return $this->DBHelper->updateUpdateTime();
    }

    public function bind() {
      return $this->DBHelper->bind();
    }

    public function addDataRow($_data) {
      $data = [];
      for ($i = 0; $i < sizeof($_data); $i++) $data[$i] = (float)$_data[$i];
      return $this->DBHelper->addDataRow($data);
    }

  
    public function remove() {
     // auth checks
    }
  }

?>
