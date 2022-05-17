export const AxisBottom = ({
  xScale,
  innerHeight,
  tickFormat
}) =>
  xScale.ticks().map((tickValue) => {
    console.log(tickValue)
    
    return <g className = "tick"
      key={tickValue}
      transform={`translate(${xScale(
        tickValue
      )},0)`}
    >
      <line y2={innerHeight}  />
      <text
        style={{ textAnchor: 'middle' }}
        y={innerHeight + 5}
        dy="0.71rem"
      >
        {tickFormat(tickValue)}
      </text>
    </g>
  });
