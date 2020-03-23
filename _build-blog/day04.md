---
title: "搭建博客之第四天"
excerpt: "通过staticman实现nested comment，太难了！"
header:
  overlay_color: "#333"
  teaser: assets/images/build-blog-04.jpg
sidebar:
  nav: "foo"
toc: true
toc_label: "本页目录"
toc_icon: "cog"
categories: [artices]
tags: [web development, jekyll, staticman]

---
## 膜拜大佬
老规矩大佬帖子先贴上 [**here**](https://mademistakes.com/articles/improving-jekyll-static-comments/)，看完大佬写的netsted comment文章后，手痒于是准备动手去做，拿到源码后一看完全是一脸懵逼。一连串的html文本嵌套着看不懂的liquid代码。
```liquid
{% raw %}{% assign comments = site.data.comments[page.slug] | sort | where_exp: "comment", "comment[1].replying_to == blank" %}
{% for comment in comments %}
  {% assign avatar      = comment[1].avatar %}
  {% assign email       = comment[1].email %}
  {% assign name        = comment[1].name %}
  {% assign url         = comment[1].url %}
  {% assign date        = comment[1].date %}
  {% assign message     = comment[1].message %}
  {% include comment.html avatar=avatar email=email name=name url=url date=date message=message %}
{% endfor %}{% endraw %}
```
更痛苦的是，大佬攻略是17年写的，在这之后代码更迭了好多，完全无法下手。几次尝试后，问题不断地出现，原本可以的评论全都不能显示了，js中的方法各种出错。折磨了一个晚上后，实在受不了准备放弃了，可心里还有些不甘心。
## 艰难的第一步  
可是程序员强迫症犯了，看到bug解决不了是真睡不着！没忍住我又去看了一遍攻略。当我再翻到大佬攻略评论后面时，看到有人已经实现了，我进到他的仓库里面，去找他的代码，发现跟我之前的思路差不多。对于更迭之后的html样式不做修改，只添加核心的liquid循环。并且我发现之所以js方法一直提示找不到，原来所有js已经被打包了，也就是说要修改js要重新编译打包才能生效。

又是一顿操作，什么node.js uglify全都装了一遍，一执行又懵逼了，又是一堆错误，xxx not found！！程序员最痛苦的绝逼是处理版本依赖，没有之一！！没辙了，只能作罢另想办法。再去翻攻略的评论，发现评论模块是分provider的，并且都有单独的配置文件。赶紧打开仓库找配置文件，果然js代码写在了里面。当我把js写进去后，终于是生效了！！泪流满面，万里长征总算是迈出了第一步。
## 渐入佳境
现在最大的问题是liquid loops我该怎么加进去。一堆大括号，管道符，什么unless，看得让人头皮发麻！！没办法想要实现，就必须看懂他的思路。虽说编译语言有很多种，但大多都是大同小异。代码肯定有英文单词，那就大概能猜到某段代码块在干什么。不禁感叹为什么就没一款中文编译语言呢！！不过想想中文博大精深，一句话语气不同意思也不一样！！看来没有也是有原因的。无奈只能一点点渗透进去，从单词猜语法到测试去验证，这是唯一的办法了。由于是17年的文章，很多东西都更新了，需要慢慢调试。不过好在文章下面，有一堆哥们已经问过大佬一堆问题了，解决了不少问题，思路也捋清了。

考虑到复杂性，回复只深入到一层。回复字段对应着replying_to,对于parent comment的字段应该为empty。那么就需要一个隐藏的input输入框去填充这个字段，对于回复而言也就是child comment字段也应该是对应的parent字段。那么我们就必须对parent comment排序并建立索引。
```liquid
{% raw %}{% assign index = forloop.index %}{% endraw %}
```
这段代码跟我们jstl标签差不多，在循环中赋值唯一且有序的index。对于显示评论我们应该用两层循环，外层循环找出replying_to为empty的parent comment，而内层循环找出对应的child comment然后通过include comment.html去显示每一条评论。
```liquid
{% raw %}{% capture i %}{{ include.index }}{% endcapture %}
{% assign replies = site.data.comments[page.slug] | sort | where_exp: "comment", "comment[1].replying_to == i" %}
{% for reply in replies %}
  {% assign index       = forloop.index | prepend: '-' | prepend: include.index %}
  {% assign replying_to = reply[1].replying_to %}
  {% assign avatar      = reply[1].avatar %}
  {% assign email       = reply[1].email %}
  {% assign name        = reply[1].name %}
  {% assign url         = reply[1].url %}
  {% assign date        = reply[1].date %}
  {% assign message     = reply[1].message %}
  {% include comment.html index=index replying_to=replying_to avatar=avatar email=email name=name url=url date=date message=message %}
{% endfor %}{% endraw %}
```
并且当我们点击回复按钮时，对应的reply也就是一条新的comment replying_to字段应该为它patent的index,而取消回复时该字段应该被重置为empty。
思路清晰了，问题解决起来也就自然而然轻松多了，剩下的只是调优，以及一些css样式的处理。虽说功能很简单，但是对于我来说能用liquid语法做出来，心里那种兴奋和满足感无以言表。
## 收获及感悟
想起小时候学的课文愚公移山，觉得他真是人如其名，用醴陵话说硬是蠢不哒法！不过认真想想他真的愚吗？还是大智若愚呢？古话说的好，大隐隐于市小隐隐于野。事物的发展从量变到质变，技术从生疏到娴熟，这期间效率的提升可以至千倍万倍。一个人挖搬一座山并非不可能，放到我们现今来说更不是什么难事。秦始皇修建万里长城就是例子，在搬山的过程中，随着技术的精进，你可能会挖到石油、黄金、钻石，有了财产的积累就有更大的发展空间，于是你开个公司招人研发部生产部销售部，那你的效率就是上万倍的提升。当然这是夸张点讲，古代皇帝就像相当于现在公司的CEO，你怎么知道他愚公就不能当皇帝呢？毕竟王侯将相宁有种乎？刘邦可是深有体会！  [滑稽脸]扯得有点远了，重点往往就是迈出的第一步，你有信念并充满热情投入到你当下的事情中，不管是什么事情，你都会获得意想不到的收获。

至此，博客搭建已经基本完成了。剩下就是一些博客内容的布局和编排了，这些功能大佬都整合好了，放心用就完事了。接下来我会写一些我一直以来学的一些大数据分析的框架，毕竟自己学会跟表达出来讲述给别人是完全不同的层次，对自己也是一种提升，这也是我决定开始写博客的原因之一。
