const listEl = document.getElementById('file-list');
const pathEl = document.getElementById('current-path');

function render(entries, dir) {
  pathEl.textContent = 'Текущий каталог: ' + dir;
  listEl.innerHTML = '';
  entries.forEach(e => {
    const li = document.createElement('li');
    li.textContent = e.name + (e.isDir ? '/' : '');
    li.className = e.isDir ? 'dir' : 'file';
    listEl.appendChild(li);
  });
}

document.getElementById('btn-current').addEventListener('click', async () => {
  const entries = await window.api.listDir('.');
  render(entries, '.');
});

document.getElementById('btn-select').addEventListener('click', async () => {
  const dir = await window.api.selectDirectory();
  if (!dir) return;
  const entries = await window.api.listDir(dir);
  render(entries, dir);
});