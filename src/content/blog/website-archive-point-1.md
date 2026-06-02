---

title: '建站存档点 - 1'
publishDate: 2025-11-16
updatedDate: 2026-02-24
description: '建站记录'
author: 'Jerry Liangzh'
tags: ["建站", "cloudflare", "waline", "umami", "piclist"]
featured: false

---

## 写在前面

本文旨在为8月末至今的建站阶段做一个小结。过去的这几个月中，凡涉及博客事务，对我而言，大抵是在折腾主题与其他配置，或是测试一下博客各组件的一些功能，博文的产出反而不是重点。但随着昨晚把困扰我已久的一个疑惑解决后，我觉得中心似乎已经可以转移了。尽管本博客的views&comments统计功能仍未正常，还想引入“碎碎念”部分，不过均可徐徐图之，是时候重点关注一下内容产出了。

在[博客启航规划](https://kusanali.top/blog/blog-launch-planning/)中我曾提及，我的Computer Science水平并不算高，在建站等事上更多的也只是止于将各种AI回答与搜索引擎结果去粗取精、融合运用，类比于考试，则更似二级结论的学习与记忆，不能像所谓的数理高手一样无师自通、举一反三，或是现场推公式，因此本文也不会详细把每一步都一一列出，而是给出相关参考链接。

## Astro Theme Pure & Cloudflare Pages

Astro Theme Pure的使用，可见[主题GitHub页面](https://github.com/cworld1/astro-theme-pure)与[主题文档](https://astro-pure.js.org/docs)。Fork或用template部署后，src\pages里的个性化修改并不难，很多只是文本的简单替换。不过在Astro Theme Pure v4.0.9在根目录里的tsconfig.json引入的verbatimModuleSyntax，或可考虑关闭。相较于Template而言，个人更推荐fork，后续升级会更为简便，免得像我一样。

Cloudflare Pages部署，可见[Astro + Cloudflare pages 快速搭建个人博客](https://yaoqx.netlify.app/blog/2024-08-15/#heading-5)与[Astro搭建个人博客](https://www.cnblogs.com/yinph/p/18549888)。记得把astro.config.ts中的adapter删除或注释，output内容改为static。

另外，我个人不喜欢我的博客上出现赞助按钮或链接。要删除，可以npm install后，删除src\components\projects\Sponsorship.astro、src\components\projects\Sponsors.astro、packages\pure\components\pages\Copyright.astro中关于sponsor的部分以及About&Projects页面的sponsor部分。

## waline与umami引入

waline的引入我并不局限于简单的构建使用，而是额外参考了[Astro 修改(4) -- 更快、更安全的 Waline 评论](https://blog.ixiaocai.net/posts/Astro-Blog-Customize-4-Waline-Enhancement/)。但其中MongoDB的部分，其中部分页面与现在部署的页面有不少区别，当初我折腾了一晚上也没能成功，因此还是得用LeanCloud。其余可见[waline文档](https://waline.js.org/guide/)与[Astro Theme Pure中关于Comment system的配置](https://astro-pure.js.org/docs/integrations/comment)。不过博客若使用Cloudflare部署后，使用waline会无法显示评论者ip，参考xgclevo的[解决办法](https://blog.xgclevo.top/posts/7824742a/)。

本博客的waline基础配置，如emoji、表情包搜索与Markdown预览等，是继承自Astro theme pure的；于此基础上，还启用了这些组件/功能：[Cloudflare Turnstile](https://www.cloudflare-cn.com/application-services/products/turnstile/)，及[服务器环境变量](https://waline.js.org/reference/server/env.html)中的IPQPS（5秒）、MARKDOWN_SUP、MARKDOWN_SUB、MARKDOWN_TEX（mathjax）。

umami则见[umami官方文档](https://umami.is/docs)与[关于页数据统计接入自建umami](https://blog.starsharbor.com/posts/solitude-about_umami/)。

**2026.02.02 Update**：实现了MongoDB的部署，由于篇幅原因，单开一篇，详见[建站存档点 - 2](https://kusanali.top/blog/website-archive-point-2)。

**2026.02.24 Update**：解决了waline的浏览量、评论数统计功能不可用的问题。由于篇幅原因，单开一篇，详见[博客中的URL配置](https://kusanali.top/blog/blog-url-configuration)。

## 图床构建

图床构建我选择使用Cloudflare R2的Free Plan，搭配[PicList](https://piclist.cn/)以及[Webp Cloud](https://docs.webp.se/webp-cloud/)。具体教程可见[从零开始搭建你的免费图床系统](https://www.pseudoyu.com/zh/2024/06/30/free_image_hosting_system_using_r2_webp_cloud_and_picgo)。关于隐私与版权保护，也有同一作者的[升级版教程](https://www.pseudoyu.com/zh/2024/07/02/protect_your_image_using_webp_and_cloudflare_waf)。