const praticarBtn = document.getElementById('praticarBtn');
const praticarSubmenu = document.getElementById('praticarSubmenu');

praticarBtn.addEventListener('click', () => {
  praticarSubmenu.classList.toggle('abrir');
});

document.addEventListener('click', function(event) {
  const isClickInside = praticarBtn.contains(event.target) || praticarSubmenu.contains(event.target);
  if (!isClickInside) {
    praticarSubmenu.classList.remove('abrir');
  }
});

const menuToggle = document.getElementById('menu-toggle');
menuToggle.addEventListener('change', () => {
  if (!menuToggle.checked) {
    praticarSubmenu.classList.remove('abrir');
  }
});