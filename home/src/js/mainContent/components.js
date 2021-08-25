import '../../css/mainContent/components.css';
import DV from '../dataVisualizer.js';
import React, { useRef, useEffect } from 'react'


// calc(2 * var(--componentWidth) - 10px * 2)
function Component({size, className, children}) {
  if (!size || size.length != 2) size = [1, 1];
  const reference = useRef(null);
  useEffect(() => {
    let element = reference.current;
    if (!element) return;
    element.style.width = 'calc(' + size[0] + ' * var(--componentWidth) - 10px * 2)';
    element.style.height = 'calc(' + size[1] + ' * var(--componentHeight) - 10px * 2)';
  });

  return <div ref={reference} className={'Component panel ' + className}> 
    {children}
  </div>
}

export function WhiteSpace({size}) {
  return <Component className='whiteSpace' size={size}></Component>
}


export function Variable({name, value, size}) {
  return <Component className='variable' size={size}> 
      <div className='text name'>{name}</div>
      <div className='text value'>{value}</div>
  </Component>;
}





export function LineGraph({xAxisTag, yAxisTag, size = [2, 2], yRange, lines, controlObject}) {
  let actualLines = [];
  for (let line of lines)
  {
    let actualLineData = [];
    try {
      actualLineData = typeof line == 'string' ? JSON.parse(line) : line;
    } catch (e) {};
    actualLines.push(actualLineData);
  }
 
  return <Component size={size} className='lineGraph'>
      <DV.LineGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} yRange={yRange} lines={actualLines} controlObject={controlObject}/>
  </Component>
}