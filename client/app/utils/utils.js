
export function getWorkoutLatLng(samples) {
  const latLngs = [];

  samples.forEach((sample) => {
    if (sample.values.positionLat) {
      latLngs.push([sample.values.positionLat, sample.values.positionLong]);
    }
  });

  return latLngs;
};



export function getWorkoutTimePower(samples) {
  return samples.map((sample) => {
    return [sample.millisecondOffset, sample.values.power];
  });
};



export function getMaxPowerAverage(rangeMinutes, samples) {
  const range = rangeMinutes * 60;

  let workingSum = 0;
  let powerEnd = range - 1;

  // Get sum of initial range
  for (let i = 0; i < range; i++) {
    workingSum += samples[i].values.power;
  }

  let powerSum = workingSum;

  // Figure out the largest range sum
  for (let j = range; j < samples.length; j++) {
    const newVal = samples[j].values.power;
    const droppedVal = samples[j - range].values.power;

    workingSum += (newVal - droppedVal);

    if (workingSum > powerSum) {
      powerSum = workingSum;
      powerEnd = j;
    }
  }

  // Save subarray of range
  const subRange = [];
  for (let k = (powerEnd - range); k <= powerEnd; k++) {
    subRange.push(samples[k]);
  }


  // Calculate and return average
  return {
    average: (powerSum/range).toFixed(2),
    endPoint: powerEnd,
    range: rangeMinutes,
    items: subRange,
    itemsLatLng: getWorkoutLatLng(subRange),
    itemsTimePower: getWorkoutTimePower(subRange),
  };
};