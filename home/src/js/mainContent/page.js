import React from 'react';


export function Page({children, controlObject}) {
  let [openState, setState] = React.useState([]);
  controlObject.setOpenState = setState;

  return (
    <div className={'page' + (openState ? '' : ' hide')}> 
      {children}
    </div>
  );
}

export function PageHeader({title}) {
  return (
    <div className='pageHeader'> 
      <div className='text titleHolder'>{title}</div>
    </div>
  );
}

export function PageContent({children}) {
  return (
    <div className='content'> 
      {children}
    </div>
  );
}