---
title: "Flume Tutorial" 
excerpt: "Flume 是Cloudera 提供的一个高可用的，高可靠的，分布式的海量日志采集、聚合和传输的系统。Flume 基于流式架构，灵活简单。"
header:
  overlay_color: "#FD9F21"
  teaser: assets/images/bigdata-framework/flume/flume-logo.png

sidebar:
  nav: "bigdata"
toc: true
toc_label: "本页目录"
toc_icon: "cog"

---

## Flume概述
Flume是Cloudera提供的一个高可用的，高可靠的，分布式的海量日志采集、聚合和传输的系统。Flume基于流式架构，灵活简单。
Flume的优点：
1. 可以和任意集中式存储进程集成。
2. 输入的数据速率大于写入存储目的地的速度，flume会进行缓冲。
3. Flume提供上下文路由。（数据流路线）
4. Flume中的事务基于channel，put事务和take事务，确保消息的可靠性。
5. Flume支持大量的source和destination类型。
6. Flume支持多级跳跃multi-hop，source和destination的fan in/out（扇入/出）。

## Flume组成架构
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flume-archi.png){: .align-right}
<center>Flume组成架构</center>
* Agent  
Agent是一个JVM进程，它以事件的形式将数据从源头送至目的。Agent主要有 3 个部分组成，Source 、Channel 、Sink 。
* Source  
Source是负责接收数据到Flume Agent的组件。Source组件可以处理各种类型、各种格式的日志数据，包括 avro 、 thrift 、 exec 、 jms 、 spooling directory 、 netcat 、 taildir 、sequence generator 、 syslog 、 http 、 legacy 。
* Sink  
Sink不断地轮询Channel中的事件且批量地移除它们，并将这些事件批量写入到存储或索引系统、或者被发送到另一个Flume Agent 。Sink组件目的地包括 hdfs 、 logger 、 avro 、 thrift 、 ipc 、 file 、 HBase 、 solr 、自定义。
* Channel  
Channel是位于Source和Sink之间的缓冲区。因此，Channel允许Source和Sink运作在不同的速率上。Channel是线程安全的，可以同时处理几个Source的写入操作和几个Sink的读取操作。Channel是提供事务的，put事务和take事务。  
Flume自带两种Channel Memory Channel和File Channel: 
   * Memory Channel  
	是内存中的队列。Memory Channel 在不需要关心数据丢失的情景下适用。如果需要关心数据丢失，那么Memory Channel 就不应该使用，因为程序死亡、机器宕
	机或者重启都会导致数据丢失。
   * File Channel  
	将所有事件写到磁盘。因此在程序关闭或机器宕机的情况下不会丢失数据。
* Event  
传输单元，Flume 数据传输的基本单元，以Event的形式将数据从源头送至目的地。Event由Header和Body两部分组成，Header用来存放该event的一些属性，为K/V结构，
Body用来存放该条数据，形式为字节数组。

**注意!** 一个flume的agent，可以有多个source、channel、sink。Source可以配置多个channel，sink只能配置一个channel。
{: .notice--primary}

## Flume进阶

### Flume事务
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flume-txn.png){: .align-right}
<center>Flume事务</center>
### Flume Agent内部原理
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flumeagent-archi.png){: .align-right}
<center>Flume Agent内部原理</center>
重要组件：  
1. Interceptor，拦截器  
用来修改和检查source和channel之间传递的events。
2. ChannelSelector，通道选择器  
ChannelSelector的作用就是选出Event将要被发往哪个Channel。其共有两种类型，分别是Replicating（复制）和Multiplexing（多路复用）。ReplicatingSelector 会将同一个Event 发往所有的Channel，Multiplexing 会根据相应的原则，将不同的Event 往不同的Channel。
3. SinkProcessor，沉槽处理器  
SinkProcessor共有三种类型，分别是DefaultSinkProcessor、LoadBalancingSinkProcessor和FailoverSinkProcessor。DefaultSinkProcessor对应的是单个的Sink， LoadBalancingSinkProcessor和FailoverSinkProcessor对应的是Sink Group，LoadBalancingSinkProcessor可以实现负载均衡的功能，FailoverSinkProcessor可以错误恢复的功能。

### Flume的拓扑结构
1. 简单串联 
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flume-topo01.png){: .align-center}
	<center>Flume Agent连接</center>
	这种模式是将多个flume 顺序连接起来了，从最初的 source 开始到最终 sink 传送的目的存储系统。此模式不建议桥接过多的 flume 数量 flume 数量 过多不仅会影响传输速率，
	而且一旦传输过程中某个节点 flume 宕机，会影响整个传输系统。
2. 复制和多路复用
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flume-topo02.png){: .align-center}
	<center>单source，多channel、sink</center>
	Flume支持将事件流向一个或者多个目的地。这种模式可以将相同数据复制到多个channel 中，或者将不同数据分发到不同的 channel 中， sink 可以选择传送到不同的目的
	地。
3. 负载均衡和故障转移
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flume-topo03.png){: .align-center}
	<center>Flume负载均衡和故障转移</center>
	Flume 支持使用将多个sink逻辑上分到一个sink组，sink组配合不同的SinkProcessor可以实现负载均衡和错误恢复的功能。
4. 聚合
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/flume/flume-topo04.png){: .align-center}
	<center>Flume Agent聚合</center>
	这种模式是我们最常见的，也非常实用，日常web应用通常分布在上百个服务器，大者甚至上千个、上万个服务器。产生的日志，处理起来也非常麻烦。
	用flume的这种组合方式能很好的解决这一问题， 每台服务器部署一个flume采集日志，传送到一个集中收集日志的。


