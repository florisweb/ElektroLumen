#include "Device.h";
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>


const String deviceName = "ElektroLumen";
const String deviceToken = "fd55f6784dc43fb5f69859b3e6ea8f7330c8b3ecaf25dffa19ba98f91721e06578b401556c0c2735"; // Leave empty if not yet generated

Device device;


const int DHT11SensorPin = 14;
const int groundMoisturePin1 = 34;
const int groundMoisturePin2 = 35;
const int photoResistorPin = 32;

const int motorEnablePin = 33;




DHT_Unified dht(DHT11SensorPin, DHT11);

void setup() {
  Serial.begin(115200);
  pinMode(groundMoisturePin1, INPUT);
  pinMode(groundMoisturePin2, INPUT);
  pinMode(photoResistorPin, INPUT);
  pinMode(motorEnablePin, OUTPUT);
  digitalWrite(motorEnablePin, LOW);


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
}


String dataString = "";
float moistureValue1 = 0;
float moistureValue2 = 0;
float lightValue = 0;
void loop() {
//  digitalWrite(motorEnablePin, HIGH);
//  delay(1000);
//  digitalWrite(motorEnablePin, LOW);

  bool Status = device.getStatus();
  Serial.print("Status: ");
  Serial.println(Status);

  if (Status) // The device is bound to an account
  {
    dataString = "";
    sensors_event_t event;
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

    moistureValue1  = analogRead(groundMoisturePin1) / 40.95;
    moistureValue2  = analogRead(groundMoisturePin2) / 40.95;
    lightValue      = analogRead(photoResistorPin) / 40.95;
    dataString      += (String)moistureValue1 + "," + (String)moistureValue2 + "," + (String)lightValue;

    Serial.println(device.writeData("[" + dataString + "]"));
    delay(60 * 1000);
  }
  delay(5000);
}
