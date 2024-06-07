export function tickValues(start, noOfTicks, increment) {
  let ticks = [];
  let nextTickVal = start;
  let steps = noOfTicks;
  
  while (steps > 0) {
    ticks.push(nextTickVal);
    nextTickVal += increment;
    steps--;
  }
  
  return {ticks};
}
