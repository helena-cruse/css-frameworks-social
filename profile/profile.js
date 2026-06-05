const navToggle = document.getElementById("navToggle");
const navListMobile = document.getElementById("navListMobile");
const profilePosts = document.getElementById("profilePosts");
const noPosts = document.getElementById("noPosts");
const postsCount = document.getElementById("postsCount");

const editProfileButton = document.getElementById("editProfile");
const editProfilePanel = document.getElementById("editProfilePanel");
const editProfileForm = document.getElementById("editProfileForm");
const cancelEditProfile = document.getElementById("cancelEditProfile");

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileBio = document.getElementById("profileBio");
const editName = document.getElementById("editName");
const editImage = document.getElementById("editImage");
const editBio = document.getElementById("editBio");

const DEFAULT_PROFILE = {
  name: "Brigt",
  bio: "Sharing moments, thoughts and a bit of inspiration every day.",
  image: "https://i.pravatar.cc/150?img=13",
};

navToggle?.addEventListener("click", () => {
  navListMobile?.classList.toggle("hidden");
});

function escapeHtml(string = "") {
  return String(string).replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[match])
  );
}

function getStoredPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem("hs_posts") || "[]");
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

function getProfile() {
  try {
    return (
      JSON.parse(localStorage.getItem("hs_profile") || "null") ||
      DEFAULT_PROFILE
    );
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(profile) {
  localStorage.setItem("hs_profile", JSON.stringify(profile));
}

function renderProfile() {
  const profile = getProfile();

  profileName.textContent = profile.name;
  profileBio.textContent = profile.bio;
  profileImage.src = profile.image || DEFAULT_PROFILE.image;

  editName.value = profile.name;
  editBio.value = profile.bio;
  editImage.value = profile.image || "";
}

function postCardHTML(post) {
  const image = post.image
    ? `<img src="${escapeHtml(
        post.image
      )}" alt="" class="aspect-square w-full object-cover">`
    : `<div class="grid aspect-square w-full place-items-center bg-blue-50 text-5xl font-black text-blue-600">#</div>`;

  return `
    <article class="overflow-hidden rounded-3xl border bg-white shadow-sm">
      ${image}
      <div class="p-4">
        <h3 class="font-black">${escapeHtml(post.title || "Untitled post")}</h3>
        <p class="mt-2 line-clamp-2 text-sm text-gray-500">${escapeHtml(
          post.body || ""
        )}</p>
      </div>
    </article>
  `;
}

function renderProfilePosts() {
  const posts = getStoredPosts();

  postsCount.textContent = posts.length;

  if (posts.length === 0) {
    noPosts.classList.remove("hidden");
    profilePosts.innerHTML = "";
    return;
  }

  noPosts.classList.add("hidden");
  profilePosts.innerHTML = posts.map(postCardHTML).join("");
}

editProfileButton?.addEventListener("click", () => {
  editProfilePanel.classList.toggle("hidden");

  if (!editProfilePanel.classList.contains("hidden")) {
    editName.focus();
  }
});

cancelEditProfile?.addEventListener("click", () => {
  editProfilePanel.classList.add("hidden");
  renderProfile();
});

editProfileForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  saveProfile({
    name: editName.value.trim() || DEFAULT_PROFILE.name,
    bio: editBio.value.trim() || DEFAULT_PROFILE.bio,
    image: editImage.value.trim() || DEFAULT_PROFILE.image,
  });

  renderProfile();
  editProfilePanel.classList.add("hidden");
});

renderProfile();
renderProfilePosts();
