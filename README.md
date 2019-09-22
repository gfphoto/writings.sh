writings.sh
===========

Source for my personal blog [writings.sh](https://writings.sh).

Fork Notice
-----------

**Please create your own design if you fork this**.

About This Site
---------------

This site is powered by [jekyll](https://github.com/jekyll),
and the theme is self-created and self-maintained.

Hosting:

1. China: My personal vps, because for the well-known reason, cloudfront is slowly when visited from China mainland..
2. Other: Thanks to greate [Netlify](https://www.netlify.com/),
   it's a super-easy, super-cool page hosting service,
   with lots of **free features** such as free cdn, free cert-allocations, css&js minify, image optimization,
   and the most-featured deployment (much like CD) etc.

Images:

1. Post-related images are managed under directory `assets/images/posts/<post-identifier>`.
2. Images in the posts should be optimized for smaller size, otherwise pages will be slow to load.
   Two tools to make image size smaller: [tinypng](https://tinypng.com) and [ImageOptim](https://imageoptim.com).
3. SVG based image placeholders with blur effects are generated by [SQIP](https://github.com/axe312ger/sqip).
   I wrote [a tiny shell script](sqip-images.sh) for batch processing purpose.
   What's more, each post owns a main-heading-large image,
   its placeholder is an inline svg which is hand-written in the post meta,
   here's [a tool](http://yoksel.github.io/url-encoder/) to encode the inline code from svg source.
4. Image zooming effects are handled by a javascript library named [medium-zoom](https://medium-zoom.francoischalifour.com/).
5. Image lazy loading for better page loading experience: [lozad](https://github.com/ApoorvSaxena/lozad.js).

Fonts:

1. Thanks to [Google fonts](https://fonts.google.com):
   [Arvo](https://fonts.google.com/specimen/Arvo) as the main font for paragraphs, texts, aka the main font.
   [Roboto (mono)](https://fonts.google.com/specimen/Roboto) as the font for code.
2. Thanks to [Icomoon](https://icomoon.io/), which is a wonderful and helpful icon application website,
   all icons in this site comes from icomoon's free plan, libraries used: [Feather](https://feathericons.com/), designed by [Cole Bemis](http://colebemis.com/).


Math:

1. Thanks to greate [MathJax](https://www.mathjax.org/), which is easy to setup, works everywhere and looks beautiful.

Feed:

1. The old old old [feedburner](https://feedburner.com).
2. There's an annoying problem that MathJax won't render on RSS readers,
   because almost all RSS readers don't run javascript there.
   So the trick I'm using is to use images, detail introduction here:
   [Displaying Math in RSS feeds](https://www.noamross.net/archives/2012-04-04-math-in-rss-feeds/),
   which introduces a solution on the top of [CODECOGS](http://latex.codecogs.com/) -
   a service that gives us an image by inputing a latex equation.
   In my workflow, the latex-to-image replacement will be done after jekyll build completes.

Others:

1. Anchor headings solution: [jekyll-anchor-headings](https://github.com/allejo/jekyll-anchor-headings).
   Which helps to create a clickable anchor link inside text headings.
2. The [Drop-Cap](https://www.google.com/search?q=drop-cap) effect,
   making the first larger helps readers to find the begining of our texts easily.
3. Website monitor, the great free [uptime-robot](https://uptimerobot.com) monitor service.
4. A heavy heavy javascript library: [Turbolinks](https://github.com/turbolinks/turbolinks), but indeed pretty cool.
   Which makes navigating the site faster, visiting a site taked care by turbolinks are as of visiting a single-page application.

License
-------

Copyright (c) Chao Wang (hit9[at]icloud.com), All rights reserved.
