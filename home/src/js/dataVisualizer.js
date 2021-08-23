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
  const axisMargin = 0;
  const axisColor = '#999';

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

    drawData(ctx);
    drawXAxis(ctx);
    drawYAxis(ctx);
  }

  function drawData(ctx) {
    let y = dataToYLoc(data[0], ctx);
    ctx.strokeStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(axisMargin, y);

    for (let i = 1; i < data.length; i++)
    {
      let x = indexToXLoc(i, ctx);
      let y = dataToYLoc(data[i], ctx);
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }


  function drawXAxis(ctx) {
    ctx.strokeStyle = axisColor;
    let y = dataToYLoc(0, ctx);
    
    ctx.beginPath();
    ctx.moveTo(axisMargin, y);
    ctx.lineTo(ctx.canvas.width, y);
    
    ctx.closePath();
    ctx.stroke();
  }

  function drawYAxis(ctx) {
    ctx.strokeStyle = axisColor;
    
    ctx.beginPath();
    ctx.moveTo(axisMargin, 0);
    ctx.lineTo(axisMargin, ctx.canvas.height);
    
    ctx.closePath();
    ctx.stroke();
  }

  function indexToXLoc(_index, ctx) {
    return _index / (data.length - 1) * (ctx.canvas.width - axisMargin) + axisMargin;
  }
  function dataToYLoc(_value, ctx) {
    return ctx.canvas.height - (_value - yRange[0]) / (yRange[1] - yRange[0]) * ctx.canvas.height;
  }



  return <BaseGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} drawCallback={draw}/>
}


export default {
  LineGraph: LineGraph
}
