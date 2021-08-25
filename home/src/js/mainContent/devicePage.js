
import React from 'react';
import MainContent from './mainContent.js';

import { Variable, LineGraph } from './components.js';


import {Page, PageHeader, PageContent} from './page.js';

window.graph = {};

function DevicePage({device}) {
  let UI = UIDefListToObjects(device.UIDefinition);
  return (
    <Page controlObject={MainContent.devicePage}>
      <PageHeader title={device.name}/>
      <PageContent>{UI}</PageContent>
    </Page>
  );
}




function UIDefListToObjects(_UIDefList = []) {
  let UI = [];
  for (let item of _UIDefList) UI.push(UIDefToObjects(item));
  return UI;
}

function UIDefToObjects(_Def) {
  switch (_Def.type) 
  {
    case 'Variable': 
      return <Variable name={_Def.parameters[0]} value={_Def.parameters[1]}/>;
    
    case 'LineGraph':   
      let dataParams = _Def.parameters.splice(2, _Def.parameters.length);
      return <LineGraph xAxisTag={_Def.parameters[0]} yAxisTag={_Def.parameters[1]} lines={dataParams}/>;
    
    case 'WhiteSpace': 
      return <div className='Component panel whiteSpace'></div>;
    default: 
      return <strong>UIComponent of type `{_Def.type}` is not supported.</strong>
  }
}


export default DevicePage;


