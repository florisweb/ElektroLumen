#include "Device.h";
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>



const String deviceName = "ElektroLumen";
const String deviceToken = "d3c667ced2769f80ce0bb03854ff759fc06aab780b6c75af52729cb3ea1ef02a890260af1164487b"; // Leave empty if not yet generated

Device device;


const int DHT11SensorPin = 14;
const int groundMoisturePin1 = 34;
const int groundMoisturePin2 = 35;
//const int motorEnablePin = 2;



DHT_Unified dht(DHT11SensorPin, DHT11);

void setup() {
  Serial.begin(115200);
  device.configureWifi(ssid, password);
  device.setToken(deviceToken);
  if (device.registerDevice(deviceName))
  {
    Serial.println("Succesfully registered device with token:");
    Serial.println(device.token);
  } else {
    Serial.println("Error while registering device.");
  }

  // Sensors


  dht.begin();

  // Print temperature sensor details.
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  Serial.println(F("------------------------------------"));
  Serial.println(F("Temperature Sensor"));
  Serial.print  (F("Max Value:   ")); Serial.print(sensor.max_value); Serial.println(F("°C"));
  Serial.print  (F("Min Value:   ")); Serial.print(sensor.min_value); Serial.println(F("°C"));
  Serial.print  (F("Resolution:  ")); Serial.print(sensor.resolution); Serial.println(F("°C"));
  Serial.println(F("------------------------------------"));
  // Print humidity sensor details.
  dht.humidity().getSensor(&sensor);
  Serial.println(F("Humidity Sensor"));
  Serial.print  (F("Max Value:   ")); Serial.print(sensor.max_value); Serial.println(F("%"));
  Serial.print  (F("Min Value:   ")); Serial.print(sensor.min_value); Serial.println(F("%"));
  Serial.print  (F("Resolution:  ")); Serial.print(sensor.resolution); Serial.println(F("%"));
  Serial.println(F("------------------------------------"));


  pinMode(groundMoisturePin1, INPUT);
  pinMode(groundMoisturePin2, INPUT);
}


String dataString = "";
float moistureValue1 = 0;
float moistureValue2 = 0;
void loop() {
  bool Status = device.getStatus();
  Serial.print("Status: ");
  Serial.println(Status);

  if (Status) // The device is bound to an account
  {
    sensors_event_t event;
    
    dataString = "";
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
      Serial.println(F("Error reading temperature!"));
      dataString += "-1,";
    }
    else {
      dataString += (String)event.temperature + ","; //°C
    }
    // Get humidity event and print its value.
    dht.humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
      Serial.println(F("Error reading humidity!"));
      dataString += "-1,";
    }
    else {
      dataString += (String)event.relative_humidity + ","; //%
    }

    moistureValue1 = analogRead(groundMoisturePin1) / 40.95;
    moistureValue2 = analogRead(groundMoisturePin2) / 40.95;
    dataString += (String)moistureValue1 + "," + (String)moistureValue2;

    Serial.println(device.writeData("[" + dataString + "]"));
    delay(6 * 1000);
  }

  delay(5000);
}
