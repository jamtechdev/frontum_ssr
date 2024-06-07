import React from "react";
import Skeleton from "react-loading-skeleton";

const VerticalChartSkeleton = () => {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: "200px" }}>
      {[...Array(7)].map((_, index) => (
        <div key={index} style={{ margin: "0 10px" }}>
          <Skeleton height={Math.random() * 150 + 50} width={30} />
          <Skeleton width={30} style={{ marginTop: "10px" }} />
        </div>
      ))}
    </div>
  );
};

export default VerticalChartSkeleton;
