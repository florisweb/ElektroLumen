
import SideBar from './sideBar';
import MainContent from './mainContent';
import '../css/component.css';
import '../css/App.css';



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
