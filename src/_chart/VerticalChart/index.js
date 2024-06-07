import BaseChart from "../BaseChart";
import classnames from "classnames";
import * as d3 from "d3";

import "./index.scss";

function drawBarChart(props) {
  const { svgRef, data, xScale, yScale, height, barClass, tooltipRef } = props;
  const toolTip = d3.select(tooltipRef.current);
  const svg = d3.select(svgRef.current).select("g");

  // // Remove zero after decimal point
  // let updatedData = data.map(({ label, ...rest }) => ({
  //   ...rest,
  //   label: label.split("-").map(Number).join("-"),
  // }));

  svg
    .selectAll("bar")
    .data(data)
    .attr("viewBox", `0 0 ${xScale.bandwidth()} ${height}`)
    .enter()
    .append("rect")
    .attr("class", classnames(["bar-chart__bar rect-hover", barClass]))
    .attr("x", (d) => xScale(d.label))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value))
    .on("mouseover", (e, data) => {
      toolTip.transition().duration(300).style("opacity", 1).style("display", "inline-block");
      toolTip
        .html(
          `<div style="font-size: 14px;
      font-weight: 400;
      color: rgba(39, 48, 78, 0.8);"><span style="margin-right:8px">${
        data.value
      }% (${data.productCount ? data.productCount : "0"})</span></div>`
        )
        .style("left", e.clientX - 20 + "px")
        .style("top", e.clientY - 50 + "px");
    })

    .on("mouseout", (d, data) => {
      toolTip.transition().duration(300).style("opacity", 0).style("display", "none");
    });
}

const extraProps = {
  useScaleBands: { x: true, y: false },
};

export default BaseChart(drawBarChart, extraProps);
