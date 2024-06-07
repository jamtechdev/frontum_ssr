import React, { useEffect } from "react";
import { select, scaleLinear, line } from "d3";
import * as d3 from "d3";
import "./index.css";

function ProductPageGraph({ data, activeTab }) {
  // (props, "neet");
  // (JSON.stringify(data), "neet");

  const margin = { top: 20, right: 10, bottom: 60, left: 10 };
  const width = 490 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  // const data = [
  //   {
  //     "Total": 5.71,
  //     "Battery": 3.81,
  //     "Cleaning": 5.03,
  //     "Mopping": 1.21,
  //     "Navigation": 1.25,
  //     "Design": 4.05,
  //     "control&Mooping": 1.21,
  //   },
  //   {
  //     "Total": 3.12,
  //     "Battery": 3.23,
  //     "Cleaning": 4.15,
  //     "Mopping": 1.5,
  //     "Navigation": 1.15,
  //     "Design": 4.77,
  //   },
  // ];

  const capitalize = (str) => {
    if (str && str.length > 0) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      return "";
    }
  };
  useEffect(() => {
    const svgContainer = select("#productGraph");
    // Select all SVG elements inside the container
    const svgElements = svgContainer.selectAll("svg");
    // Filter out the SVG elements you want to remove
    const svgToRemove = svgElements.filter((d, i) => i === 0); // Keep only the first SVG element, remove the rest
    // Remove the SVG elements
    svgToRemove.remove();

    // Continue with your D3.js code for the remaining SVG element...
  }, []);

  useEffect(() => {
    const isMobileScreen = window.innerWidth <= 768;
    const svg = select("#productGraph")
      .append("svg")
      .attr("viewBox", `0 0 470 450`)
      // .attr("width", width + margin.left + margin.right)
      .attr("width", 490)
      .attr("height", 420)
      // .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("fill", "gray");

    const attributes = Object?.keys(data[0]);

    const radius = 150;

    const min = 0;
    const max = 10;

    const radAxis = scaleLinear().domain([min, max]).range([0, radius]);
    const cordForAngle = (angle, len) => {
      const x = Math.cos(angle - Math.PI / 1) * len;
      const y = Math.sin(angle - Math.PI / 1) * len;
      return { x, y };
    };
    const tooltip = d3
      .selectAll(`.graph-tab-content`)
      .append("div")
      .attr("class", "tooltip")
      .style("display", "none");

    for (let i = 0; i < attributes.length; i++) {
      const slice = Math.PI / 2 + (2 * Math.PI * i) / attributes.length;
      const key = attributes[i];
      // (key)
      const { x, y } = cordForAngle(slice, radius);
      // Calculate the center position of the line
      const lineCenterX = x + width / 2;
      const lineCenterY = y + height / 2;
      // Append the line
      svg
        .append("line")
        .attr("x2", lineCenterX)
        .attr("y2", lineCenterY)
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("stroke", "#dedede")
        .attr("stroke-width", 1.5)
        .style("opacity", "0.5");

      // Append the text

      // Append the text
      const textDistance = -30;
      const textX = lineCenterX + textDistance * Math.cos(slice) + 20.5;
      const textY = lineCenterY + textDistance * Math.sin(slice) + 5;
      svg
        .append("text")

        .attr("x", textX)
        .attr("y", textY)
        .text(capitalize(key))
        .style(
          "text-anchor",
          slice < (Math.PI * 3.9) / 3.2 && slice > Math.PI / 2
            ? "middle"
            : "end"
        ) // Center the text horizontally
        .attr("dy", "0.5em")
        .attr("dy", (d) => {
          const textHeight = 5; // Approximate text height for vertical centering
          return i % 2 === 0 ? "0.5em" : `${-textHeight / 10}px`; // Adjust vertical position
        })
        .attr("fill", "gray");
    }
    const numTicks = 10; // Number of ticks
    const tickIncrement = (max - min) / (numTicks - 1); // Calculate the tick increment
    const ticks = Array.from(
      { length: numTicks },
      (_, index) => min + tickIncrement * index
    ); // Generate an array of ticks

    ticks.forEach((el) => {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - radAxis(el) - 0.85)

        .attr("fill", "black")
        .attr("stroke", "none")
        .attr("opacity", "0.5")
        .style("text-anchor", "middle")
        .style("font-size", "0.825rem");
    });

    ticks.forEach((el) => {
      svg
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "none")
        .attr("stroke", "#D3D3D3")
        .attr("stroke-width", 1.0)
        .attr("r", radAxis(el));
    });

    const lineGen = line()
      .x((d) => d.x)
      .y((d) => d.y);
    const getCoordPath = (dataPoint) => {
      let coord = [];
      for (let i = 0; i < attributes.length; i++) {
        let attr = attributes[i];
        let angle = Math.PI / 2 + (2 * Math.PI * i) / attributes.length;
        let { x, y } = cordForAngle(angle, radAxis(dataPoint[attr]));
        coord.push({ x, y, value: dataPoint[attr], attribute: attr });
      }
      return coord;
    };

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      // (i);
      const cord = getCoordPath(d);
      // (activeTab, i , "neetxy")

      svg
        .append("path")
        .datum(cord)
        .attr("class", `areapath${i}`)

        .attr("d", lineGen)
        .attr("stroke-width", "1.5px")
        .attr("stroke", () =>
          data?.length > 2
            ? i === 0
              ? "#437ECE"
              : i === 1
              ? "#FF8F0B"
              : "#28A28C"
            : i === 0
            ? "#437ECE"
            : "#FF8F0B"
        )
        .attr("fill", () =>
          data?.length > 2
            ? i === 0
              ? "#fff"
              : i === 1
              ? "#FF8F0B"
              : "#28A28C"
            : i === 0
            ? "#437ECE"
            : "#FF8F0B"
        )
        .attr("opacity", activeTab == i ? 0.9 : 0.1)
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .style("pointer-events", activeTab === 0 ? "none" : "all");
      // .style("display", activeTab == i ? "block" : "none");
      cord.forEach((point, index) => {
        svg
          .append("circle")
          .attr("cx", point.x + width / 2)
          .attr("cy", point.y + height / 2)
          .attr("r", 5)
          .style("display", activeTab == i ? "block" : "none")
          .style("z-index", activeTab == i ? 99999 : 2)
          .style(
            "stroke",
            data?.length > 2
              ? i === 0
                ? "#437ECE"
                : i === 1
                ? "#FF8F0B"
                : "#28A28C"
              : i === 0
              ? "#437ECE"
              : "#FF8F0B"
          )
          .style("fill", "white")
          .attr("opacity", 1)
          .attr("class", `data-point${i}`)
          .attr("data-value", point.value)
          .attr("data-attribute", point.attribute)
          .on("mouseover", function (event, d) {
            const value = select(this).attr("data-value");
            const hoverClass = d3.select(this).attr("class");
            let backgroundColor = "";

            if (hoverClass === "data-point0") {
              backgroundColor = "#437ECE";
            } else if (hoverClass === "data-point1") {
              backgroundColor = "#ff8f0b";
            } else {
              backgroundColor = "#28A28C";
            }
            // (i, "check");
            const attribute = select(this).attr("data-attribute");
            tooltip
              .style("display", "block")
              .style("z-index", 99999)
              .style("opacity", 0.9)
              .html(`${attribute}: ${parseFloat(value).toFixed(1)}`)
              .style("background-color", backgroundColor)
              .style("left", event.clientX + "px")
              .style("top", event.clientY + "px")
              .style("color", "#fff");
          })

          .on("mouseout", function () {
            // Remove the tooltip and the value label on mouse leave
            // svg.selectAll(".data-point-label").remove();
            // tooltip.style("display", "none");
            tooltip.style("opacity", 0);
          });
      });
    }
  }, [activeTab]);

  return <svg></svg>;
}

export default ProductPageGraph;
