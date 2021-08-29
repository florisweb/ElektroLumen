import '../css/sidebar.css';

import React from 'react';
import Server from './server';
import icon from '../images/icons/plantIcon.png';
import addDeviceIcon from '../images/sidebar.jpg';

import MainContent from './mainContent/mainContent';
import PairMenu from './pairMenu';


const SideBar = new function() {
  this.render = function() {
    return (
      <div id='sideBar'>
        <DeviceListElement/>
        <AddDeviceButton/>
      </div>
    );
  }
  this.update = async function() {
    await this.deviceList.update();
  }

  this.deviceList = new function() {
    this.update = async function() {
      let devices = await Server.getDevices();
      setDevices(devices);
    }
  }
}


let setDevices;
function DeviceListElement() {
  let [openState, setOpenState] = React.useState(true);
  SideBar.deviceList.open = function() {
    setOpenState(true);
  }
  SideBar.deviceList.close = function() {
    setOpenState(false);
  }

  let devices;
  [devices, setDevices] = React.useState([]);
  let deviceElements = [];
  for (let device of devices) deviceElements.push(<DeviceElement data={device}/>);

  // onClick={() => {setState(false)}}
  return (
    <div className={'deviceList' + (openState ? '' : ' hide')}> 
      {deviceElements}
    </div>
  );
}

function DeviceElement({data}) {
  let statusClass = 'offline';
  if (data.status == 1) statusClass = 'online';
  if (data.status == 2) statusClass = 'error';

  return <div className='header device' onClick={() => {MainContent.devicePage.open(data)}}>
    <img className='icon' src={icon}/>
    <div className='text title'>{data.name}</div>
    <div className={'text status ' + statusClass}>●</div>
  </div>
}



function AddDeviceButton() {
  return <div className='header addDeviceButton' onClick={() => {PairMenu.open()}}>
    <img className='icon' src={addDeviceIcon}/>
    <div className='text title'>{'Add Device'}</div>
  </div>
}



export default SideBar;
