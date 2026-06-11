// ============================================================
//  Sharuko — JS mínimo: filtro de tags + copiar código
// ============================================================

// ---------- 1. Filtro de tags en /blog ----------
(function () {
  const filter = document.getElementById("tag-filter");
  const list = document.getElementById("post-list");
  if (!filter || !list) return;

  const items = Array.from(list.querySelectorAll("li"));
  const buttons = Array.from(filter.querySelectorAll("button"));
  const noResults = document.getElementById("no-results");

  function apply(tag) {
    let visible = 0;
    items.forEach((li) => {
      const tags = (li.dataset.tags || "").split(" ");
      const show = tag === "all" || tags.includes(tag);
      li.hidden = !show;
      if (show) visible++;
    });
    buttons.forEach((b) =>
      b.classList.toggle("active", b.dataset.tag === tag)
    );
    if (noResults) noResults.hidden = visible > 0;
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      apply(b.dataset.tag);
      history.replaceState(null, "", b.dataset.tag === "all" ? "#" : "#" + b.dataset.tag);
    })
  );

  // Click en un tag dentro de un post -> filtra
  list.querySelectorAll(".tag-link").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      apply(a.dataset.tag);
    })
  );

  // Aplica el tag del hash al cargar (ej: /blog/#crypto)
  const initial = decodeURIComponent(location.hash.replace("#", ""));
  if (initial && buttons.some((b) => b.dataset.tag === initial)) apply(initial);
})();

// ---------- 2. Botón "copiar" en bloques de código ----------
(function () {
  document.querySelectorAll(".highlighter-rouge").forEach((block) => {
    const pre = block.querySelector("pre");
    if (!pre) return;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "copy";
          btn.classList.remove("copied");
        }, 1500);
      } catch (_) {
        btn.textContent = "error";
      }
    });
    block.appendChild(btn);
  });
})();
