---
layout: default
title: Chao's blog
permalink: /
---

### 联系

* **Email**: [hit9[at]icloud.com](mailto: hit9@icloud.com)
* **Github**: [*github.com/hit9*](https://github.com/hit9)
* **Douban**: [*douban.com/people/hit9*](https://www.douban.com/people/hit9)

### Blog

[[所有文章]({{ "/posts"  | relative_url }})]
[[订阅]]({{ "/feed.xml"  | relative_url }})

最近文章:

{% for post in site.posts limit:91 %}
- `{{ post.date | date: "%Y-%m-%d" }}` - [{{ post.title | escape }}]({{ post.url }}){% endfor %}
