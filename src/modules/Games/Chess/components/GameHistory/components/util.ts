function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
      };
}

function map(
  value: number,
  fromSource: number,
  toSource: number,
  fromTarget: number,
  toTarget: number
) {
  return ((value - fromSource) / (toSource - fromSource)) * (toTarget - fromTarget) + fromTarget;
}

// Taken from here https://stackoverflow.com/a/46543292
export function getColor(
  startColour: string,
  endColour: string,
  min: number,
  max: number,
  value: number
) {
  var startRGB = hexToRgb(startColour);
  var endRGB = hexToRgb(endColour);
  var percentFade = map(value, min, max, 0, 1);

  var diffRed = endRGB.r - startRGB.r;
  var diffGreen = endRGB.g - startRGB.g;
  var diffBlue = endRGB.b - startRGB.b;

  diffRed = diffRed * percentFade + startRGB.r;
  diffGreen = diffGreen * percentFade + startRGB.g;
  diffBlue = diffBlue * percentFade + startRGB.b;

  var result =
    'rgb(' + Math.round(diffRed) + ', ' + Math.round(diffGreen) + ', ' + Math.round(diffBlue) + ')';
  return result;
}
