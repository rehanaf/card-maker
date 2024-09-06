const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const PORT = 3000;

const addFont = (family, weight,fileName) => {
  registerFont(path.join(__dirname, 'static', 'fonts', fileName), { family: family, weight: weight })
}

addFont('Poppins', 400, 'Poppins-Regular.ttf');
addFont('Poppins', 500, 'Poppins-Medium.ttf');
addFont('Poppins', 700, 'Poppins-Bold.ttf');

app.use(express.static(path.join(__dirname, 'static')));


app.get('/v0', (req, res) => {
  // Buat canvas
  const width = 1200;
  const height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Gambar latar belakang putih
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(0, 0, width, height);

  // Menggambar lingkaran pertama
  ctx.arc(100, 75, 50, 0, Math.PI * 2, false);
  ctx.stroke(); // Menggambar lingkaran pertama

  // Menggambar lingkaran kedua tanpa beginPath
  ctx.arc(150, 150, 50, 0, Math.PI * 2, false);
  ctx.stroke(); // Menggambar lingkaran kedua
  // Kirim gambar canvas sebagai respons
  res.setHeader('Content-Type', 'image/png');
  res.send(canvas.toBuffer('image/png'));
})

app.get('/v1', async (req, res) => {
  // dapatkan data dari query parameter
  const text = req.query.text || 'reyycard v1';
  const color = req.query.color || '#F1F5F9';
  const background = req.query.background?.replace(/%23/g, '#') || '#020617';
  const imageDefault = path.join(__dirname, 'default.jpg');
  let image = false;
  try {
    image = await loadImage(req.query.image || imageDefault);
  } catch (error) {
    image = await loadImage(imageDefault);
  }

  // Buat canvas
  const width = 1200;
  const height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Gambar latar belakang putih
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Muat gambar dan gambar potong bulat
  const x = width / 2;
  const y = 120;

  // Gambar lingkaran putih sebagai potongan gambar
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y + 180, 180, 0, Math.PI * 2);
  ctx.clip();

  // Gambar gambar yang sudah dipotong
  ctx.drawImage(image, x - 180, y, 360, 360);
  ctx.restore();

  // Gambar teks
  ctx.fillStyle = color;
  ctx.font = '500 80px Poppins';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, 600);

  // Kirim gambar canvas sebagai respons
  res.setHeader('Content-Type', 'image/png');
  res.send(canvas.toBuffer('image/png'));
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
