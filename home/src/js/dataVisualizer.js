import '../css/dataVisualizer.css';
import React, { useRef, useEffect } from 'react'

function Canvas(props) {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    //Our first draw
    // props.ctx = ctx;
    props.draw(ctx);
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}






function BaseGraph({xAxisTag, yAxisTag, drawCallback = function() {}}) {
  return (
    <div className='DV GraphHolder'> 
      <div className='AxisText xAxisTag'>{xAxisTag}</div>
      <div className='yAxisTagHolder'>
        <div className='AxisText yAxisTag'>{yAxisTag}</div>
      </div>
      <Canvas className='Canvas' draw={drawCallback} ctx={window.ctx}></Canvas>
    </div>
  )
}

export function LineGraph({xAxisTag, yAxisTag, data, yRange, controlObject}) {
  if (!yRange)
  {
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < data.length; i++)
    {
      if (minY > data[i]) minY = data[i];
      if (maxY < data[i]) maxY = data[i];
    }
    yRange = [minY, maxY];
}

  function draw(ctx) {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;

    let y = ctx.canvas.height - (data[0] - yRange[0]) / (yRange[1] - yRange[0]) * ctx.canvas.height;
    ctx.strokeStyle = '#f00';
    ctx.moveTo(0, y);

    for (let i = 1; i < data.length; i++)
    {
      let x = i * ctx.canvas.width / (data.length - 1);
      let y = ctx.canvas.height - (data[i] - yRange[0]) / (yRange[1] - yRange[0]) * ctx.canvas.height;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  return <BaseGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} drawCallback={draw}/>
}


export default {
  LineGraph: LineGraph
}
