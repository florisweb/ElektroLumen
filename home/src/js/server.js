

const Server = new function() {
  this.getDevices = async function() {
    return await this.fetchData('database/getDeviceList.php');
  }

  this.getFilledInDevice = async function(_id) {
    return await this.fetchData('database/getFilledInDevice.php', "id=" + _id);
  }

  this.getUnboundDevices = async function() {
    return await this.fetchData('database/getUnboundDevices.php');
  }

  this.bindDevice = async function(_id) {
    return await this.fetchData('database/bindDevice.php', "id=" + _id);
  }

  this.fetchData = async function(_url, _parameters = "", _attempts = 0) {
    let parameters = _parameters;
    let response = await new Promise(function (resolve) {
      fetch(_url, {
        method: 'POST', 
        body: parameters,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include'
      }).then(function (_result) {
        resolve(_result);
      }, function (_error) {
        resolve("E_noConnection");
      });
    });
    
    if (response.status != 200 && response != "E_noConnection") 
    {
      if (_attempts >= 5) return {error: "E_responseError", result: false};
      return await new Promise(function (resolve) {
        setTimeout(async function () {
          resolve(await Server.fetchData(_url, _parameters, _attempts + 1));
        }, 500);
      }) 
    }
    
    if (response == "E_noConnection") return {error: "E_noConnection", result: false};
    
    let result = await response.text();
    try {
      result = JSON.parse(result);
    } catch (e) {}

    // if (result.error == "E_noAuth") App.promptAuthentication();
    return result;
  }
}
window.Server = Server;

export default Server;
