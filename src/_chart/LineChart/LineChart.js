import * as React from "react";
import * as d3 from "d3";

function lineChart(svgRef, lineChartData,page_phase) {
  (lineChartData?.page_phase)
  // (lineChartData?.lineChartData[0], "xxx");
  let date_time_store = "";
  if (lineChartData?.lineChartData[0]?.format === "Y-m-d") {
    date_time_store = "%Y-%m-%d";
  } else if (lineChartData?.lineChartData[0]?.format === "d/m/Y") {
    date_time_store = "%d/%m/%Y";
  } else if (lineChartData?.lineChartData[0]?.format === "m/d/Y") {
    date_time_store = "%m/%d/%Y";
  } else if (lineChartData?.lineChartData[0]?.format === "d-m-Y") {
    date_time_store = "%d-%m-%Y";
  } else if (lineChartData?.lineChartData[0]?.format === "m-d-Y") {
    date_time_store = "%m-%d-%Y";
  } else if (lineChartData?.lineChartData[0]?.format === "d.m.Y") {
    date_time_store = "%d.%m.%Y";
  }
  const parseDate = d3.timeParse(date_time_store);
  const europeanDateFormat = date_time_store;

  // (lineChartData);
  const data = lineChartData?.lineChartData.map((chartData) => ({
    name: chartData.name,
    values: chartData.values?.map((value) => ({
      date: parseDate(value?.date),
      price: value?.price,
    })),
  }));

  const dates = [
    new Date("2023-10-15T18:30:00.000Z"),

    // Add more dates here
  ];

  dates.forEach((date) => {
    // (
    //   date.toDateString(),
    //   "is a",
    //   [
    //     "Sunday",
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday",
    //     "Saturday",
    //   ][date.getDay()]
    // );
  });

  // (sundays);

  const svg = d3.select(svgRef.current);
  const width = 1020;
  const height = 350;
  const margin = 100;
  const duration = 250;

  const lineOpacity = "2.5";
  const lineOpacityHover = "0.5";
  const otherLinesOpacityHover = "0";
  const lineStroke = "2.5";
  const lineStrokeHover = "2.5";

  const circleOpacity = "0.85";
  const circleOpacityOnLineHover = "0.85";
  const circleRadius = 5;
  const circleRadiusHover = 6;

  const [minX, maxX] = d3.extent(data[0].values, (d) => d.date);

  const numWeeks = 24;
  const intervalWeeks = 2;

  const lastSunday = d3.timeSunday.floor(maxX); // Get the last Sunday from the maxX date
  // (lastSunday)
  const firstSunday = d3.timeSunday.offset(
    lastSunday,
    -numWeeks * intervalWeeks
  ); // Get the Sunday 24 weeks ago
  const middleSunday1 = d3.timeSunday.offset(lastSunday, -8 * intervalWeeks); // Get the Sunday 8 weeks ago
  const middleSunday2 = d3.timeSunday.offset(lastSunday, -16 * intervalWeeks); // Get the Sunday 16 weeks ago

  // (firstSunday, middleSunday1, middleSunday2, lastSund4564456445465456454545ay);

  // (yIntervals);
  const xScale = d3
    .scaleTime()
    .domain([d3.timeWeek.offset(maxX, -24), maxX]) // Show data for the last 24 weeks
    .range([0, 700 - margin]);

  const [minY, maxY] = d3.extent(data[0].values, (d) => d.price);
  // (maxY);
  const maxDifference = maxY / 15;
  // (maxDifference);
  const maxPlusDifference = Math.round(maxY) + Math.round(maxDifference);
  // (maxPlusDifference);

  const maxInterval = Math.round(maxPlusDifference);
  // (maxInterval);
  const minInterval = Math.max(0, Math.round(minY - maxDifference));
  // (maxInterval, minInterval);
  const intervalDifference = (maxInterval - minInterval) / 5;
  // (intervalDifference);

  const yIntervals = [
    maxInterval,
    maxInterval - intervalDifference,
    maxInterval - 2 * intervalDifference,
    maxInterval - 3 * intervalDifference,
    maxInterval - 4 * intervalDifference,
    maxInterval - 5 * intervalDifference,
  ];
  const yIntervalsInt = yIntervals.map((value) => parseInt(value));
  // [0, 200, 400, 600, 800, 980];
  // (yIntervals);
  // (yIntervalsInt);
  const isMobileScreen = window.innerWidth <= 768;
  // Day
  const yScale = d3
    .scaleLinear()
    .domain([minInterval, maxInterval])
    .range([height - margin, 0]);

  svg
    .attr("width", 800)
    .attr("viewBox", `${isMobileScreen ? `80 0 600 300` : "80 0 600 300"}`)
    .attr("height", 300)
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(height - margin)
    .tickFormat(d3.timeFormat(europeanDateFormat))
    .tickPadding(10);

  // (yIntervalsInt);
  // .ticks(d3.timeWeek.every(1)) // Set the interval between ticks to 1 week
  // .tickValues([firstSunday, middleSunday2, middleSunday1, lastSunday]); // Optionally, set specific tick values

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(margin - 710) // Keep ticks for labels (optional)
    .tickSizeOuter(0)
    .tickValues(yIntervalsInt)
    .tickPadding(20)
    .tickFormat((d) => `${d} ${lineChartData?.lineChartData[0]?.currency}`);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(${margin}, ${margin})`) // Move the x-axis to the bottom of the chart
    .style("opacity", 1)
    .style("font-size", "17px")

    .style("font-weight", "800")
    .call(xAxis)
    .append("text");
  // Move the label 30 units below the x-axis

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin}, ${margin})`)
    .attr("font-weight", "100")
    // .style("stroke", "#27314BB2") // Set the stroke color of the axis lines to grey
    .style("opacity", 1)
    .style("font-size", "17px")
    .style("stroke", "none")

    // .attr("font-family", '"Roboto", "sans-serif"')
    .call(yAxis)
    .append("text")
    .attr("y", 900)
    .attr("transform", "rotate(-90)");

  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.price));

  const lines = svg
    .append("g")
    .attr("class", "lines")
    .attr("transform", `translate(${margin}, ${margin})`)
    .style("stroke", "#437ECE");
  // .style("opacity", 0.8);

  lines
    .selectAll("line-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "line-group")
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .style("stroke", "#437ECE")
    .style("stroke-width", 3.5)
    .style("fill", "none")
    // .style("opacity", 5)
    .on("mouseover", function () {
      // d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
      d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
      d3.select(this)
        // .style("opacity", lineOpacityHover)
        // .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function () {
      // d3.selectAll(".line").style("opacity", lineOpacity);
      d3.selectAll(".circle");
      d3.select(this).style("stroke-width", 4.5).style("cursor", "none");
    });

  const tooltip = d3
    .selectAll(`.chart__data`)
    .append("div")
    .attr("class", "tooltip")
    .style("display", "none");

  lines
    .selectAll("circle-group")
    .data(data)
    .enter()
    .append("g")
    .style("fill", "#437ECE")
    .style("stroke-width", 5.5)

    .selectAll("circle")
    .data((d) => d.values)
    .enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover touchstart", function (e, d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text");
      // .attr("x", (d) => xScale(d.date) + 5)
      // .attr("y", (d) => yScale(d.price) - 10);

      const formatDate = d3.timeFormat(europeanDateFormat);
      // const formatDate = d3.timeFormat("%d.%m.%y");

      tooltip
        .style("display", "block")
        .style("opacity", 1)
        .html(
          `<div style="font-size: 15px"> <b style="opacity: 0.6">${d.price} ${
            lineChartData?.lineChartData[0]?.currency
          } </b>   <i style="opacity: 0.5">(${formatDate(d?.date)} )</i> </div>`
        )
        .style("background-color", "white")
        // .style("left", "250px")
        .style("top", (e.clientY || e.touches[0].clientY) + "px")
        .style("color", "#000");
      // .text(`${d.price}`)
    })
    .on("mouseout touchend", function () {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text");
      tooltip.style("opacity", 0);
    })
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.price))
    .attr("r", circleRadius)
    // .style("opacity", circleOpacity)
    .on("mouseover touchstart", function () {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadiusHover);
    })
    .on("mouseout touchend", function () {
      d3.select(this).transition().duration(duration).attr("r", circleRadius);
    });
}

const DrawChart = (lineChartData ,page_phase) => {
  const svg = React.useRef(null);
  React.useEffect(() => {
    lineChart(svg, lineChartData , page_phase);
  }, [svg]);

  return <svg ref={svg} />;
};

export default DrawChart;
