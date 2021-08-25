import '../css/dataVisualizer.css';
import React, { useRef, useEffect, componentDidUpdate } from 'react'

const Colors = [
  '#f00',
  '#0f0',
  '#00f',
  '#fa0',
  '#af0',
  '#0fa',
];


function Canvas(props) {
  let drawHandler = props.draw;
  const canvasRef = useRef(null);
  useEffect(() => {update();});

  function update() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    drawHandler(ctx);
  }

  return <canvas ref={canvasRef}/>
}








function BaseGraph({xAxisTag, yAxisTag, drawCallback = function() {}}) {
  return (
    <div className='DV GraphHolder'> 
      <div className='AxisText xAxisTag'>{xAxisTag}</div>
      <div className='yAxisTagHolder'>
        <div className='AxisText yAxisTag'>{yAxisTag}</div>
      </div>
      <Canvas draw={drawCallback} ctx={window.ctx}></Canvas>
    </div>
  )
}

export function LineGraph({xAxisTag, yAxisTag, lines, yRange, controlObject}) {
  console.log('create lineGraph', ...arguments);

  const yLabelMargin = 20;
  const xLabelMargin = 15;
  const nonAxisMargin = 15;
  
  const axisColor = '#999';
  const subAxisColor = '#ddd';
  const numberColor = '#666';
  const minLabelRoom = 20; //px

  if (!yRange) yRange = calcRange(lines, 1);
  let xRange = calcRange(lines, 0);
  console.log('range', xRange, yRange);

  const dy = yRange[1] - yRange[0];
  const dx = xRange[1] - xRange[0]


  function draw(ctx) {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;

    drawXAxis(ctx);
    drawYAxis(ctx);

    if (!lines[0]) return;
    if (typeof lines[0] != 'object') return drawLine(ctx, lines);
    for (let i = 0; i < lines.length; i++)
    {
      drawLine(ctx, lines[i], Colors[i]);
    }
  }



  function drawLine(ctx, _data, _lineColor = '#f00') {
    if (!_data[0]) return;
    let x = indexToXLoc(_data[0][0], ctx);
    let y = dataToYLoc(_data[0][1], ctx);

    ctx.lineWidth = 1;
    ctx.strokeStyle = _lineColor;
    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1; i < _data.length; i++)
    {
      let x = indexToXLoc(_data[i][0], ctx);
      let y = dataToYLoc(_data[i][1], ctx);
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
    if (typeof y == 'number')
    {
      ctx.beginPath();
      ctx.moveTo(yLabelMargin, y);
      ctx.lineTo(ctx.canvas.width, y);
      
      ctx.closePath();
      ctx.stroke();
    } else y = ctx.canvas.height - nonAxisMargin;

    ctx.lineWidth = .5;
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle"; 
    for (let x = Math.floor(xRange[0] / stepSize) * stepSize; x < xRange[1] + stepSize; x += stepSize)
    {
      ctx.strokeStyle = subAxisColor;
      let xLoc = indexToXLoc(x, ctx);
      ctx.beginPath();
      ctx.moveTo(xLoc, 0);
      ctx.lineTo(xLoc, ctx.canvas.height - xLabelMargin);
      
      ctx.closePath();
      ctx.stroke();

      if (x === 0) continue;
      let labelText = String(x).substr(0, 4);
      if (x > 1000000000)
      {
        let date = new Date();
        date.setTime(x * 1000);
        labelText = date.getSeconds();
      }

      ctx.fillStyle = numberColor;
      ctx.fillText(labelText, xLoc, y + xLabelMargin * .5);
      ctx.fill();
    }
  }

  function drawYAxis(ctx) {
    let maxStepCount = Math.floor(ctx.canvas.height / minLabelRoom);
    const stepSize = getStepSize(maxStepCount, dy);
    
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(yLabelMargin, 0);
    ctx.lineTo(yLabelMargin, ctx.canvas.height - xLabelMargin);
    
    ctx.closePath();
    ctx.stroke();

    ctx.lineWidth = .5;
    ctx.textAlign = 'right';
    ctx.textBaseline = "middle"; 
    for (let y = Math.floor(yRange[0] / stepSize) * stepSize; y < yRange[1] + stepSize; y += stepSize)
    {
      ctx.strokeStyle = subAxisColor;
      let yLoc = dataToYLoc(y, ctx);
      if (typeof yLoc != 'number') continue;
      ctx.beginPath();
      ctx.moveTo(yLabelMargin, yLoc);
      ctx.lineTo(ctx.canvas.width, yLoc);
      
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = numberColor;
      ctx.fillText(String(y).substr(0, 4), yLabelMargin - 5, yLoc);
      ctx.fill();
    }
  }

  function indexToXLoc(_index, ctx) {
    let perc = (_index - xRange[0]) / (xRange[1] - xRange[0]);
    if (perc < 0 || perc > 1.1) return false;
    return perc * (ctx.canvas.width - yLabelMargin - nonAxisMargin) + yLabelMargin;
  }
  function dataToYLoc(_value, ctx) {
    let perc = (_value - yRange[0]) / (yRange[1] - yRange[0]);
    if (perc < 0 || perc > 1.1) return false;
    return (ctx.canvas.height - xLabelMargin) - perc * (ctx.canvas.height - xLabelMargin - nonAxisMargin);
  }

  function getStepSize(_maxSteps, _delta) {
    const stepOptions = [.01, .02, .05, .1, .2, .5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000];
    for (let i = 0; i < stepOptions.length; i++)
    {
      let steps = _delta / stepOptions[i];
      if (steps > _maxSteps) continue;
      return stepOptions[i];
    }

    return stepOptions[stepOptions.length - 1];
  }


  function calcRange(_data, _rangeIndex) {
    let min = Infinity;
    let max = -Infinity;

    if (typeof _data[0] != 'object') return calcRangePerDataSet(_data, _rangeIndex);
    for (let lineData of _data)
    {
      let range = calcRangePerDataSet(lineData, _rangeIndex);
      if (range[0] < min) min = range[0];
      if (range[1] > max) max = range[1];
    }
    return [min, max];
  }
    function calcRangePerDataSet(_data, _rangeIndex) {
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < _data.length; i++)
      {
        if (min > _data[i][_rangeIndex]) min = _data[i][_rangeIndex];
        if (max < _data[i][_rangeIndex]) max = _data[i][_rangeIndex];
      }
      return [min, max];
    }




  return <BaseGraph xAxisTag={xAxisTag} yAxisTag={yAxisTag} drawCallback={draw}/>
}


export default {
  LineGraph: LineGraph
}
