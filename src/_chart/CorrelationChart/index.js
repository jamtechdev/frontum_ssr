import { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./index.css";
import { calculateNextStep } from "../utils/calculateTickStepCorrelation";
import useScreenSize from "@/_helpers/useScreenSize";

function CorrelationChart(props) {
  const {
    data: correlationChartData,
    height,
    width,
    chartTitle,
    xLabel,
    yLabel,
    xTick,
    yTick,
    xUnit,
    yUnit,
    xTitle,
    yTitle,
    isGeneralAttribute_x,
    isGeneralAttribute_y,
    rangeMinX,
    rangeMaxX,
    rangeMinY,
    rangeMaxY,
  } = props;

  // (correlationChartData);

  const svgContainer = useRef();
  let maxY = rangeMaxY ?? d3.max(correlationChartData.map((d) => Number(d.y)));
  let minY = rangeMinY ?? d3.min(correlationChartData.map((d) => Number(d.y)));
  let maxX = rangeMaxX ?? d3.max(correlationChartData.map((d) => Number(d.x)));
  let minX = rangeMinX ?? d3.min(correlationChartData.map((d) => Number(d.x)));
  let x_tick = xTick;
  let y_tick = yTick;

  if (isGeneralAttribute_x) {
    minX = 1;
    maxX = 10;
    x_tick = 10;
  }
  if (isGeneralAttribute_y) {
    minY = 1;
    maxY = 10;
    y_tick = 10;
  }
  function tickValuesAdujst(start, end, noOfTicks, increment) {
    let ticks = [];
    let tempTick = [];
    let nextTickVal = start;
    let steps = noOfTicks;

    while (steps >= 0 && nextTickVal <= end) {
      tempTick.push(nextTickVal);
      nextTickVal += increment;
      steps--;
    }

    if (tempTick.length < noOfTicks) {
      tempTick.push(nextTickVal);
    }

    let tickValNeedToBeAppend = noOfTicks - tempTick.length;
    let tickValNeedToBeAppendFront = 0;
    let tickValNeedToBeAppendEnd = 0;

    if (tickValNeedToBeAppend > 0) {
      tickValNeedToBeAppendFront = Math.ceil(tickValNeedToBeAppend / 2);
      tickValNeedToBeAppendEnd =
        tickValNeedToBeAppend - tickValNeedToBeAppendFront;
    }

    let frontTick = [];
    let endTick = [];

    for (let i = tickValNeedToBeAppendFront; i > 0; i--) {
      frontTick.push(i * increment);
    }
    for (let i = 1; i <= tickValNeedToBeAppendEnd; i++) {
      endTick.push(i * increment);
    }

    let tempStartTick = tempTick[0];
    let tempEndTick = tempTick[tempTick.length - 1];

    for (let i = 0; i < noOfTicks; i++) {
      if (i <= frontTick.length - 1) {
        ticks[i] = Number(Math.abs(frontTick[i] - tempStartTick).toFixed(2));
      } else if (i > frontTick.length + tempTick.length - 1) {
        ticks[i] = Number(
          (
            endTick[i - (frontTick.length + tempTick.length)] + tempEndTick
          ).toFixed(2)
        );
      } else {
        ticks[i] = Number(tempTick[i - frontTick.length].toFixed(2));
      }
    }

    return { ticks };
  }

  // here Update x and y axios label based on xLabel and yLabel value

  let yLabelValue = {};
  if (yLabel) {
    yLabelValue = {
      ticks: yLabel,
    };
  } else {
    let yLabelValue = tickValuesAdujst(minY, maxY, y_tick, yStep);
  }

  let xLabelValue = {};
  if (xLabel) {
    xLabelValue = {
      ticks: xLabel,
    };
  } else {
    let xLabelValue = tickValuesAdujst(minX, maxX, x_tick, xStep);
  }
  // end Update x and y axios label

  const margin = { top: 40, right: 35, bottom: 40, left: 35 };
  const { nextStepVal: yStep } = calculateNextStep(maxY, minY, y_tick);
  const { ticks: yTickValues } = yLabelValue;
  const { nextStepVal: xStep } = calculateNextStep(maxX, minX, x_tick);
  const { ticks: xTickValues } = xLabelValue;
  useEffect(() => {
    drawChart();
  }, [correlationChartData]);

  function drawChart() {
    d3.select(svgContainer.current).select("svg").remove();
    const isMobileScreen = window.innerWidth <= 768;
    // alert(isMobileScreen)
    // Remove the old tooltip
    d3.select(svgContainer.current).select(".tooltip").remove();
    const translateX = margin.left + 15;
    const svg = d3
      .select(svgContainer.current)
      .append("svg")
      // .attr("width", "520px !important")
      .attr("height", 250)
      // .attr("viewBox", isMobileScreen ? "15 0 410 400" : "0 150 400  210")
      .attr("viewBox", isMobileScreen ? "-20 150 500 60" : "-20 150 500 60")
      .append("g")
      .style("background-color", "#fff")
      .attr("transform", "translate(" + translateX + "," + margin.top + ")");

    //add tooltip
    const tooltip = d3
      .select(svgContainer.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height - margin.top - margin.bottom)
      .attr("width", width - margin.left - margin.right)
      .style("fill", "#fff");

    // Add X axis
    const xScale = d3
      .scaleLinear()
      .domain([xTickValues[0], xTickValues[xTickValues.length - 1]])
      .range([margin.left, width - margin.right]);

    const translateXaxis = {
      y: height - margin.top - margin.bottom,
      x: -margin.left,
    };

    const xAxisGroups = svg
      .append("g")
      .attr("transform", `translate(${translateXaxis.x},${translateXaxis.y})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(xTickValues)
          .tickFormat(customTickFormatXaxis)
          .tickSize(-(height - margin.top - margin.bottom))
      );
    xAxisGroups
      .selectAll("text")
      .attr("x", 0) // Adjust the horizontal position
      .attr("y", 10); // Adjust the vertical position

    //Add Y axis
    const yScale = d3
      .scaleLinear()
      .domain([yTickValues[0], yTickValues[yTickValues.length - 1]])
      .range([height - margin.top, margin.bottom]);

    const translateYaxis = {
      y: -margin.top,
      x: 0,
    };

    const yAxisGroups = svg
      .append("g")
      .attr("transform", `translate(${translateYaxis.x},${translateYaxis.y})`)
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(customTickFormaYaxis)
          .tickValues(yTickValues)
          .tickSize(-(width - margin.left - margin.right))
      );
    yAxisGroups
      .selectAll("text")
      .attr("x", -10) // Adjust the horizontal position
      .attr("y", 0); // Adjust the vertical position

    svg.selectAll(".tick line").attr("stroke", "rgba(39, 48, 78, 0.1)");
    svg.selectAll("path").attr("display", "none");

    //x axis label
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", (width - margin.left) / 2)
      .attr("y", height - margin.top + 20)
      //.attr("transform", "rotate(-90)")
      .text(xTitle);

    //y axis label
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", -40)
      .attr("y", -20)
      .attr("transform", "rotate(0)")
      .text(yTitle);

    //plot graph
    // Add dots
    const dotGroups = svg
      .append("g")
      .selectAll("dot")
      .data(correlationChartData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.x) - margin.left;
      })
      .attr("cy", function (d) {
        return yScale(d.y) - margin.top;
      })
      .attr("r", 7)
      .attr("class", "hover-effect")
      .style("fill", "#437ECE")
      .on("mouseover", (e, data) => {
        tooltip
          .transition()
          .duration(300)
          .style("opacity", 1)
          .style("display", "inline-block");
        tooltip
          .html(
            `<div class="tooltip-font">
            <span style="margin-right:4px">
            ${data.x} ${xUnit} , ${data.y} ${yUnit}
            </span>
            <span>${data.name ? `(${data.name})` : ""}</span></div>`
          )
          .style("left", e.clientX - 20 + "px")
          .style("top", e.clientY - 50 + "px");
      })
      .on("mouseout", () => {
        tooltip
          .transition()
          .duration(300)
          .style("opacity", 0)
          .style("display", "none");
      });

    function customTickFormaYaxis(d) {
      if (!Number.isInteger(d)) {
        const formateFunction = d3.format(".0f");
        return `${formateFunction(d)} ${yUnit}`;
      } else {
        const formateFunction = d3.format(".0f");
        return `${formateFunction(d)} ${yUnit}`;
      }
    }
    function customTickFormatXaxis(d) {
      if (!Number.isInteger(d)) {
        const formateFunction = d3.format(".0f");
        return `${formateFunction(d)} ${xUnit}`;
      } else {
        const formateFunction = d3.format(".0f");
        return `${formateFunction(d)} ${xUnit}`;
      }
    }
  }
  return (
    <div
      style={{
        "align-items": "center",
        "flex-direction": "column",
        display: "flex",
        padding: " 0px",
        "margin-top": "8%",
        "margin-bottom": "3%",
        "margin-left": " -15px",
        "margin-right": "-15px",
      }}
    >
      <span
        style={{ "max-width": width, "text-align": "center" }}
        className="chartTitle"
      >
        {chartTitle}
      </span>
      <div
        className="correlation_svg_width"
        ref={svgContainer}
        style={{ "background-color": "#fff" }}
      ></div>
    </div>
  );
}
export default CorrelationChart;
