// === Social Menu ===
const userMenuBtn = document.getElementById('user-menu');
const socialMenu = document.createElement('div');
socialMenu.className = "fixed right-4 top-20 bg-white rounded-lg shadow-lg p-4";
socialMenu.style.display = "none";
socialMenu.innerHTML = `
  <div class="flex flex-col space-y-3">
    <a href="https://www.instagram.com/for_evershya10" class="flex items-center space-x-2 text-gray-700 hover:text-red-500"><i class="fab fa-instagram text-xl"></i><span>Instagram</span></a>
    <a href="https://www.youtube.com/@Naoticaceha" class="flex items-center space-x-2 text-gray-700 hover:text-red-500"><i class="fab fa-youtube text-xl"></i><span>Yutup</span></a>
    <a href="https://github.com/Naotica2" class="flex items-center space-x-2 text-gray-700 hover:text-red-500"><i class="fab fa-github text-xl"></i><span>Github</span></a>
    <a href="https://youtu.be/xvFZjo5PgG0?si=RtrekDzT-Rk9eKiv" class="flex items-center space-x-2 text-gray-700 hover:text-red-500"><i class="fab fa-facebook text-xl"></i><span>Fesnuk</span></a>
  </div>
`;
document.body.appendChild(socialMenu);

userMenuBtn.addEventListener('click', e => {
  e.stopPropagation();
  socialMenu.style.display = socialMenu.style.display === 'none' ? 'block' : 'none';
});
document.addEventListener('click', () => socialMenu.style.display = 'none');
socialMenu.addEventListener('click', e => e.stopPropagation());


// === Gallery Fetch + Render ===
const gallery = document.getElementById('gallery');
let currentDownloadURL = "";

fetch('image.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = "pin-card bg-white rounded-xl overflow-hidden shadow-md";
      card.setAttribute('data-tags', item.tags || '');

      const imageContainer = document.createElement('div');
      imageContainer.className = "pin-image-container";

      const img = new Image();
      img.src = item.src;
      img.alt = item.alt || "";
      img.className = "pin-image cursor-zoom-in";

      img.addEventListener('click', () => showImageDetails(item));
      imageContainer.appendChild(img);

      const content = `
        <div class="absolute top-0 right-0 p-2">
          <button class="like-btn bg-white rounded-full p-2 shadow-md hover:bg-gray-100" data-liked="false">
            <i class="far fa-heart text-gray-700"></i>
          </button>
        </div>
        <div class="p-4">
          <div class="mb-2"><span class="text-sm font-medium">${item.username}</span></div>
          <p class="text-sm text-gray-600 mb-2">${item.description}</p>
          <div class="flex justify-between items-center">
            <div class="flex space-x-2 text-xs text-gray-500">
              <span><i class="fas fa-apk mr-1"></i>${item.location}</span>
              <span><i class="far fa-comment mr-1"></i>${item.comments}</span>
              <span><i class="far fa-heart mr-1"></i><span class="like-count">${item.likes}</span></span>
            </div>
            <button class="like-toggle text-xs text-red-500 font-medium hover:text-red-600"><i class="far fa-heart mr-1"></i> Like</button>
          </div>
        </div>
      `;
      card.appendChild(imageContainer);
      card.insertAdjacentHTML('beforeend', content);
      gallery.appendChild(card);
    });
  });


// === Modal ===
function showImageDetails(item) {
  document.getElementById("modal-image").src = item.src;
  document.getElementById("modal-username").textContent = item.username;
  document.getElementById("modal-description").textContent = item.description;
  document.getElementById("modal-like-count").textContent = item.likes;
  document.getElementById("modal-comment-count").textContent = item.comments;

  currentDownloadURL = item.download || item.src;

  const commentList = document.getElementById("comment-list");
  commentList.innerHTML = "";
  if (item.commentList) {
    item.commentList.forEach(c => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${c.user}</strong><p>${c.text}</p>`;
      commentList.appendChild(div);
    });
  }

  const modal = document.getElementById("image-modal");
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("active"), 10);

  history.pushState({ modalOpen: true }, '');
}

function closeModal() {
  const modal = document.getElementById('image-modal');
  modal.classList.remove('active');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

document.querySelector('.close-modal').addEventListener('click', () => {
  closeModal();
  if (history.state?.modalOpen) history.back();
});

window.addEventListener('popstate', () => {
  const modal = document.getElementById('image-modal');
  if (modal.classList.contains('active')) closeModal();
});


// === Download ===
document.getElementById("download-btn").addEventListener("click", () => {
  const url = currentDownloadURL;
  const a = document.createElement("a");
  a.href = url;
  a.download = "pinfolio-image.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});


// === Comment ===
document.getElementById("comment-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter" && this.value.trim() !== "") {
    const commentText = this.value.trim();
    const commentList = document.getElementById("comment-list");

    const newComment = document.createElement("div");
    newComment.innerHTML = `<strong>You</strong><p>${commentText}</p>`;
    commentList.appendChild(newComment);

    this.value = "";
  }
});


// === Like Toggle ===
document.addEventListener('click', function (e) {
  if (e.target.closest('.like-toggle')) {
    const btn = e.target.closest('.like-toggle');
    const likeCountEl = btn.closest('.pin-card').querySelector('.like-count');
    let currentLikes = parseInt(likeCountEl.textContent);
    const icon = btn.querySelector('i');

    if (btn.classList.contains('liked')) {
      currentLikes -= 1;
      icon.classList.remove('fas');
      icon.classList.add('far');
      btn.classList.remove('liked');
    } else {
      currentLikes += 1;
      icon.classList.remove('far');
      icon.classList.add('fas');
      btn.classList.add('liked');
    }

    likeCountEl.textContent = currentLikes;
  }
});


// === Filter Tag ===
document.querySelectorAll('.tag-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tag-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.getAttribute('data-tag');
    document.querySelectorAll('.pin-card').forEach(card => {
      const tags = card.getAttribute('data-tags');
      card.style.display = tag === 'all' || tags.includes(tag) ? 'block' : 'none';
    });
  });
});


// === Search Filter ===
document.querySelector('input[placeholder="Search"]').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  document.querySelectorAll('.pin-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(keyword) ? 'block' : 'none';
  });
});
