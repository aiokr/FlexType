export default function convertDMSToDecimal(dmsStr: string) {

  // console.log('dmsStr: ' + dmsStr)

  if (dmsStr === '0/1,0/1,0/1') {
    return 0
  } else if (!dmsStr) {
    return 0
  }

  // Split the DMS string into parts
  const parts = dmsStr.split(',');

  // Extract degrees, minutes, and seconds
  const degrees = parts[0].split('/')[0];
  const degreesDivisor = parts[0].split('/')[1];
  const minutes = parts[1].split('/')[0];
  const minutesDivisor = parts[1].split('/')[1];
  const seconds = parts[2].split('/')[0];
  const secondsDivisor = parts[2].split('/')[1];

  // Convert these strings to numbers and calculate the decimal degrees
  const degreesNum = Number(degrees) / Number(degreesDivisor);
  const minutesNum = Number(minutes) / Number(minutesDivisor);
  const secondsNum = Number(seconds) / Number(secondsDivisor);

  // The formula to convert dms to decimal is:
  // decimal = degrees + (minutes / 60) + (seconds / 3600)
  const decimal = degreesNum + (minutesNum / 60) + (secondsNum / 3600);

  return decimal.toFixed(6);
}