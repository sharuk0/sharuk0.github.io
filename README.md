# sharuk0.github.io — Sharuko

Página personal minimalista (blog + notas técnicas) construida con **Jekyll**, lista
para **GitHub Pages**. Estética editorial sobria: fondo claro cálido, tipografía serif
para títulos, mucho espacio en blanco. Sin backend, sin base de datos.

- **Markdown** para los posts (`_posts/`).
- **LaTeX** vía MathJax 3 (inline `$...$` y display `$$...$$`).
- **Resaltado de código** con Rouge (integrado en Jekyll).
- **Filtro de tags** simple en `/blog` (JS mínimo) y botón de copiar en bloques de código.

## Estructura

```
sharuk0.github.io/
  _config.yml            # configuración + tus enlaces (GitHub, LinkedIn, email)
  index.md               # homepage
  about.md               # /about/
  blog.md                # /blog/  (listado + filtro de tags)
  _layouts/
    default.html         # shell (header, footer, MathJax, CSS)
    post.html            # plantilla de cada post
  _includes/
    header.html          # navegación superior
    footer.html
  _posts/                # tus notas en Markdown
    2026-06-11-caesar-cipher.md
    2026-06-11-lattice-crypto-notes.md
    2026-06-11-kerberoasting-notes.md
  assets/
    css/style.css        # todo el diseño
    js/main.js           # filtro de tags + copiar código
  Gemfile
```

## Correr en local

Necesitas Ruby. Luego:

```bash
gem install bundler
bundle install
bundle exec jekyll serve --livereload
```

Abre http://localhost:4000. (En la primera ejecución Bundler descargará las gemas de
`github-pages`, que reproducen el entorno exacto de GitHub.)

## Subir a GitHub Pages (gratis)

Como es un **repo de usuario** (`sharuk0.github.io`), no hay que configurar `baseurl`:
ya está vacío y `url` apunta a `https://sharuk0.github.io`.

```bash
git init
git add .
git commit -m "init: personal site"
git branch -M main
git remote add origin https://github.com/sharuk0/sharuk0.github.io.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
rama `main`, carpeta `/ (root)`. GitHub construye el sitio con Jekyll automáticamente y en
1–2 minutos estará en **https://sharuk0.github.io/**. No necesitas GitHub Actions.

## Agregar un nuevo post

Crea un archivo en `_posts/` con el formato `AAAA-MM-DD-titulo.md`:

```markdown
---
layout: post
title: "Mi nueva nota"
description: "Resumen de una línea que aparece en el listado."
date: 2026-06-20
tags: [crypto, ctf]
---

Texto en Markdown. LaTeX inline: $a^2 + b^2 = c^2$.

$$
c_i \equiv m_i + k \pmod{n}
$$

```python
print("código con resaltado")
```
```

El post aparece solo en la homepage (Latest writing) y en `/blog`. Los tags nuevos se
añaden automáticamente al filtro y a la sección Topics; no hay que tocar nada más.

## Cambiar enlaces de GitHub / LinkedIn / email

Todo está en `_config.yml`:

```yaml
github_username: sharuk0
linkedin_url: "https://www.linkedin.com/in/USERNAME"   # <-- cámbialo
email: "correo@ejemplo.com"                            # <-- cámbialo
```

Cambia esos valores y los enlaces del header, el footer y la página About se actualizan
solos.

## Notas técnicas

- **LaTeX**: en `_config.yml` está `math_engine: null`, lo que hace que kramdown deje los
  delimitadores `$` y `$$` intactos para que MathJax 3 los renderice en el navegador. Si
  alguna vez ves la fórmula como texto crudo, confirma que ese valor sigue en `null`.
- **Código**: Rouge ya viene con Jekyll/GitHub Pages. El tema de colores (claro y cálido)
  está definido al final de `style.css`, en las clases `.highlight .*`.
- **Fuentes**: Source Serif 4 (títulos) y JetBrains Mono (código/metadatos) se cargan desde
  Google Fonts; el cuerpo usa la fuente del sistema para máxima velocidad.
