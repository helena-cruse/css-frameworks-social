const navToggle = document.getElementById("navToggle");
const navListMobile = document.getElementById("navListMobile");
const createToggle = document.getElementById("createToggle");
const createToggleEmpty = document.getElementById("createToggleEmpty");
const createForm = document.getElementById("createForm");
const postsGrid = document.getElementById("postsGrid");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptyText = document.getElementById("emptyText");
const searchInput = document.getElementById("searchInput");
const postCount = document.getElementById("postCount");
const toast = document.getElementById("toast");

navToggle?.addEventListener("click", () => {
  navListMobile?.classList.toggle("hidden");
});

function toggleCreate() {
  createForm.classList.toggle("hidden");

  if (!createForm.classList.contains("hidden")) {
    document.getElementById("postTitle")?.focus();
  }
}

createToggle?.addEventListener("click", toggleCreate);
createToggleEmpty?.addEventListener("click", toggleCreate);

function getStoredPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem("hs_posts") || "[]");
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem("hs_posts", JSON.stringify(posts));
}

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

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalisePost(post) {
  return {
    id: post.id || createId(),
    title: post.title || "Untitled post",
    body: post.body || "",
    image: post.image || "",
    createdAt: post.createdAt || Date.now(),
    liked: Boolean(post.liked),
    likes: Number(post.likes || 0),
    comments: Array.isArray(post.comments) ? post.comments : [],
  };
}

function getPosts() {
  const posts = getStoredPosts().map(normalisePost);
  savePosts(posts);
  return posts;
}

function formatDate(timestamp) {
  return new Date(timestamp || Date.now()).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function showToast() {
  toast?.classList.remove("hidden");

  window.setTimeout(() => {
    toast?.classList.add("hidden");
  }, 2500);
}

function postCardHTML(post) {
  const image = post.image
    ? `<img src="${escapeHtml(
        post.image
      )}" alt="" class="mt-4 max-h-[520px] w-full rounded-2xl object-cover">`
    : "";

  const comments = post.comments
    .map(
      (comment) => `
        <div class="rounded-2xl bg-gray-50 px-4 py-3 text-sm">
          <p class="font-black text-gray-950">Member</p>
          <p class="mt-1 text-gray-600">${escapeHtml(comment.text)}</p>
        </div>
      `
    )
    .join("");

  return `
    <article class="rounded-3xl border bg-white p-5 shadow-sm">
      <div class="flex items-center gap-3">
        <img src="https://i.pravatar.cc/150?img=13" alt="" class="h-11 w-11 rounded-full object-cover">
        <div class="min-w-0 flex-1">
          <p class="font-bold text-gray-900">Member</p>
          <p class="text-xs text-gray-500">${formatDate(post.createdAt)}</p>
        </div>
      </div>

      ${image}

      <div class="mt-4">
        <h2 class="text-lg font-black">${escapeHtml(post.title)}</h2>
        <p class="mt-2 text-sm leading-6 text-gray-600">${escapeHtml(
          post.body
        )}</p>
      </div>

      <div class="mt-5 flex gap-5 border-t pt-4 text-sm font-bold text-gray-500">
        <button data-like="${post.id}" class="${
    post.liked ? "text-blue-600" : "hover:text-blue-600"
  }">
          ${post.liked ? "♥" : "♡"} Like ${
    post.likes > 0 ? `(${post.likes})` : ""
  }
        </button>

        <button data-comment-toggle="${post.id}" class="hover:text-blue-600">
          💬 Comment ${
            post.comments.length > 0 ? `(${post.comments.length})` : ""
          }
        </button>
      </div>

      <div id="comments-${post.id}" class="mt-4 hidden space-y-3">
        ${comments}

        <form data-comment-form="${post.id}" class="flex gap-2">
          <input
            name="comment"
            type="text"
            required
            minlength="1"
            placeholder="Write a comment..."
            class="flex-1 rounded-full border bg-gray-50 px-4 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-100"
          />
          <button class="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
            Post
          </button>
        </form>
      </div>
    </article>
  `;
}

function renderPosts(filter = "") {
  const posts = getPosts();
  const query = filter.trim().toLowerCase();

  const visiblePosts = query
    ? posts.filter((post) => {
        return (
          String(post.title || "")
            .toLowerCase()
            .includes(query) ||
          String(post.body || "")
            .toLowerCase()
            .includes(query)
        );
      })
    : posts;

  if (postCount) {
    postCount.textContent = posts.length;
  }

  if (visiblePosts.length === 0) {
    postsGrid.classList.add("hidden");
    emptyState.classList.remove("hidden");
    postsGrid.innerHTML = "";

    if (query) {
      emptyTitle.textContent = "No matching posts";
      emptyText.textContent = `No posts matched "${filter}". Try another search.`;
      createToggleEmpty.classList.add("hidden");
    } else {
      emptyTitle.textContent = "No posts yet";
      emptyText.textContent = "Create your first post to get started.";
      createToggleEmpty.classList.remove("hidden");
    }

    return;
  }

  emptyState.classList.add("hidden");
  postsGrid.classList.remove("hidden");
  postsGrid.innerHTML = visiblePosts.map(postCardHTML).join("");
}

createForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const image = document.getElementById("postImage").value.trim();
  const body = document.getElementById("postBody").value.trim();

  if (!title || !body) return;

  const posts = getStoredPosts().map(normalisePost);

  posts.unshift({
    id: createId(),
    title,
    image,
    body,
    createdAt: Date.now(),
    liked: false,
    likes: 0,
    comments: [],
  });

  savePosts(posts);

  createForm.reset();
  createForm.classList.add("hidden");
  searchInput.value = "";

  renderPosts();
  showToast();
});

postsGrid?.addEventListener("click", (event) => {
  const likeButton = event.target.closest("[data-like]");
  const commentButton = event.target.closest("[data-comment-toggle]");

  if (likeButton) {
    const postId = likeButton.dataset.like;
    const posts = getPosts();

    const updatedPosts = posts.map((post) => {
      if (post.id !== postId) return post;

      const liked = !post.liked;

      return {
        ...post,
        liked,
        likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
      };
    });

    savePosts(updatedPosts);
    renderPosts(searchInput.value);
  }

  if (commentButton) {
    const postId = commentButton.dataset.commentToggle;
    document.getElementById(`comments-${postId}`)?.classList.toggle("hidden");
  }
});

postsGrid?.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-comment-form]");
  if (!form) return;

  event.preventDefault();

  const postId = form.dataset.commentForm;
  const input = form.elements.comment;
  const text = input.value.trim();

  if (!text) return;

  const posts = getPosts();

  const updatedPosts = posts.map((post) => {
    if (post.id !== postId) return post;

    return {
      ...post,
      comments: [
        ...post.comments,
        {
          id: createId(),
          text,
          createdAt: Date.now(),
        },
      ],
    };
  });

  savePosts(updatedPosts);
  renderPosts(searchInput.value);

  requestAnimationFrame(() => {
    document.getElementById(`comments-${postId}`)?.classList.remove("hidden");
  });
});

searchInput?.addEventListener("input", () => renderPosts(searchInput.value));

renderPosts();
