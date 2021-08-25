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


export function LineGraph({xAxisTag, yAxisTag, yRange, lines, controlObject}) {
  let actualLines = [];
  for (let line of lines)
  {
    let actualLineData = [];
    try {
      actualLineData = typeof line == 'string' ? JSON.parse(line) : line;
    } catch (e) {};
    actualLines.push(actualLineData);
  }
 
  return (
    <div className='Component panel lineGraph'> 
      <DV.LineGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} yRange={yRange} lines={actualLines} controlObject={controlObject}/>
    </div>
  )
}