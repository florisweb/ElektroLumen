#include <WiFi.h>
#include <HTTPClient.h>
#include "WifiController.h";

void WifiController::configure(char* _ssid, char* _password)
{
  Serial.begin(115200);
  delay(10);
  pinMode(LED_BUILTIN, OUTPUT);
  this->connect(_ssid, _password);
}

void WifiController::connect(char* _ssid, char* _password) {
  Serial.println("WiFi: Connecting...");
  Serial.print("Current Status: ");
  Serial.println(this->statusToString(WiFi.begin(_ssid, _password)));
  Serial.print("SSID: ");
  Serial.println(_ssid);
  Serial.print("Password: ");
  Serial.println(_password);

  ssid      = _ssid;
  password  = _password;
  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20) { // Wait for the Wi-Fi to connect
    delay(500);
    Serial.print('.');
    attempts++;
  }
  Serial.print('\n');
  
  if (attempts == 20)
  {
    Serial.println("Could not connect to WiFi: Timed out after 20 attempts");
    digitalWrite(LED_BUILTIN, LOW);
  } else {
    this->printDebugInfo();
    digitalWrite(LED_BUILTIN, HIGH);
  }
}

void WifiController::reconnect() {
  this->connect(ssid, password);
}

String WifiController::sendGet(String _path, String _data)
{
  digitalWrite(LED_BUILTIN, LOW);
  if (WiFi.status() == WL_CONNECTED)
  {
    digitalWrite(LED_BUILTIN, HIGH); // Indicates that the device is connected to WiFi
    HTTPClient http;

    String path = _path + '?' + _data;
//    Serial.print("Get: ");
//    Serial.println(path);
    http.begin(path.c_str());

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      //      Serial.print("HTTP Response code: ");
      //      Serial.println(httpResponseCode);
      String payload = http.getString();
      http.end();
      return payload;
    }
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    http.end();
    return String(httpResponseCode);
  } else {
    Serial.println("WiFi Disconnected");
  }
}



void WifiController::printDebugInfo() {
  Serial.print("Status: "); 
  Serial.println(this->statusToString(WiFi.status()));

  Serial.print("LocalIP: ");
  Serial.println(WiFi.localIP());
}

void WifiController::disconnect() {
  Serial.println(WiFi.disconnect());
  digitalWrite(LED_BUILTIN, LOW);
}

String WifiController::statusToString(int status) {
  switch (status)
  {
    case WL_CONNECTED: return "WL_CONNECTED";
    case WL_NO_SHIELD: return "WL_NO_SHIELD";
    case WL_IDLE_STATUS: return "WL_IDLE_STATUS";
    case WL_NO_SSID_AVAIL: return "WL_NO_SSID_AVAIL";
    case WL_SCAN_COMPLETED: return "WL_SCAN_COMPLETED";
    case WL_CONNECT_FAILED: return "WL_CONNECT_FAILED";
    case WL_CONNECTION_LOST: return "WL_CONNECTION_LOST";
    case WL_DISCONNECTED: return "WL_DISCONNECTED";
    default: return String(status); break;
  }

}
