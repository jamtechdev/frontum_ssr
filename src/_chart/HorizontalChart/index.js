import { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./index.css";
import formatValue from "@/_helpers/formatValue";

function HorizontalChart(props) {
  const {
    data,
    height,
    width,
    chartTitle,
    xUnit,
    yUnit,
    rectBarWidth,
    rectBarPadding,
  } = props;
  const svgContainer = useRef();
  const colors = [
    "#658fde",
    "#6d9dec",
    "#7caaef",
    "#8eb9f1",
    "#abcdf6",
    "#c9e0fa",
  ];
  const margin = { top: 20, right: 30, bottom: 20, left: 450 };

  const newWidth = width - margin.left - margin.right;
  const newHeight = calculateHeight(
    height,
    rectBarWidth,
    rectBarPadding,
    data.length
  );
  // (data)
  const barpadding = rectBarPadding / (rectBarWidth + rectBarPadding) ?? 0.5;
  const minValue = d3.min(data, (d) => d.value);
  const maxValue = d3.max(data, (d) => d.value);
  const opacities = uniformallyDistributeBaropacity(data);

  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    d3.select(svgContainer.current).select("svg").remove();
    const isMobileScreen = window.innerWidth <= 768;

    const svg = d3
      .select(svgContainer.current)
      .append("svg")
      .attr(
        "viewBox",
        `${
          isMobileScreen
            ? `320  0 340 ${newHeight + margin.top + margin.bottom}`
            : `320  0 340 ${newHeight + margin.top + margin.bottom}`
        }`
      )
      // .attr("width", `${newWidth + margin.left + margin.right}`+"px !important")
      .attr("height", newHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //setting scaling
    const xScale = d3.scaleLinear().domain([0, maxValue]).range([0, newWidth]);
    svg
      .append("g")
      .attr("transform", "translate(0," + newHeight + ")")
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const yScale = d3
      .scaleBand()
      .range([0, newHeight])
      .domain(
        data.map(function (d) {
          return d.label;
        })
      )
      .padding(barpadding);

    svg
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(formateYaxisLabel)
          .tickSizeOuter(0)
          .tickSizeInner(0)
      )
      .attr("class", "y-axis-tick");

    svg
      .selectAll("myRect")
      .data(data)
      .join("rect")
      .attr("x", xScale(0))
      .attr("y", (d) => yScale(d.label))
      .attr("width", (d) => xScale(d.value) - 20)
      .attr("height", yScale.bandwidth())
      .attr("fill", "#4B90E1")
      .attr("class", "rect-size")
      .style("opacity", (d, i) => {
        return opacities[i] / 100;
      });

    svg
      .selectAll(".span-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", function (d, i) {
        return xScale(d.value); // Adjust horizontal positioning
      })
      .attr("y", function (d) {
        return yScale(d.label) + 5 + yScale.bandwidth() / 2; // Adjust vertical positioning 
      })
      .text(function (d) {
        return d.value ? `${d.value} ${xUnit}` : "";
      });

    svg.select("path").style("display", "none");
  }

  function formateYaxisLabel(d, i) {
    return `${i + 1}. ${d}`;
  }

  function uniformallyDistributeBaropacity(data) {
    const opacities = [];
    const totalBars = data.length;

    // if all values are same, set opacity to 100 and return the array
    const firstBarValue = data[0].value;
    const similarMatchesCount = data.filter(
      (data) => data.value === firstBarValue
    )?.length;

    if (similarMatchesCount == totalBars) {
      return [...Array(totalBars)].fill(100);
    }

    opacities.push(100);

    for (let i = 1; i < totalBars - 1; i++) {
      if (data[i].value == data[i - 1].value) {
        opacities.push(opacities[i - 1]);
      } else {
        const opacity = 100 - (i / (totalBars - 1)) * 80;
        opacities.push(Math.round(opacity));
      }
    }

    if (data[totalBars - 1]?.value == data[totalBars - 2]?.value) {
      opacities[totalBars - 2] = 20;
      opacities.push(20);
    } else {
      opacities.push(20);
    }

    return opacities;
  }

  function calculateHeight(actualHeight, width, padding, totalRectBar) {
    let newHeight = actualHeight;
    if (totalRectBar > 0) {
      newHeight = Number(totalRectBar) * (Number(width) + Number(padding));
    }
    return newHeight;
  }
  return (
    <div
      style={{
        "align-items": "center",
        "flex-direction": "column",
        display: "flex",
      }}
    >
      <span
        style={{
          "max-width": width,
          "text-align": "center",
          "margin-bottom": "-30px",
        }}
        className="chartTitle"
      >
        {chartTitle}
      </span>
      <div ref={svgContainer} style={{ width: `305px` }}></div>
    </div>
  );
}

export default HorizontalChart;
