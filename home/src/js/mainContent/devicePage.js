
import React from 'react';
import MainContent from './mainContent.js';
import { LineGraph } from '../dataVisualizer.js';
import { Variable } from './components.js';


import {Page, PageHeader} from './page.js';

window.graph = {};

function DevicePage({device}) {
  return (
    <Page controlObject={MainContent.devicePage}>
      <PageHeader title={device.name}/>
      <LineGraph controlObject={window.graph} xAxisTag='Time (h)' yAxisTag='Moisture (%)'/>

      <Variable name='Moisture' value='50%'/>
      <Variable name='Humidity' value='72%'/>
      <Variable name='Temperature' value='21.0*'/>
      <Variable name='Light Intensity' value='25'/>
    </Page>
  );
}

export default DevicePage;


