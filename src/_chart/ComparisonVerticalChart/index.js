import ComparisonBaseChart from "../ComparisonBaseChart";
import classnames from "classnames";
import * as d3 from "d3";

import "./index.scss";

function ComparisonVerticalChart(props) {
  const {
    svgRef,
    data,
    xScale,
    yScale,
    height,
    barClass,
    tooltipRef,
    containerId,
    slug,
  } = props;
  const toolTip = d3.select(tooltipRef.current);
  const margin = { top: 20, right: 10, bottom: 60, left: 10 };
  const width = 500 - margin.left - margin.right;
  const heights = 450 - margin.top - margin.bottom;
  const svg = d3.select(svgRef.current).select("g");
  const slugsExtract = slug.split("-vs-");
  // Bar chart Valur Based on selected product
  let fristIndex = -1;
  let secondIndex = -1;
  let thirdIndex = -1;
  let count = 0;

  data.forEach((item, index) => {
    if (item.selected === 1) {
      count++;
      // (item);
      // (count, index);
      if (count === 1) fristIndex = index;
      if (count === 2) secondIndex = index;
      if (count === 3) thirdIndex = index;
    }
  });

  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    // .attr("viewBox", `40 90 280 100`)
    .attr("class", classnames(["bar-chart__bar rect-hover", barClass]))
    .attr("x", (d) => xScale(d.label))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value))
    .style("fill", (d, i) => {
      if (d.selected === 1 && d.product_id?.[0] === 1) {
        return "rgb(67, 126, 206)";
      } else if (d.selected === 1 && d.product_id?.[0] === 2) {
        return "#FF8F0B";
      } else if (d.selected === 1 && d.product_id?.[0] === 3) {
        return "#28a28c";
      } else if (d.selected === 2 && d.product_id?.length === 2) {
        return d.product_id[0] === 1
          ? "rgb(67, 126, 206)"
          : d.product_id[0] === 2
          ? "#ff8f0b"
          : "#28a28c";
      } else if (d.selected === 3 && d.product_id?.length === 3) {
        return d.product_id[2] === 1
          ? "rgb(67, 126, 206)"
          : d.product_id[2] === 2
          ? "#ff8f0b"
          : "#28a28c";
      } else {
        return "purple"; // or any other default color
      }
    })
    .on("mouseover", (e, data) => {
      toolTip.transition().duration(300).style("opacity", 1);
      toolTip
        .html(
          `<div style="font-size: 14px;
          font-weight: 400;
          color: rgba(39, 48, 78, 0.8); cursor: pointer;"><span style="margin-right:8px">${
            data.value
          }% (${data.product_count ? data.product_count : "0"})</span></div>`
        )
        .style("left", e.clientX - 20 + "px")
        .style("top", e.clientY - 50 + "px");
    })

    .on("mouseout", (d, data) => {
      toolTip.transition().duration(300).style("opacity", 0);
    });
  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", classnames(["bar-chart__bar rect-hover", barClass]))
    .attr("x", (d) => xScale(d.label))
    .attr("width", (d) =>
      d.selected === 3 ? xScale.bandwidth() / 1.5 : xScale.bandwidth()
    )
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value))
    .style("fill", (d, i) => {
      if (d.selected === 1 && d.product_id?.[0] === 1) {
        return "rgb(67, 126, 206)";
      } else if (d.selected === 1 && d.product_id?.[0] === 2) {
        return "#FF8F0B";
      } else if (d.selected === 1 && d.product_id?.[0] === 3) {
        return "#28a28c";
      } else if (d.selected === 2 && d.product_id?.length === 2) {
        return d.product_id[1] === 1
          ? "rgb(67, 126, 206)"
          : d.product_id[1] === 2
          ? "#ff8f0b"
          : "#28a28c";
      } else if (d.selected === 3 && d.product_id?.length === 3) {
        return d.product_id[1] === 1
          ? "rgb(67, 126, 206)"
          : d.product_id[1] === 2
          ? "#ff8f0b"
          : "#28a28c";
      } else {
        return ""; // or any other default color
      }
    })
    .on("mouseover", (e, data) => {
      toolTip.transition().duration(300).style("opacity", 1);
      toolTip
        .html(
          `<div style="font-size: 14px;
            font-weight: 400;
            color: rgba(39, 48, 78, 0.8); cursor: pointer;"><span style="margin-right:8px">${
              data.value
            }% (${data.product_count ? data.product_count : "0"})</span></div>`
        )
        .style("left", e.clientX - 20 + "px")
        .style("top", e.clientY - 50 + "px");
    })

    .on("mouseout", (d, data) => {
      toolTip.transition().duration(300).style("opacity", 0);
    });
  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", classnames(["bar-chart__bar rect-hover", barClass]))
    .attr("x", (d) => xScale(d.label))
    .attr("width", (d) =>
      d.selected === 2
        ? xScale.bandwidth() / 2
        : d.selected === 3
        ? xScale.bandwidth() / 3
        : xScale.bandwidth()
    )
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => height - yScale(d.value))
    .style("fill", (d, i) => {
      // (d.product_id);
      if (d.selected === 1 && d.product_id?.[0] === 1) {
        return "rgb(67, 126, 206)";
      } else if (d.selected === 1 && d.product_id?.[0] === 2) {
        return "#FF8F0B";
      } else if (d.selected === 1 && d.product_id?.[0] === 3) {
        return "#28a28c";
      } else if (d.selected === 2 && d.product_id?.length === 2) {
        return d.product_id[0] === 1
          ? "rgb(67, 126, 206)"
          : d.product_id[0] === 2
          ? "#ff8f0b"
          : "#28a28c";
      } else if (d.selected === 3 && d.product_id?.length === 3) {
        return d.product_id[0] === 1
          ? "rgb(67, 126, 206)"
          : d.product_id[0] === 2
          ? "#ff8f0b"
          : "#28a28c";
      } else {
        return ""; // or any other default color
      }
    })
    .on("mouseover", (e, data) => {
      toolTip.transition().duration(300).style("opacity", 1);
      toolTip
        .html(
          `<div style="font-size: 14px;
            font-weight: 400;
            color: rgba(39, 48, 78, 0.8);"><span style="margin-right:8px">${
              data.value
            }% (${data.product_count ? data.product_count : "0"})</span></div>`
        )
        .style("left", e.clientX - 20 + "px")
        .style("top", e.clientY - 50 + "px");
    })
    .on("mouseout", (d, data) => {
      toolTip.transition().duration(300).style("opacity", 0);
    });

  // loop data and add product name with color
  const legendMainContainer = d3
    .select(`.compareWithOther`)
    .attr("class", "parentBarDiv");

  const legendContainer = legendMainContainer
    .append("div")
    .attr("class", "legendBoxBarChart");

  // remove object were products is undefined
  let filteredData = data.filter((item) => item.products?.length > 0);
  // (filteredData, "filter");
  const table = legendContainer.append("table");
  const tbody = table.append("tbody");
  const rows = tbody.selectAll("tr").data(filteredData).enter().append("tr");
  let color = ["", "#437ECE", "#FF8F0B", "rgb(40, 162, 140)"];
  const cells = rows
    .selectAll("tr")
    .data((d, i) => {
      // Check if products is an array and return a nested array for multiple products
      if (d.products?.length > 1) {
        return d.products.map((product, index) => [
          color[d.product_id[index]],
          product,
        ]);
      } else {
        return [[color[d.product_id[0]], d.products]]; // Wrap single product in an array
      }
    })
    .enter()
    .append("td")
    .each(function (d, i) {
      if (Array.isArray(d)) {
        // Case when d is an array containing [color, product_name]
        const [colorName, productName] = d;

        // (colorName); // Log the color name
        // (productName); // Log the product name

        // Append div for color and span for product name
        d3.select(this)
          .append("div")
          .attr("class", "legend-avatar barChartProduct")
          .style("width", "12px")
          .style("height", "12px")
          .style("background-color", colorName);

        d3.select(this)
          .append("span")
          .attr("class", "legend-text barChartProduct")
          .text(productName);
      } else {
        // Case when d is just a color name or a product name
        // (d); // Log the value of d

        // Append div for color or span for product name based on the index i
        if (i === 0) {
          d3.select(this)
            .append("div")
            .attr("class", "legend-avatar barChartProduct")
            .style("width", "12px")
            .style("height", "12px")
            .style("background-color", d); // Assuming d is a color name here
        } else if (i === 1) {
          d3.select(this)
            .append("span")
            .attr("class", "legend-text barChartProduct")
            .text(d); // Assuming d is a product name here
        }
      }
    });
}

const extraProps = {
  useScaleBands: { x: true, y: false },
};

export default ComparisonBaseChart(ComparisonVerticalChart, extraProps);
