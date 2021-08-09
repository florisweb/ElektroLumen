import React from 'react';
import Server from '../server';


let renderDeviceElements;
const PairMenu = new function() {
  this.render = function() {
    return <PairMenuElement/>
  }


  this.update = async function() {
    let deviceElements = [];
    let devices = await Server.getUnboundDevices();
    for (let device of devices) deviceElements.push(<DeviceElement data={device}/>);
    renderDeviceElements(deviceElements);
  }
}

function PairMenuElement() {
  let [openState, setOpenState] = React.useState(true);
  let deviceElements;
  [deviceElements, renderDeviceElements] = React.useState('Searching for devices...');
  PairMenu.open = function() {
    setOpenState(true);
  }
  PairMenu.close = function() {
    setOpenState(false);
  }
  // onClick={() => {setState(false)}}
  return (
    <div className={'popup' + (openState ? '' : ' hide')}> 
      {deviceElements}
    </div>
  );
}

function DeviceElement({data}) {
  console.log(data);


  return <div className='deviceOption'>
    data.name
  </div>
}


export default PairMenu;


