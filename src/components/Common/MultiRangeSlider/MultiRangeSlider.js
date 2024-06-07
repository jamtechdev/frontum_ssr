import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import "./multiRangeSlider.css";

const MultiRangeSlider = ({
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

  const step = 1; // Step value set to 1 for whole number intervals

  const getPercent = useCallback((value) =>
    Math.round(((value - min) / (max - min)) * 100)
  );

  useEffect(() => {
    if (rangeVal?.maxVal) {
      setMaxVal(rangeVal?.maxVal);
      setMinVal(rangeVal?.minVal);
      const minPercent = getPercent(rangeVal?.minVal);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `100%`;
      }
    }
  }, [rangeVal]);

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

  return (
    <div className="multi-range-slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal);
          setMinVal(Math.round(value)); // Round to nearest integer
          minValRef.current = Math.round(value);
        }}
        onMouseUp={() => onChange({ min: minVal, max: maxVal })}
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
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal);
          setMaxVal(Math.round(value)); // Round to nearest integer
          maxValRef.current = Math.round(value);
        }}
        onMouseUp={() => onChange({ min: minVal, max: maxVal })}
        id={`thumb thumb--right ${classForSlider}`}
        className={`thumb thumb--right ${classForSlider}`}
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
      </div>
      <div className="values">
        <label>
          {minVal.toFixed(0)} {unit}
        </label>
        <label>
          {maxVal.toFixed(0)} {unit}
        </label>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
