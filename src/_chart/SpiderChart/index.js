import React, { useState } from "react";
import ReactDOM from "react-dom";
import Radar from "react-d3-radar";
import "./index.css";
const chartData = {
  variables: [
    { key: "anxiety", label: "Anxiety" },
    { key: "illness", label: "Any Mental Illness" },
    { key: "sucidal", label: "Suicidal Thoughts" },
    { key: "distress", label: "Frequent Mental Distress" },
    { key: "depression", label: "Depression" },
  ],
  sets: [
    {
      key: "served",
      label: "Those Who Have Served",
      values: {
        anxiety: 19.7,
        illness: 6,
        sucidal: 10,
        distress: 2,
        openness: 8,
        depression: 10,
      },
    },
    {
      key: "civilians",
      label: "Civilians",
      values: {
        anxiety: 10,
        illness: 8,
        sucidal: 10,
        distress: 4,
        openness: 2,
        depression: 10,
      },
    },
  ],
};
const SpiderChart = () => {
  const [highlighted, setHighlighted] = useState(null);

  const onHover = (hovered) => {
    if (!highlighted && !hovered) return;
    if (highlighted && hovered && hovered.key === highlighted.key) return;
    setHighlighted(hovered);
  };

  return (
    <div className="App">
      <Radar
        width={500}
        height={500}
        padding={70}
        domainMax={20}
        highlighted={highlighted}
        onHover={onHover}   
        data={chartData}
      />
    </div>
  );
};

export default SpiderChart;
