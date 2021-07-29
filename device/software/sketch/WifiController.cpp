#include <WiFi.h>
#include <HTTPClient.h>
#include "WifiController.h";


void WifiController::configure(const char* _ssid, const char* _password)
{
  Serial.begin(115200);
  delay(10);
  Serial.println('\n');

  WiFi.begin(_ssid, _password);
  Serial.print("Connecting to ");
  Serial.print(_ssid);

  pinMode(LED_BUILTIN, OUTPUT);

  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(500);
    Serial.print('.');
  }

  Serial.println('\n');
  Serial.println("Connection established!");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());
}

String WifiController::sendGet(String _path, String _data)
{
  digitalWrite(LED_BUILTIN, LOW);
  if (WiFi.status() == WL_CONNECTED)
  {
    digitalWrite(LED_BUILTIN, HIGH); // Indicates that the device is connected to WiFi
    HTTPClient http;

    String path = _path + '?' + _data;
    Serial.print("Get: ");
    Serial.println(path);
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
