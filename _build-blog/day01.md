---
title: "搭建博客之第一天" 
excerpt: "在虚拟机上使用Ubuntu1804搭建环境ruby rubygems jekyll等  坑有点多！！"
header:
  overlay_color: "#333"
  teaser: assets/images/build-blog-01.jpg
sidebar:
  nav: "foo"
toc: true
toc_label: "本页目录"
toc_icon: "cog"
---


## 第一篇博客   
为了用个jekyll模板，ubuntu折腾了一天。中间遇到一些bug贼痛苦，记录下来也许对别人有点用处。
### 坑点
1. Ubuntu各种黑屏
2. 速度拉跨的gems源
3. bundle install 提示找不到openssl

### 解决ubuntu各种黑屏 
#### 方法一 
$> vim /etc/default/grub  <br/>
增加nomodeset到GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash nomodeset\"  <br/>
$> sudo update-grub  <br/>
$> sudo reboot	<br/>
这个方法禁止虚拟机检测显卡，设置后屏幕可能很难看。<br /> 
#### 方法二
管理员cmd> netsh winsock reset   <br />
将winsock的目录重置为默认的设置状态。虚拟机与主机之间的通信方式是以socket进行的。
可能会因为某个程序通过LSP注入DLL,导致回收不彻底。影响虚拟的运行。因此需要进行这些注入DLL的残留清理重置。
这个方法虚拟机显示效果更好，但是会重置防火墙设置 hosts文件变成只读。<br />
没用！！ 事实上虚拟机重启它就黑屏，宿主机重启才能正常进入虚拟机可视化界面，尝试调整虚拟机显示可用内存试试。<br/>

另外，有可能之前安装就一直黑屏，如果是vmware 建议用原生的模拟磁盘安装（选稍后自行安装），自动安装贼坑。
卡在retrieving file 可以 skip 不然等一年！ <br />
### 更换gems国内源
$> gem sources -l   <br/>
$> gem sources -r   //加上上面的干掉官方源   <br/>
$> gem sources -a \'https://gems.ruby-china.com\'  //目前可用的国内源   <br/>
另外gem在update 或者 bundle install的时候 也会使用默认源。   <br/>
$> bundle config \'mirror.https://rubygems.org\' \'https://gems.ruby-china.com\'
会在你 ~/.bundle 生成对应配置文件，而不需要去改Gemfile  <br/>
### 安装jekyll和theme的依赖
这个坑奇坑无比！！  明明安装了openssl，他就是找不到你气不气 <br/>
```
$> sudo gem install eventmachine -v '1.2.7' --source 'https://gems.ruby-china.com' -- --with-cppflags=-I/usr/local/opt/openssl/include
```
参数设置也是贼坑，看帮助完全没用！！ 注意 两个\'\-\-\'不能少 还有空格。
模板用的github mmistakes大佬的jekyll-theme-skinny-bones，装完ruby、rubygems、bundle 之后，解压大佬的zip包 bundle install 安装好 jekyll 就可以自己写博客啦！！  <br/>
编译: $>bundle exec jekyll build    <br/>
开启服务器: $>bundle exec jekyll serve    <br/>
默认本机 127.0.0.0:4000  绑定的本机内网 宿主机进不去的。 <br/>
tips：有些时候需要强制jekyll生产模式下运行，用来开启一些功能 比如：评论 等。
```
$> JEKYLL_ENV=production bundle exec jekyll build
```
makedown还不熟估计版式贼丑。 <br/>
模板换成大佬最新的 minimal-mistakes。

