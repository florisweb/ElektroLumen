import React from 'react';


export function Page({children, controlObject}) {
  console.log('page', ...arguments);
  let [openState, setState] = React.useState([]);
  // open={() => {setState(true)}} close={() => {setState(false)}}
  // {'page ' + openState ? '' : 'hide'}>
  controlObject.setOpenState = setState;

  return (
    <div className={'page' + (openState ? '' : ' hide')}> 
      {children}
      {/* <Header/> */}
      {/* <Content/> */}
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



// class Page extends Component {

//   // (Header, Content)
//   // let setOpenState;
//   render() {
//     let [openState, setState] = React.useState([]);
//     // setOpenState = setState;
//     return (
//       <div className={'page ' + openState ? '' : 'hide'}>
//         {/* <Header/> */}
//         {/* <Content/> */}
//       </div>
//     );
//   }

//   open() {
//     // setOpenState(true);
//   }

//   close() {
//     // setOpenState(false); 
//   }
// }

