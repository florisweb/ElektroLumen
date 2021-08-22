
import React from 'react';
import MainContent from './mainContent.js';

import {Page, PageHeader} from './page.js';

function DevicePage({device}) {
  return (
    <Page controlObject={MainContent.devicePage}>
      <PageHeader title={device.name}/>
      <a>Hey there</a>
      <div>Welcome!</div>
    </Page>
  );
}

export default DevicePage;


