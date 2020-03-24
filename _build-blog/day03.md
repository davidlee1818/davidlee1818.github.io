---
title: "搭建博客之第三天"
excerpt: "用[**algolia**](http://www.algolia.com)实现博客的搜索功能，并通过[**travis-ci**](https://travis-ci.org/)实现自动更新搜索库，
很简单只要注册并配置好就行了！"
header:
  overlay_color: "#333"
  teaser: assets/images/build-blog/build-blog-03.jpg
sidebar:
  nav: "buildblog"
toc: true
toc_label: "本页目录"
toc_icon: "cog"

---

# alglia
1. 将jekyll-algolia添加到你`Gemfile`以及`jekyll_plugins`中，如下：
```
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-paginate"
  gem "jekyll-include-cache"
  gem "jekyll-algolia"
end
```
之后在命令行执行`bundle install`，安装好相应的依赖库。
2. 在你的`_config.yml`中修改如下：
```
search_provider: algolia
```
3. 将algolia的认证信息添加到`_config.yml`
```
algolia:
  application_id: # YOUR_APPLICATION_ID
  index_name: # YOUR_INDEX_NAME
  search_only_api_key: # YOUR_SEARCH_ONLY_API_KEY
  powered_by: # true (default), false
```
如果你没有algolia账号，*去注册一个并启用一个免费的[社区计划](https://www.algolia.com/users/sign_up/hacker)。
从你的[dashboard](https://www.algolia.com/licensing)中获取认证信息。*
4. 当你的认证信息配置好之后，就可以通过以下命令去执行algolia的索引编排
```
ALGOLIA_API_KEY=your_admin_api_key bundle exec jekyll algolia
```
对于windows用户，你应该通过`set`设置`ALGOLIA_API_KEY`环境变量
```
set ALGOLIA_API_KEY=your_admin_api_key
bundle exec jekyll algolia
```
注意`ALGOLIA_API_KEY`应该是你的admin API key。

# Travis
## 启用Travis 
Travis CI 是一个托管的持续集成的服务，并且是开源免费的项目。你可以通过它监听Github仓库的任何变化，并执行一个特殊的命令反馈回去。
正如上面一样如果每次更新索引库都需要我们手动执行
```
ALGOLIA_API_KEY=your_admin_api_key bundle exec jekyll algolia
```
会变得很麻烦。不过别担心，Travis CI可以帮助你完成这个工作。在你每次push到github仓库中时它会自动帮你执行`jekyll algolia`来实时更新。
接下来是你要执行的一些步骤：
 - 注册登录[travis-ci.org](https://travis-ci.org/)(可以直接使用github账户登录)
 - 点击你的头像和简介
 - 从列表中找到你的github仓库并启用 


![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/build-blog/shortcut-buildblog03.png){: .align-right}
取消勾选'Build pull request updates'选项，防止每次你收到pull请求是重新编排索引(评论会触发pull request)

## 配置Travis
现在Travis已经启用了，通过`.travis.yml`文件配置到你的仓库的根目录下，将会使你更容易追踪配置信息，尽管你可以通过Travis UI去配置，但是并不推荐。

```
# .travis.yml
# This file should be at the root of your project
language: ruby
cache: bundler
before_install:
  - gem install bundler
script:
  - bundle exec jekyll algolia
branches:
  only:
    # Change this to gh-pages if you're deploying using the gh-pages branch
    - master
rvm:
 - 2.4'

```
通过`.travis.yml`文件Travis能够使用Bundler获得你定义在`Gemfile`中的所有依赖，然后执行`bundle exec jekyll algolia`对你的数据自动排序。
设置`branches.only`的值，你可以选择只对Github仓库的某个分支生效，通常来说都是master，取决于你Github pages发布在哪里。
 
## 忽略`vendor`
Travis将他的服务端`vendor`目录下所有gems打包，因此Jekyll可以能会错误的读取，这可能会导致执行失败。为了避免这种情况，你应该将`vendor`配置到`_config.yml`的`exclude`列表中。
```
exclude: [vendor]
```
## 添加`ALGOLIA_API_KEY`
通过WebUI Travis Settings页面将你的`ALGOLIA_API_KEY`作为环境变量传给Travis。


接下来让我们验证一下，提交你所有的修改并push到Github远程仓库，Travis会抓取push事件并触发一个自动排序。你可以通过Travis dashboard查看作业执行的完整日志。


