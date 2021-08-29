import '../css/pairMenu.css';

import React from 'react';
import Server from './server';
import SideBar from './sideBar';
import icon from '../images/icons/plantIcon.png';
import localIcon from '../images/icons/localIconDark.png';
import loadIcon from '../images/icons/loadingDark.gif';


let renderDeviceElements;
let setPairListOpenState;
let setPairMenuOpenState;
let setPopupOpenState;

let setCurDevice;

const PairMenu = new function() {
  this.render = function() {
    return <PopupHolder>
      <PairMenuElement/>
      <PairMenuListElement/>
    </PopupHolder>
  }

  this.open = async function() {
    setPairListOpenState(true);
    setPopupOpenState(true);
    await this.update();
  }
  this.close = function() {
    setPairListOpenState(false);
    setPairMenuOpenState(false);
    setPopupOpenState(false);
  }


  this.update = async function(_attempt = 0) {
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
    if (!deviceElements.length) 
    {
      if (_attempt > 5) 
      {
        deviceElements = <div className='text'>No available devices...</div>
      } else 
      {
        deviceElements = <Loader text={'Searching for devices...'}/>;
        setTimeout(function() {
          PairMenu.update(_attempt + 1);
        }, 1000 * (_attempt + 1));
      }
    }
    renderDeviceElements(deviceElements);
  }
}


function PopupHolder({children}) {
  let openState;
  [openState, setPopupOpenState] = React.useState(false);
  return <div class={'popupContainer' + (openState ? '' : ' hide')}>
    {children}
  </div>;
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
  [deviceElements, renderDeviceElements] = React.useState(<Loader text={'Searching for devices...'}/>);

  return (
    <div className={'popup pairMenu deviceList' + (openState ? '' : ' hide')}> 
      {deviceElements}
      <div className='text button bBoxy cancelButton' onClick={PairMenu.close}>Cancel</div>
    </div>
  );
}

function DeviceElement({data}) {
  return <div className='deviceOption' onClick={() => {
    setCurDevice(data);
    setPairListOpenState(false);
    setPairMenuOpenState(true);
  }}>
    <div className='text title'>{data.name}</div>
    {data.onSameNetwork ? <div className='onSameNetworkIndicator' src={localIcon}/> : ''}
  </div>
}


function Loader({text}) {
  return <div className='loader'>
    <img className='loadCircle icon' src={loadIcon} />
    <div className='text'>{text}</div>
  </div>
}

export default PairMenu;


