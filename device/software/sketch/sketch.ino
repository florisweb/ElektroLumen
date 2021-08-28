#include "Device.h";
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

const char* ssid = "";
const char* password = "";

const String deviceName = "ElektroLumen";
const String deviceToken = ""; // Leave empty if not yet generated



const int DHT11SensorPin = 33;
const int groundMoisturePin1 = 34;
const int groundMoisturePin2 = 35;
const int photoResistorPin = 32;

const int motorEnablePin = 14;


const int loopsPerUpdate = 15;



Device device;
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





















float temperatureValueSum = 0;
float humidityValueSum = 0;
int moistureValue1Sum = 0;
int moistureValue2Sum = 0;
int lightValueSum = 0;

void updateSensorValues() {
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    temperatureValueSum += -1;
  }
  else {
    temperatureValueSum += event.temperature;
  }

  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    humidityValueSum += -1;
  }
  else {
    humidityValueSum += event.relative_humidity;
  }

  moistureValue1Sum += analogRead(groundMoisturePin1);
  moistureValue2Sum += analogRead(groundMoisturePin2);
  lightValueSum     += analogRead(photoResistorPin);
}

String dataString = "";

float temperatureValue  = 0;
float humidityValue     = 0;
float moistureValue1    = 0;
float moistureValue2    = 0;
float lightValue        = 0;

void uploadSensorValues() {
  temperatureValue  = temperatureValueSum / loopsPerUpdate;
  humidityValue     = humidityValueSum / loopsPerUpdate;
  moistureValue1    = moistureValue1Sum / loopsPerUpdate / 40.95;
  moistureValue2    = moistureValue2Sum / loopsPerUpdate / 40.95;
  lightValue        = lightValueSum / loopsPerUpdate / 40.95;

  dataString = (String)temperatureValue + "," + (String)humidityValue + "," + (String)moistureValue1 + "," + (String)moistureValue2 + "," + (String)lightValue;

  temperatureValueSum = 0;
  humidityValueSum    = 0;
  moistureValue1Sum   = 0;
  moistureValue2Sum   = 0;
  lightValueSum       = 0;


  Serial.println(device.writeData("[" + dataString + "]"));
}




int loopIndex = 0;
bool Status = false;
void loop() {
  //  digitalWrite(motorEnablePin, HIGH);
  //  delay(1000);
  //  digitalWrite(motorEnablePin, LOW);

  loopIndex++;
  updateSensorValues();

  if (loopIndex > loopsPerUpdate)
  {
    loopIndex = 0;
    Status = device.getStatus();
    Serial.print("Status: ");
    Serial.println(Status);

    if (Status) // The device is bound to an account
    {
      uploadSensorValues();
    }
  }

  delay(60 * 1000);
}
