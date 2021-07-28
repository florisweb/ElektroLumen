#ifndef WifiController_h
#define WifiController_h

class WifiController
{
  public:
    void configure(const char* _ssid, const char* _password);
    String sendGet(String _path, String _data);
};

#endif
