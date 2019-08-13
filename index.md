---
layout: default
title: Chao's blog
permalink: /
---

### Contact

* **Email**: [hit9[AT]icloud.com](mailto: hit9@icloud.com)
* **Github**: [*github.com/hit9*](https://github.com/hit9)
* **Douban**: [*douban.com/people/hit9*](https://www.douban.com/people/hit9)

### Blog

[All posts]({{ "/posts"  | relative_url}})

{% for post in site.posts limit:15 %}
- `{{ post.date | date: "%Y-%m-%d" }}` - [{{ post.title | escape }}]({{ post.url }}){% endfor %}
