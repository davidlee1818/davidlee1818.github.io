var store = [{
        "title": "Blog Format-Header Image Overlay",
        "excerpt":"This post should display a header with an overlay image, if the theme supports it. 第一篇博客 为了用个jekyll模板，ubuntu折腾了一天。中间遇到一些bug贼痛苦，记录下来也许对别人有点用处。 坑点 Ubuntu持续黑屏 速度拉跨的gem源 bundle install 提示找不到openssl 解决办法 方法一 $&gt; vim /etc/default/grub 增加nomodeset到GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash nomodeset\" $&gt; sudo update-grub $&gt; sudo reboot 这个方法禁止虚拟机检测显卡，设置后屏幕可能很难看。 方法二 管理员cmd&gt; netsh winsock reset 将winsock的目录重置为默认的设置状态。虚拟机与主机之间的通信方式是以socket进行的。 可能会因为某个程序通过LSP注入DLL,导致回收不彻底。影响虚拟的运行。 因此需要进行这些注入DLL的残留清理重置。 这个方法虚拟机显示效果更好。但是会重置防火墙设置 hosts文件变成只读 有可能之前安装就一直黑屏，如果是vmware 建议用原生的模拟磁盘安装（选稍后自行安装），自动安装贼坑。...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/first-post/",
        "teaser": null
      },{
        "title": "通过staticman实现博客评论",
        "excerpt":"博客实现评论及验证 大佬帖子先贴上 https://travisdowns.github.io/blog/2020/02/05/now-with-comments.html 流程原理： 客户端网页渲染器通过post请求提交评论表单，js附加表单信息提交到运行在Heroku上的staticman (API bridge). 云端staticman保持着一份local git-repo(第一次是从你的blog-repo clone 到本地的)。 收到评论时会同步到bot账号的github仓库,并发起pull请求到你的博客仓库，然后需要博客账号同意merge。 当你同意merge之后，会立即触发github pages立即更新并发布你的网页内容(这是github pages的特性)，刷新后评论立刻就会出现。 建一个bot账号（普通账号）用户 为了能实现上述流程，因此需要用你的博客账号把bot账号拉到协作者团队中，允许bot修改你的博客仓库。 同时生成github Personal access tokens,勾选repo和users scope. google recaptcha实验验证功能 https://www.google.com/recaptcha/admin 翻墙注册博客域名 拿到sitekey和screte sitekey:在您的网站提供给用户的 HTML 代码中使用此网站密钥。 screte:此密钥用于您的网站和 reCAPTCHA 之间的通信(staticman 还会对它再加密) //使用之前部署在heroku的staticman加密recaptcha的screte https://${bridge_app_name}.herokuapp.com/v2/encrypt/{$recaptcha-site-secret} 将sitekey和加密后screte正确设置到jekyll的_config.yml中。 记得将html中的goog recaptcha中的js源改成国内的，不然无法通过验证（被墙了）。 将www.google.com改成www.recaptcha.net 通过heroku实现私人staticman服务 这个网站是真厉害，你可以部署你的服务在上面实时运行，甚至可以自定义pipline，统计分析、机器学习都能用得上。 现在你要为staticman添加参数配置： 在本机生成rsa密钥对，用公钥加密你的reCAPTCHA screte的公共部分，之后使用私钥进行解密。 登录heroku的cli，可以使用web端设置，也可以下载heroku的client登录。cli设置如下： heroku config:add --app ${bridge_app_name}...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/%E9%80%9A%E8%BF%87staticman%E5%AE%9E%E7%8E%B0%E5%8D%9A%E5%AE%A2%E8%AF%84%E8%AE%BA/",
        "teaser": null
      }]
