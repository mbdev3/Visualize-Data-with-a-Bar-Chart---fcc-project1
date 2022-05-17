import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { useData } from "./useData";
import { AxisBottom } from "./axisBottom";
import { AxisLeft } from "./axisLeft";
import { Marks } from "./Marks";
import {
  csv,
  scaleLinear,
  max,
  min,
  format,
  extent,
  scaleTime,
  timeFormat,
  bin,
  timeMonths,
  sum,
  tip,
  tipOffsetScale,
  commaFormat,
  monthFormat,
  precisionPrefix,
} from "d3";

const width = window.innerWidth;
const height = window.innerHeight;
const margin = {
  top: 20,
  bottom: 100,
  right: 30,
  left: 110,
};

const App = () => {
  const data = useData();
  if (!data) {
    return <pre>loading..</pre>;
  }

  const xValue = (d) => d[0];
  const xAxisLabel = "Date";

  const yValue = (d) => d[1];

  const yAxisLabel = "GDP";

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  let yearsDate = data.map((d) => new Date(d[0]));
  // console.log(yearsDate);
  let xMax = new Date(max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  // console.log(xMax);
  const xScale = scaleTime()
    .domain([min(yearsDate), xMax])
    .range([0, innerWidth]);

  const [start, stop] = xScale.domain();
  const binnedData = bin()
    .value(xValue)
    .domain(xScale.domain())
    .thresholds(timeMonths(start, stop))(data)
    .map((array, i) => ({
      y: data[1].y,
      x0: array.x0,
      x1: array.x1,
    }));

  // console.log(xValue((d) => data(d)));

  // d['Total Dead and Missing'] = +d['Total Dead and Missing']
  //      d['Reported Date'] = new Date(d['Reported Date'] )

  const xAxisTickFormat = timeFormat("%Y");
  const toolTimeFormat = timeFormat(" %Y %B");
  const gdpFormat = format("s");
  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0]);

  const monthFormatting = (m) => {
    let regex = "-(.*?)-";
    let match = m.match(regex);
    if (match[1] === "01") {
      return m.substr(0, 4) + " Q1";
    }
    if (match[1] === "04") {
      return m.substr(0, 4) + " Q2";
    }
    if (match[1] === "07") {
      return m.substr(0, 4) + " Q3";
    }
    if (match[1] === "10") {
      return m.substr(0, 4) + " Q4";
    }
  };

  const gdpFormatting = (m) => {
    m = m * 1000000000;
    m = gdpFormat(m);
    if (m.includes("T")) {
      return m.replace("T", " Trillion USD");
    } else if (m.includes("G")) {
      return m.replace("G", " Billion USD");
    }
    return m;
  };
  const onMouseEnter = (e) => {
    tooldiv
      .style("visibility", "visible")
      .html(() => `${monthFormatting(e[0])}</br>${gdpFormatting(e[1])}`)
      .style("top", yScale(e[1]) + "px")
      .style("left", e[2] + "px")
      .attr("data-date", e[0])
      .on("mousemove", (e, d) => {
        tooldiv.style("top", 0).style("left", 0);
      });
  };
  const onMouseOut = (e) => {
    tooldiv.style("visibility", "hidden");
  };
  return (
    <>
      <div id="title">
        <h1>United States GDP chart</h1>
      </div>
      <div className="copyright">
        Made by
        <a href="https://thembdev.com">
          <img src={"https://mbdev-utils.s3.eu-west-3.amazonaws.com/mbdev_logo_sm.svg"} alt="mbdev" />
        </a>
      </div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g id="x-axis">
            <AxisBottom innerHeight={innerHeight} xScale={xScale} tickFormat={xAxisTickFormat} />
          </g>
          <g id="y-axis">
            <AxisLeft yScale={yScale} innerWidth={innerWidth} />
          </g>

          <text className="label" textAnchor="middle" x={innerWidth / 2} y={height - margin.bottom / 1.5}>
            {xAxisLabel}
          </text>
          <text
            className="label"
            textAnchor="middle"
            transform={`translate(${-margin.left / 1.5},${innerHeight / 2}) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <Marks
            binnedData={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            innerHeight={innerHeight}
            tooltip={(d) => d}
            yearsDate={yearsDate}
            onMouseEnter={(e) => onMouseEnter(e)}
            onMouseOut={(e) => onMouseOut(e)}
          />
        </g>
        <title>US GDP</title>
      </svg>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
