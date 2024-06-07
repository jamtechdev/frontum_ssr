export function calculateNextStep(maxLimit, mulfactor) {
  const multipleFactor = mulfactor ?? 5;
  let maxVal = maxLimit;
  let nextStepVal = 0;

  if (!isOriginalNumMultipleOfmultipleFactor(maxVal)) {
    maxVal = makeNumberInMultipleofmultipleFactor(maxVal);
  }

  nextStepVal = maxVal / multipleFactor;
  
  if (!isStepMultipleOfmultipleFactor(nextStepVal)) {
    nextStepVal = makeNumberInMultipleofmultipleFactor(nextStepVal);
  }
  
  function isOriginalNumMultipleOfmultipleFactor(val) {
    return isNumIsMultipleOfmultipleFactor(val);
  }
  
  function isStepMultipleOfmultipleFactor(val) {
    return isNumIsMultipleOfmultipleFactor(val);
  } 
  
  function isNumIsMultipleOfmultipleFactor(val) {
    if (val % multipleFactor === 0) {
      return true;
    }
    return false;
  }

  function makeNumberInMultipleofmultipleFactor(val) {
    const reminder = val % multipleFactor;
    const paddDigit = multipleFactor - reminder;
    val = val + paddDigit;
    return val;
  }
  
  return { nextStepVal };
}
