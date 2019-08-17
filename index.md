---
layout: default
title: Chao's blog
permalink: /
---

[归档]({{ "/posts" | relative_url }}) \|
[订阅]({{ "/feed.xml"  | relative_url }}){:target="_blank"}  \|
[联系]({{ "/contact"  | relative_url }})

---

> 非淡泊无以明志，非宁静无以致远。
>
> -- 诸葛亮，《诫子书》

最近文章:

{% for post in site.posts limit:30 %}
- <span class="posts-list-post-date">{{ post.date | date: "%Y-%m-%d" }}</span> »
  [{{ post.title | escape }}]({{ post.url }}){:class="posts-list-post-title"}{% endfor %}
- [更多文章...…]({{ "/posts" | relative_url }}){:class="posts-list-post-title"}
