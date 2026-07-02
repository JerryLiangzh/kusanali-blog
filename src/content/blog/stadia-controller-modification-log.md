---

title: 'Stadia Controller改造记录'
publishDate: 2026-07-03
description: '旧物新生：Stadia Controller在Windows 11下的游戏映射指南'
author: 'Jerry Liangzh'
tags: ["stadia", "手柄"]
featured: false

---

## 背景与开箱初体验

6月28日的上午，我在浏览微信公众号时，偶然刷到少数派的一篇文章，[《我们最近买的 4 个「新玩意」》](https://mp.weixin.qq.com/s/y26fjeG1JRwLew4J09MRRw)，其中关于Google Stadia Controller的章节吸引了我的注意。令人感叹的是，这款手柄的当年发布价格与现今的二手市场留存价存在不小的差距。虽然Stadia云游戏服务早已关停，但Google官方在停服前提供了一套[利好政策](https://support.google.com/stadia/answer/13067284)：用户可以通过官方工具升级固件的方式，解锁手柄的内置蓝牙连接功能。现今官方网页服务早已关闭，但GitHub上的相关备份有不少，如[Stadia Controller Flasher](https://github.com/luigimannoni/stadia-controller-flasher)。考虑到同价位的新手柄几乎不存在质量过硬的竞品，在良好的硬件质感与诱人的高性价比面前，在长久以来对另一种游玩视角的向往的催促下，我在某宝下单了一件。

到货后的第一感觉是，不愧是当初定价69美元的第一方手柄，整体握持手感与使用反馈极佳。尽管缺乏现代手柄标配的陀螺仪感应，但在五十元左右的价位，其竞争力依旧显著。通过蓝牙连接后，Steam能正确识别为Google Stadia Controller并正常工作。除了无线模式，该手柄通过USB-C线缆进行有线连接时，各项功能同样完整可用。

## 常见问题或故障

### 蓝牙休眠断连异常

在实际使用中，Stadia Controller在闲置一段时间后会出现重连失败的问题。当中央的Stadia Button周围的白光熄灭（进入休眠）后，长按重新开机，Stadia Controller将无法直接与电脑恢复连接。此时Stadia Button周围会先显示闪烁的白光（Blinking white），接着转为闪烁的橘光（Blinking orange）。查阅说明书后，不难推断应该是Stadia Controller在休眠后，与Windows 11的蓝牙握手协议出现连接超时或系统层面的蓝牙设备缓存识别错误。在电脑端删除设备，重走一遍配对、连接流程后，一切恢复正常。要预防这种情况也很容易，使用完毕后，直接长按Stadia Button将其关机即可。

### 游戏兼容性测试

为了测试该手柄在非 Steam 游戏及独立启动器环境下的原生兼容性，我选择了几款游戏进行交叉测试，摘要如下：

| 测试对象 | 识别结果 | 异常表现 |
|------|------|----------|
| 《原神》 | 显示为PlayStation控制器 | L2/R2扳机键失效 |
| 《崩坏：星穹铁道》 | 识别结果未知 | 无 |
| 《卡拉彼丘》 | 识别结果未知 | 游戏无反应 |

在《原神》中，控制器页面显示的是PlayStation的控制器，按键也是与之相对应，我不清楚这是默认显示还是游戏真的把Stadia Controller识别成DualShock/DualSense。同时，Stadia Controller的L2、R2扳机键不能使用，即按下后不能实现指定功能。R2是个例外，按下后，视角会莫名其妙地回正——但我设置的是“冲刺”。

![Genshin Playstation Controller Settings](https://images.kusanali.top/genshin-playstation-controller-settings.png)

在《崩坏：星穹铁道》中，一切正常，所有按键都能执行指定任务。而且，在Stadia Controller与电脑已经连接的前提下，无需像《原神》一样在设置页面在“键盘鼠标”与“手柄”间手动切换输入设备，只要检测到Stadia Controller输入信号，手柄支持就会自动启用（即无缝切换），同时游戏的按键提示UI会自动切换为手柄相关。《绝区零》并未测试，但作为妹妹的她，技术支持应该会比两个姐姐更好，手柄支持更不在话下。在《卡拉彼丘》中，无论控制器设置采用何种方案/搭配，Stadia Controller均无反应，就像报废了一样。

![Strinova Controller Settings](https://images.kusanali.top/strinova-controller-settings.png)

### 未解之问

截至本文成稿时，仍有一个问题在困扰着我。Stadia Controller在初次通过蓝牙连接到电脑时，可以在Steam的控制器设置页面“呼叫”控制器，具体反应就是Stadia Controller的振动；如文初所述，有线连接时，功能无异，即亦可触发振动。在应用了接下来会提到的开源解决方案后，Stadia Controller被模拟为XBOX 360 Controller。此时无论方案中的HidHide是否启用，即控制器设置页面是只显示XBOX 360 Controller还是二者皆有，都不能再通过振动进行“呼叫”。在关闭方案中的Stadia ViGEm、解除HidHide中的相关隐藏后，蓝牙状态的Stadia Controller仍旧不能被振动“呼叫”，有线状态倒是可以。

## 解决办法

要解决上述问题，核心思路就是在表现异常的游戏和Stadia Controller之间加一层虚拟的转换层。有两种办法。

### Steam Input

在Steam中能正常游玩，要归功于强大、支持广泛的[Steam Input](https://baike.baidu.com/item/Steam%20Input)。既然Steam能够完美解决底层映射问题，我们只需要把《原神》拉进Steam的运行环境中即可，即[添加非Steam游戏](https://help.steampowered.com/zh-cn/faqs/view/4B8B-9697-2338-40EC)。但这样太过麻烦。

### 开源映射工具

该方案由三个关键的开源组件协同完成。

1. 核心框架：[ViGEmBus](https://github.com/nefarius/ViGEmBus)

    作为系统级的驱动内核框架（Virtual Gamepad Emulation Bus），负责在Windows中动态创建和销毁虚拟的Xbox或 PlayStation手柄节点。

2. 映射桥梁：[Stadia ViGEm](https://github.com/walkco/stadia-vigem)

    Stadia ViGEm针对Stadia Controller开发，其作用是捕获手柄的原生信号，并通过调用ViGEmBus，将其转化为符合标准XInput协议的Xbox 360 控制器信号。

3. 设备隔离：[HidHide](https://github.com/nefarius/HidHide)

    为了解决可能的Double Input问题，需要引入HidHide。它可以在系统内核层将Stadia Controller的原始硬件节点对游戏应用进行隐藏，仅放行被模拟出来的Xbox 360虚拟手柄。此时，游戏便只能接收到干净单一的XInput信号。

得益于以上工具的联合作用，Stadia Controller被成功、干净地模拟为XBOX 360 Controller。此时，《原神》的控制器设置中显示的控制器按键示意图与对应按键，都变更为了XBOX Controller；《卡拉彼丘》也能正常游玩，且其具有和《崩坏：星穹铁道》一样的无缝切换能力。

![Genshin XBOX Controller Settings](https://images.kusanali.top/genshin-xbox-controller-settings.png)

## 故障原因试析

### 《原神》与《卡拉彼丘》

据称，Stadia Controller升级蓝牙固件后，在Windows 11默认被识别为[DirectInput/DInput](https://baike.baidu.com/item/DirectInput)设备。《原神》等独立客户端会直接读取Windows的硬件数据，由于缺乏官方Windows驱动程序，系统只能将其作为通用控制器处理。此时，手柄的L2和R2线性扳机会被错误地识别为普通的数字开关按键。而《原神》读取PlayStation模式时，要求L2/R2必须是线性轴（Axis/Trigger）。由于数据类型不匹配，游戏自然无法接收并解析按键指令。此外，由于DInput下扳机被识别为数字按钮，《原神》很可能将其误映射为其他按键，导致视角回正。

《卡拉彼丘》应该是只支持XInput或XBOX Controller。通用控制器此时将不会有任何输入反馈。

### Double Input

在解决上述原因对应的故障时，如果仅仅使用Stadia ViGEm进行模拟而不使用HidHide进一步隔离，就会触发Double Input。其本质是在执行模拟出来的Xbox 360 Controller指令时，系统未能屏蔽底层的原生Stadia Controller指令。

在《原神》中，该缺陷具有两个极其影响体验的显性表现。

一是动作冲突。在同一页面下按下某一按键会同时触发两种逻辑。例如在派蒙菜单页面，光标选中“设置”后按下`A`，系统会同时执行Xbox模拟层发出的“确认”指令与原生层发出的“游戏退出”指令，导致设置页面开启的同时叠加弹出了游戏退出确认弹窗，如下图所示。不难注意到，图中同一页面的UI，`A`（Xbox）与`×`（PlayStation）能并存，亦为一证。

![Genshin Controller Double Input](https://images.kusanali.top/genshin-controller-double-input.png)

二是UI频繁变化。在未按压任何按键时，图标如下图所示。移动左右摇杆、按压上下左右按键、按压`ABXY`按键和按压`R1`与`R2`按键，游玩时只要出现上述情况中的一种，界面的按键辅助指示图标就会由PlayStation类似的四符号系统变为Xbox的`ABXY`；同时，普通攻击、元素战技、元素爆发和跳跃这4个图标的绝对位置也随之改变。更别提按下`R2`后，还会一边冲刺一边视角回正了。

![Genshin Controller Double Input another example](https://images.kusanali.top/genshin-controller-double-input-2.png)

总之，通过构建这一套完整的虚拟映射链路，Stadia Controller得以在 Windows 11环境下获取近乎完美的全局游戏兼容性，这也是目前挖掘该手柄剩余硬件价值的最优解之一。