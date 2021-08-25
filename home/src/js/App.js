
import SideBar from './sideBar';
import Server from './server';
import MainContent from './mainContent/mainContent';
import '../css/component.css';
import '../css/App.css';


window.MainContent = MainContent;
const App = new function() {
  this.render = function() {
    return (
      <div className='App'>
        <SideBar.render />
        <MainContent.render />
      </div>
    );
  }

  this.setup = async function() {
    await SideBar.update();

    let devices = await Server.getDevices()
    if (devices.length < 1) return;
    MainContent.devicePage.open(devices[0]);
  }
}

// setTimeout(function () {
  App.setup();
// }, 100);
export default App;
