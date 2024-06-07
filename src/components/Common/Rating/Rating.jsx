import React from "react";

const Rating = ({ value }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(value)) {
      stars.push(<i key={i} className="ri-star-fill"></i>);
    } else if (i === Math.floor(value) && value % 1 >= 0.5) {
      stars.push(<i key={i} className="ri-star-half-fill"></i>);
    } else {
      stars.push(<i key={i} className="ri-star-line"></i>);
    }
  }

  return (
    <div className="rating">
      {stars}
      {/* <span className="rating-value">{value}</span> */}
    </div>
  );
};

export default Rating;
