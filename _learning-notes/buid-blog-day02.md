---
title: "搭建博客之第二天"
excerpt: "基于Staticman实现博客的评论功能以及Google reCAPTCHA验证，有点难度不过当你实现后很有成就感哦！"
last_modified_at: 2021-10-23
header:
  overlay_color: "#333"
  teaser: assets/images/learning-notes/build-blog/build-blog-02.jpg
sidebar:
  nav: "learningnotes"
toc: true
toc_label: "本页目录"
toc_icon: "cog"

---


## 博客实现评论及验证
大佬帖子先贴上 [**点这**](https://travisdowns.github.io/blog/2020/02/05/now-with-comments.html) <br />
### 流程原理：
1. 客户端网页渲染器通过post请求提交评论表单，js附加表单信息提交到运行在Heroku上的staticman (API bridge).
2. 云端staticman保持着一份local git-repo(第一次是从你的blog-repo clone 到本地的)。
3. 收到评论时会同步到bot账号的github仓库,并发起pull请求到你的博客仓库，然后需要博客账号同意merge。<br />
4. 当你同意merge之后，会立即触发github pages立即更新并发布你的网页内容(这是github pages的特性)，刷新后评论立刻就会出现。




### 建一个bot账号（普通账号）用户
为了能实现上述流程，因此需要用你的博客账号把bot账号拉到协作者团队中，允许bot修改你的博客仓库。 <br />
同时生成github Personal access tokens,勾选repo和users scope.

### google recaptcha实验验证功能
https://www.google.com/recaptcha/admin 翻墙注册博客域名 拿到sitekey和screte <br />
sitekey:在您的网站提供给用户的 HTML 代码中使用此网站密钥。<br />
screte:此密钥用于您的网站和 reCAPTCHA 之间的通信(staticman 还会对它再加密) <br />
```
//使用之前部署在heroku的staticman加密recaptcha的screte
https://${bridge_app_name}.herokuapp.com/v2/encrypt/{$recaptcha-site-secret}
```
将sitekey和加密后screte正确设置到jekyll的_config.yml中。
记得将html中的goog recaptcha中的js源改成国内的，不然无法通过验证（被墙了）。
将www.google.com改成www.recaptcha.net

### 通过heroku实现私人staticman服务
这个网站是真厉害，你可以部署你的服务在上面实时运行，甚至可以自定义pipline，统计分析、机器学习都能用得上。
现在你要为staticman添加参数配置：
1. 在本机生成rsa密钥对，staticman会用公钥来加密你的reCAPTCHA screte的公共部分，之后使用私钥进行解密。
2. 登录heroku的cli，可以使用web端设置，也可以下载heroku的client登录。cli设置如下：
```
//staticman无法处理换行,需要处理掉\n 和 /
heroku config:add --app ${bridge_app_name} "RSA_PRIVATE_KEY=$(cat ~/.ssh/staticman_key | tr -d '\n')"
heroku config:add --app ${bridge_app_name} "GITHUB_TOKEN=${github_token}"
heroku config --app ${bridge_app_name} //验证参数设置是否正确
```
3. 邀请bot账户至协作者团队 blog-repo -> Settings -> manage access -> invate a collaborator
```
//浏览器中输入以下地址, ${bridge_app_name}是你heroku上的应用名 后两个参数你是博客的用户名和仓库名
https://${bridge_app_name}.herokuapp.com/v2/connect/${github-username}/${blog-repo}
```
当出现OK！就说明邀请成功了(只会显示一次，之后再刷新就会提示邀请找不到)，事实上你也可以手动通过bot账号的邮件同意邀请。
不过通过heroku同意也证明了我们之前的设置是有效的。



现在你的博客就可以实现评论功能了！！！

