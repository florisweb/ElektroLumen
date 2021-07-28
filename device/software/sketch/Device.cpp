#include "Device.h";
#include "WifiController.h";


WifiController wifiController;
String requestPath = "http://192.168.178.92/git/elektroLumen/home/database/API/";

void Device::configureWifi(const char* _ssid, const char* _password)
{
  wifiController.configure(_ssid, _password);
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
