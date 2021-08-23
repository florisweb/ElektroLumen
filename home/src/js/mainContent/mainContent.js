import '../../css/mainContent/mainContent.css';
import PairMenu from './pairMenu';
import DevicePage from './devicePage';
import Server from '../server';
import React from 'react';

let curDevice;
let setCurDevice;

const MainContent = new function() {
  this.pairMenu = PairMenu;

  this.devicePage = new function() {
    this.open = async function(_device) {
      this.setOpenState(true);
      setCurDevice(_device);
      await this.update();
    }
    this.update = async function() {
      let response = await Server.getFilledInDevice(curDevice.id);
      if (response.error) return console.error(response);
      curDevice = response.result;
      setCurDevice(curDevice);
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
  [curDevice, setCurDevice] = React.useState({name: '...'});
  console.log(curDevice);
  return (
    <div id='mainContent'>
      <DevicePage device={curDevice}/>

      <PairMenu.render/>
    </div>
  );
}

export default MainContent;