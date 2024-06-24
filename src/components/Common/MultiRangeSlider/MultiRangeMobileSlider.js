import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";

const MultiRangeMobileSlider = ({
  min,
  max,
  onChange,
  unit,
  classForSlider,
  rangeVal,
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const step = 1; // Adjust the step value for better precision

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (rangeVal?.maxVal) {
      setMaxVal(rangeVal?.maxVal);
      setMinVal(rangeVal?.minVal);
      const minPercent = getPercent(rangeVal?.minVal);
      const maxPercent = getPercent(rangeVal?.maxVal);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [rangeVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  const handleTouchMove = (event) => {
    const rect = range.current.getBoundingClientRect();
    const touch = event.touches[0];
    const sliderWidth = rect.width / (max - min);
    const clientX = touch.clientX - rect.left;

    if (event.target.id.includes("thumb--left")) {
      let newValue = clientX / sliderWidth + min;
      newValue = Math.min(Math.max(newValue, min), max);

      // Check if thumb--left is beyond thumb--right, adjust thumb--right if necessary
      if (newValue >= maxValRef.current) {
        setMaxVal(parseFloat(newValue).toFixed(2));
        maxValRef.current = parseFloat(newValue).toFixed(2);
      }

      setMinVal(parseFloat(newValue).toFixed(2));
      minValRef.current = parseFloat(newValue).toFixed(2);
    } else if (event.target.id.includes("thumb--right")) {
      let newValue = clientX / sliderWidth + min;
      newValue = Math.min(Math.max(newValue, min), max);
      setMaxVal(parseFloat(newValue).toFixed(2));
      maxValRef.current = parseFloat(newValue).toFixed(2);
    }

    onChange({ min: minValRef.current, max: maxValRef.current });
  };

  return (
    <div className="multi-range-slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => onChange({ min: minVal, max: maxVal })}
        id={`thumb thumb--left ${classForSlider}`}
        className={`thumb thumb--left ${classForSlider}`}
        style={{ zIndex: minVal > max - step && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => onChange({ min: minVal, max: maxVal })}
        id={`thumb thumb--right ${classForSlider}`}
        className={`thumb thumb--right ${classForSlider}`}
      />
      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
      </div>
      <div className="values">
        <label>
          {typeof minVal === "number"
            ? Number.isInteger(minVal)
              ? minVal.toFixed(0)
              : minVal.toFixed(1)
            : minVal}
          {unit}
        </label>
        <label>
          {typeof maxVal === "number"
            ? Number.isInteger(maxVal)
              ? maxVal.toFixed(0)
              : maxVal.toFixed(1)
            : ""}
          {unit}
        </label>
      </div>
    </div>
  );
};

MultiRangeMobileSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.string,
  classForSlider: PropTypes.string,
  rangeVal: PropTypes.shape({
    minVal: PropTypes.number,
    maxVal: PropTypes.number,
  }),
};

export default MultiRangeMobileSlider;
