import React from 'react';
import Server from '../server';


let renderDeviceElements;
let setBindState;
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
  let binding = false;
  [binding, setBindState] = React.useState(false);

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
    <div className={'popup' + (openState ? '' : ' hide') + (binding ? ' binding' : '')}> 
      {deviceElements}
    </div>
  );
}

function DeviceElement({data}) {
  console.log(data, arguments);

  return <div className='deviceOption' onClick={() => {
    console.log('bind', data.id);
    setBindState(true);
    Server.bindDevice(data.id).then(function(_response) {
      console.log('pair response', _response);
      setBindState(false);
      if (_response.result) PairMenu.close();
    });
  }}>
    {data.name}
    {data.onSameNetwork ? <div className='onSameNetworkIndicator'>Local</div> : ''}
  </div>
}


export default PairMenu;


