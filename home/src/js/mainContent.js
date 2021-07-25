import logo from '../logo.svg';
import '../css/mainContent/mainContent.css';

const MainContent = new function() {

  this.render = function() {
    return (
      <div id='mainContent'>
        <div className='header'>
          <img src={logo} className='icon headerIcon'/>
          <div className='text headerTitle'>Home</div>
        </div>
        <div className='content'>
          maincontent
        </div>

      </div>
    );
  }
}

export default MainContent;
