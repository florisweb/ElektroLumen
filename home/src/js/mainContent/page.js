import '../../css/mainContent/page.css';
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

export function PageHeader({title, icon}) {
  let iconElement = icon ? <img className='icon headerIcon' src={icon}/> : '';
  return (
    <div className='pageHeader'> 
      {iconElement}
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