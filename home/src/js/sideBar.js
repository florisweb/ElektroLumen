import '../css/sidebar.css';

import React from 'react';
import Server from './server';
import icon from '../images/sidebar.jpg';


const SideBar = new function() {
  this.render = function() {
    return (
      <div id='sideBar'>
        <DeviceListElement/>
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
  return <div className='header device'>
    <img className='icon' src={icon}/>
    <div className='text title'>{data.name}</div>
    <div className='text status'>{data.onSameNetwork ? 'local' : 'external'}</div>
  </div>
}




export default SideBar;
