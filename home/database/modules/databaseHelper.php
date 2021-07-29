<?php
  require_once __DIR__ . "/../getRoot.php";
  include_once($GLOBALS["Root"] . "/PHP/PacketManager.php");

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
      return new _databaseHelper_DBDeviceInstance($this->DB, $_deviceId);
    }

    public function getDeviceIdByToken($_token) {
      $response = $this->DB->execute("SELECT id FROM $this->DeviceListTableName WHERE token=? LIMIT 1", [
        $_token
      ]);
      if (sizeof($response) != 1) return "E_deviceNotFound";
      return (int)$response[0]['id'];
    }

    public function getUserId() {
      $userId = $GLOBALS["SESSION"]->get("userId");
      if (!$userId) return false;
      return $userId;
    }


    public function registerDevice($_data) {
      $token    = $this->createId();
      $response   = $this->DB->execute("INSERT INTO $this->DeviceListTableName (token, name) VALUES (?, ?)", array(
        $token,
        (string)$_data['name']
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
    private $DBTableName = "deviceList";
    private $DBDataTableName = 'deviceData';

    private $DB;
    public $id;

    public function __construct($_DB, $_id) {
      $this->DB   = $_DB;
      $this->id   = (int)$_id;
    }

    public function getOwnerId() {
      $response = $this->DB->execute("SELECT ownerId FROM $this->DBTableName WHERE id=? LIMIT 1", [
        $this->id
      ]);
      if (sizeof($response) != 1) return false;
      return $response[0]['ownerId'];
    }

    public function bind() {
      if ($this->getOwnerId()) return "E_deviceAlreadyBound";
      $userId = $GLOBALS['DBHelper']->getUserId();
      if (!$userId) return "E_noAuth";

      return $this->DB->execute("UPDATE $this->DBTableName SET ownerId=? WHERE id=?", [
        $userId,
        $this->id
      ]);
    }


    public function addDataRow($_data) {
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
  }

?>
