import '../css/dataVisualizer.css';

function BaseGraph({xAxisTag, yAxisTag}) {
  return (
    <div className='DV GraphHolder'> 
      <div className='AxisText xAxisTag'>{xAxisTag}</div>
      <div className='yAxisTagHolder'>
        <div className='AxisText yAxisTag'>{yAxisTag}</div>
      </div>
      <canvas className='Canvas'></canvas>
    </div>
  )
}

export function LineGraph({xAxisTag, yAxisTag, controlObject}) {
    


 
    return <BaseGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag}/>
}


export default {
  LineGraph: LineGraph
}
