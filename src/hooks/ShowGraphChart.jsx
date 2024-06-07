import { createRoot } from "react-dom/client";
import ComparisonPieChart from "../_chart/ComparisonPieChart/index.js";
import ComparisonVerticalChart from "../_chart/ComparisonVerticalChart/index.js";
import { v4 as uuidv4 } from "uuid";

const ShowGraphChart = async (chartData, containerSelector , pageType , slug) => {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error("Container not found");
    return;
  }

  // Clear previous charts
  container.innerHTML = "";

  if (chartData) {
    const xAixsLabel = chartData.x_axis_label ?? "";
    const yAixsLabel = chartData.y_axis_label ?? "";
    const xAxisTitle = chartData.x_title ?? "";
    const yAxisTitle = chartData.y_title ?? "";
    const yAxisUnit = chartData.unitY ?? "";
    const xAxisUnit = chartData.unit ?? "";
    const chartTitle = chartData.title ?? "";
    const pieProductBatch = chartData.products ?? "";
    const isGeneralAttributesOfCorrelationChart_x =
      chartData.is_general_attribute_x ?? false;
    const isGeneralAttributesOfCorrelationChart_y =
      chartData.is_general_attribute_y ?? false;
    const correlation_minX = Number(chartData.rang_min_x) ?? null;
    const correlation_maxX = Number(chartData.rang_max_x) ?? null;
    const correlation_minY = Number(chartData.rang_min_y) ?? null;
    const correlation_maxY = Number(chartData.rang_max_y) ?? null;
    const plotData = await regenerateData(chartData);

    // (plotData);

    const chartContainer = document.createElement("div");
    chartContainer.style.padding = "10px";
    container.appendChild(chartContainer);
    const root = createRoot(chartContainer);

    if (chartData.type === "pie-chart") {
      root.render(
        <ComparisonPieChart
          data={chartData?.data}
          pieSize={150}
          svgSize={180}
          innerRadius={0}
          containerId={`pie${uuidv4()}`}
          chartTitle={chartTitle}
          xUnit={xAxisUnit}
          pieProductBatch={chartData.products}
        />
      );
    } else if (chartData.type === "vertical-chart") {
      root.render(
        <ComparisonVerticalChart
          svgProps={{
            margin: {
              top: 80,
              bottom: 80,
              left: 80,
              right: 80,
            },
            width: 478,
            height: 180,
          }}
          axisProps={{
            xLabel: { xAixsLabel },
            yLabel: { yAixsLabel },
            xUnit: { xAxisUnit },
            yUnit: { yAxisUnit },
            drawXGridlines: true,
            tick: 6,
            isTextOrientationOblique:
              plotData[0].label.length > 3 ? true : false,
          }}
          chartTitle={chartTitle}
          pageType={pageType}
          slug={slug}
          data={chartData?.data}
          strokeWidth={4}
        />
      );
    }
  }
};
async function regenerateData(chartData) {
  const dataForChart = [];

  if (
    chartData &&
    chartData.data &&
    chartData.data.length > 0 &&
    chartData.lable &&
    chartData.selected &&
    chartData.products &&
    (chartData.product_count || chartData.produt_name)
  ) {
    chartData.data.forEach((val, index) => {
      dataForChart.push({
        label: chartData.lable[index],
        value: Number(val),
      });
      if (chartData.product_count) {
        dataForChart[index]["productCount"] = chartData.product_count[index];
      }
      if (chartData.products) {
        dataForChart[index]["products"] = chartData.products[index];
      }
      if (chartData.selected) {
        dataForChart[index]["selected"] = chartData.selected[index];
      }
      if (chartData.produt_name)
        dataForChart[index]["productName"] = chartData.produt_name[index];
    });
  } else if (
    chartData &&
    chartData.data &&
    chartData.data.length > 0 &&
    chartData.lable
  ) {
    chartData.data.forEach((val, index) => {
      dataForChart.push({
        label: chartData.lable[index],
        value: Number(val),
      });
    });
  } else if (
    chartData &&
    chartData.data &&
    chartData.data.length > 0 &&
    chartData.label
  ) {
    chartData.data.forEach((val, index) => {
      dataForChart.push({
        label: chartData.label[index],
        value: Number(val),
      });
    });
  } else if (chartData && chartData.data && chartData.data.length > 0) {
    chartData.data.forEach((val) => {
      dataForChart.push({
        label: val,
        value: Number(val),
      });
    });
  }
  return dataForChart;
}

export default ShowGraphChart;
