---
layout: page
title: 春水煎茶 - 王超的博客
permalink: /
id: index
---


<span class="heading-anchor">§</span>
**博文列表**

 <div class="posts-list" markdown="1">
{% for post in site.posts limit:100 %}
* <span class="post-date-container"><span class="posts-list-post-date">{{ post.date | date: "%Y/%m" }}</span></span>
  [{{ post.title | escape }}]({{ post.url }}){:class="posts-list-post-title"}{% endfor %}

<div class="clear"></div>
</div>


<div class="pendant-large">
  <img class="pendant-img-large" src="{{ '/assets/images/pendant-large.png' | relative_url }}">
</div>


<div class="about" markdown="1">

<div class="about-left">
  <img src="{{ '/assets/images/i.png' | relative_url }}" class="avatar" />

  <div class="nav nav-icons" markdown="0">
     <a class="icon-wrapper" href="https://github.com/{{ site.github_username }}" target="_blank" title="Github">
       <span class="icon-github1"></span>
     </a>
     <a class="icon-wrapper" href="mailto:{{ site.email }}"  title="邮件联系">
       <span class="icon-mail"></span>
     </a>
     <a class="icon-wrapper" href="{{ site.feedburner_url }}" title="RSS 订阅">
       <span class="icon-rss1"></span>
     </a>
  </div>
</div>

<div class="about-right" markdown="1">

王超 @ 上海，软件研发工作。

> 松花酿酒，春水煎茶。

</div>

<div class="clear"></div>

</div>

