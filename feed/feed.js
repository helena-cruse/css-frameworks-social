const navToggle = document.getElementById("navToggle");
const navListMobile = document.getElementById("navListMobile");
navToggle.addEventListener("click", () =>
  navListMobile.classList.toggle("hidden")
);

const createToggle = document.getElementById("createToggle");
const createToggleEmpty = document.getElementById("createToggleEmpty");
const createForm = document.getElementById("createForm");
const postsGrid = document.getElementById("postsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

function toggleCreate() {
  createForm.classList.toggle("hidden");
  if (!createForm.classList.contains("hidden")) {
    createForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
createToggle.addEventListener("click", toggleCreate);
if (createToggleEmpty)
  createToggleEmpty.addEventListener("click", toggleCreate);

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem("hs_posts") || "[]");
  } catch {
    return [];
  }
}
function savePosts(posts) {
  localStorage.setItem("hs_posts", JSON.stringify(posts));
}
function escapeHtml(s = "") {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}
function postCardHTML(p) {
  const img = p.image
    ? `<img src="${p.image}" alt="" class="w-full aspect-video object-cover">`
    : "";
  const time = new Date(p.createdAt).toLocaleString();
  return `
    <article class="bg-white/90 backdrop-blur rounded-2xl shadow border overflow-hidden">
      ${img}
      <div class="p-4 space-y-2">
        <h2 class="font-semibold">${escapeHtml(p.title)}</h2>
        <p class="text-sm text-gray-600">${escapeHtml(p.body)}</p>
        <div class="text-xs text-gray-500">by @you • ${time}</div>
      </div>
    </article>
  `;
}
function renderPosts(filter = "") {
  const posts = getPosts();
  const q = filter.trim().toLowerCase();
  const visible = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
      )
    : posts;

  if (visible.length === 0) {
    postsGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    postsGrid.innerHTML = "";
    return;
  }
  emptyState.classList.add("hidden");
  postsGrid.classList.remove("hidden");
  postsGrid.innerHTML = visible.map(postCardHTML).join("");
}

createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("postTitle").value.trim();
  const image = document.getElementById("postImage").value.trim();
  const body = document.getElementById("postBody").value.trim();
  if (!title || !body) return;

  const posts = getPosts();
  posts.unshift({ title, image, body, createdAt: Date.now() });
  savePosts(posts);

  createForm.reset();
  createForm.classList.add("hidden");
  renderPosts(searchInput.value);
  postsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", () => renderPosts(searchInput.value));

renderPosts();
