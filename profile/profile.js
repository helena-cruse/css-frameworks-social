const navToggle = document.getElementById("navToggle");
const navListMobile = document.getElementById("navListMobile");
navToggle.addEventListener("click", () =>
  navListMobile.classList.toggle("hidden")
);

const profilePosts = document.getElementById("profilePosts");
const noPosts = document.getElementById("noPosts");

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem("hs_posts") || "[]");
  } catch {
    return [];
  }
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

function renderProfilePosts() {
  const posts = getPosts();
  if (posts.length === 0) {
    noPosts.classList.remove("hidden");
    profilePosts.innerHTML = "";
    return;
  }
  noPosts.classList.add("hidden");
  profilePosts.innerHTML = posts.map(postCardHTML).join("");
}

renderProfilePosts();
