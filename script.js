function calculate() {
  const plants = parseInt(document.getElementById('plants').value);
  const waterPerPlant = 0.5; // литров

  if (!plants || plants <= 0) {
    document.getElementById('result').innerText = 'Введите корректное число растений';
    return;
  }

  const total = plants * waterPerPlant;
  document.getElementById('result').innerText = `Нужно ${total} литров воды`;
}
