#include "connectionManager.h";
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

const char* ssid = "";
const char* password = "";
const String deviceId = "";
const String deviceKey = "";



const int groundMoisturePin2 = 35;
const int groundMoisturePin1 = 34;
const int DHT11SensorPin = 33;
const int photoResistorPin = 32;

const int sensorEnablePin = 27;

const int motorDisablePin = 26;

const int sensorUpdateFrequency = 1000 * 30; // ms


connectionManager ConnectionManager;
DHT_Unified dht(DHT11SensorPin, DHT11);




void onMessage(DynamicJsonDocument message) {
}



void setup() {
  pinMode(groundMoisturePin1, INPUT);
  pinMode(groundMoisturePin2, INPUT);
  pinMode(photoResistorPin, INPUT);
  pinMode(motorDisablePin, OUTPUT);
  pinMode(sensorEnablePin, OUTPUT);
  digitalWrite(sensorEnablePin, LOW);
  digitalWrite(motorDisablePin, HIGH);

  Serial.begin(115200);

  delay(1000);
  Serial.println("Waking up...");
  delay(2000);
  ConnectionManager.setup(ssid, password, deviceId, deviceKey, &onMessage);



  // Sensors
  Serial.println("Sensorset 2");
  Serial.println(analogRead(groundMoisturePin1));
  Serial.println(analogRead(groundMoisturePin2));
  Serial.println(analogRead(photoResistorPin));

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

  digitalWrite(motorDisablePin, LOW);
  delay(500);
  digitalWrite(motorDisablePin, HIGH);
}



float temperatureValue = 0;
float humidityValue = 0;
float moistureValue1 = 0;
float moistureValue2 = 0;

void readSensorValues() {
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    temperatureValue = -1;
  }
  else {
    temperatureValue = event.temperature;
  }

  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    humidityValue = -1;
  }
  else {
    humidityValue = event.relative_humidity;
  }

  digitalWrite(sensorEnablePin, HIGH);
  delay(10);
  moistureValue1 = analogRead(groundMoisturePin1) / 40.95 * 2;
  moistureValue2 = analogRead(groundMoisturePin2) / 40.95 * 2;
  digitalWrite(sensorEnablePin, LOW);
}


void sendSensorValues() {
  readSensorValues();
  String dataString = "{\"type\": \"sensorState\", \"data\": {\"temperature\": " + String(temperatureValue) +
                      ", \"humidity\":" + String(humidityValue) +
                      ", \"moisture1\":" + String(moistureValue1) +
                      ", \"moisture2\":" + String(moistureValue2) + "}}";
  Serial.println(dataString);
  ConnectionManager.send(dataString);
}


unsigned int prevMillis = millis();
void loop() {
  ConnectionManager.loop();

  if (millis() - prevMillis > sensorUpdateFrequency)
  {
    prevMillis = millis();
    sendSensorValues();
  }
}
