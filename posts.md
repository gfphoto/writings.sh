---
layout: default
title: 归档 | 春水煎茶
permalink: /posts
id: posts
---

<span class="nav" markdown="1">[首页]({{ "/" | relative_url }})</span>
<span class="nav-divider">·</span>
<span class="nav" markdown="1">[归档]({{ "/posts" | relative_url }})</span>
<span class="nav-divider">·</span>
<span class="nav" markdown="1">[关于]({{ "/about" | relative_url }})</span>
<span class="nav-divider">·</span>
<span class="nav" markdown="1">[订阅]({{ site.feedburner_url }}){:target="_blank"}</span>

{% for category in site.categories %}
### [{{ category[0] }}](#{{ category[0]|slugize }})
  {% for post in category[1] %}
- <span class="posts-list-post-date">{{ post.date | date: "%Y-%m-%d" }}</span> ·
  [{{ post.title | escape }}]({{ post.url }}){:class="posts-list-post-title"}{% endfor %}
{% endfor %}
