#ifndef WifiController_h
#define WifiController_h
#include <WString.h>

class WifiController
{
  public:
    void configure(char* _ssid, char* _password);
    String sendGet(String _path, String _data);
    void printDebugInfo();
    void disconnect();
    void connect(char* _ssid, char* _password);
    void reconnect();
    String statusToString(int status);

  private:
    char* ssid;
    char* password;
};

#endif
