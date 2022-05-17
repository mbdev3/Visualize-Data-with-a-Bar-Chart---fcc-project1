import { format } from 'd3';
const gdpFormat = format('.2s');
export const AxisLeft = ({
  yScale,
  innerWidth,
}) =>
  yScale.ticks().map((tickValue) => (
    <g
      className="tick"
      transform={`translate(0,${yScale(
        tickValue
      )})`}
    >
      <line x2={innerWidth} />
      <text
        key={tickValue}
        style={{ textAnchor: 'end' }}
        x={-5}
        dy=".32em"
      >
        {(tickValue )}
      </text>
    </g>
  ));
