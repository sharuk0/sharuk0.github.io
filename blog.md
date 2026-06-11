---
layout: default
title: Blog
permalink: /blog/
---

<h1>Blog</h1>
<p class="lead">Notes, writeups and research ideas.</p>

<div class="filter" id="tag-filter" role="group" aria-label="Filter posts by tag">
  <button class="active" data-tag="all">All</button>
  {% assign tags = site.tags | sort %}
  {% for tag in tags %}
  <button data-tag="{{ tag[0] }}">{{ tag[0] }}</button>
  {% endfor %}
</div>

<ul class="post-list" id="post-list">
  {% for post in site.posts %}
  <li data-tags="{{ post.tags | join: ' ' }}">
    <h2 class="p-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    {% if post.description %}<p class="p-desc">{{ post.description }}</p>{% endif %}
    <span class="post-meta">
      {{ post.date | date: "%b %-d, %Y" }}
      {% for tag in post.tags %}<span class="dot">·</span><a href="#{{ tag }}" class="tag-link" data-tag="{{ tag }}">{{ tag }}</a>{% endfor %}
    </span>
  </li>
  {% endfor %}
</ul>

<p id="no-results" hidden style="color: var(--muted);">No posts with this tag yet.</p>
