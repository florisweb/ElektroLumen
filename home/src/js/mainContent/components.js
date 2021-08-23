import '../../css/mainContent/components.css';
import DV from '../dataVisualizer.js';

export function Variable({name, value}) {
  return (
    <div className='Component panel variable'> 
      <div className='text name'>{name}</div>
      <div className='text value'>{value}</div>
    </div>
  )
}


export function LineGraph({xAxisTag, yAxisTag, controlObject}) {
  return (
    <div className='Component panel lineGraph'> 
      <DV.LineGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} controlObject={controlObject}/>
    </div>
  )
}