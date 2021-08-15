<?php
  require_once __DIR__ . "/../getRoot.php";
  include_once($GLOBALS["Root"] . "/PHP/PacketManager.php");
  require_once __DIR__ . "/miscilanious.php";

  $GLOBALS["PM"]->includePacket("DB", "1.0");
  $GLOBALS["PM"]->includePacket("SESSION", "1.0");

  global $DBHelper;
  $DBHelper = new _databaseHelper;

  class _databaseHelper {
    private $DBName = "eelekweb_home";
    private $DeviceListTableName = 'deviceList';

    private $DB;
    public function __construct() {
      $this->DB = $GLOBALS["DB"]->connect($this->DBName);
      if (!$this->DB) die("databaseHelper.php: Couldn't connect to DB");
    }

    public function getDeviceDBInstance($_deviceId) {
      $device = new _databaseHelper_DBDeviceInstance($this->DB, $_deviceId);
      if ($device->errorOnCreation) return $device->errorOnCreation;
      return $device;
    }

    public function getDeviceIdByToken($_token) {
      $response = $this->DB->execute("SELECT id FROM $this->DeviceListTableName WHERE token=? LIMIT 1", [
        $_token
      ]);
      if (sizeof($response) != 1) return "E_deviceNotFound";
      return (int)$response[0]['id'];
    }

    public function getDevicesIdsByOwnerId($_ownerId) {
      $response = $this->DB->execute("SELECT id FROM $this->DeviceListTableName WHERE ownerId=?", [
        $_ownerId
      ]);
      return array_map('getIdFromObject', $response);
    }

    public function getAllUnboundDevicesIds() {
      $response = $this->DB->execute("SELECT id FROM $this->DeviceListTableName WHERE ownerId IS NULL", []);
      return array_map('getIdFromObject', $response);
    }

    public function getUserId() {
      $userId = $GLOBALS["SESSION"]->get("userId");
      if (!$userId) return false;
      return $userId;
    }


    public function registerDevice($_data) {
      $token    = $this->createId();
      $response = $this->DB->execute("INSERT INTO $this->DeviceListTableName (token, name, ip, lastUpdateTime) VALUES (?, ?, ?, ?)", array(
        $token,
        (string)$_data['name'],
        getIP(),
        time()
      ));

      if (!$response || is_string($response)) return "E_Internal";
      return $token;
    }


    public function createId() {
      return  sha1(uniqid(mt_rand(), true)) . 
          sha1(uniqid(mt_rand(), true));
    }
  }


  class _databaseHelper_DBDeviceInstance {
    private $DBTableName      = "deviceList";
    private $DBDataTableName  = 'deviceData';

    private $DB;
    
    public $id;
    public $name;
    public $ownerId;
    public $registerTime;
    public $lastUpdateTime;
    public $ip;

    public $errorOnCreation = false;

    public function __construct($_DB, $_id) {
      $this->DB   = $_DB;
      $this->id   = (int)$_id;


      $response = $this->DB->execute("SELECT name, ownerId, registerTime, lastUpdateTime, ip FROM $this->DBTableName WHERE id=? LIMIT 1", [
        $this->id
      ]);
      if (sizeof($response) != 1) return $this->errorOnCreation = 'E_deviceNotFound';
      
      $this->name           = $response[0]['name'];
      $this->ownerId        = $response[0]['ownerId'];
      $this->registerTime   = $response[0]['registerTime'];
      $this->lastUpdateTime = $response[0]['lastUpdateTime'];
      $this->ip             = $response[0]['ip'];
    }

    public function getOwnerId() {
      $response = $this->DB->execute("SELECT ownerId FROM $this->DBTableName WHERE id=? LIMIT 1", [
        $this->id
      ]);
      return $response[0]['ownerId'];
    }


    

    

    public function bind() {
      if ($this->ownerId) return "E_deviceAlreadyBound";
      $userId = $GLOBALS['DBHelper']->getUserId();
      if (!$userId) return "E_noAuth";

      $this->ownerId = $userId;
      return $this->DB->execute("UPDATE $this->DBTableName SET ownerId=? WHERE id=?", [
        $userId,
        $this->id
      ]);
    }


    public function addDataRow($_data) {
      $this->updateUpdateTime();
      return $this->DB->execute("INSERT INTO $this->DBDataTableName (deviceId, data) VALUES (?, ?)", [
        $this->id,
        json_encode($_data)
      ]);
    }

    public function getAllData() {
      return $this->DB->execute("SELECT data, createDate FROM $this->DBDataTableName WHERE id=?", [
        $this->id
      ]);
    }

    public function remove() {
      return $this->DB->execute(
        "DELETE FROM $this->DBTableName WHERE id=? LIMIT 1", 
        array($this->id)
      );
    }


    public function updateUpdateTime() {
      return $this->DB->execute("UPDATE $this->DBTableName SET lastUpdateTime=? WHERE id=?", [
        time(),
        $this->id
      ]);
    }
  }
?>
