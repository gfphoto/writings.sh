---
layout: default
title: Posts | Chao's blog
permalink: /posts
---

{% for category in site.categories %}
### [{{ category[0] }}](#{{ category[0]|slugize }})
  {% for post in category[1] %}
- <span class="posts-list-post-date">{{ post.date | date: "%Y-%m-%d" }}</span> »
  [{{ post.title | escape }}]({{ post.url }}){:class="posts-list-post-title"}{% endfor %}
{% endfor %}
