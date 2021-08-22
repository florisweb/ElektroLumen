

function BaseGraph({xAxisTag, yAxisTag}) {
  return (
    <div className='DV GraphHolder'> 
      <div className='AxisText xAxisTag'>{xAxisTag}</div>
      <div className='AxisText yAxisTag'>{yAxisTag}</div>
      <canvas className='Canvas'></canvas>
    </div>
  )
}

export function LineGraph({xAxisTag, yAxisTag, controlObject}) {
    


 
    return <BaseGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag}/>
}


