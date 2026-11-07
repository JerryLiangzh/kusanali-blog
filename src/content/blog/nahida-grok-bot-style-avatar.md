---

title: '纳西妲Grok Bot风格头像'
publishDate: 2026-11-07
description: '就感兴趣的主题尝试用AI生图'
author: 'Jerry Liangzh'
tags: ["纳西妲"]
featured: false

---

很久之前就看到Grok Bot风格的头像，类似于：

![DeepSeek拟人形象的Grok Bot头像](https://images.kusanali.top/grok-bot-style-deepseek-avatar.png)

和

![另一个DeepSeek拟人形象的Grok Bot头像](https://images.kusanali.top/grok-bot-style-deepseek-avatar-2.jpg)

一直想做一个纳西妲版本的，最近有空，就让AI搓了几张出来，感觉可以再优化一点。

## 纯提示词

可以通过只用语言描述来让模型生图，这就是纯提示词流派。

在网页端Gemini，向Google Gemini 4 Argon(High)描述了具体需求。描述需求时，可以纯文字描述，也可以附上一张参考图。这两种方式生成的提示词，前者逊于后者，但差的不多。

我在描述之外，附上了这样的参考图：

![McDonald的Grok Bot头像](https://images.kusanali.top/grok-bot-style-mcdonald-avatar.png)

它生成的提示词如下：

> A minimalist flat vector avatar illustration, extreme close-up of a cute chibi elf girl peeking from the bottom-left corner, head tilted to the right, cropped at the edges. Smooth cream-colored round face with pointed elf ears, completely mouthless and noseless, two simple thick vertical dark-emerald-green pill-shaped lines for eyes, two soft pastel pink oval blush marks on the cheeks. Fluffy pure white hair with leaf-green streaks at the tips, asymmetrical side ponytail, wearing a simple flat geometric gold and green leaf crown hairpiece. Solid warm pastel butter-yellow background. Clean lineless 2D vector art, bold flat color blocks, no outlines, no shading, kawaii minimalist profile picture, 1:1 aspect ratio.

但Nano Banana 2.1（在网页端把提示词发给Google Gemini 4 Argon(High)，调用的应该是这个）据此生成的只有头部。如果是像参考图一样，只有头部但可见部分最低到脸部，那还好，但它生成的是字面意义的只有头部，下巴处离矩形图片的左下角之间隔了不小的距离，是用背景色填充的。反馈给Google Gemini 4 Argon(High)，它生成了一段新的提示词：

> Please zoom the camera out a little bit. Don't just focus on one head. Draw Nahida as a two-quarter-length portrait in a "big head small body" style (showing a slender neck, narrow shoulders and the upper part of the chest). The body extends from the lower left of the frame, while the head still maintains the cute posture of tilting to the right. The clothes she is wearing should be extremely simplified to pure color blocks: keep her signature dark green with a golden collar and high neck, the exposed small shoulders, the white top and the light green shawl color block at the back. The background should be a soft and pure mint green, without any black edges or complex gradients.

使用时，是在第一段提示词的聊天窗口输入第二段提示词的。如果新开一个窗口，可能需要把这两段一起输入。

效果如下：

![Nanobanana通过纯文字生成的纳西妲的Grok Bot头像](https://images.kusanali.top/grok-bot-style-nahida-avatar-by-nanobanana-via-text.jpg)

## 参考图+简单提示词

也可以直接向模型提要求，附上相应参考图。我在具体制作时，附图为本文首图与纳西妲立绘：

![纳西妲立绘](https://images.kusanali.top/nahida-character-illustration.png)

提示词如下：

> 参考ref.png的风格，以我接下来给你的这张纳西妲立绘为原型，制作一张和ref.png风格一致的版本

Nano Banana 2.1结果如下：

![Nanobanana通过文字与参考图生成的纳西妲的Grok Bot头像](https://images.kusanali.top/grok-bot-style-nahida-avatar-by-nanobanana-via-text-and-pic.jpg)

GPT Image 2（在网页端把提示词和图发给ChatGPT，调用的应该是这个）效果如下：

![GPT Image通过文字与参考图生成的纳西妲的Grok Bot头像](https://images.kusanali.top/grok-bot-style-nahida-avatar-by-gpt-image-via-text-and-pic.png)

调用Qwen Image 3 Pro的API，效果太差了：

![Qwen Image 3 Pro通过文字与参考图生成的纳西妲的Grok Bot头像](https://images.kusanali.top/grok-bot-style-nahida-avatar-by-qwen-image-via-text-and-pic.png)

---

可惜水平不太够，也没有相应条件，不然就可以自己画出来或调用本地专业绘图模型反复修改。其实使用经验足够也行，这样就可以更好地指导模型修图。总之，由于种种限制，目前对纳西妲版Grok Bot头像的探索，就先到这里吧。
