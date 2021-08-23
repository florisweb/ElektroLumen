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
  const axisMargin = 20;
  const nonAxisMargin = 15;
  
  const axisColor = '#999';
  const subAxisColor = '#ddd';
  const numberColor = '#666';
  const minLabelRoom = 20; //px

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

  const dy = yRange[1] - yRange[0];
  const dx = data.length;


  function draw(ctx) {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
    

    drawXAxis(ctx);
    drawYAxis(ctx);
    drawData(ctx);
  }

  function drawData(ctx) {
    let y = dataToYLoc(data[0], ctx);
    ctx.lineWidth = 1;
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
    let maxStepCount = Math.floor(ctx.canvas.width / minLabelRoom);
    const stepSize = getStepSize(maxStepCount, dx);

    ctx.lineWidth = 1;
    ctx.strokeStyle = axisColor;
    let y = dataToYLoc(0, ctx);
    
    ctx.beginPath();
    ctx.moveTo(axisMargin, y);
    ctx.lineTo(ctx.canvas.width, y);
    
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = .5;
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle"; 
    for (let x = 0; x < data.length + stepSize; x += stepSize)
    {
      ctx.strokeStyle = subAxisColor;
      let xLoc = indexToXLoc(x, ctx);
      ctx.beginPath();
      ctx.moveTo(xLoc, 0);
      ctx.lineTo(xLoc, ctx.canvas.height - axisMargin);
      
      ctx.closePath();
      ctx.stroke();

      if (x === 0) continue;
      ctx.fillStyle = numberColor;
      ctx.fillText(x, xLoc, ctx.canvas.height - axisMargin / 2);
      ctx.fill();
    }

  }

  function drawYAxis(ctx) {
    let maxStepCount = Math.floor(ctx.canvas.height / minLabelRoom);
    const stepSize = getStepSize(maxStepCount, dy);
    
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(axisMargin, 0);
    ctx.lineTo(axisMargin, ctx.canvas.height - axisMargin);
    
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = .5;
    ctx.textAlign = 'right';
    ctx.textBaseline = "middle"; 
    for (let y = 0; y < yRange[1] + stepSize; y += stepSize)
    {
      ctx.strokeStyle = subAxisColor;
      let yLoc = dataToYLoc(y, ctx);
      ctx.beginPath();
      ctx.moveTo(axisMargin, yLoc);
      ctx.lineTo(ctx.canvas.width, yLoc);
      
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = numberColor;
      ctx.fillText(y, axisMargin - 5, yLoc);
      ctx.fill();
    }
  }

  function indexToXLoc(_index, ctx) {
    return _index / (data.length - 1) * (ctx.canvas.width - axisMargin - nonAxisMargin) + axisMargin;
  }
  function dataToYLoc(_value, ctx) {
    let perc = (_value - yRange[0]) / (yRange[1] - yRange[0]);
    return (ctx.canvas.height - axisMargin) - perc * (ctx.canvas.height - axisMargin - nonAxisMargin);
  }

  function getStepSize(_maxSteps, _delta) {
    const stepOptions = [.01, .05, .1, .5, 1, 5, 10, 20, 50, 100, 200, 500, 1000];
    for (let i = 0; i < stepOptions.length; i++)
    {
      let steps = _delta / stepOptions[i];
      if (steps > _maxSteps) continue;
      return stepOptions[i];
    }

    return stepOptions[stepOptions.length - 1];
  }



  return <BaseGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} drawCallback={draw}/>
}


export default {
  LineGraph: LineGraph
}
