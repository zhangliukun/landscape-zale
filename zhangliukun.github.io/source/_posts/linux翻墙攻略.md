title: linux翻墙攻略
date: 2014-09-08 23:44:00
categories: linux
tags: [linux,goagent,GFW,翻墙]
desctiption: 翻墙攻略

---
![google]({{BASE_PATH}}/image/google.png)


##前言
如今，我们中国网民的眼界基本已经被**[GFW](http://baike.baidu.com/link?url=JuSDS8C5xp-kz0sSEBBQ8-l6eNMu4-evhNaNB90e9n65oAtGC8dwQnhHw2KCJ8Gk5Nn9J6E1R1XtnpIxH4bdtnDyaCXFYN8wMvrEfKrsnra)**所成功禁锢，但是无论有多么强大的GFW或者金盾，即使被关在果壳之中，中国的网络还是以它自己的方式适应种种压力顽强地发展。而想要冲破那枷锁，在浩瀚的网络海洋中自由翱翔，就需要我们去进行[**翻墙**](http://baike.baidu.com/subview/883663/9171160.htm?fr=aladdin)。
<!--more-->

##翻墙起由
虽说GFW确实很强大，但是它也屏蔽了很多并没有危害性内容的健康网站，例如我们最熟悉的**Google**,我认为谷歌可以说是最强大的搜索引擎了，其搜索的准确度是百度之类所不能比的，尤其是在搜索一些国外的先进技术时其优劣一用就知道了，还记得在去年google搜索引擎还能正常使用，现在在浏览器中已经打不开谷歌的网址了，很多谷歌的服务都不能用了，于是就不得不去翻墙了。


##翻墙途径
要说翻墙的途径的话有很多，有很多翻墙软件可已下载，比如说：   

>---更新于2014年12月29日    
**最新方法推荐，linux下直接更改/etc/hosts文件中的设置，将一大段Ip地址复制进来，根本不用其他复杂的设置就能完成轻松翻墙！！强烈推荐！！可以无视下面方法了！！**

* 免费翻墙软件**[墙内下载](https://s3.amazonaws.com/fqtools/index.html)**，支持各平台。
* [GAE](https://developers.google.com/appengine/)（Google App Engine） 包括：[GoAgent](https://code.google.com/p/goagent/) ，是使用跨平台语言Python 开发的代理软件，利用GAE的服务器充当代理，帮助用户浏览被封锁的内容。
* [VPN Gate](http://www.vpngate.net/cn/)  由全世界志愿者提供的公共 VPN 服务器获得自由访问互联网
* [动态网](dongtaiwang.com) （[自由门下载](dongtaiwang.com/loc/download.php) 有安卓版）调查显示最多人使用这个翻墙软件，建议和其他软件一并使用防止失效，注意更新。
* [无界浏览](www.wujieliulan.com) （[下载](www.wujieliulan.com/download.php)  有安卓版，在首页右上角） 目前仍有较多人使用的翻墙软件，建议和其他软件一并使用防止失效，注意更新。

除此以外还有很多中方法此处不一一细说。但是虽然知道有这些方法，但是这些网址大部分都是已经被墙了，连网址都访问不了，更别说下载工具了。不急，待到下边慢慢说来。

##我的翻墙之路
我采用的是上述的第2中也就是利用了goagent这个工具来进行翻墙的。以前在windows中使用过，windows中使用这个工具相对来说还是比较方便的，网上教程已经很详备了，现在我要在linux下来使用这个工具，其实大体的流程是差不多的。

首先我们需要准备好以下几个工具：   

1. 火狐浏览器firefox的插件AutoProxy，这里我使用的浏览器是火狐，可在附加组件下载到插件。
2. goagent软件，因为是通用版，都可用，网上很多地方都可以下。
3. python的环境，如果没有的话**apt-get install python**一下应该就可以跳出相关提示了。
4. 一个谷歌的AppID。获取方法下面会讲到。

然后就开始具体实现步骤了。   
1. 首先，去http://appengine.google.com 这个网址去注册谷歌的AppID，这里一开始就遇到麻烦了，因为现在的
封锁比较严，凡是跟**.google.com挂钩的基本都不能访问，所以这个页面也打不开，需要翻墙才能打开，于是没办法，
我就只能切到win7系统下，上网搜了一个VPN代理软件，里面有免费的试用账号，于是我就利用这个试用账号火速
注册了一个AppID，因为试用账号每10分钟短线一次，但已经够了。   
2. 进入goagent目录下的local文件夹找到并编辑proxy.ini，在[gae]的appid处填写刚才注册的application identifier，如果有多个用 | 隔开。   
![proxy.ini]({{BASE_PATH}}/image/proxy.png)   
3. 进入goagent目录下找到server目录里面的uploader.zip，右键打开终端输入命令 
```shell 
sudo python uploader.zip
```   
4. 之后就是填写gmail邮箱和密码了，按照提示填写，等待上传成功的提示上传成功后，每次使用代理前，进local目录，执行命令  
```shell
sudo python proxy.py   
```
**注意**：这里面的我的python版本为2.7，如果是3以后出现错误的话可以尝试这么解决   :
```shell
sudo python2.7 proxy.xy
```   
5.此时大功马上告成，只差最后一步最后配置firefox 插件autoproxy ，选择工具->附加组建右上角搜索autoproxy安装 autoproxy 也就是那个福，安装完成后，重启浏览器重启之后，点击右上角福字的倒三角，选择首选项点击 代理规则-> 代理规则订阅之后勾选gfwList并点击订阅，设置 默认代理 为 goagent，确定那个 福 字 有三种状态  灰色-禁用代理；红色-自动模式；绿色-全局模式。（gfwlist中都是被GFW所禁止访问的网站）    


---
至此，所有配置完毕，在执行了上边的 sudo python proxy.py命令 后 就可以访问youtube，facebook，google等网站啦


##题外话
一部GFW简史同时也是中国网络化简史。网络化既是技术变革，也是文化变革。网络的确是意识形态完全的敌人，因为网络多元化文化要求取消意识形态的中心地位；但意识形态不是网络的敌人，事实上网络没有敌人，因为网络只有解构对象。因此对于执政者来说，意识形态的中心地位与网络化发展趋势两者只能选择其一。实际情况是，执政者选择了前者，而把大刀挥向了Web 2.0。于是网络用它一贯调侃的风格模仿意识形态话语进行了如下讽刺："我们对你陈旧的政权概念和意识形态烂腌菜毫不感兴趣。你无法理解在人类网络化的历史潮流之前宏大叙事为何而消解，你也无法理解国家和民族概念为何将分崩离析，你无法改变你对互联网的无知。你的政权无法成为我们真正的敌人。"其实,《2009匿名网民宣言》只是过早的预言，cyberpunk式的谜语。


####参考文献
* 维基百科 http://en.wikipedia.org/wiki/Main_Page
* 翻墙后看什么 http://fanqianghou.com
