---

title: '博客中的URL配置'
publishDate: 2026-02-24
updatedDate: 2026-03-01
description: '谈谈建站过程中和url打过的交道'
author: 'Jerry Liangzh'
tags: ["建站", "waline", "copyright", "cloudflare", "vercel"]
featured: false

---

2月和URL打了不少交道，从Waline到Copyright等等，总算弄清楚了一些东西、积累了一点经验，这篇文章就当是备忘录吧。本来是以update形式补充在[建站存档点 - 1](https://kusanali.top/blog/website-archive-point-1)里的，但随着对这个点的探索深入，update的篇幅似乎有点喧宾夺主，除非重构整篇文章，那我还不如聚合在一起好了。

## waline

首先要谈谈waline，它的统计功能终于启用了。22号那天我在update处提到，从`data-path`入手探索。参考astro theme pure的示例博客以及2位突出贡献者的博客，对他们文章开头的comments右键检查后，`data-path`末尾都是不带`/`的，我也一样；同样地，在astro.config.ts里，`trailingSlash`均为`never`。但我的waline后台管理页面中显示的评论所属的博客文章页面都是尾是带`/`的。我追踪到src\components\waline\Pageview.astro，可无论把其中的path赋值为默认的`window.location.pathname`还是尾带`.replace(/\/$/,'')`的版本，waline的浏览量、评论数统计功能均不能生效——也就是说`data-path`末尾仍是不带`/`，与waline记录无法匹配，故始终显示**0 views | 0 comments**。于是干脆在src\components\waline\PageInfo.astro中把两个`data-path`从`{path}`改成`{path+'/'}`，强行多加一个`/`，就解决了问题。

## 文章URL

24号上午在闲逛收藏夹里的各博客时，刷到了绅士喵的这一篇文章，[正确配置用 .html 作为 URL 后缀的博客缓存](https://blog.hentioe.dev/posts/configure-blog-cache-with-html-as-url-suffix.html)，内中提及`/post/post-1`与`/post/post-1/`的对比，并称后者是丑陋的文件夹地址。我虽然对文件夹地址意见不是很大，但如可能我更愿意让我的博客使用前一种地址。我额外参考了本文上一部分提及的那3个参考博客，它们皆是属于前者。

Astro theme pure的Docs并未提及此内容，但Astro的Docs倒是有，也就是涉及到所谓的[build.format](https://docs.astro.build/en/reference/configuration-reference/#buildformat)与[trailingSlash](https://docs.astro.build/en/reference/configuration-reference/#trailingslash)。和绅士喵文中吐槽的Hugo一样，Astro默认生成的文件结构会让文章以“文件夹”的形式访问，即
```astro
{
    build: {
        format: 'directory'
    }
}
```
此举会让astro为每个页面都生成一个内含index.html的文件夹，比如构建时就会生成/about/index.html；如果要不带，可以改为`format: 'file'`，此时astro会为每个页面路由创建同名html文件，比如/about.html。加之Cloudflare默认启用[Route matching](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching)，即强行忽略URL中的.html后缀并进行302重定向，/about.html重定向到/about、/about/index.html则是/about/，也就是末尾带不带`/`的区别。这是无法手动关闭的。

这样修改后，waline那边就出了问题——这是必然的。但如果只把Pageview.astro和PageInfo.astro都改回默认设置，waline统计功能依旧是失效的，因为这时的`data-path`变成了`/blog/website-archive-point-1.html`——真是按下葫芦浮起瓢。这时可以对PageInfo.astro里的path动手脚:
```astro
/* Original code: const path = Astro.url.pathname; */
const path = Astro.url.pathname.replace(/(index)?\.html$/, '')
```
以此修复`data-path`。

当然也可以优雅一些，参考Kukmoon谷月的[用重定向去掉博文的 .html 后缀](https://kukmoon.github.io/3366bd4a8b7d/)。虽然她用的是Valine，但Waline作为With backend Valine，都是根据静态页面的文件名来储存评论数据的。她的办法就是在在虚拟主机和CF Pages两边都配置301跳转，利用Apache的.htaccess文件以及CF Pages的[_redirects](https://developers.cloudflare.com/pages/configuration/redirects/)重定向规则文件。

## 同步修改Copyright

在build.format从默认配置变为`format: 'file'`的改动生效的同时，文末的Copyright部分也陷入了麻烦，从文件式URL变成了尾带`.html`版本。鉴于packages\pure\components\pages\Copyright.astro中对应代码是
```astro
{/* title & link */}
  <div class='flex flex-col'>
    <div class='font-medium text-foreground'>{title}</div>
    <div class='text-sm'>{Astro.url}</div>
  </div>
```
不妨改为：先在前面来一行
```astro
const sharelink = 'https://kusanali.top'+Astro.url.pathname.replace(/(index)?\.html$/, ''); 
```
然后
```astro
{/* title & link */}
  <div class='flex flex-col'>
    <div class='font-medium text-foreground'>{title}</div>
    <div class='text-sm'>{sharelink}</div>
  </div>
```
需要注意的是，如果sharelink没有前半部分的硬编码，Copyright部分生成的字段就会从URL退化成路径，比如`/blog/website-archive-point-1`。当然，Copyright.astro中不止这一处`Astro.url`，但其他部分都是涉及创建分享到第三方平台的链接，比如

http://service.weibo.com/share/share.php?url=https://kusanali.top/blog/example-name.html&title=example-title&pic=

不影响功能，就懒得去改了。

## 关于SEO与ERR_TOO_MANY_REDIRECTS

虽然本博客的创建与写作初心不是为了什么SEO，但也不代表我可以完全忽视它。在以上改动完成后，我立刻就遇到了浏览器提示的重定向错误，亦即ERR_TOO_MANY_REDIRECTS——在清空cookies后一切看起来又恢复正常。众所周知，URL末尾带不带/、有无.html对搜索引擎爬虫而言完全是两回事，由此容易导致内容重复与权重分散。为了避免这2点或爬虫抓到大量的404或重定向循环，可以在\public根目录下引入_redirects重定向规则文件，内容是
```
/*/ /:splat 301
/*.html /:splat 301
```
以实现/blog/about/与/blog/about.html向/blog/about的301跳转。

或者可以考虑在BaseHead.astro里对Canonical URL进行改动。若进行了以下改动，则_redirects非必需。Cloudflare会自动308重定向。
```astro
/* Original code: const canonicalURL = new URL(Astro.url.pathname, Astro.site) */
const canonicalURL = new URL(Astro.url.pathname.replace(/\.html$/, '').replace(/\/$/, ''), Astro.site)
```

## Cloudflare与Vercel

在查找原因时，我曾疑心是不是我之前改动代码时误改了什么，虽然我清楚地记得我并没有动过这一部分的代码，但出于稳妥还是把Astro theme pure主题的2位杰出贡献者的博客代码都和我对比了一下（在此感谢他们能把相关Repository设置为Public），发现一模一样（不然初始`data-path`也不会相同）。

于是我想到了部署平台的问题，因为他们二位都是在Vercel部署，与我不同。我把代码改了回去之后，在Vercel部署了一次（不得不说尽管两者的部署、配置都非常简单方便，但要说更，还得是Vercel），就发现了有趣的一点：Vercel部署后，URL末尾是没有`/`的。当然，如果是裸域URL/主页，那实际上还是有`/`，因为访问请求必须从`/`开始，浏览器此时替我们做了正确的修正，在URL后面自动的加上了`/`从而能正确访问，不过是在地址栏中隐去而已。

**在Vercel部署时**，由于没有Cloudflare的Route Matching，设置如何就是如何。本博客使用的主题，其并未针对build.format作出设置，因此即为默认的directory，结合`trailingSlash: "never"`，故其除主页外的canonicalURL都与浏览器地址栏中一致——所见即所得。**在Cloudflare Pages部署时**，情况就变得稍微有些复杂，变量有点多，经试验，结果如下：

![url settings in cloudflare pages](https://images.kusanali.top/comparison-of-url-settings-in-cloudflare-pages.png)

这里不含对主页的测试。出于SEO的考虑，`trailingSlash`只取图中这两个值。在Settings E下，修改推送到GitHub后，只有Vercel触发了部署，而Cloudflare Pages则毫无动静。但考虑到这是本博客所用主题的默认代码，故其表现还是可以通过Cloudflare Pages的历史部署链接查看，这种设定下，其地址栏是与拥有相同build.format的设定一致。

总之，博客URL末尾加/也好不加也罢，个人认为并无高下之分，不会为网站性能带来什么加成，关键还得要**尽早**+**统一**。由此，推荐Settings B/D/G。在Settings G下，若仍需要_redirects文件，则其需要改写。

另外，我是没想到还能触发这样的bug。以waline或Waline为章节名时，竟然会让waline系统会从文末瞬移到文中。章节本质就是“文章URL”+“#title-of-paragraph”，而文章页面中文末的waline评论系统就是以“文章URL”+“#waline”存在。此为所提[issue](https://github.com/cworld1/astro-theme-pure/issues/139)，目前已经得到开发者修复。

![waline display bug while as subtitle](https://images.kusanali.top/waline-display-bug-while-as-subtitle.png)

原本Waline初始化时寻找挂载点用的是el: '#waline'，这在底层会调用类似document.querySelector('#waline')的方法。因为章节标题叫waline，Markdown渲染器自动给这个章节的HTML标签加上了id="waline"。由于章节在正文里，排在文末的评论区前面，所以Waline找到了第一个匹配的元素（也就是章节标题），就把评论区渲染到那里去了。在Comment.astro中el项加上comment-component作为父级限定后，Waline就只会在<comment-component>这个自定义元素内部去寻找#waline，从而彻底解决了冲突。此为[参考](https://waline.js.org/guide/get-started/#html-%E5%BC%95%E5%85%A5)。

---

鸣谢：

- [URL最后结尾斜杠(/)加与不加区别](https://www.jianshu.com/p/1183ae7b1a33)

- [URL地址末尾/的意义](https://juejin.cn/post/7502349133346930739)