---
layout: default
title: Home
---

<section class="intro">
  <h1>Hi, I’m Sharuko.</h1>
  <p class="lead">
    Mathematics student, pentester and CTF player. I use this space to publish
    notes, writeups and research ideas about cybersecurity, applied cryptography,
    CTFs, infrastructure and mathematics.
  </p>
  <div class="actions">
    <a class="btn btn-primary" href="{{ '/blog/' | relative_url }}">Read the blog</a>
    <a class="btn" href="https://github.com/{{ site.github_username }}" rel="me noopener" target="_blank">GitHub</a>
  </div>
</section>

<section>
  <p class="section-label">Latest writing</p>
  <ul class="latest">
    {% for post in site.posts limit: 5 %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span class="when">{{ post.date | date: "%b %-d, %Y" }}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<section style="margin-top: 3rem;">
  <p class="section-label">Topics</p>
  <div class="topics">
    {% assign tags = site.tags | sort %}
    {% for tag in tags %}
    <a class="tag" href="{{ '/blog/' | relative_url }}#{{ tag[0] }}">{{ tag[0] }}</a>
    {% endfor %}
  </div>
</section>
