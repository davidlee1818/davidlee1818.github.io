---
title: "Blog Format-Header Image Overlay"
header:
  overlay_image: /assets/images/unsplash-image-1.jpg
  caption: "Photo credit: [**Unsplash**](https://unsplash.com)"
  actions:
    - label: "Learn more"
      url: "https://unsplash.com"
last_modified_at: 2020-03-16 13:20:51
---

This post should display a **header with an overlay image**, if the theme supports it.


## 第一篇博客   
为了用个jekyll模板，ubuntu折腾了一天。中间遇到一些bug贼痛苦，记录下来也许对别人有点用处。
### 坑点
1. Ubuntu持续黑屏
2. 速度拉跨的gem源
3. bundle install 提示找不到openssl

### 解决办法
1. $> vim /etc/default/grub  <br/>
   增加nomodeset到GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash nomodeset\"  <br/>
   $> sudo update-grub  <br/>
   $> sudo reboot	<br/>
   有可能之前安装就一直黑屏，如果是vmware 建议用原生的模拟磁盘安装（选稍后自行安装），自动安装贼坑。
   卡在retrieving file 可以 skip 不然等一年！

2. $> gem sources -l   <br/>
   $> gem sources -r   //加上上面的干掉官方源   <br/>
   $> gem sources -a \'https://gems.ruby-china.com\'  //目前可用的国内源   <br/>
   另外gem在update 或者 bundle install的时候 也会使用默认源。   <br/>
   $> bundle config \'mirror.https://rubygems.org\' \'https://gems.ruby-china.com\'
   会在你 ~/.bundle 生成对应配置文件，而不需要去改Gemfile  <br/>
3. 这个坑奇坑无比！！  明明安装了openssl，他就是找不到你气不气 <br/>
   $> sudo gem install eventmachine -v \'1.2.7\' \-\-source \'https://gems.ruby-china.com\' \-\- \-\-with-cppflags=-I/usr/local/opt/openssl/include   <br/>
   参数设置也是贼坑，看帮助完全没用！！ 注意 两个\'\-\-\'不能少 还有空格

模板用的github mmistakes大佬的jekyll-theme-skinny-bones，装完ruby、rubygem、bundle 之后，解压大佬的zip包 bundle install 安装好 jekyll 就可以自己写博客啦！！  <br/>
编译: $>bundle exec jekyll build    <br/>
开启服务器: $>bundle exec jekyll serve    <br/>
默认本机 127.0.0.0:4000  绑定的本机内网 宿主机进不去的。

makedown还不熟估计版式贼丑。 <br/>
模板换成大佬最新的 minimal-mistakes。

