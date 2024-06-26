import React, { useEffect } from "react";
import * as d3 from "d3";
import classnames from "classnames";
import drawAxis from "./axis";
import "./index.scss";

const ComparisonBaseChart = (drawChart, extraProps) => {
  function Chart(props) {
    const svgRef = React.createRef();
    const tooltipRef = React.createRef();
    const {
      chartTitle,
      axisProps,
      data,
      slug,
      containerId,
      svgProps,
      tooltipClass,
      scaleBandPadding,
      ...restProps
    } = props;
    const { tick } = axisProps;
    const { useScaleBands, findHoverData } = extraProps;

    const { margin, width, height, svgContainerClass } = svgProps;

    const yMinValue = d3.min(data, (d) => d.value);
    const yMaxValue = d3.max(data, (d) => d.value);

    const xMinValue = d3.min(data, (d) => d.label);
    const xMaxValue = d3.max(data, (d) => d.label);
    // (data);

    let xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    // .attr("transform", "rotate(-45)");

    if (useScaleBands.x) {
      xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.label))
        .padding(scaleBandPadding);
    }

    let yScale = d3.scaleLinear().range([height, 0]).domain([0, yMaxValue]);

    if (useScaleBands.y) {
      yScale = d3
        .scaleBand()
        .range([height, 0])
        .domain(data.map((d) => d.value))
        .padding(scaleBandPadding);
    }

    useEffect(() => {
      flushChart();
      draw();
    });

    function flushChart() {
      d3.select(svgRef.current).selectAll("*").remove();
    }

    function draw() {
      const svg = d3
        .select(svgRef.current)
        // .attr("width", width + margin.left + margin.right)
        .attr("width", "500px")
        .attr("height", 180)
        // .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + 20},${margin.top - 60})`);

      drawAxis({
        ...axisProps,
        ...svgProps,
        ...extraProps,
        data,
        svgRef,
        xScale,
        yScale,
      });

      drawChart({
        svgRef,
        tooltipRef,
        data,
        slug,
        xScale,
        yScale,
        ...svgProps,
        ...restProps,
      });
    }

    return (
      <div
        className="graph__upperdiv"
        style={{
          "align-items": "center",
          // "flex-direction": "column",
          display: "flex",
        }}
      >
        {" "}
        <span className="chartTitle" style={{ "margin-bottom": "6px" }}>
          {/* {chartTitle} */}
        </span>
        <div className="base__container" style={{ height: "180px" }}>
          <svg
            viewBox={`40 50 510 100`}
            ref={svgRef}
            className={classnames("base__svg-container bar-container-graph", svgContainerClass)}
          />
          <div
            className={classnames("base__tooltip", tooltipClass)}
            ref={tooltipRef}
          />
        </div>
        <div id={containerId} className="barChart"></div>
      </div>
    );
  }

  Chart.defaultProps = {
    scaleBandPadding: 0.4,
  };

  return Chart;
};
export default ComparisonBaseChart;
