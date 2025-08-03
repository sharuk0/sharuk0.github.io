// Lista manual de posts (luego se puede automatizar con GitHub Actions si quieres)
const posts = [
  "2025-08-02-first-post.md",
  "2025-08-05-second-post.md"
];

const container = document.getElementById("journal-container");

posts.forEach(file => {
  fetch(`journals/${file}`)
    .then(res => res.text())
    .then(text => {
      // Parse front matter
      const match = /^---\n([\s\S]*?)\n---/.exec(text);
      let meta = {};
      if (match) {
        match[1].split("\n").forEach(line => {
          const [key, ...rest] = line.split(":");
          if (key && rest.length) {
            meta[key.trim()] = rest.join(":").trim().replace(/"/g, "");
          }
        });
        text = text.replace(match[0], ""); // remove front matter
      }

      // Create card
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${meta.title || "Untitled"}</h2>
        <p>${meta.date || ""}</p>
        <p>${text.split("\n")[0]}</p>
        <div class="tags">
          ${(meta.tags || "").split(",").map(t => `<span class="tag">${t.trim()}</span>`).join("")}
        </div>
      `;
      container.appendChild(card);
    });
});
