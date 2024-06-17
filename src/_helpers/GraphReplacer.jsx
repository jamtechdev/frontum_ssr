import React, { useEffect, useRef } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { v4 as uuidv4 } from "uuid";
import PieChart from "@/_chart/PieChart";
import { ChartName } from "@/_chart/data/enums/ChartName";
import CorrelationChart from "@/_chart/CorrelationChart";
import VerticalChart from "@/_chart/VerticalChart";
import HorizontalChart from "@/_chart/HorizontalChart";

const GraphReplacer = () => {
  const observer = useRef(null);

  const renderGraphForMatchedShortCodePattern = async (element, shortCode) => {
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("container-div");
    element.insertAdjacentElement("afterend", parentDiv);

    for (let idx = 0; idx < shortCode?.length; idx++) {
      if (shortCode[idx]?.isMatch && element.nodeType === Node.ELEMENT_NODE) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/generate-graph?graph_shortcode=${shortCode[idx].matchedString}`,
            {
              headers: {
                Authorization: `Bearer Jf8r1Xp0rTVbdz4jIOXpkxGEmE3oVc7VlqAGyKCJksKf4SboPfOhrdPy7Wz5W3U2`,
                "Content-Type": "application/json",
              },
            }
          );
          const chartData = response?.data?.data;
          if (chartData && chartData.data && chartData.data.length > 0) {
            const xAixsLabel = chartData.x_axis_label ?? "";

            // (xAixsLabel)
            const yAixsLabel = chartData.y_axis_label ?? "";
            const xAxisTitle = chartData.x_title ?? "";
            const yAxisTitle = chartData.y_title ?? "";

            const isGeneralAttributesOfCorrelationChart_x =
              chartData.is_general_attribute_x ?? false;
            const isGeneralAttributesOfCorrelationChart_y =
              chartData.is_general_attribute_y ?? false;
            const correlation_minX = Number(chartData.rang_min_x) ?? null;
            const correlation_maxX = Number(chartData.rang_max_x) ?? null;
            const correlation_minY = Number(chartData.rang_min_y) ?? null;
            const correlation_maxY = Number(chartData.rang_max_y) ?? null;
            const chartTitle = chartData.title ?? "";
            const yAxisUnit = chartData.unitY ?? "";
            const xAxisUnit = chartData.unit ?? "";
            const plotData = await regenerateData(chartData);
            if (plotData && plotData.length > 0) {
              const container = document.createElement("div");
              container.style.padding = "20px";
              container.setAttribute("class", `chart_Append${idx}`);
              parentDiv.insertAdjacentElement("beforeend", container);
              const root = createRoot(container);
              // (plotData);
              // (shortCode[idx]);

              if (shortCode[idx].pattern === ChartName.PieChart) {
                root.render(
                  <PieChart
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
              if (shortCode[idx].pattern == ChartName.VerticalChart) {
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

              if (shortCode[idx].pattern == ChartName.HorizontalChart) {
                root.render(
                  <HorizontalChart
                    data={plotData}
                    height={220}
                    width={650}
                    chartTitle={shortCode[idx].chartTitle}
                    xUnit={xAxisUnit}
                    yUnit={yAxisUnit}
                    rectBarWidth={27}
                    rectBarPadding={10}
                  />
                );
              }

              if (shortCode[idx].pattern == ChartName.CorrelationChart) {
                root.render(
                  <CorrelationChart
                    data={chartData?.data}
                    height={300}
                    width={478}
                    chartTitle={shortCode[idx].chartTitle}
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
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    // Remove the original shortcode placeholder element
    element.remove();
  };

  const regenerateData = async (chartData) => {
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
  };

  const matchShortCodePatternsAgainstText = (str) => {
    const shortCodepatternsRE =
      /\[(pie-chart|vertical-chart|horizontal-chart|correlation-chart)-\d+\]/g;

    const results = [];
    const patternRE = /\[[^\]]*]/g;
    const patterns = str.match(patternRE);
    // (patterns);

    if (patterns) {
      patterns.forEach((matchedPattern) => {
        const regex = new RegExp(shortCodepatternsRE);
        if (regex.test(matchedPattern)) {
          results.push({
            isMatch: true,
            pattern: getChartTypeFromShortCodePattern(matchedPattern),
            matchedString: matchedPattern,
            chartTitle: getChartTitle(matchedPattern),
          });
        }
      });
    }
    return results;
  };

  const getChartTypeFromShortCodePattern = (matchedPattern) => {
    const typePattern = /\[(\w+-chart)-\d+\]/;
    const match = matchedPattern.match(typePattern);
    return match ? match[1] : null;
  };

  const getChartTitle = (shortCodestr) => {
    let chartTitle = "";
    let result = shortCodestr.slice(1, -1);
    const stringArray = result.split(";");
    if (stringArray && stringArray.length > 0 && stringArray[1]) {
      chartTitle = stringArray[1];
    }
    return chartTitle;
  };

  useEffect(() => {
    const handleIntersect = async (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const shortCode = element.getAttribute("data-shortcode");
          const matchedShortCode = matchShortCodePatternsAgainstText(shortCode);
          if (matchedShortCode && !element.classList.contains("render-chart")) {
            element.classList.add("render-chart");
            renderGraphForMatchedShortCodePattern(element, matchedShortCode);
            observerInstance.unobserve(element);
          }
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    setTimeout(() => {
      const elementsWithNodeType =
        document.querySelectorAll("[data-shortcode]");
      "Observed elements:", elementsWithNodeType;
      elementsWithNodeType.forEach((element) => {
        observer.current.observe(element);
      });
    }, 3000);

    // const elementsWithNodeType1 = document.querySelectorAll(".chart-placeholder");
    // ('Observed elements:', elementsWithNodeType1);
    // elementsWithNodeType1.forEach((element) => {
    //   observer.current.observe(element);
    // });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  });

  return null;
};

export default GraphReplacer;
