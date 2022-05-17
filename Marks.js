import { line, curveNatural } from 'd3';
export const Marks = ({
  binnedData,
  yScale,
  xScale,
  xValue,
  yValue,
  innerHeight,
  tooltip,
  yearsDate,
  onMouseEnter,
  onMouseOut,
}) => (
  <g className="mark">
    {binnedData.map((d, i) => {
     
      return (
        <rect
          x={xScale(yearsDate[i])}
          y={yScale(yValue(d))}
          width={
            xScale(yearsDate[i]) -
            xScale(yearsDate[i - 1])
          }
          height={innerHeight - yScale(yValue(d))}
          onMouseEnter={() =>
            onMouseEnter([xValue(d), yValue(d),xScale(yearsDate[i])])
          }
          onMouseOut={() => onMouseOut(null)}
          class="bar"
          data-date={(xValue(d))}
          data-gdp={(yValue(d))}
        ></rect>
      );
    })}
  </g>
);
