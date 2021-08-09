
import SideBar from './sideBar';
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
}

export default App;
