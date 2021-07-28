
#include "WifiController.h";


WifiController wifiController;




const String deviceName = "ElektroLumen";

String requestPath = "http://192.168.178.92/git/elektroLumen/home/database/API/";
String deviceToken = "";



void setup() {
  Serial.begin(115200);         // Start the Serial communication to send messages to the computer
  wifiController.configure(ssid, password);
 }

void loop() {
  String response = wifiController.sendGet(requestPath + "register.php", "name=" + deviceName);
  Serial.println("==============");
  Serial.println(response);
  delay(5000);
}
