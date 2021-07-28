#ifndef Device_h
#define Device_h
#include <WString.h>

class Device
{
  public:
    void configureWifi(const char* _ssid, const char* _password);
    bool registerDevice(String _name);
    String token;
};

#endif
