---
layout: post
title: 逻辑时钟 - 如何刻画分布式中的事件顺序
date: 2019-08-10 15:39:00 +0800
categories: 分布式
tags: 逻辑时钟 lamport时钟 向量时钟 分布式 因果关系 版本向量
permalink: /post/logical-clocks
image: /assets/images/posts/logical-clocks/repr-clock.jpg
image_ref_text: unsplash
image_ref_link: https://unsplash.com/photos/OshG1lLSNa4
image_svg_data: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 563'%3E%3Cdefs/%3E%3Cfilter id='prefix__a'%3E%3CfeGaussianBlur stdDeviation='12'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%233d3d3d'/%3E%3Cg filter='url(%23prefix__a)'%3E%3Cg fill-opacity='.5' transform='translate(2 2) scale(3.90625)'%3E%3Cellipse cx='96' cy='85' fill='%23fff' rx='48' ry='35'/%3E%3Ccircle r='1' fill='%230c0c0c' transform='matrix(10.39932 183.60092 -61.74794 3.49746 199.6 71.6)'/%3E%3Cellipse cx='31' cy='122' rx='71' ry='24'/%3E%3Ccircle r='1' fill='%23dadada' transform='rotate(64.2 -15.2 134) scale(44.08543 27.21373)'/%3E%3Cpath fill='%23fff' d='M25 73l-11 9 29 16z'/%3E%3Cpath fill='%23c8c8c8' d='M79 107L29 95l55-43z'/%3E%3Ccircle r='1' transform='matrix(-63.98389 -46.3166 10.0682 -13.90867 11.5 102.1)'/%3E%3Cpath fill='%234d4d4d' d='M91 91l-38 17 46 51z'/%3E%3Ccircle r='1' transform='matrix(21.21783 11.61642 -4.50594 8.23026 146.4 68)'/%3E%3Cpath d='M98 42L33 81l29-37zm-1 117l61-10 18-73z'/%3E%3Cellipse cx='201' cy='66' fill='%23666' rx='28' ry='12'/%3E%3Ccircle r='1' fill='%23161616' transform='matrix(-39.86852 63.89908 -29.21158 -18.22597 9.2 11.8)'/%3E%3Cpath fill='%234e4e4e' d='M169-16l-59 4 96 76z'/%3E%3Ccircle r='1' fill='%23030303' transform='matrix(31.76676 31.93146 -20.0116 19.90837 251.3 119.6)'/%3E%3Cpath d='M91 96l-4 13-9-17z'/%3E%3Cpath fill='%23767676' d='M244 148l-23 5-38-39z'/%3E%3Cpath fill='%23747474' d='M93.1 109.4l34.6 5.4-2.8 17.8-34.6-5.4z'/%3E%3Cpath fill='%23e5e5e5' d='M53 72l90 15-38 15z'/%3E%3Cpath fill='%23ccc' d='M133.4 128.5l-12.1-4.7 9.3-24.3 12.1 4.7z'/%3E%3Cpath fill='%230a0a0a' d='M132.5 56.4l-15.6-1.9 23.4-26-57.1 17.2z'/%3E%3Cpath fill='%23d1d1d1' d='M79.4 94.8l-39 1.6 7.1-21.7 34.8 31.2z'/%3E%3Cpath fill='%23545454' d='M193 110l42 3-67-29z'/%3E%3Cpath d='M207.4 96.3l-56.2-18.2 3.4-10.4 56.2 18.2z'/%3E%3Cpath fill='%23656565' d='M98.4 24.5L108.6-9l21 6.5L119.4 31z'/%3E%3Cpath d='M64 159l-9.1-61.1-67.1-2-1-44.7z'/%3E%3Cpath fill='%23bfbfbf' d='M168.6 35.5l2.6-3.3 18.4.8-3.3 3z'/%3E%3Ccircle r='1' fill='%23131313' transform='matrix(-23.04336 4.121 -4.9819 -27.85722 155.1 61.6)'/%3E%3Cpath fill='%23141414' d='M63.3 79l26 23.3-.6.8-26-23.4z'/%3E%3Cpath fill='%23ebebeb' d='M37.6 100.4l-7.1-5.2L19 76.1l4.7-4.7z'/%3E%3Cpath fill='%23787878' d='M231.3 35.8l.9-8.1-1.1 14L271 22.5z'/%3E%3Cpath fill='%23ccc' d='M114.6 72.3L94.2 50.8l28 2.8 20.7-24.1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
---

<div class="drop-cap drop-cap-red" markdown="1">
逻辑时钟是描述分布式系统中时序和因果关系的一种机制。
由于网络延迟、时钟漂移等现实问题，我们无法建立一个全局物理时钟来描述时序，
因此区别于物理时钟的「逻辑时钟」机制应运而生。
第一个逻辑时钟算法是由分布式领域的大神Lamport在1978年提出的lamport时钟算法。
</div>

本文将从一个基础问题的讨论切入，逐步介绍：

* 为什么需要逻辑时钟 -- 物理时钟是否可行？
* 相对论是带来了什么启示 -- 事件的相对性
* 最早期的逻辑时钟算法什么特点 -- Lamport逻辑时钟
* 后续改进的算法有哪些 -- 「向量时钟」和「版本向量」等等

逻辑时钟的思想有趣而深刻，值得探究。

### 如何确定分布式系统中事件的发生顺序？

首先，我们来观察一个「如何确定分布式系统中事件的发生顺序」的问题：

在这个分布式系统中，有三个独立的进程A、B、C：

1. 首先，进程A中发生了一个事件$a$，并把这个事件消息同步给另外两个进程B和C。
2. B收到消息后，发生了一个事件$b$，并把这个事件消息同步给进程C。
3. 但是由于无法确定的网络延迟原因，导致进程A发出的消息到达C晚于进程B发出的消息到达C，这样
   进程C的视角上，最终看到的事件顺序是 $b, a$，但是这与事实是相悖的。

{% include image.html path="logical-clocks/01.jpg" note="图1 - 由于网络延迟， 进程$B$发出的消息晚于进程$A$发出的消息到达进程$C$" %}

可以看到，在分布式通信中，由于网络延迟的不确定性，
**仅仅以接收顺序作为整个分布式系统中事件的发生顺序是不可取的**。

下面我们再观察一个稍微现实点的例子。

1. 假设朋友圈有三个数据中心，分别在北京、维也纳和纽约。
2. 北京小明在朋友圈中发了一张风景图，并问到「猜猜这里是哪里?」，这条消息被扩散到其他数据中心。
3. 维也纳的小红看到这个消息后，回复说她知道。这条回复也被扩散到其他数据中心。
4. 但是由于无法确定的网络延迟的原因，导致纽约的数据中心先收到小红的回复，而后收到了原始的提问消息。
   这样，导致最终小李看到的问答顺序是不符合问答的因果一致性的。

{% include image.html path="logical-clocks/02.jpg"  note="图2 - 由于网络延迟，小李看到的事件顺序并不符合问答的因果关系" %}

以上的例子，是腾讯微信朋友圈真实碰到并解决的问题。 详细的介绍见 [微信朋友圈技术之道](https://ppt.baomitu.com/d/010f1d70)。

下面是微信朋友圈架构设计的两个关于因果一致性算法设计的PPT截图：

{% include image.html path="logical-clocks/03.jpg" note="图3 - 《微信朋友圈技术之道》中分享的关于因果性的PPT" %}

{% include image.html path="logical-clocks/04.jpg" note="图4 - 《微信朋友圈技术之道》中分享的关于向量时钟的PPT" %}

在腾讯的分享PPT中，提到了「向量时钟」， 不过我们稍后再揭开它的神秘面纱。

而这两个例子中，我们面临的要解决的问题， 其实是分布式系统中的[因果一致性](https://en.wikipedia.org/wiki/Causal_consistency)，
换句话说，就是如何准确刻画分布式中的事件顺序，
**显然仅仅简单地依靠进程接收到的(看到的)事件发生顺序是不准确的**。

### 全局物理时钟

对于上面提到的两个问题，我们试图解决的一个天然想法是，
记录每个分布式进程中发生事件的原始时间戳，
并把它连同事件本身扩散到其他节点，这样其他节点的视角上就可以观察到完整的因果顺序了？

> "If you have one clock, you know what the time is. If you have two, you are not sure." --  Anonymous

大家都清楚的一点是，**不同节点的物理时钟其实是不一致的，而且无法做到精确一致**。

其原因：

1. 仍然是由于网络延迟的不确定，我们无法通过网络同步时间来获取一个全局一致的物理时钟。
2. 现实中的多个时钟，即使时间已经调成一致，但是由于日积月累的计时速率的差异，会导致时钟漂移而显示不同的时间。

如此看来，<span class="highlighted" markdown="1">**寄希望于一个全局的时钟来对事件顺序做全局标定也是不现实的**</span>。

参考链接：

* [Time and Global states](https://www.cs.usfca.edu/~srollins/courses/cs682-s08/web/notes/timeandstates.html)
* [时间同步 - wikipedia](https://zh.wikipedia.org/wiki/时钟同步)
* [时钟漂移(clock skew)](https://zh.wikipedia.org/wiki/%E6%97%B6%E9%92%9F%E5%81%8F%E7%A7%BB)

### 全序和偏序

在数学上，「顺序」是如何描述的？

我们看下[序理论](https://zh.wikipedia.org/wiki/%E5%BA%8F%E7%90%86%E8%AE%BA)中的两种序关系：偏序(partial ordering) 和 全序 (total ordering).

[偏序](https://zh.wikipedia.org/wiki/%E5%81%8F%E5%BA%8F%E5%85%B3%E7%B3%BB)：
假设 $\le$ 是集合$S$上的一个二元关系，如果 $\le$ 满足：

1. [自反性](https://zh.wikipedia.org/wiki/%E8%87%AA%E5%8F%8D%E5%85%B3%E7%B3%BB)： 对$S$中任意的元素$a$，都有 $a\le a$.
2. [反对称性](https://zh.wikipedia.org/wiki/%E5%8F%8D%E5%AF%B9%E7%A7%B0%E5%85%B3%E7%B3%BB)：
   如果对于$S$中的两个元素 $a$ 和 $b$， $a\le b$ 且 $b\le a$，那么 $a=b$
3. [传递性](https://zh.wikipedia.org/wiki/%E4%BC%A0%E9%80%92%E5%85%B3%E7%B3%BB)：
   如果对于$S$中的三个元素，有$a\le b$ 且 $b\le c$， 那么 $a \le c$

以上的数学内容其实不那么重要~ 关键理解： **偏序关系是一种序关系，但只是部分元素有序，并不是全部元素都可以比较。**

[全序](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%BA%8F%E5%85%B3%E7%B3%BB)则比偏序的要求更为严格一些，
在偏序的基础上，多了一个完全性的条件：

4. 完全性： 对于$S$中的任意$a$ $b$元素，必然有 $a \le b$ 或  $b \le a$.

可以看出，实际上， **全序就是在偏序的基础上，要求全部元素都必须可以比较**。

总结来看，简短说： **偏序是部分可比较的序关系，全序是全部可比较的序关系**。

举例来看：

1. 自然数集合中的比较大小的关系，就是一种全序关系。
2. 集合之间的包含关系，则是一种偏序关系（集合之间可以有包含关系，也可以没有包含关系）。
3. 复数之间的大小关系，是一种偏序关系，而复数的模的大小关系，则是一种全序关系。

下面用简单的有向图([哈斯图](https://zh.wikipedia.org/wiki/%E5%93%88%E6%96%AF%E5%9C%96))来描述下全序和偏序的区别：

图5中$S_{1}$上的图示关系，描述的是整数之间的大小顺序，是一种全序关系，可以看到任意两个元素之间都可以比较顺序。

而$S_{2}$上的关系，描述的是集合之间的包含关系，是一种偏序关系，其中 $v_{2}$ 和 $v_{3}$ 是不可比较的。

{% include image.html path="logical-clocks/05.jpg" note="图5 - $S1$描述了全序关系； $S2$描述了偏序关系" %}

现在我们回头看，寻求全局时钟为分布式节点中的时间做顺序标定的方式，
其实是在寻求一种全序关系来描述分布式中的事件顺序，
而且是严格对齐真实的物理时钟的全序关系。

### 事件先后的相对性

逻辑时钟的概念是由著名的分布式系统科学家 [Leslie Lamport (2013年图灵奖得主)](https://en.wikipedia.org/wiki/Leslie_Lamport) 提出的，
在他的那篇著名的论文「[Time, Clocks and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)」
的介绍上，lamport提到了著名的[狭义相对论](https://zh.wikipedia.org/wiki/%E7%8B%AD%E4%B9%89%E7%9B%B8%E5%AF%B9%E8%AE%BA)：

> Special relativity teaches us that there is no invariant total ordering of events in space-time;
> different observers can disagree about which of two events happened first.
> There is only a partial order in which an event e1 precedes an event e2 iff e1 can causally affect e2.
> -- Leslie Lamport [Time clocks and …](https://lamport.azurewebsites.net/pubs/pubs.html#time-clocks)

<span class="highlighted" markdown="1">
爱因斯坦的狭义相对论告诉我们，**时空中不存在绝对的全序事件顺序，
不同的观察者可能对哪个事件是先发生的无法达成一致。
但是有偏序关系存在，当事件e2是由事件e1引起的时候，e1和e2之间才有先后关系**。
</span>

对于「不同的观察者可能对哪个事件是先发生的无法达成一致」这个说法，
我们从[同时的相对性](https://zh.wikipedia.org/wiki/相對同時)开始说起：

> 根据狭义相对论，发生在空间中不同位置的两个事件，它们的同时性并不具有绝对的意义，
> 我们没办法肯定地说它们是否为同时发生。若在某一参考系中此两事件是同时的，则在另一相对于原参考系等速运动的新参考系中，
> 此两事件将不再同时。  -- 维基百科【同时的相对性】

因为狭义相对论最基本的假设，[光速不变原理](https://zh.wikipedia.org/wiki/%E5%85%89%E9%80%9F%E4%B8%8D%E5%8F%98%E5%8E%9F%E7%90%86)：
无论在何种惯性参考系下，光在真空中的传播速度相对观察者都是一个常数。所以「同时」这个概念也是相对的。

关于同时的相对性，有一个著名的火车思想实验：

有一个观察者$A$在移动的火车中间，有另一位观察者$B$在地面上的月台上，
当两个观察者相遇时，一道闪光从火车的中央发出。

对于火车上的观察者$A$而言，由于火车头和火车尾距离光源的距离是相同的，
因此观察到了光同时到达了车头和车尾。

但是对于月台的观察者$B$而言，火车的尾部会迎向光移动，而车头会远离光移动，
而且光速是有限的，且相对于两个观察者都是相同的常数，所以$B$认为光会先到达车尾，后到达车头。

{% include image.html path="logical-clocks/06.jpg"  note="图6 - 狭义相对论中著名的火车思想实验" %}

这样，**对于不同参照系的观察者而言，事件的顺序并没有一个一致性的结论**。
之所以得出这样神奇的结论，仍然是因为关键的「光速不变原理」。
但是，这并不意味着发生了因果上的逻辑矛盾，
我们在这种情况下，只是无法在不同的参照系下**观察**到一致性的事件顺序。

我们经验上所说的「同时发生」，是因为光速太大，或者我们生活的尺度太小，
所以同时是一种近乎同时。

相对论告诉我们，光速是物质移动的最大速度，信息传播的速度不可能超过这个速度。
假如太阳消失了，地球上的我们也要在8分钟之后感知到太阳消失了。

也就是说，一个事件$A$发生后，
载有这个事件信息的光（引力、无论什么，快不过光速）到达观察者之前，
观察者是无法没有任何感知的， 这时我们就无法定义事件的顺序。
而当信息最终传播到达观察者时， 这个事件也就对观察者发生了影响，
造成了一个新的事件$B$，叫做「观察到了事件$A$的事件$B$」。
这时我们才有 $A$ happened before $B$ 的因果关系。

{% include image.html path="logical-clocks/07.jpg" max_width="80%" note="图7 - 物理时空中因果关系建立了事件顺序" %}

可以看到，时空对于描述事件顺序的「happened before」同样是偏序关系。

因为事件$A$的发生， 造成了事件$B$的发生（包括$B$这种观察$A$而发生的事件），那么$A$和$B$就存在因果关系。

Lamport受相对论中事件顺序的相对性的启发，创造了[Lamport Logical Clocks](#逻辑时钟lamports-timestamp)。

我们的分布式系统，和相对论有很多相似之处：

* 在物理时空中，信息是通过光速传播的，而在分布式系统中，信息是通过网络传播的。
* 在物理时空中，不同参照系下的观察者可能对于事件顺序无法达成一致，
  而在分布式系统中，由于全局物理时钟无法实现，不存在进程拥有全局视角。
  而如果进程间的事件没有因果关系，那么就无法达成顺序上的一致性。
* 在物理时空中，由于光速限制，观察者在观察到事件$A$的时候，才确定了事件$B$和$A$的因果关系。
  那么在分布式系统中，我们同样可以通过消息传递来创造因果关系。

总体来说， 逻辑时钟尝试用「**通过进程间创造通信以添加因果关系**」的方式来对分布式中的事件顺序做描述。

下面，我们来看下，「**通过通信创造因果关系**」 这个设计对于刻画分布式系统中的事件顺序有多么重要。

观察下面图8中的两个图：

* 红色的点表示自发性事件。 黑色的表示『观察到其他进程事件』而发生的事件。
* 横向黑色实线代表物理时钟。
* 带箭头的线表示进程中一个事件发生时，向另外一个进程传播这个事件。

我们试着从每个进程的视角，依次对图$S_{1}$和$S_{2}$进行推导一下，会发现，
其实**两个图所描述的事件顺序，在进程的相对视角中，是一样的**。

{% include image.html path="logical-clocks/08.jpg" note="图8 - 示例： $S_{1}$和$S_{2}$虽然在物理时序上不一样，但是在各个进程的视角上推导出来却是一样的" %}

我们的逻辑时序应该越接近物理时序越好，然而两个图对时序的刻画，
出现了歧义（比如无法确定 $a_{3}$ 和 $b_{2}$ 的顺序）。
**根本上是没有做充分的消息传递来添加因果关系**。

### 逻辑时钟(Lamport's timestamp)

现在，我们开始讨论Lamport的逻辑时钟算法。

首先我们需要明确一点：
<span class="highlighted" markdown="1">
**逻辑时钟并不度量时间本身，仅区分事件发生的前后顺序。**</span>

那么，「事件」是如何分类的：

1. 进程内自发的事件（如下图中的红色标记的事件）。
2. 发送一个消息，是一个事件（如下图中的蓝色标记的事件）。
3. 接收一个消息，是一个事件 （如下图中的黑灰色标记的事件）。

{% include image.html path="logical-clocks/09.jpg" note="图9 - 分布式中事件的分类" %}

我们上面有提到「happened before」的关系，我们知道，因果关系是推导「happened before」关系的重要一环：

> if $e_{i}$ causes $e_{j}$, then $e_{i}$ must happen before $e_{j}$
> -- [Logical Time](http://www2.imm.dtu.dk/courses/02220/2015/L7/Logical_Time.pdf)

道理是显然的：**如果事件$e_{i}$导致了事件$e_{j}$，那么一定$e_{i}$发生在$e_{j}$之前**。

我们现在给「happened before」这个关系一个记号： $\rightarrow$， 事件$a$在事件$b$之前发生则表示为 $a \rightarrow b$，
那么我们有：

1. 如果 $a$ 和 $b$ 是同一个进程内的事件，并且 $a$ 在 $b$ 之前发生，则 $a \rightarrow b$。
2. 如果事件 $a$ 是「发送了一个消息」，而事件 $b$ 是接收了这个消息，则 $a \rightarrow b$。
3. 如果 $a \rightarrow b$ 并且 $b \rightarrow c$ ，那么 $a \rightarrow c$ （即传递性）。

那么，是否存在两个事件并无顺序关系吗？ 经过前面的讨论，答案当然是肯定的。

如果两个事件无法推导出顺序关系的话，我们称两个事件是并发的，记作 $a \parallel b$。

这样，我们可以这样描述上面的图9中存在的事件顺序：

* $a \rightarrow b \rightarrow c \rightarrow d$
* $e \rightarrow c \rightarrow d$
* $a \parallel e$
* $b \parallel e$

可以看出， 「 happened before」$\rightarrow$ 是一个偏序关系。

**Lamport的时钟算法**：

1. 每个进程 $P_{i}$ 内维护本地一个计数器 $C_{i}$ ，初始为$0$.
2. 每次执行一个事件，计数器 $C_{i}$ 自增 （假设自增量为$1$）.
3. 进程 $P_{i}$ 发消息给进程 $P_{j}$ 时，需要在消息上附带自己的计数器 $C_{i}$.
4. 当进程 $P_{j}$ 接收到消息时，更新自己的计数器 $C_{j}=Max(C_{i}, C_{j})+1$

下面的图10是这个算法的示意图，可以推算最后的时钟计数器的值：$C_{i}=3$, $C_{j}=5$

{% include image.html path="logical-clocks/10.jpg" note="图10 - Lamport时钟算法" %}

下面，将证明：如果 $a \rightarrow b$，那么一定有 $C_{a} < C_{b}$。

1. 假设 $a$ 和 $b$ 发生在同一个进程内，显然 $C_{a} < C_{b}$.
2. 假设 $a$ 和 $b$ 分别处在不同的进程内，如 $P_{a}$ 和 $P_{b}$，

   根据事件先后的定义，必然存在一个不早于 $a$ 且 不晚于 $b$ 的由 $P_{a}$ 到 $P_{b}$ 的通信
   （否则 $a \parallel b$ ，矛盾）。

   那么假设两个进程在 $a$ 和 $b$ 之间最近一次通信是由 $P_{a}$ 向 $P_{b}$ 发送了消息 $a \rightarrow b$：
   易得 $a \rightarrow c \rightarrow d \rightarrow b$
   (其中可能 $a=c$ 或者 $d=b$) 。根据算法定义，得：

   1. $C_{a} \le C_{c}$  (进程内计数器自增).
   2. $C_{d} \le C_{b}$ (进程内计数器自增).
   3. $C_{c} < C_{d}$ (进程间通信，观察者事件已经严格大于发生者事件的计数器)。

   那么，最终推导出 $C_{a} < C_{b}$（严格小于）。

   {% include image.html path="logical-clocks/11.jpg" note="图11 - 事件 $a$ 和 $b$ 在不同进程的情况下，中间一定有消息传递，否则两个事件并发"  %}

以上，得证 $a \rightarrow b \Rightarrow C_{a} < C_{b}$。

但是，如果我们已知 $C_{a} < C_{b}$ 的话，是否可以推导出 $a \rightarrow b$ 呢？

悲哀的是，不能。 下面的图12是个反例：

{% include image.html path="logical-clocks/12.jpg" note="图12 - lamport时钟无法反向推导事件顺序的反例： 红色 $a$ 和蓝色 $b$ 是并发的"  %}

这样，我们反证了 $C_{ a } < C_{ b } \nRightarrow a \rightarrow b$。

我们无法推导出 $C_{ a } < C_{ b } \Rightarrow a \rightarrow b$ 的原因，在于 $a$ 可能和 $b$ 并发。

但是， 如果 $C_{ a } < C_{ b }$，一定不会有 $b \rightarrow a$ 的关系存在。

<span class="highlighted" markdown="1">
Lamport的逻辑时钟算法构建了一个全序(total ordering)时钟来描述事件顺序</span>，
但是我们知道「happened before」是一个偏序关系，
用全序关系的一维计数器来描述「happened before」的话，
就会导致无法等价化描述的结果，
lamport时钟的缺陷在于：**如果两个事件并不相关，那么这个时钟给出的大小关系则没有意义，
这个缺陷其实恰好就是全序和偏序的不同点而已**。

所以，要准确描述事件顺序，我们终究要寻求偏序方法。

于是，我们继续探讨向量时钟。

### 向量时钟 (Vector Clocks)

向量时钟，其实是对Lamport的时钟的一个延伸思考，**算法结构一致，只是多传了一部分信息**。

对每个进程，定义一个向量 $VC$ ，向量的长度是 $n$， $n$ 是进程数目。

1. 初始化各个进程 $P_{i}$ 的向量， 全部抹零：  ${VC}_{i} = [0,...,0]$。
2. 进程 $P_{i}$ 每发生一个事件时， 其向量的第 $i$ 个元素自增： ${VC}_{i}[i] += 1$。
3. 当进程 $P_{i}$ 发消息给进程 $P_{j}$ 时，需要在消息上附带自己的向量  ${VC}_{i}$。
4. 当进程 $P_{j}$ 接收到消息时，对齐对方的时钟，并在自己的时钟上自增：

   对 $[0, n)$ 上的任意一个整数 $k$ 执行
   $${VC}_{j}[k]=Max({VC}_{j}[k], {VC}_{i}[k])$$，

   接着，对应第2点： $${VC}_{j}[j]+=1$$。

下面图13是一个向量时钟算法的示意图：

1. 和lamport时钟算法示意图一样：（红色点、蓝色点、黑灰色点..）
2. 图的右方部分，总结了这个算法对不同事件的操作：

   1. 对于红色和蓝色，也就是进程内自发性事件和发送消息的事件，向量内相应的计数器自增。
   2. 发送消息的时候，需要传播出去自己的整个向量（也就是广播自己对整个系统的视角）。
   3. 接收到消息的时候，也就是蓝色事件，需要对齐对方的向量，并应用第一条规则，即自己的向量内相应计数器自增。

{% include image.html path="logical-clocks/13.jpg" note="图13 - 向量时钟示意图"  %}

可以发现，向量时钟和lamport的时钟算法结构一样， 不同的点在于：
lamport时钟只是在对齐时钟的计数器，
而**向量时钟是在对齐各自对整个系统的视角**。

我们可以推导出来关于向量时钟比较大小的几个性质：

1. **向量的各维相等，则向量相等**。 这个是显而易见的。

2. **向量时钟是有序的** (充要)，即：

   $${VC}_{i}$$ 的各维上的值不大于 $${VC}_{j}$$ 对应维上的值， 则认为 $${VC}_{i}$$ 不大于 $${VC}_{j}$$。

3. **向量时钟有序性质的进一步细化，定义了严格小于**：

   如果 $$VC_{i}$$ 不大于 $${VC}_{j}$$ ，
   并且至少存在一个维，在这个维上 $${VC}_{i}$$ 的值严格小于 $${VC}_{j}$$ 在这个维上的值，
   则认为 $${VC}_{i}$$ 小于 $${VC}_{j}$$。

4. **如果两个向量不存在大小关系，则认为两个向量平行**，记作 $${VC}_{i} \parallel {VC}_{j}$$.

这几个性质看起来复杂，其实都是在定义向量时钟之间的大小关系。
我们可以得出一个结论：

**向量时钟之间的大小关系是一种偏序关系**。

和lamport时钟一样，我们可以利用类似的推导方式，证明 $ a \rightarrow b \Rightarrow VC_a < VC_b$ 。
这里不再描述证明思路。

我们接下来要花一定篇幅论证下 $VC_a < VC_b \Rightarrow a \rightarrow b$ 。

1. 如果 $a$ 和 $b$ 两个事件处在同一个进程中，显而易见 $a \rightarrow b$ 。
2. 假设 $a$ 和 $b$ 分别处在不同的进程内，如 $P_a$ 和 $P_b$ ，

   设 $$VC_a = [m,n]$$ , $$VC_b = [s,t]$$ 。

   因为 $VC_a < VC_b$ ，所以 $m \le s$， 所以必然在 不早于 $a$ 之前 和 不晚于 $b$ 之后的时间内，
   $P_a$ 向 $P_b$ 发送了消息 （否则 $P_b$ 对 $P_a$ 的计数器得不到及时刷新，$s$ 就不会不小于 $m$ ）。

   {% include image.html path="logical-clocks/14.jpg" note="图14 - 中间必然存在$P_a$向$P_b$发送了消息"  %}

   实际上，可以分为以下几种情况：

   {% include image.html path="logical-clocks/15.jpg" note="图15 - 可能出现的4种情况" %}

   1. 当 $a = c$ 且 $d = b$ , 易得 $a \rightarrow b$.
   2. 当 $a = c$ 且 $d \rightarrow b$ ，由传递性，得 $a \rightarrow b$ .
   3. 同样对于 $d = b$ 且 $a \rightarrow c$ 的情况.
   3. 当 $a \rightarrow c$ 且 $d \rightarrow b$ ，根据进程内的算法逻辑和传递性，也很容易得出结论。


综上： $VC_a < VC_b \Rightarrow a \rightarrow b$ 得证。

进一步的，我们可以得出这样的结论：

1. **向量有序，则事件有序**（充要）：

   $VC_a < VC_b \Leftrightarrow a \rightarrow b$

2. **向量平行，则事件并发**（充要）：

   $VC_a \parallel VC_b \Leftrightarrow a \parallel b$

<span class="highlighted" markdown="1">
是的，**向量时钟可以准确刻画事件顺序**。
</span>

其本质在于将lamport时钟的全序计数器的方式改造成向量时钟的偏序大小关系。

### 向量时钟看前面的问题

现在我们回到文中一开始提到的问题。

由于网络延迟的不确定性，
我们在文章开始提出了一个$A$, $B$, $C$三个进程中如何确定事件顺序的问题。

我们可以从下面的图16中看出， $VC_{a} < VC_{b} < VC_{c}$，那么可以确定 $a \rightarrow b \rightarrow c$。
也就是我们找到了一种方法来描述这种情况下的事件顺序。
进程$C$的视角下观察 $a$ 和 $b$ 的顺序的问题也有了明确的答案。

{% include image.html path="logical-clocks/16.jpg" note="图16 - 用向量时钟的方法解答文章开始提出的问题" %}

最后，我们回到朋友圈的例子。 下面图17中可以看出，
$VC_{a} < VC_{b} < VC_{c} < VC_{d} < VC_{e}$， 显然可以确定 $a \rightarrow b \rightarrow c \rightarrow d \rightarrow e$ 。

在小李看到小明的朋友圈和小红的评论的时候，也收到了这两条数据的向量，
我们可以根据向量时钟来确定事件的先后关系，从而不会显示出因果矛盾。

{% include image.html path="logical-clocks/17.jpg" note="图17 - 用向量时钟的方法看朋友圈问题" %}

图17中还有一个事件 $f$， 它的发生可能是小红又发了一条评论。 我们可以看到 $VC_{f} \parallel VC_{e}$。
这时候，无法确定事件 $f$ 和 $e$ 的先后关系，也就是说 $f \parallel e$。

但是，这时候小李还没有看见这个事情。所谓「因果」：**有因才有果**。  看见也是一个事件的果。
这样说， $f$ 和 $e$ 没有因果关系， 因为小李还没有看见这个事件。 所以讨论也就没有意义。

### 版本向量 (Version Vectors)

[版本向量 Version Clocks](https://en.wikipedia.org/wiki/Version_vector)
是一种工程上用来同步分布式数据的算法，
和向量时钟非常相似，以至于人们经常混淆这两种算法。
但是二者却有不同的地方 ([Version Vectors are not Vector Clocks](https://haslab.wordpress.com/2011/07/08/version-vectors-are-not-vector-clocks/))。

我们注意到在向量时钟算法中， 消息传播后，发送方的向量一定会小于接收者的向量，
是因为接收者对齐了发送者的原因。

版本向量在此基础上，做了一点小的加强：

<span class="highlighted" markdown="1">
**消息传播后，发送方也对齐接收者的向量， 也就是双向对齐，在版本向量中，叫做同步。**
</span>

用数学语言描述的话，向量时钟算法的第三点，改成：

   对 $[0, n)$ 上的任意一个整数 $k$ 执行
   $${VC}_{i}[k]={VC}_{j}[k]=Max({VC}_{j}[k], {VC}_{i}[k])$$

除了这个关键性区别外，
版本向量还和向量时钟算法有一点细微的区别：

发送消息和接收消息的时候不再自增向量中的自己的计数器，而是只做双方的向量对齐操作。
也就是，**只有在更新数据的时候做向量自增**。

版本向量是针对数据的更新和同步的协调算法，那么我们把数据操作的事件分为以下两种：

1. **更新数据**的事件， 即图18中红色的点。
2. **同步数据**的事件， 发送数据 和 接收数据， 分别为蓝色和黑灰色的点。

{% include image.html path="logical-clocks/18.jpg" note="图18 - 版本向量示意图" %}

我们可以看到，在进行一次同步操作后，双方进程的版本向量会变成一样。

在我们熟知的网络通信方式上（比如TCP，UDP），同步操作可以做成原子的 ，
比如接收进程对收到的消息进行消息反写。

### 向量时钟的不足

我们再次回到向量时钟，可以看出它的两点不足：

1. 只考虑了**固定数量**的节点，没有考虑节点的动态添加和销毁。

   如果我们考虑用类似Hashtable而不是Vector的描述方式的话，
   我们还需要事先给每个节点定义一个全局唯一标识。

   现代解决方案： [区间树时钟 - Interval Tree Clocks](http://gsd.di.uminho.pt/members/cbm/ps/itc2008.pdf)。
   这个论文我没有看明白 T_T。

   大概是每个时间戳设定为 $(Id, Event)$， 而 $Id$ 和 $Event$
   都用[区间树](https://en.wikipedia.org/wiki/Interval_tree)的数据结构来做。
   而区间树是可以在 $[0,1]$ 实数域上无限二分的。

   文中建立了一个通用的时钟模型叫做「Fork-Event-Join Model」，

   新加入一个节点的时候，我们找一个节点进行 $fork$ ，
   $fork$ 则将当前节点的时间戳的 $Id$ 二分、 $Event$ 克隆，作为新节点的初始时间戳。

   当一个节点要移出的时候， 我们把它合并到一个其他节点， $join$ 类似 $fork$ 的一个
   反向操作， 类似一个取最大者的方式进行合并。

   区间树时钟算法消去了向量时钟对全局唯一节点标识的依赖。

2. 假设节点数量是 $N$ ， 那么每个节点需要维护的空间复杂度是 $O(N)$。
   通信的信息量的复杂度也是 $O(N)$ 。

   关于这个话题，有个文章可以看下： [Causality Is Expensive](http://www.bailis.org/blog/causality-is-expensive-and-what-to-do-about-it/).
   文中提到：

   > Causality can be characterized only by vector timestamps of size N.

   也就是这个 $O(N)$ 的复杂度，不能再小了。

   2019年新鲜出炉的一个寻求优化时钟空间的算法，[布隆时钟 - Bloom Clocks](https://arxiv.org/abs/1905.13064)。

### 总结与感想

* 现实中，无法构建精确的全局时钟来描述事件顺序。
* 受狭义相对论的启发，我们用因果关系来描述事件顺序。
* 因果关系是一种偏序关系。
* Lamport时钟构造的计数器之间的大小关系是一种全序关系，无法准确刻画事件顺序的偏序关系。
* 向量时钟是一种对lamport时钟的延伸，以偏序关系准确刻画了事件的因果顺序。

此外，向量时钟给我一种感想，对每个分布式节点来说：

1. 我把我的视角分享给其他节点。
2. 我对齐我看到的其他节点的视角。

<span class="highlighted" markdown="1">
本质上，是在做 **视角对齐**。
</span>

这自然地，让我想起了[Gossip谣言传播算法](https://en.wikipedia.org/wiki/Gossip_protocol)。
Gossip算法如其名，每个分布式参与者都在散播自己视角的信息，以达到谣言扩散的效果。
同样是在做 **视角对齐**。

对于分布式系统中的事件顺序的刻画，就讨论到这里。

-- 毕 「逻辑时钟」
