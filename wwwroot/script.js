const apiBase = '/api/cars';

async function fetchCars() {
  const res = await fetch(apiBase);
  const cars = await res.json();
  const tbody = document.querySelector('#cars-table tbody');
  tbody.innerHTML = '';
  cars.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${escapeHtml(c.make)}</td>
      <td>${escapeHtml(c.model)}</td>
      <td>${c.year}</td>
      <td>${c.price}</td>
      <td>
        <button data-id="${c.id}" class="edit">Editar</button>
        <button data-id="${c.id}" class="del">Deletar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str){
  if(!str) return '';
  return str.replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
}

async function init(){
  await fetchCars();
  document.getElementById('car-form').addEventListener('submit', onSave);
  document.getElementById('cars-table').addEventListener('click', onTableClick);
  document.getElementById('cancel-edit').addEventListener('click', resetForm);
}

async function onSave(e){
  e.preventDefault();
  const id = document.getElementById('car-id').value;
  const payload = {
    make: document.getElementById('make').value,
    model: document.getElementById('model').value,
    year: parseInt(document.getElementById('year').value) || 0,
    price: parseFloat(document.getElementById('price').value) || 0
  };
  if(id){
    payload.id = parseInt(id);
    await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
  } else {
    await fetch(apiBase, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
  }
  resetForm();
  await fetchCars();
}

function resetForm(){
  document.getElementById('car-id').value = '';
  document.getElementById('make').value = '';
  document.getElementById('model').value = '';
  document.getElementById('year').value = '';
  document.getElementById('price').value = '';
}

async function onTableClick(e){
  const id = e.target.dataset.id;
  if(!id) return;
  if(e.target.classList.contains('edit')){
    const res = await fetch(`${apiBase}/${id}`);
    const car = await res.json();
    document.getElementById('car-id').value = car.id;
    document.getElementById('make').value = car.make;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('price').value = car.price;
    window.scrollTo(0,0);
  } else if(e.target.classList.contains('del')){
    if(confirm('Deletar este carro?')){
      await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      await fetchCars();
    }
  }
}

window.addEventListener('DOMContentLoaded', init);
