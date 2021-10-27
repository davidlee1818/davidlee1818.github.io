---
title: "Hadoop Tutorials" 
excerpt: "Hadoop是一个由Apache基金会所开发的分布式系统基础架构，广义上来说，Hadoop通常是指一个更广泛的概念——Hadoop生态圈。"
header:
  overlay_color: "#169CDE"
  teaser: assets/images/bigdata-framework/hadoop/hadoop-logo.jpeg

sidebar:
  nav: "bigdata"
toc: true
toc_sticky: true
toc_label: "本页目录"
toc_icon: "cog"

---


# 从Hadoop框架讨论大数据生态   

## Hadoop的诞生
我们生活在一个数据时代，想要测量存储的数据总量并不容易，但国际数据公司(IDC)估计，2013年“数字宇宙”的大小为4.4 zettabytes
并预计到2020年将增长10倍，达到44 zettabytes。
而1 zettabyte= 10<sup>21</sup>bytes，ZB我们可能不熟悉，1ZB=2<sup>10</sup>EB 1EB=2<sup>10</sup>PB 1PB=2<sup>10</sup>TB 1TB=2<sup>10</sup>MB，1ZB相当于10亿TB。
就公司而言，数据总量也将达到PB级别，并且还在不断增长中。这么大的数据量的存储以及分析的成本在当时是非常昂贵的，于是就有了去“IOE”化的概念，
I：IBM的商业小型机 O：Oracle的软件 E：Emc的数据存储。
为了解决这些问题，hadoop应运而生。hadoop提供了可靠的，可伸缩的，分布式计算机的开源平台。使用廉价的PC机就能存储、分析大量的数据。
{: style="text-align: justify;"}

## Hadoop是什么？
Hadoop是一个由Apache基金会所开发的分布式系统基础架构。主要解决，海量数据的存储和海量数据的分析计算问题。
广义上来说，Hadoop通常是指一个更广泛的概念——Hadoop生态圈。

![image-01]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/hadoop-ecosystem01.jpg)

Hadoop的核心概念是分布式，那么分布式又是什么呢？ <br/>
分布式应用：由分布在不同主机上的进程协同在一起，才能构成整个应用。

## Hadoop发展历史
Lucene框架是Doug Cutting开创的开源软件，用Java书写代码，实现与Google类似的全文搜索功能，它提供了全文检索引擎的架构，包括完整的查询引擎和索引引擎。

2001年年底Lucene成为Apache基金会的一个子项目。对于海量数据的场景，Lucene面对与Google同样的困难，存储数据困难，检索速度慢。学习和模仿Google解决这些问题的办法 ：微型版Nutch。

可以说Google是Hadoop的思想之源(Google在大数据方面的三篇论文)
* GFS --->HDFS
* Map-Reduce --->MR
* BigTable --->HBase

2003-2004年，Google公开了部分GFS和MapReduce思想的细节，以此为基础Doug Cutting等人用了2年业余时间实现了DFS和MapReduce机制，使Nutch性能飙升。

2005 年Hadoop 作为 Lucene的子项目 Nutch的一部分正式引入Apache基金会。

2006 年 3 月份，Map-Reduce和Nutch Distributed File System (NDFS) 分别被纳入到 Hadoop 项目中，Hadoop就此正式诞生，标志着大数据时代来临。

## Hadoop三大发行版本
**Hadoop三大发行版本：Apache、Cloudera、Hortonworks**
* Apache版本最原始（最基础）的版本，对于入门学习最好。
* Cloudera在大型互联网企业中用的较多。
* Hortonworks文档较好。

**Apache Hadoop**  
[**官网地址**](http://hadoop.apache.org/releases.html)
[**下载地址**](https://archive.apache.org/dist/hadoop/common/)

**Cloudera Hadoop**   
[**官网地址**](https://www.cloudera.com/downloads/cdh/5-10-0.html)
[**下载地址**](http://archive-primary.cloudera.com/cdh5/cdh/5/)
* 2008年成立的Cloudera是最早将Hadoop商用的公司，为合作伙伴提供Hadoop的商用解决方案，主要是包括支持、咨询服务、培训。
* 2009年Hadoop的创始人Doug Cutting也加盟Cloudera公司。Cloudera产品主要为CDH，Cloudera Manager，Cloudera Support
* CDH是Cloudera的Hadoop发行版，完全开源，比Apache Hadoop在兼容性，安全性，稳定性上有所增强。
* Cloudera Manager是集群的软件分发及管理监控平台，可以在几个小时内部署好一个Hadoop集群，并对集群的节点及服务进行实时监控。Cloudera Support即是对Hadoop的技术支持。
* Cloudera的标价为每年每个节点4000美元。Cloudera开发并贡献了可实时处理大数据的Impala项目。

**Hortonworks Hadoop**  
[**官网地址**](https://hortonworks.com/products/data-center/hdp/)
[**下载地址**](https://hortonworks.com/downloads/#data-platform)
* 2011年成立的Hortonworks是雅虎与硅谷风投公司Benchmark Capital合资组建。
* 公司成立之初就吸纳了大约25名至30名专门研究Hadoop的雅虎工程师，上述工程师均在2005年开始协助雅虎开发Hadoop，贡献了Hadoop80%的代码。
* 雅虎工程副总裁、雅虎Hadoop开发团队负责人Eric Baldeschwieler出任Hortonworks的首席执行官。
* Hortonworks的主打产品是Hortonworks Data Platform（HDP），也同样是100%开源的产品，HDP除常见的项目外还包括了Ambari，一款开源的安装和管理系统。
* HCatalog，一个元数据管理系统，HCatalog现已集成到Facebook开源的Hive中。Hortonworks的Stinger开创性的极大的优化了Hive项目。Hortonworks为入门提供了一个非常好的，易于使用的沙盒。
* Hortonworks开发了很多增强特性并提交至核心主干，这使得Apache Hadoop能够在包括Window Server和Windows Azure在内的Microsoft Windows平台上本地运行。定价以集群为基础，每10个节点每年为12500美元。

## Hadoop的优势
1. 高可靠性：Hadoop底层维护多个数据副本，所以即使Hadoop某个计算元素或存储出现故障，也不会导致数据的丢失。
2. 高扩展性：在集群间分配任务数据，可方便的扩展数以千计的节点。
3. 高效性：在MapReduce的思想下，Hadoop是并行工作的，以加快任务处理速度。
4. 高容错性：能够自动将失败的任务重新分配。

## Hadoop的组成
Hadoop包含以下模块：

* Hadoop common：支持其他模块的工具模块。
* HDFS（Hadoop Distributed File System）：分布式文件系统，提供了对应用程序数据的高吞吐量的访问。
* Hadoop YARN（Yet Another Resource Negotiate）：作业调度与集群资源管理的框架。
* Hadoop Map-Reduce：基于yarn系统对大数据集进行并行处理的技术。

在Hadoop1.x时代，Hadoop中的MapReduce同时处理业务逻辑运算和资源的调度，耦合性较大，在Hadoop2.x时代，增加了Yarn。
Yarn只负责资源的调度，MapReduce只负责运算。

### HDFS架构
**NameNode(nn)**：名称节点，存储文件的元数据，如文件名，文件目录结构，文件属性（生成时间、副本数、文件权限），以及每个文件的块列表。但是并不直接
存储块所在DataNode（数据节点）的位置，而是通过系统启动时由DataNode通过心跳机制报告给NameNode。在磁盘则表现为两种文件：the namespace image（名字空间镜像文件）和 the edit log（编辑日志）。

**DataNode(dn)**：数据节点，在本地文件系统存储文件块数据，以及块数据的校验和。

**Secondary NameNode(2nn)**：辅助名称节点，用来监控HDFS状态的辅助后台程序，每隔一段时间获取HDFS元数据的快照。



### YARN架构

![image-02]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/yarn-framework.png)

### MapReduce架构
MapReduce将计算过程分为两个阶段：Map和Reduce，如下图所示
* Map阶段并行处理输入数据
* Reduce阶段对Map结果进行汇总

![image-03]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/map-reduce.jpg)

### 大数据生态体系
![image-04]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/hadoop-ecosystem02.png)


图中涉及的技术名词解释如下：  
**Sqoop：**Sqoop是一款开源的工具，主要用于在Hadoop、Hive与传统的数据库(MySql)间进行数据的传递，可以将一个关系型数据库（例如 ：MySQL，Oracle 等）中的数据导进到Hadoop的HDFS中，也可以将HDFS的数据导进到关系型数据库中。

**Flume：**Flume是Cloudera提供的一个高可用的，高可靠的，分布式的海量日志采集、聚合和传输的系统，Flume支持在日志系统中定制各类数据发送方，用于收集数据；同时，Flume提供对数据进行简单处理，并写到各种数据接受方（可定制）的能力。

**Kafka：**Kafka是一种高吞吐量的分布式发布订阅消息系统，有如下特性：

* 通过O(1)的磁盘数据结构提供消息的持久化，这种结构对于即使数以TB的消息存储也能够保持长时间的稳定性能。
* 高吞吐量：即使是非常普通的硬件Kafka也可以支持每秒数百万的消息。
* 支持通过Kafka服务器和消费机集群来分区消息。
* 支持Hadoop并行数据加载。

**Storm：**Storm用于“连续计算”，对数据流做连续查询，在计算时就将结果以流的形式输出给用户。

**Spark：**Spark是当前最流行的开源大数据内存计算框架。可以基于Hadoop上存储的大数据进行计算。

**Oozie：**Oozie是一个管理Hadoop作业（job）的工作流程调度管理系统。

**Hbase：**HBase是一个分布式的、面向列的开源数据库。HBase不同于一般的关系数据库，它是一个适合于非结构化数据存储的数据库。

**Hive：**Hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供简单的SQL查询功能，可以将SQL语句转换为MapReduce任务进行运行。 其优点是学习成本低，可以通过类SQL语句快速实现简单的MapReduce统计，不必开发专门的MapReduce应用，十分适合数据仓库的统计分析。
R语言：R是用于统计分析、绘图的语言和操作环境。R是属于GNU系统的一个自由、免费、源代码开放的软件，它是一个用于统计计算和统计制图的优秀工具。

**Mahout：**Apache Mahout是个可扩展的机器学习和数据挖掘库。

**ZooKeeper：**Zookeeper是Google的Chubby一个开源的实现。它是一个针对大型分布式系统的可靠协调系统，提供的功能包括：配置维护、名字服务、 分布式同步、组服务等。ZooKeeper的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。


### 推荐系统框架图

![image-05]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/hadoop-ecosystem03.png)

# Hadoop运行时环境搭建
## 虚拟机环境准备

{% capture notice-1 %}
CentOS环境变量：  	
* /etc/profile 不推荐 
* /etc/profile.d/env.sh  
	export JAVA_HOME= /XX/XX  
	pathmunge /xx/xx:/xx/xx
{% endcapture %}

<div class="notice--info">{{ notice-1 | markdownify }}</div>

* 安装JDK
* 安装Hadoop

## Hadoop目录结构

**查看Hadoop目录结构**

```shell	
[centos@hadoop101 hadoop-2.7.2]$ ll
总用量 52
drwxr-xr-x. 2 centos centos  4096 5月  22 2017 bin
drwxr-xr-x. 3 centos centos  4096 5月  22 2017 etc
drwxr-xr-x. 2 centos centos  4096 5月  22 2017 include
drwxr-xr-x. 3 centos centos  4096 5月  22 2017 lib
drwxr-xr-x. 2 centos centos  4096 5月  22 2017 libexec
-rw-r--r--. 1 centos centos 15429 5月  22 2017 LICENSE.txt
-rw-r--r--. 1 centos centos   101 5月  22 2017 NOTICE.txt
-rw-r--r--. 1 centos centos  1366 5月  22 2017 README.txt
drwxr-xr-x. 2 centos centos  4096 5月  22 2017 sbin
drwxr-xr-x. 4 centos centos  4096 5月  22 2017 share
```

**重要目录** 

* bin目录：存放对Hadoop相关服务（HDFS,YARN）进行操作的脚本
* etc目录：Hadoop的配置文件目录，存放Hadoop的配置文件
* lib目录：存放Hadoop的本地库（对数据进行压缩解压缩功能）
* sbin目录：存放启动或停止Hadoop相关服务的脚本
* share目录：存放Hadoop的依赖jar包、文档、和官方案例

# Hadoop运行模式

## 本地运行模式
主要用于测试和开发环境，没有启动任何java进程。

```shell
查看hdfs文件系统
$>hadoop fs -ls
```
## 伪分布式运行模式
事实上，hadoop伪分布式和完全分布式并没有严格意义上的区分，伪分布式只是完全分布式的一种特殊情况，将所有进程在一个节点上启动。

**修改$HADOOP_HOME/etc/hadoop 下的配置文件**  

**tips!**   4个经典的配置文件：  
core-site.xml hdfs-site.xml mapred-site.xml yarn-site.xml 
{: .notice--info}

```xml
<?xml version="1.0"?>
<!-- core-site.xml -->
<!-- 指定namenode的节点-->
<configuration>
	<property>
		<name>fs.defaultFS</name>
		<value>hdfs://localhost/</value>
	</property>
</configuration>

<?xml version="1.0"?>
<!-- hdfs-site.xml -->
<!-- 指定文件的副本数-->
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>1</value>
	</property>
</configuration>

<?xml version="1.0"?>
<!-- mapred-site.xml -->
<!-- 指定mr作业使用yarn框架-->
<configuration>
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
</configuration>

<?xml version="1.0"?>
<!-- yarn-site.xml -->
<!-- 指定资源管理器的节点-->
<configuration>
	<property>
		<name>yarn.resourcemanager.hostname</name>
		<value>localhost</value>
	</property>
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
</configuration>

```

**配置ssh无密登录**  
hadoop是读取slaves文件中的主机名并通过ssh启动相应的java进程。

*[slaves]: 在$HADOOP_HOME/etc/hadoop下

*ssh无密登录原理*

![image-06]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/ssh.png)

*安装配置ssh*

```shell
$> yum list installed | grep ssh	//检查是否安装了ssh
$> sudo yum -y install ssh	//没有则安装
//生成公私秘钥对 -t指定算法 -P指定密码为空 -f指定路径
$> ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
//会生成两个文件id_rsa（私钥）、id_rsa.pub（公钥）
$> cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys	//追加公钥到本地主机的授权库中
$> ssh-copy-id username@hostname	//拷贝公钥到指定主机的授权库中（以上两种方法都可以）
$> ssh localhost	//测试连接，如果不需要输入密码就成功了
	```

*启动停止进程* 

```shell
//在首次使用hdfs文件系统之前，需要对其进行格式化
$> hdfs namenode -format
//启动hdfs、yarn、mr历史作业服务器进程
$> start-dfs.sh
$> start-yarn.sh
$> mr-jobhistory-daemon.sh start historyserver
/* 你可以通过log文件查看是否启动成功，也可以通过webUI查看。
名称节点 http://localhost:50070/ 
资源管理器 http://localhost:8088/
mr历史作业服务器http://localhost:19888/  
还可以通过java命令jps查看相应的进程是否启动成功 */
//关闭hdfs、yarn、mr历史作业服务器进程
$> stop-dfs.sh
$> stop-yarn.sh
$> mr-jobhistory-daemon.sh stop historyserver
```

## 完全分布式运行模式

### 集群配置

|                  | hadoop100 |  hadoop101 | hadoop102 |
| --------         | --------- | ---------------------- |
|       HDFS       |   NN DN   |      DN    |  2NN DN   |
|       YARN       |    NM     |    RM NM   |    NM     |

*[NN]:Namenode
*[DN]:Datanode
*[2NN]:Secondary Namenode
*[RM]:ResourceManager
*[NM]:NodeManager

### 编写集群分发、执行脚本

**scp（secure copy）安全拷贝**    
scp可以实现服务器与服务器之间的数据拷贝。（from server1 to server2）  

```shell
$> scp  -r   $pdir/$fname  $user@$host:$pdir/$fname  
 命令 递归 要拷贝的文件路径/名称 目的用户@主机:目的路径/名称
```

**rsync 远程同步工具**  
rsync主要用于备份和镜像。具有速度快、避免复制相同内容和支持符号链接的优点。  
rsync和scp区别：用rsync做文件的复制要比scp的速度快，rsync只对差异文件做更新。scp是把所有文件都复制过去。  

```shell
$> rsync -rvl $pdir/$fname $user@$host:$pdir/$fname
 命令 参数 要拷贝的文件路径/名称 目的用户@主机:目的路径/名称
// -r递归拷贝 -v显示详细信息 -l支持符号链接
```
**xsync集群分发脚本**   

* 需求：循环复制文件到所有节点的相同目录下  
	rsync命令原始拷贝：  
	rsync  -rvl     /opt/module  		 root@hadoop103:/opt/ 
* 期望脚本：  
	xsync 要同步的文件名称  
* 说明： 
	在/usr/local/bin这个目录下存放的脚本，用户可以在系统任何地方直接执行。 

```shell
$> cd /usr/local/sbin
$> touch xsync
$> chmod +x xsync
$> vi xsync
====================xsync======================
#!/bin/bash
pcount=$#
if((pcount<1));then
	echo no args;
	exit;
fi

p1=$1
fname=`basename $p1`
pdir=`cd -P $(dirname $p1);pwd`

cuser=`whoami`
host=`hostname`
nodes='hadoop100 hadoop101 hadoop102'
for node in $nodes;do
	if [ $node != $host ];then
		tput setaf 2
		echo ------------$node------------
		tput setaf 7
		rsync -rvl $pdir/$fname $cuser@$node:$pdir
	fi
done
===============================================
```

**集群执行脚本xcall**    
xcall：在所有主机上执行相同的命令  

```shell
-------------xcall.sh------------------------
#!/bin/bash

pcount=$#
if(($pcount<1));then
	echo no args;
	exit;
fi

params=$@
nodes='hadoop100 hadoop101 hadoop102'
for node in $nodes;do
	tput setaf 2
	echo ------------$node------------
	tput setaf 7
	ssh -4 $node "source /etc/profile;$params"
done
---------------------------------------------
```

### 修改配置文件并分发

```xml
<?xml version="1.0"?>
<!-- core-site.xml -->
<!-- 指定HDFS中NameNode的地址 -->
<property>
	<name>fs.defaultFS</name>
	<value>hdfs://hadoop100:9000</value>
</property>

<!-- 指定Hadoop运行时产生文件的存储目录 -->
<property>
	<name>hadoop.tmp.dir</name>
	<value>/opt/module/hadoop-2.7.2/data/tmp</value>
</property>

<?xml version="1.0"?>
<!-- hdfs-site.xml -->
<property>
	<name>dfs.replication</name>
	<value>3</value>
</property>

<!-- 指定Hadoop辅助名称节点主机配置 -->
<property>
	<name>dfs.namenode.secondary.http-address</name>
	<value>hadoop102:50090</value>
</property>

<?xml version="1.0"?>
<!-- yarn-site.xml -->
<!-- 指定YARN的ResourceManager的地址 -->
<property>
	<name>yarn.resourcemanager.hostname</name>
	<value>hadoop101</value>
</property>

<!-- slaves -->
hadoop100
hadoop101
hadoop102
```

**将配置好的hadoop以及环境变量分发至各节点**

```shell
$> xsync /opt/module/hadoop /etc/profile.d/env.sh
//通过xcall 检验文件是否发送成功
$> xcall cat /etc/profile.d/env.sh
//使环境变量生效
$> xcall source /etc/profile
```

### 集群的启动并验证
 
```shell
//集群启动前需要格式hdfs文件系统
$> hdfs namenode -format
//群起
$> start-hdfs.sh
$> start-yarn.sh
//通过xcall查看进程是否启动成功
$> xcall jps
//hadoop100上应该有nn、dn进程 
//hadoop101应该有rm、dn进程 
//hadoop102应该有2nn、dn进程
//如果某个节点有进程没有启动成功，首先去该节点查看日志。
//解决问题后通过以下命令单点启动
$>hadoop-daemon.sh start xxx(namenode后者datanode)
$>yarn-daemon.sh start xxx(resourcemanager后者nodemanager)
```
### 集群时间同步  

时间同步的方式：找一个机器，作为时间服务器，所有的机器与这台集群时间进行定时的同步，比如，每隔十分钟，同步一次时间。  
**时间服务器配置（必须root用户）**

```shell
#[检查ntp是否安装]
[root@hadoop100 /]# rpm -qa|grep ntp
ntp-4.2.6p5-10.el6.centos.x86_64
fontpackages-filesystem-1.41-1.1.el6.noarch
ntpdate-4.2.6p5-10.el6.centos.x86_64
```


```shell
#[修改ntp配置文件]
[root@hadoop100 /]# vi /etc/ntp.conf
修改内容如下
a）修改1（授权192.168.1.0-192.168.1.255网段上的所有机器可以从这台机器上查询和同步时间）
#restrict 192.168.1.0 mask 255.255.255.0 nomodify notrap为
restrict 192.168.1.0 mask 255.255.255.0 nomodify notrap
b）修改2（集群在局域网中，不使用其他互联网上的时间）
server 0.centos.pool.ntp.org iburst
server 1.centos.pool.ntp.org iburst
server 2.centos.pool.ntp.org iburst
server 3.centos.pool.ntp.org iburst为
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst
c）添加3（当该节点丢失网络连接，依然可以采用本地时间作为时间服务器为集群中的其他节点提供时间同步）
server 127.127.1.0
fudge 127.127.1.0 stratum 10
```


```shell
#[修改/etc/sysconfig/ntpd 文件]
[root@hadoop102 /]# vim /etc/sysconfig/ntpd
增加内容如下（让硬件时间与系统时间一起同步）
SYNC_HWCLOCK=yes
```


```shell
#[重新启动ntpd服务]
[root@hadoop100 /]# service ntpd status
ntpd 已停
[root@hadoop100 /]# service ntpd start
正在启动 ntpd：                       [确定]
```


```shell
#[设置ntpd服务开机启动]
[root@hadoop100 桌面]# chkconfig ntpd on
```


**其他机器配置（必须root用户）**  

```shell
1. 在其他机器配置10分钟与时间服务器同步一次
[root@hadoop101 桌面]# crontab -e
编写定时任务如下：
*/10 * * * * /usr/sbin/ntpdate hadoop102
2. 修改任意机器时间
[root@hadoop101 桌面]# date -s "2017-9-11 11:11:11"
3. 十分钟后查看机器是否与时间服务器同步
[root@hadoop101 桌面]# date
说明：测试的时候可以将10分钟调整为1分钟，节省时间。
```









