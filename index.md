---
layout: default
title: 春水煎茶
permalink: /
id: index
---

[归档]({{ "/posts" | relative_url }}) <span class="nav-divider">|</span>
[订阅]({{ "/feed.xml" | relative_url }}){:target="_blank"} <span class="nav-divider">|</span>
[联系](mailto:hit9@icloud.com)

{% include image.html max_height=220 absolute_url='/assets/images/home-banner.jpg' %}

欢迎来到我的个人博客！

博客名字取自：

> 山中何事？松花酿酒，春水煎茶。
> -- 张可久《人月圆·山中书事》

**关于**

我是一名热爱写作和阅读的软件工程师，
曾在[YOGO Robot](https://www.yogorobot.com)、[饿了么](https://www.ele.me)工作。

**联系**

我的开源项目托管在[Github](https://github.com/hit9){:target="_blank"}上。
可以通过[邮件](mailto:hit9@icloud.com)联系到我。

**最近博文**:

{% for post in site.posts limit:30 %}
* <span class="post-date-container"><span class="posts-list-post-date">{{ post.date | date: "%Y-%m-%d" }}</span> »</span>
  [{{ post.title | escape }}]({{ post.url }}){:class="posts-list-post-title"}{% endfor %}
* [更多文章...]({{ "/posts" | relative_url }}){:class="posts-list-post-title"}
