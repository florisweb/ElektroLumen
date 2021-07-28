
#include "Device.h";


const String deviceName = "ElektroLumen";

Device device;


void setup() {
  Serial.begin(115200);
  device.configureWifi(ssid, password);
  if (device.registerDevice(deviceName))
  {
    Serial.println("Succesfully register device, with token:");
    Serial.println(device.token);
  } else {
    Serial.println("Error while registering device.");
  }
 }

void loop() {
  bool Status = device.getStatus();
  Serial.print("Status: ");
  Serial.println(Status);
  delay(5000);
}
