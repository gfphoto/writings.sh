---
layout: default
title: Chao's blog
permalink: /
---

[**[文章]**]({{ "/posts"  | relative_url }})
[**[联系]**]({{ "/contact"  | relative_url }})
[**[订阅]**]({{ "/feed.xml"  | relative_url }}){:target="_blank"}

```
夫君子之行，静以修身，俭以养德，
非淡泊无以明志，非宁静无以致远。

- 诸葛亮，《诫子书》
```

最近文章:

{% for post in site.posts limit:30 %}
- `{{ post.date | date: "%Y-%m-%d" }}` - [{{ post.title | escape }}]({{ post.url }}){% endfor %}
