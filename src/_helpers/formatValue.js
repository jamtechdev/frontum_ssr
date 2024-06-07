const formatValue = (value) => {
  if (value % 1 === 0 && value !== 10) {
    return `${value}.0`;
  }
  return value?.toFixed(1);
};

export default formatValue;
