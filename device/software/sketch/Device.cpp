#include "Device.h";
#include "WifiController.h";
#include <Arduino.h>


WifiController wifiController;
String requestPath = "https://home.florisweb.dev/database/API/";

void Device::configureWifi(char* _ssid, char* _password)
{
  Serial.begin(115200);
  wifiController.configure(_ssid, _password);
}

void Device::handleDebugCommand(char rxChar) {
  Serial.print('\n');
  switch (rxChar) {
    case 's':
      Serial.println("[DEBUG] === WiFi ===");
      wifiController.printDebugInfo();
      break;
    case 'd':
      Serial.println("[DEBUG] === WiFi.disconnect() ===");
      wifiController.disconnect();
      break;
    case 'r':
      Serial.println("[DEBUG] === WiFi.reconnect() ===");
      wifiController.reconnect();
      break;
    case '\n': break;
    default:
      Serial.print("[DEBUG] Command '");
      Serial.print(rxChar);
      Serial.println("' not recoginized.");
  }
}




bool Device::registerDevice(String _name)
{
  if (token != "")
  {
    if (this->isDeviceRegistered()) return true;
  }

  deviceName = _name;
  String response = wifiController.sendGet(requestPath + "register.php", "name=" + _name);
  if (response == "E_Internal") return false;
  token = response;
  return true;
}

void Device::setToken(String _token) {
  token = _token;
}

bool Device::getStatus()
{
  String response = wifiController.sendGet(requestPath + "getStatus.php", "token=" + token);
  if (response == "E_Internal") return false;
  if (response == "E_deviceNotFound")
  {
    token = "";
    this->registerDevice(deviceName);
    return false;
  }

  isBound = false;
  if (response == "true") isBound = true;
  return isBound;
}

String Device::writeData(String _data)
{
  String response = wifiController.sendGet(requestPath + "writeData.php", "data=" + _data + "&token=" + token);
  return response;
  //  if (response == "E_Internal") return "false;
  //  if (response == "E_deviceNotFound")
  //  {
  //    token = "";
  //    this->registerDevice(deviceName);
  //    return "false";
  //  }
  //
  //  return response;
}


bool Device::isDeviceRegistered() {
  String response = wifiController.sendGet(requestPath + "getStatus.php", "token=" + token);
  if (response == "E_Internal") return false;
  if (response == "E_deviceNotFound") return false;
  return true;
}
