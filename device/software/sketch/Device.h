#ifndef Device_h
#define Device_h
#include <WString.h>

class Device
{
  public:
    void configureWifi(const char* _ssid, const char* _password);
    bool registerDevice(String _name);

    bool getStatus();
    String writeData(String _data);
    void setToken(String _token);
    
    String token;
    bool isBound = false;
  private:
    String deviceName;
    bool isDeviceRegistered();
};

#endif
