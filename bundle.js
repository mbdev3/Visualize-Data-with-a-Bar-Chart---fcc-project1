(function (React$1, ReactDOM, d3) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  var jsonUrl ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

  var useData = function (){
  var ref = React$1.useState(null);
  var data = ref[0];
  var setData = ref[1];
    if(data){
      console.log(data[0]);
    }

    React$1.useEffect(function () {
      d3.json(jsonUrl).then(function (data){ return data.data; } ).then(setData);
    }, []);
  return data
  };

  var AxisBottom = function (ref) {
      var xScale = ref.xScale;
      var innerHeight = ref.innerHeight;
      var tickFormat = ref.tickFormat;

      return xScale.ticks().map(function (tickValue) {
      console.log(tickValue);
      
      return React.createElement( 'g', { className: "tick", key: tickValue, transform: ("translate(" + (xScale(
          tickValue
        )) + ",0)") },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', {
          style: { textAnchor: 'middle' }, y: innerHeight + 5, dy: "0.71rem" },
          tickFormat(tickValue)
        )
      )
    });
  };

  d3.format('.2s');
  var AxisLeft = function (ref) {
      var yScale = ref.yScale;
      var innerWidth = ref.innerWidth;

      return yScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', {
        className: "tick", transform: ("translate(0," + (yScale(
          tickValue
        )) + ")") },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -5, dy: ".32em" },
          (tickValue )
        )
      )
    ); });
  };

  var Marks = function (ref) {
    var binnedData = ref.binnedData;
    var yScale = ref.yScale;
    var xScale = ref.xScale;
    var xValue = ref.xValue;
    var yValue = ref.yValue;
    var innerHeight = ref.innerHeight;
    ref.tooltip;
    var yearsDate = ref.yearsDate;
    var onMouseEnter = ref.onMouseEnter;
    var onMouseOut = ref.onMouseOut;

    return (
    React.createElement( 'g', { className: "mark" },
      binnedData.map(function (d, i) {
       
        return (
          React.createElement( 'rect', {
            x: xScale(yearsDate[i]), y: yScale(yValue(d)), width: xScale(yearsDate[i]) -
              xScale(yearsDate[i - 1]), height: innerHeight - yScale(yValue(d)), onMouseEnter: function () { return onMouseEnter([xValue(d), yValue(d),xScale(yearsDate[i])]); }, onMouseOut: function () { return onMouseOut(null); }, class: "bar", 'data-date': (xValue(d)), 'data-gdp': (yValue(d)) })
        );
      })
    )
  );
  };

  var width = window.innerWidth;
  var height = window.innerHeight;
  var margin = {
    top: 20,
    bottom: 100,
    right: 30,
    left: 110,
  };

  var App = function () {
    var data = useData();
    if (!data) {
      return React__default["default"].createElement( 'pre', null, "loading.." );
    }

    var xValue = function (d) { return d[0]; };
    var xAxisLabel = "Date";

    var yValue = function (d) { return d[1]; };

    var yAxisLabel = "GDP";

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var yearsDate = data.map(function (d) { return new Date(d[0]); });
    // console.log(yearsDate);
    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    // console.log(xMax);
    var xScale = d3.scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, innerWidth]);

    var ref = xScale.domain();
    var start = ref[0];
    var stop = ref[1];
    d3.bin()
      .value(xValue)
      .domain(xScale.domain())
      .thresholds(d3.timeMonths(start, stop))(data)
      .map(function (array, i) { return ({
        y: data[1].y,
        x0: array.x0,
        x1: array.x1,
      }); });

    // console.log(xValue((d) => data(d)));

    // d['Total Dead and Missing'] = +d['Total Dead and Missing']
    //      d['Reported Date'] = new Date(d['Reported Date'] )

    var xAxisTickFormat = d3.timeFormat("%Y");
    d3.timeFormat(" %Y %B");
    var gdpFormat = d3.format("s");
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .range([innerHeight, 0]);

    var monthFormatting = function (m) {
      var regex = "-(.*?)-";
      var match = m.match(regex);
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

    var gdpFormatting = function (m) {
      m = m * 1000000000;
      m = gdpFormat(m);
      if (m.includes("T")) {
        return m.replace("T", " Trillion USD");
      } else if (m.includes("G")) {
        return m.replace("G", " Billion USD");
      }
      return m;
    };
    var onMouseEnter = function (e) {
      tooldiv
        .style("visibility", "visible")
        .html(function () { return ((monthFormatting(e[0])) + "</br>" + (gdpFormatting(e[1]))); })
        .style("top", yScale(e[1]) + "px")
        .style("left", e[2] + "px")
        .attr("data-date", e[0])
        .on("mousemove", function (e, d) {
          tooldiv.style("top", 0).style("left", 0);
        });
    };
    var onMouseOut = function (e) {
      tooldiv.style("visibility", "hidden");
    };
    return (
      React__default["default"].createElement( React__default["default"].Fragment, null,
        React__default["default"].createElement( 'div', { id: "title" },
          React__default["default"].createElement( 'h1', null, "United States GDP " )
        ),
        React__default["default"].createElement( 'div', { className: "copyright" }, "Made by ", React__default["default"].createElement( 'a', { href: "https://thembdev.com" },
            React__default["default"].createElement( 'img', { src: "https://mbdev-utils.s3.eu-west-3.amazonaws.com/mbdev_logo_sm.svg", alt: "mbdev" })
          )
        ),
        React__default["default"].createElement( 'svg', { width: width, height: height },
          React__default["default"].createElement( 'g', { transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default["default"].createElement( 'g', { id: "x-axis" },
              React__default["default"].createElement( AxisBottom, { innerHeight: innerHeight, xScale: xScale, tickFormat: xAxisTickFormat })
            ),
            React__default["default"].createElement( 'g', { id: "y-axis" },
              React__default["default"].createElement( AxisLeft, { yScale: yScale, innerWidth: innerWidth })
            ),

            React__default["default"].createElement( 'text', { className: "label", textAnchor: "middle", x: innerWidth / 2, y: height - margin.bottom / 1.5 },
              xAxisLabel
            ),
            React__default["default"].createElement( 'text', {
              className: "label", textAnchor: "middle", transform: ("translate(" + (-margin.left / 1.5) + "," + (innerHeight / 2) + ") rotate(-90)") },
              yAxisLabel
            ),
            React__default["default"].createElement( Marks, {
              binnedData: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, innerHeight: innerHeight, tooltip: function (d) { return d; }, yearsDate: yearsDate, onMouseEnter: function (e) { return onMouseEnter(e); }, onMouseOut: function (e) { return onMouseOut(); } })
          )
        )
      )
    );
  };

  var rootElement = document.getElementById("root");
  ReactDOM__default["default"].render(React__default["default"].createElement( App, null ), rootElement);

})(React, ReactDOM, d3);
//# sourceMappingURL=bundle.js.map
