import '../../css/mainContent/pairMenu.css';

import React from 'react';
import Server from '../server';
import SideBar from '../sideBar';
import icon from '../../images/icons/plantIcon.png';


let renderDeviceElements;
let setPairListOpenState;
let setPairMenuOpenState;

let setCurDevice;

const PairMenu = new function() {
  this.render = function() {
    return <div>
      <PairMenuElement/>
      <PairMenuListElement/>
    </div>
  }

  this.open = async function() {
    setPairListOpenState(true);
    await this.update();
  }
  this.close = function() {
    setPairListOpenState(false);
    setPairMenuOpenState(false);
  }


  this.update = async function() {
    let deviceElements = [];
    let devices = await Server.getUnboundDevices();
    
    devices.sort(function (a, b) {
      return a.onSameNetwork < b.onSameNetwork;
    });

    if (devices[0] && devices.length == 1)
    {
      setCurDevice(devices[0]);
      setPairMenuOpenState(true);
      setPairListOpenState(false);
    }
    for (let device of devices) deviceElements.push(<DeviceElement data={device}/>);
    renderDeviceElements(deviceElements);
  }
}


function PairMenuElement() {
  let curDevice;
  [curDevice, setCurDevice] = React.useState({name: 'nameless', id: false});
  let [binding, setBindState] = React.useState(false);
  
  let openState;
  [openState, setPairMenuOpenState] = React.useState(false);

  return (
    <div className={'popup pairMenu pairSingleDevice ' + (openState ? '' : ' hide') + (binding ? ' binding' : '')}> 
      <div className='text header'>{curDevice.name}</div>
      <img src={icon} className='icon deviceIcon'/>
      <div className='text button bBoxy bindButton' onClick={bindDevice}>Connect</div>
      <div className='text button bBoxy' onClick={() => {
         setPairMenuOpenState(false);
         setPairListOpenState(true);
      }}>Other devices...</div>
    </div>
  );

  function bindDevice() {
    setBindState(true);
    Server.bindDevice(curDevice.id).then(async function(_response) {
      setBindState(false);

      if (!_response.result) return;
      PairMenu.close();
    
      await SideBar.deviceList.update();
    });
  }
}


function PairMenuListElement() {
  let openState;
  [openState, setPairListOpenState] = React.useState(false);

  let deviceElements;
  [deviceElements, renderDeviceElements] = React.useState('Searching for devices...');

  return (
    <div className={'popup pairMenu' + (openState ? '' : ' hide')}> 
      {deviceElements}
    </div>
  );
}

function DeviceElement({data}) {
  console.log(data);
  return <div className='deviceOption' onClick={() => {
    setCurDevice(data);
    setPairListOpenState(false);
    setPairMenuOpenState(true);
  }}>
    <div className='text'>{data.name}</div>
    {data.onSameNetwork ? <div className='onSameNetworkIndicator'>Local</div> : ''}
  </div>
}


export default PairMenu;


