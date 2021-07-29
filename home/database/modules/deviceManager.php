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
      return new _Device($_id);
    }

    public function getDeviceByToken($_token) {
      $id = $GLOBALS['DBHelper']->getDeviceIdByToken($_token);
      if (is_string($id)) return $id;
      return $this->getDeviceById($id);
    }
  }


  class _Device {
    private $DBTableName = "deviceList";
    private $DBDataTableName = 'deviceData';

    private $DBHelper;
    public $id;

    public function __construct($_id) {
      $this->DBHelper = $GLOBALS['DBHelper']->getDeviceDBInstance($_id);
      $this->id   = (int)$_id;
    }

    public function getOwnerId() {
      return $this->DBHelper->getOwnerId();
    }

    public function getStatus() {
      return array(
        "isBound" => !!$this->DBHelper->getOwnerId()
      );
    }

    public function bind() {
      return $this->DBHelper->bind();
    }

    public function addDataRow($_data) {
      $data = [];
      for ($i = 0; $i < sizeof($_data); $i++) $data[$i] = (float)$_data[$i];

      return $this->DBHelper->addDataRow($_data);
    }

  
    public function remove() {
     // auth checks
    }
  }

?>
