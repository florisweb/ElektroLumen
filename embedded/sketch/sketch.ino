
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>


const int DHT11SensorPin = 7;
const int motorEnablePin = 2;
const int groundMoisturePin1 = A0;


DHT_Unified dht(DHT11SensorPin, DHT11);



// dry: 0
// water: 690

uint32_t delayMS;

void setup()
{
  Serial.begin(115200);

  Serial.println("Booting Device...");
  pinMode(motorEnablePin, OUTPUT);
  digitalWrite(motorEnablePin, LOW);
  pinMode(groundMoisturePin1, INPUT);

  // Initialize device.
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
  // Set delay between sensor readings based on sensor details.
  delayMS = sensor.min_delay / 1000;

  
  //  Serial.println("Boot Completed.");
  //  delay(5000);
  //  digitalWrite(motorEnablePin, HIGH);
  //  delay(1000);
  //  digitalWrite(motorEnablePin, LOW);
  //  delay(5000);
  //
  //  digitalWrite(motorEnablePin, HIGH);
  //  delay(1000);
  //  digitalWrite(motorEnablePin, LOW);
}
//
//void loop()
//{
//  delay(100);
//  // Groundmoisture
//  //  float value = analogRead(groundMoisturePin1) / 6.9;
//
//  // Water height - not reliable
//  //  float value = analogRead(groundMoisturePin1) / 6.2;
//  //  Serial.println(value);
//
//  //  sensorController.update();
//  //  wifiController.update();
//  //  ESCControl.update();
//}














void loop() {
  // Delay between measurements.
  delay(delayMS);
  // Get temperature event and print its value.
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error reading temperature!"));
  }
  else {
    Serial.print(F("Temperature: "));
    Serial.print(event.temperature);
    Serial.println(F("°C"));
  }
  // Get humidity event and print its value.
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error reading humidity!"));
  }
  else {
    Serial.print(F("Humidity: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
  }
}
