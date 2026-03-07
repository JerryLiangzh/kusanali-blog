---

title: '个人向RSS折腾记录'
publishDate: 2026-01-06
updatedDate: 2026-01-08
description: '一些RSS探索经历'
author: 'Jerry Liangzh'
tags: ["rss", "freshrss", "clawcloud run"]
featured: false

---

本博客曾经历过一段技术选型期。彼时我把收集到的博客按框架类型（SSG/SSR）归入Edge收藏夹，Jekyll、Hexo、Astro等类别下再按Theme细分。这套分类为当时的选型与持续至今的主题改造提供了参考。但如今重心转向内容产出，收藏夹里既塞满了待读博客，又混杂着各类非博客站点，筛选、分类与追踪新信息的成本越来越高。于是我想到了RSS。

接下来的内容不会涉及太多"为什么需要RSS"或"RSS能扮演什么角色"——这类议题过于主观，还不如直接去问LLM。本文仅对我的RSS探索经历做一点记录，以及补充一些可能有用的信息，也许会随着探索的深入持续更新。

## 什么是RSS

RSS全称Really Simple Syndication，基于XML描述和同步网站内容，是一种轻量级的信息聚合格式。RSS订阅的本质是可控的信息渠道：像微博、公众号一样集中获取更新，但控制权在自己手中。

## 如何订阅RSS

RSS的订阅方式有很多。

### 网站自行提供

部分站点会主动提供RSS源，图标通常是橙色底+白色无线信号图案的变体。

![RSS Icon](https://images.kusanali.top/rss-icon.png)

[少数派](https://sspai.com)、[超能网](https://www.expreview.com)、[CWorld Site](https://cworld0.com)以及[Simon Willison’s Weblog](https://simonwillison.net)都在此列。如果没有找到，也不代表网站并没有提供。以[RSSHub Radar的GitHub Releases](https://github.com/DIYgod/RSSHub-Radar/releases)为例，其页面并未放置相关图标，此时可借助浏览器扩展[RSSHub Radar](https://github.com/DIYgod/RSSHub-Radar)自动发现和生成订阅地址。该扩展也内置了部分站点的汇总源。

![RSS Radar](https://images.kusanali.top/rsshubradar.png)

### RSSHub

"Everything is RSSible." [RSSHub](https://github.com/DIYgod/RSSHub)通过爬虫将不支持RSS的站点（如B站动态、推文等）转为标准订阅源，效果取决于目标网站的反爬策略——当然，也有相应的反反爬策略。我因故未自行部署，相关教程可参考[官方文档](https://docs.rsshub.app)或其他博主的教程，比如[亂筆](https://blog.l3zc.com/2023/07/rsshub-freshrss-information-flow)和[草梅友仁](https://zhuanlan.zhihu.com/p/683851138)，此不赘述。

## RSS Readers

有了RSS订阅源，现在应该考虑如何阅读它们了。一般而言，RSS阅读器可分为2类：

一是**在线阅读器**，以[Folo](https://github.com/RSSNext/Folo)、[Inoreader](https://www.inoreader.com)、[Feedly](https://feedly.com)与[Readwise Reader](https://readwise.io)为代表，自带服务器同步，只需要注册账号，即可在各种平台/设备间无缝阅读。当然，这类阅读器也有basic plan或free plan限制，比如上限订阅100/150个源、隐藏订阅需要更高级的套餐等等。二是**本地阅读器**，以[Fluent Reader](https://github.com/yang991178/fluent-reader)、[ReadYou](https://github.com/ReadYouApp/ReadYou)和[RSS Guard](https://github.com/martinrotter/rssguard)等为代表。这些阅读器支持使用本地存储，通过手动添加RSS订阅源或OPML文件引入RSS信息流。当然，它们不少也支持在线账号登录，比如Inoreader、FreshRSS等等。

在RSS Reader以及稍后要谈到的自建RSS订阅中，订阅源的内容获取方式分为三档，差异直接影响阅读体验：**Feed正文**是直接解析RSS feed里的<content>或<description>标签。优点是快速省流量，缺点是很多站点只提供摘要。比如某博客的RSS只输出前200字，点“阅读全文”才能看完整代码示例。**网页正文**是让RSS Reader充当爬虫，抓取目标页面的完整内容。这对WordPress、Ghost等标准博客最管用，但碰到反爬严格或前端动态渲染的站点会失效。**加载网页**是终极方案，直接在RSS阅读器内嵌入原网页，RSS Reader会请求并渲染原站，相当于内置浏览器，只是渲染效果可能终究比不上真正的浏览器。不过不必过于担心，现在大多数RSS Reader都支持在文章、订阅源层面对获取方式进行修改，如果对Reader渲染效果不满意，还可以在设置中选择调用设备上的浏览器。

对我个人而言，Windows端我推荐Fluent Reader，遵循Fluent Design，可以通过其GitHub Releases免费下载；Android端可以使用[Fluent Reader Lite](https://github.com/yang991178/fluent-reader-lite)与ReadYou，前者是iOS的UI风格，后者则是经典的Material You设计。不过要注意的是，Fluent Reader Lite并不支持本地直接订阅RSS源，需要账户登录或导入OPML文件。除此之外，如果是Linux或iOS/MacOS，Fluent Reader也都是一个不错的选择，在界面优美的同时支持不少功能设置，很好地履行了一个RSS Reader的职责。

在AI逐渐走入生活的方方面面的今天，RSS Reader与AI结合不是什么罕见之事。如果偏好或需要AI进行总结、翻译与讨论，不妨考虑AI功能较为完善的Folo，或是需要配置API的其他RSS Reader，比如[MrRSS](https://github.com/WCY-dt/MrRSS)。

## 自建RSS订阅

如果希望实现数据的完全掌握，不妨自建订阅源。这方面的服务有[FreshRSS](https://github.com/FreshRSS/FreshRSS)、[minuflux](https://github.com/miniflux/v2)与[Tiny Tiny RSS](https://tt-rss.org)。通过自托管服务，还可以实现跨设备间的自动同步，包括但不限于新内容和已读状态。我最终选了FreshRSS，部署简单——可手动Docker或直接一键部署。由于[ClawCloud Run](https://run.claw.cloud)对满足条件的新用户有每月5美元的优惠，而通过ClawCloud部署FreshRSS每天只需0.11美元，所以我选择在ClawCloud Run部署了一个FreshRSS实例。ClawCloud Run的Appstore中提供[FreshRSS Template](https://template.run.claw.cloud/?openapp=system-fastdeploy%3FtemplateName%3Dfreshrss)，已经设置好相关环境，一键部署即可。

![ClawCloud Run First-time Benefit](https://images.kusanali.top/clawcloudrun-first-time-benefit.png)
![Cost of FreshRSS in ClawCloud Run](https://images.kusanali.top/freshrss-cost-in-clawcloudrun.png)

部署完成后，通过ClawCloud提供的Public access访问，创建账户即可开始订阅管理。

![FreshRSS deployment in ClawCloud Run](https://images.kusanali.top/freshrss-deployment.png)

功能与本地阅读器基本一致（不过要读点什么，还是用阅读器为好，这里更适合管理），额外支持过滤规则、归档策略等等，甚至可通过CSS选择器定制内容抓取。

![FreshRSS filter](https://images.kusanali.top/freshrss-filter.png)
![FreshRSS content rules](https://images.kusanali.top/freshrss-content-get-rules.png)

如果要发挥FreshRSS的收发作用，还需要对API进行设置。在“设置-认证”中开启API访问后，可以移步“设置-账户”，在“API管理”处设置好API密码，然后通过所给链接测试API状态，顺利的话会看到2个“PASS”，以及Fever API与Google Reader API两种机制下该FreshRSS实例的API地址。推荐使用后者，更为高效安全。

![FreshRSS API endpoint](https://images.kusanali.top/freshrss-api-endpoint.png)

之后就可以在各阅读器的账户登录页分别输入API地址、账户名称与API密码，即可开启同步。