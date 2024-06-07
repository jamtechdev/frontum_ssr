import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import { graphService } from "../_services/graph.service.js";
import PiChart from "../_chart/PieChart";
import VerticalChart from "../_chart/VerticalChart";
import HorizontalChart from "../_chart/HorizontalChart";
import CorrelationChart from "../_chart/CorrelationChart";
import { ChartName } from "../_chart/data/enums/ChartName.ts";

export const searchForPatternAndReplace = (data) => {
  const shortCodePatternsRE =
    /\[(pie-chart|vertical-chart|horizontal-chart|correlation-chart)-\d+\]/g;

  const updatedData = data?.replace(shortCodePatternsRE, (match) => {
    return `<span class="addClassData">${match}</span>`;
  });

  return updatedData;
};

const useChart = () => {
  const shortCodepatternsRE =
    /^\[pie-chart|vertical-chart|horizontal-chart|correlation-chart|.*\]$/;

  useEffect(() => {
    // Function to search for the pattern
    const searchForPattern = async () => {
      const elementsWithNodeType1 =
        document.body.querySelectorAll(".addClassData");
      elementsWithNodeType1.forEach(async (element, index) => {
        const shortCode = element.textContent;
        // (shortCode);
        const shortCodesMatched = matchShortCodePatternsAgainstText(shortCode);
        // (shortCodesMatched, "checking");
        if (
          shortCodesMatched &&
          shortCodesMatched.length > 0 &&
          !element.classList.contains("render-chart")
        ) {
          element.classList.add("render-chart");
          await renderGraphForMatchedShortCodePattern(
            element,
            shortCodesMatched,
            index
          );
          element.remove();
        }
      });
    };
    searchForPattern();
  });
  async function renderGraphForMatchedShortCodePattern(
    element,
    shortCodesMatched,
    index
  ) {
    // (shortCodesMatched)
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("container-div");
    element.insertAdjacentElement("afterend", parentDiv);
    for (let indx = 0; indx < shortCodesMatched.length; indx++) {
      if (
        shortCodesMatched[indx]?.isMatch &&
        element.nodeType === Node.ELEMENT_NODE
      ) {
        const res = await graphService.getGraphData({
          graph_shortcode: shortCodesMatched[indx].matchedString,
        });
        const chartData = await res.data.data;

        if (chartData && chartData.data && chartData.data.length > 0) {
          // (xAixsLabel)
          const xAixsLabel = chartData.x_axis_label ?? "";

          // (xAixsLabel)
          const yAixsLabel = chartData.y_axis_label ?? "";
          const xAxisTitle = chartData.x_title ?? "";
          const yAxisTitle = chartData.y_title ?? "";
          const yAxisUnit = chartData.unitY ?? "";
          const xAxisUnit = chartData.unit ?? "";
          const chartTitle = chartData.title ?? "";
          const isGeneralAttributesOfCorrelationChart_x =
            chartData.is_general_attribute_x ?? false;
          const isGeneralAttributesOfCorrelationChart_y =
            chartData.is_general_attribute_y ?? false;
          const correlation_minX = Number(chartData.rang_min_x) ?? null;
          const correlation_maxX = Number(chartData.rang_max_x) ?? null;
          const correlation_minY = Number(chartData.rang_min_y) ?? null;
          const correlation_maxY = Number(chartData.rang_max_y) ?? null;
          const plotData = await regenerateData(chartData);

          if (plotData && plotData.length > 0) {
            const container = document.createElement("div");
            container.style.padding = "20px";
            container.setAttribute("class", "chart_Append" + index);
            parentDiv.insertAdjacentElement("beforeend", container);
            const root = createRoot(container);

            const chartAppendElements = document.querySelectorAll(
              ".chart_Append" + index
            );
            const numberOfChartAppends = chartAppendElements.length;
            // (
            //   `Number of elements with class "chart_Append": ${numberOfChartAppends}`
            // );
            // (shortCodesMatched[indx].pattern);
            // (chartData?.data);
            // const data = [
            //   {
            //     data: {
            //       data: [
            //         {
            //           x: "120",
            //           y: "62",
            //           name: "amarey A90+",
            //         },
            //         {
            //           x: "140",
            //           y: "46",
            //           name: "AONUS S8",
            //         },
            //       ],
            //       title: "Title sample",
            //       x_unit: "",
            //       y_unit: "dB",
            //       x_title: "Runtime",
            //       y_title: "Noisiness",
            //       x_labels: ["80", "120", "160", "200", "240", "280"],
            //       y_labels: ["50", "55", "60", "65", "70", "75"],
            //     },
            //   },
            // ];

            if (numberOfChartAppends == 1) {
              if (shortCodesMatched[indx].pattern == ChartName.PieChart) {
                root.render(
                  <PiChart
                    data={plotData}
                    pieSize={150}
                    svgSize={180}
                    innerRadius={0}
                    containerId={`pie${uuidv4()}`}
                    chartTitle={chartTitle}
                    xUnit={xAxisUnit}
                  />
                );
              }

              if (shortCodesMatched[indx].pattern == ChartName.VerticalChart) {
                root.render(
                  <VerticalChart
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
                    data={plotData}
                    strokeWidth={4}
                  />
                );
              }

              if (
                shortCodesMatched[indx].pattern == ChartName.HorizontalChart
              ) {
                root.render(
                  <HorizontalChart
                    data={plotData}
                    height={220}
                    width={650}
                    chartTitle={shortCodesMatched[indx].chartTitle}
                    xUnit={xAxisUnit}
                    yUnit={yAxisUnit}
                    rectBarWidth={27}
                    rectBarPadding={10}
                  />
                );
              }

              if (
                shortCodesMatched[indx].pattern == ChartName.CorrelationChart
              ) {
                root.render(
                  <CorrelationChart
                    data={chartData?.data}
                    height={300}
                    width={478}
                    chartTitle={shortCodesMatched[indx].chartTitle}
                    xLabel={chartData?.x_labels}
                    yLabel={chartData?.y_labels}
                    xTick={9}
                    yTick={7}
                    xUnit={chartData?.x_unit}
                    yUnit={chartData?.y_unit}
                    xTitle={chartData?.x_title}
                    yTitle={chartData?.y_title}
                    isGeneralAttribute_x={
                      isGeneralAttributesOfCorrelationChart_x
                    }
                    isGeneralAttribute_y={
                      isGeneralAttributesOfCorrelationChart_y
                    }
                    rangeMinX={correlation_minX}
                    rangeMaxX={correlation_maxX}
                    rangeMinY={correlation_minY}
                    rangeMaxY={correlation_maxY}
                  />
                );
              }
            }
          }
        }
      }
    }
  }

  async function regenerateData(chartData) {
    const dataForChart = [];

    if (
      chartData &&
      chartData.data &&
      chartData.data.length > 0 &&
      chartData.lable &&
      (chartData.product_count || chartData.produt_name)
    ) {
      chartData.data.forEach((val, index) => {
        dataForChart.push({
          label: chartData.lable[index],
          value: val,
        });
        if (chartData.product_count) {
          dataForChart[index]["productCount"] = chartData.product_count[index];
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
          value: val,
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
          value: val,
        });
      });
    } else if (chartData && chartData.data && chartData.data.length > 0) {
      chartData.data.forEach((val) => {
        dataForChart.push({
          label: val,
          value: val,
        });
      });
    }
    return dataForChart;
  }

  function matchShortCodePatternsAgainstText(str) {
    const results = [];
    const patternRE = /\[[^\]]*]/g;
    const patterns = str.match(patternRE);

    if (patterns && patterns.length > 0) {
      patterns.forEach((matchedPattern) => {
        const regex = new RegExp(shortCodepatternsRE);
        if (regex.test(matchedPattern)) {
          results.push({
            isMatch: true,
            pattern: getTheChartTypeFromShortCodePattern(matchedPattern),
            matchedString: matchedPattern,
            chartTitle: getChartTitle(matchedPattern),
          });
        }
      });
    }
    return results;
  }

  function getTheChartTypeFromShortCodePattern(shortCodestr) {
    const typePattern = /\[(\w+-chart)-\d+\]/;
    const match = shortCodestr.match(typePattern);
    return match ? match[1] : null;
  }

  function getChartTitle(shortCodestr) {
    let chartTitle = "";
    let result = shortCodestr.slice(1, -1);
    const stringArray = result.split(";");
    if (stringArray && stringArray.length > 0 && stringArray[1]) {
      chartTitle = stringArray[1];
    }
    return chartTitle;
  }
};

export default useChart;
