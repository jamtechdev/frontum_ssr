export function calculateNextStep(maxLimit,minLimit, mulfactor) {
  let nextStepVal= (maxLimit-minLimit)/(mulfactor-1)
  nextStepVal =  Math.ceil(nextStepVal)
  return { nextStepVal };
}
  