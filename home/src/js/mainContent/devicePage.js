
import React from 'react';
import MainContent from './mainContent.js';
import { LineGraph } from '../dataVisualizer.js';
import { Variable } from './components.js';


import {Page, PageHeader} from './page.js';

window.graph = {};

function DevicePage({device}) {
  device.UIDefinition = [
    {
      type: 'Variable',
      parameters: [
        'Moisture',
        '50%'
      ]
    },
    {
      type: 'Variable',
      parameters: [
        'Humidity',
        '72%'
      ]
    },
    {
      type: 'Variable',
      parameters: [
        'Temperature',
        '21.0*'
      ]
    },
    {
      type: 'Variable',
      parameters: [
        'Light Intensity',
        '25 Lux'
      ]
    }
  ];

  let UI = UIDefListToObjects(device.UIDefinition);
  return (
    <Page controlObject={MainContent.devicePage}>
      <PageHeader title={device.name}/>
      {UI}

      <LineGraph controlObject={window.graph} xAxisTag='Time (h)' yAxisTag='Moisture (%)'/>
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
    case 'Variable': return <Variable name={_Def.parameters[0]} value={_Def.parameters[1]}/>;
    default: return <strong>UIComponent of type `{_Def.type}` is not supported.</strong>
  }
}


export default DevicePage;


