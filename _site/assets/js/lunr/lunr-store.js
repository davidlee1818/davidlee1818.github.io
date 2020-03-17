var store = [{
        "title": "Blog Format-Header Image Overlay",
        "excerpt":"This post should display a header with an overlay image, if the theme supports it. 第一篇博客 为了用个jekyll模板，ubuntu折腾了一天。中间遇到一些bug贼痛苦，记录下来也许对别人有点用处。 坑点 Ubuntu持续黑屏 速度拉跨的gem源 bundle install 提示找不到openssl 解决办法 方法一 $&gt; vim /etc/default/grub 增加nomodeset到GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash nomodeset\" $&gt; sudo update-grub $&gt; sudo reboot 这个方法禁止虚拟机检测显卡，设置后屏幕可能很难看。 方法二 管理员cmd&gt; netsh winsock reset 将winsock的目录重置为默认的设置状态。虚拟机与主机之间的通信方式是以socket进行的。 可能会因为某个程序通过LSP注入DLL,导致回收不彻底。影响虚拟的运行。 因此需要进行这些注入DLL的残留清理重置。 这个方法虚拟机显示效果更好。但是会重置防火墙设置 hosts文件变成只读 有可能之前安装就一直黑屏，如果是vmware 建议用原生的模拟磁盘安装（选稍后自行安装），自动安装贼坑。...","categories": [],
        "tags": [],
        "url": "/first-post/",
        "teaser": null
      }]
