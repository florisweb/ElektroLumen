import React from 'react';

function Page() {
  let [openState, setState] = React.useState([]);
  // open={() => {setState(true)}} close={() => {setState(false)}}
  // {'page ' + openState ? '' : 'hide'}>

  return (
    <div className={'page' + (openState ? '' : ' hide')} open={() => {setState(true)}} close={() => {setState(false)}}> 
      hey there
      {/* <Header/> */}
      {/* <Content/> */}
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


export default Page;


