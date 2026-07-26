/**
 * Generates an official, high-resolution rectangular rubber stamp Data URL
 * matching the blue "HARIHAR CARGO CARRIERS" stamp design.
 */
export const getCompanyStampDataURL = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');

  const stampColor = '#1e40af'; // Official Transport Blue Ink

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Slight tilt (-6 degrees) to mimic a real hand-placed rubber stamp
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-6 * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  const x = 20;
  const y = 20;
  const width = 360;
  const height = 200;
  const radius = 18;

  // Outer Rounded Rectangle
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.strokeStyle = stampColor;
  ctx.lineWidth = 5.5;
  ctx.stroke();

  // Inner Thin Rounded Rectangle Border
  ctx.beginPath();
  ctx.roundRect(x + 7, y + 7, width - 14, height - 14, radius - 4);
  ctx.strokeStyle = stampColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Typography Settings
  ctx.textAlign = 'center';
  ctx.fillStyle = stampColor;

  // Line 1: HARIHAR CARGO
  ctx.font = '900 28px Arial, Helvetica, sans-serif';
  ctx.fillText('HARIHAR CARGO', canvas.width / 2, y + 52);

  // Line 2: CARRIERS
  ctx.font = '900 26px Arial, Helvetica, sans-serif';
  ctx.fillText('CARRIERS', canvas.width / 2, y + 88);

  // Line 3: ★ ALL INDIA ★
  ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
  ctx.fillText('★ ALL INDIA ★', canvas.width / 2, y + 122);

  // Line 4: Dashed Separator Line
  ctx.beginPath();
  ctx.setLineDash([8, 5]);
  ctx.moveTo(x + 25, y + 140);
  ctx.lineTo(x + width - 25, y + 140);
  ctx.strokeStyle = stampColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Line 5: AUTHORIZED
  ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
  ctx.fillText('AUTHORIZED', canvas.width / 2, y + 172);

  // Realistic Ink Bleed / Stamp Texture Effect
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // Random subtle speckles inside ink regions
    if (data[i + 3] > 0 && Math.random() < 0.08) {
      data[i + 3] = Math.floor(data[i + 3] * (0.4 + Math.random() * 0.5));
    }
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.restore();

  return canvas.toDataURL('image/png');
};