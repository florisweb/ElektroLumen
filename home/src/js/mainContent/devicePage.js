
import React from 'react';
import MainContent from './mainContent.js';

import { Variable, LineGraph } from './components.js';


import {Page, PageHeader} from './page.js';

window.graph = {};

function DevicePage({device}) {
  let UI = UIDefListToObjects(device.UIDefinition);
  let data = [0, 1];
  while (Math.random() > .1)
  {
    data.push(100 * Math.random());
  }

  return (
    <Page controlObject={MainContent.devicePage}>
      <PageHeader title={device.name}/>
      {UI}

      <LineGraph controlObject={window.graph} xAxisTag='Time (h)' yAxisTag='Moisture (%)' data={data}/>
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


