---
layout: default
title: Chao's blog
permalink: /
---

### Links

* **Github**: [*github.com/hit9*](https://github.com/hit9)
* **Douban**: [*douban.com/people/hit9*](https://www.douban.com/people/hit9)

### Projects

* [~/.dotfiles](https://github.com/hit9/dotfiles) - My dotfiles :)
* [oo](https://github.com/hit9/oo) - Simple Go Version Manager.
* [thriftpy](https://github.com/Thriftpy/thriftpy2) - Pure python implementation of Apache Thrift.
* [img2txt](https://github.com/hit9/img2txt) - Image to Ascii Text with color support.
* [gif2txt](https://github.com/hit9/gif2txt) - Gif image to Ascii Text.

### Blog

[All posts]({{ "/posts"  | relative_url}})

{% for post in site.posts limit:15 %}
- `{{ post.date | date: "%Y-%m-%d" }}` - [{{ post.title | escape }}]({{ post.url }}){% endfor %}
