---

title: '建站存档点 - 2'
publishDate: 2026-02-02
updatedDate: 2026-02-17
description: '建站记录之从LeanCloud向MongoDB迁移'
author: 'Jerry Liangzh'
tags: ["建站", "mongodb", "waline", "vercel"]
featured: false

---

1月12日，我收到了LeanCloud的一封邮件，通知说要终止服务。

![leancloud stop service](https://images.kusanali.top/leancloud-stop-service.png)

而Kusanali Blog就是用了LeanCloud作为评论系统的存储服务。借此机会，可以把[建站存档点 - 1](https://kusanali.top/blog/website-archive-point-1)里未竟的MongoDB部署重新捡起来研究。

## 创建数据库

登录到MongoDB后，选择New Project并Create a cluster；

![choose mongodb cluster plan](https://images.kusanali.top/choose-mongodb-cluster-plan.png)

接下来还需要修改额外选项。选择离Waline后端最近的Region，然后取消勾选Quick Setup中的`Preload sample dataset`与`Automate security setup`即可。

## 用户权限组与用户

MongoDB为了保证数据库的安全使用，需要创建相应的用户权限组（Custom Roles）以及数据库用户（Database Users）。通过`Project` - `Security` - `Database & Network Access`即可创建。

创建用户权限组时，在起名之余，还需要授予全部`Collection Actions`以及`Database Actions and Roles`的权限。

![add custom role](https://images.kusanali.top/mongodb-add-custom-role.png)

创建数据库用户时，记住Password Authentication中的Username以及相应password。

![add database user](https://images.kusanali.top/mongodb-add-new-database-user.png)

Custom Roles就选刚刚创建好的那一个，还需要`Restrict Access to Specific Clusters`并在子列表中选择刚刚创建的Cluster。

![add database user-2](https://images.kusanali.top/mongodb-add-new-database-user-2.png)

## 连接数据库

回到Project Overview页面，点击connect后，选择Compass以及我已安装MongoDB Compass。在1.38或更新版本下，产生的URI是mongodb+srv格式的，但waline似乎并不支持如此新的格式，上次折腾时就是卡在这里，不断提示`500: ResourceRequest timed out`。

![not choose mongodb compass new version](https://images.kusanali.top/mongodb-compass-new-version.png)

所以我们需要更改Compass版本为1.11或更早，以获取mongodb格式的URI

![choose mongodb compass old version](https://images.kusanali.top/mongodb-compass-old-version.png)

根据URI信息以及先前所填的Username与password，可以汇总出Vercel部署所需的环境变量。这里用的图是我的另一个cluster与对应的数据库用户，所以用户名就不是Example-user而是JerryLiang2，不过不影响示意。

- MONGO_DB = waline
- MONGO_USER = Example-user
- MONGO_PASSWORD = Example-password
- MONGO_HOST = ["ac-2xvfhz6-shard-00-00.n4cp7vk.mongodb.net", "ac-2xvfhz6-shard-00-01.n4cp7vk.mongodb.net", "ac-2xvfhz6-shard-00-02.n4cp7vk.mongodb.net"]
- MONGO_PORT = [27017, 27017, 27017]
- MONGO_REPLICASET = atlas-abqkv3-shard-0 
- MONGO_OPT_SSL = true
- MONGO_AUTHSOURCE = admin 

## 其他注意事项

配置数据库时，最好在`Project` - `Security` - `Database & Network Access` - `IP Access List`里添加允许访问的IP为`0.0.0.0/0`，即允许所有IP访问，可以避免不少麻烦。

当然，也有一种据称相对省事的部署办法，就是在Vercel里相应Project下的Storage子项选择`Create a database` – `MongoDB Atlas`，IP Access List以及Cluster创建等等即可一键完成。但据我所试，其实也没有那么省事，一键之后，同样需要创建数据库用户、用户权限组，以及通过Compass获取相应URI，否则就会提示`500: Not initialized`——因为没有创建用户，`Cluster` - `Browse Collections`里看不到`waline/Users`。