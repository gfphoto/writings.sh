---
layout: default
title: 归档 | 春水煎茶
permalink: /posts
id: posts
---

[首页]({{ "/" | relative_url }}) <span class="nav-divider">|</span>
[归档]({{ "/posts" | relative_url }}) <span class="nav-divider">|</span>
[关于]({{ "/about" | relative_url }}) <span class="nav-divider">|</span>
[订阅]({{ "/feed.xml" | relative_url }}){:target="_blank"}

{% for category in site.categories %}
### [{{ category[0] }}](#{{ category[0]|slugize }})
  {% for post in category[1] %}
- <span class="posts-list-post-date">{{ post.date | date: "%Y-%m-%d" }}</span> »
  [{{ post.title | escape }}]({{ post.url }}){:class="posts-list-post-title"}{% endfor %}
{% endfor %}
