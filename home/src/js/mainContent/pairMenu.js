import '../../css/mainContent/pairMenu.css';

import React from 'react';
import Server from '../server';
import SideBar from '../sideBar';


let renderDeviceElements;
let setBindState;
let setOpenState;
const PairMenu = new function() {
  this.render = function() {
    return <PairMenuElement/>
  }

  this.open = async function() {
    await this.update();
    setOpenState(true);
  }
  this.close = function() {
    setOpenState(false);
  }


  this.update = async function() {
    let deviceElements = [];
    let devices = await Server.getUnboundDevices();
    for (let device of devices) deviceElements.push(<DeviceElement data={device}/>);
    renderDeviceElements(deviceElements);
  }
}

function PairMenuElement() {
  let binding;
  let openState;
  [binding, setBindState] = React.useState(false);
  [openState, setOpenState] = React.useState(false);

  let deviceElements;
  [deviceElements, renderDeviceElements] = React.useState('Searching for devices...');

  return (
    <div className={'popup pairMenu' + (openState ? '' : ' hide') + (binding ? ' binding' : '')}> 
      {deviceElements}
    </div>
  );
}

function DeviceElement({data}) {
  return <div className='deviceOption' onClick={() => {
    setBindState(true);
    Server.bindDevice(data.id).then(async function(_response) {
      setBindState(false);

      if (!_response.result) return;
      PairMenu.close();
    
      await SideBar.deviceList.update();
    });
  }}>
    {data.name}
    {data.onSameNetwork ? <div className='onSameNetworkIndicator'>Local</div> : ''}
  </div>
}


export default PairMenu;


