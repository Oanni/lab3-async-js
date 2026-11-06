const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

const loadBtn = document.getElementById('loadBtn');
const postForm = document.getElementById('postForm');
const titleInput = document.getElementById('titleInput');
const textInput = document.getElementById('textInput');
const postsList = document.getElementById('postsList');
const messageEl = document.getElementById('message');

let loading = false;

function setMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
}

function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = 'message';
}

function renderPosts(posts) {
  postsList.innerHTML = '';
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
    postsList.appendChild(card);
  });
}

async function loadPosts() {
  if (loading) return;
  loading = true;
  loadBtn.disabled = true;
  setMessage('Загрузка...', 'info');
  try {
    const response = await fetch(POSTS_URL);
    if (!response.ok) {
      throw new Error('Ошибка загрузки: ' + response.status);
    }
    const posts = await response.json();
    renderPosts(posts);
    clearMessage();
  } catch (err) {
    setMessage(err.message, 'error');
  } finally {
    loading = false;
    loadBtn.disabled = false;
  }
}

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (loading) return;

  const title = titleInput.value.trim();
  const body = textInput.value.trim();

  if (!title || !body) {
    setMessage('Заполните заголовок и текст', 'error');
    return;
  }

  loading = true;
  const submitBtn = postForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  setMessage('Отправка...', 'info');

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body, userId: 1 }),
    });

    if (!response.ok) {
      throw new Error('Ошибка отправки: ' + response.status);
    }

    const result = await response.json();
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `<h3>${result.title}</h3><p>${result.body}</p>`;
    postsList.insertBefore(card, postsList.firstChild);

    postForm.reset();
    setMessage(`Публикация "${result.title}" успешно создана (ID: ${result.id})`, 'success');
  } catch (err) {
    setMessage(err.message, 'error');
  } finally {
    loading = false;
    submitBtn.disabled = false;
  }
});

loadBtn.addEventListener('click', loadPosts);