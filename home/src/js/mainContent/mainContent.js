import '../../css/mainContent/mainContent.css';
import PairMenu from './pairMenu';
import DevicePage from './devicePage';
import React from 'react';

let setCurDevice;
const MainContent = new function() {
  this.pairMenu = PairMenu;

  this.devicePage = new function() {
    this.open = function(_device) {
      this.setOpenState(true);
      setCurDevice(_device);
    }
    this.close = function() {
      this.setOpenState(false);
    }
  }

 
  this.render = function() {
    return <MainContentElement/>
  }
}




function MainContentElement() {
  let curDevice;
  [curDevice, setCurDevice] = React.useState({name: '...'});

  return (
    <div id='mainContent'>
      <DevicePage device={curDevice}/>

      <PairMenu.render/>
    </div>
  );
}

export default MainContent;