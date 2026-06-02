---

title: '记一次PicList原图预览探索之旅'
publishDate: 2026-02-19
description: '非常奇怪'
author: 'Jerry Liangzh'
tags: ["piclist", "cloudflare"]
featured: false

---

本博客曾有一段时间一直在动工维修，执着于调整、个性化配置，但并不是每次部署都一切顺利，因此我养成了一边在VS Code修一边开着Cloudflare Dashboard网页以便随时查看部署日志、根据报错返修的习惯。既然Dashboard都开着，那需要用图时直接上传图片拖进Cloudflare R2里就好了，懒得再用PicList上传，更何况PicList的相册只能查看从PicList上传的图片，不是很方便。

但在学习了Cloudflare Images、R2里的文件多起来、PicList引入“管理/云端”之后，PicList的便利之处再次吸引了我。“管理/云端”可以查看、管理、预览云端图片，PicList上传时部分操作较Cloudflare Images更便捷，激励了我再次投入研究。在更新PicList版本至最新的3.3.2之后，探索之旅就此开启。

## 云端与存储桶

PicList的云端设置较为便捷。由于是Cloudflare R2，故需选用S3 API。Access Key ID、Secret Access Key、endpoint、存储桶名的设置和先前图床/相册时没有区别。至于起始目录/baseDir，在保持默认的前提下即所填为`/`，只要不勾选`上传时保持目录结构`，就不会在图片url里出现2次`//`。

云端启用需要Cloudflare R2的Account API提权，从Object Read&Write提到Admin Read&Write，否则云端管理里不会出现相应存储桶，而是一片空白。至于PicList的相关设置，保持默认即可。

![cloudflare r2 account api](https://images.kusanali.top/cloudflare-r2-account-api.png)

可惜云端设置时没办法填customUrl与area，还需要修改manage.json即云端配置文件，在transformedConfig里分别填入相应字段与`auto`。customUrl如果不填或填错，可能出现图片点击后无法预览的问题。

## 原图预览

在以上一切设置完毕后，PicList云端已经达到使用标准，点击照片、视频图标即可在新弹窗预览。但我的需求还未得到满足，即在管理页面直接能看到原图。

![piclist cloud default icon](https://images.kusanali.top/piclist-cloud-default-icon.png)

注意到设置中有`图片显示为原图而非默认文件格式图标（需要存储桶可公开访问）`的设置，即云端配置文件中的`isShowThumbnail`。开启后，并未看到预期结果。我查阅了PicList Docs、issues以及FAQs，没能找到相应办法，只好试着探索看看。

在确保公开访问、自定义域名、CORS策略均无问题（有问题也不会能点击预览了），且确认`为自定义域名强制开启https`一项一直保持开启后，鉴于PicList是基于electron的，便打开其开发者工具页面的network部分查看。发现并非PicList请求失败，而是根本没加载，在点进存储桶时只加载了默认文件格式图标，只有等我点击图片图标后才会向目标存储桶发起请求（对应点击预览这个操作）。而且`content-type`也能正常识别为`image/png`而非什么`application/octet-stream`之类——真是令人大惑不解，询问了Gemini 3 Pro等LLM也没找出是什么原因，自然也无解决办法。

鉴于PicList云端并未满足我的需求，故暂时停用，没必要并行2个功能一致的操作/服务。我会继续探索原因以及相应的解决办法，在此之前还是先不去提issue了。