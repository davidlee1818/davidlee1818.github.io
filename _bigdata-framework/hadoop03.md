---
title: "大数据技术之Hadoop(MapReduce)" 
excerpt: "Hadoop是一个由Apache基金会所开发的分布式系统基础架构，广义上来说，Hadoop通常是指一个更广泛的概念——Hadoop生态圈。"
header:
  overlay_color: "#169CDE"
  teaser: assets/images/bigdata-framework/hadoop/hadoop-logo.jpeg
categories:
  - bigdata
tags:
  - hadoop

sidebar:
  nav: "bigdata"
toc: true
toc_sticky: true
toc_label: "本页目录"
toc_icon: "cog"

---


## MapReduce的概念
### MapReduce定义
MapReduce是一个分布式运算程序的编程框架，是基于Hadoop的数据分析计算的核心框架。MapReduce处理过程分为两个阶段：Map和Reduce。Map负责把一个任务分解成多个任务；Reduce负责把分解后多任务处理的结果汇总。

### MapReduce优缺点
* 优点  
1．MapReduce 易于编程  
它简单的实现一些接口，就可以完成一个分布式程序，这个分布式程序可以分布到大量廉价的PC机器上运行。也就是说你写一个分布式程序，跟写一个简单的串行程序是一模一样的。就是因为这个特点使得MapReduce编程变得非常流行。  
2．良好的扩展性  
当你的计算资源不能得到满足的时候，你可以通过简单的增加机器来扩展它的计算能力。  
3．高容错性  
MapReduce设计的初衷就是使程序能够部署在廉价的PC机器上，这就要求它具有很高的容错性。比如其中一台机器挂了，它可以把上面的计算任务转移到另外一个节点上运行，不至于这个任务运行失败，而且这个过程不需要人工参与，而完全是由Hadoop内部完成的。  
4．适合PB级以上海量数据的离线处理  
可以实现上千台服务器集群并发工作，提供数据处理能力。  
* 缺点  
1.  不擅长实时计算  
MapReduce无法像MySQL一样，在毫秒或者秒级内返回结果。  
2.  不擅长流式计算  
流式计算的输入数据是动态的，而MapReduce的输入数据集是静态的，不能动态变化。这是因为MapReduce自身的设计特点决定了数据源必须是静态的。  
3.  不擅长DAG（有向图）计算  
多个应用程序存在依赖关系，后一个应用程序的输入为前一个的输出。在这种情况下，MapReduce并不是不能做，而是使用后，每个MapReduce作业的输出结果都会写入到磁盘，会造成大量的磁盘IO，导致性能非常的低下。  

### MapReduce核心思想
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/map-reduce.png){: .align-right}
<center>MapReduce核心编程思想</center>
1. 分布式的运算程序往往需要分成至少2个阶段。
2. 第一个阶段的MapTask并发实例，完全并行运行，互不相干。
3. 第二个阶段的ReduceTask并发实例互不相干，但是他们的数据依赖于上一个阶段的所有MapTask并发实例的输出。
4. MapReduce编程模型只能包含一个Map阶段和一个Reduce阶段，如果用户的业务逻辑非常复杂，那就只能多个MapReduce程序，串行运行。
总结：分析WordCount数据流走向深入理解MapReduce核心思想。

### MapReduce进程
一个完整的MapReduce程序在分布式运行时有三类实例进程：  
1）MrAppMaster：负责整个程序的过程调度及状态协调。  
2）MapTask：负责Map阶段的整个数据处理流程。  
3）ReduceTask：负责Reduce阶段的整个数据处理流程。

### 常用数据序列化类型
常用的数据类型对应的Hadoop数据序列化类型

|  Java类型  |  Hadoop Writable类型 |
| ---------- | ---------------------|
|  boolean   |   BooleanWritable    |
|  byte      |   ByteWritable       |
|  int       |   IntWritable        |
|  float     |   FloatWritable      |
|  double    |   DoubleWritable     |
|  String    |      Text            |

### MapReduce编程规范
用户编写的程序分成三个部分：Mapper、Reducer和Driver。  
* Mapper阶段  
（1）用户自定义的Mapper要继承自己的父类  
（2）Mapper的输入数据是KV对的形式（KV的类型可自定义）  
（3）Mapper中的业务逻辑写在map()方法中  
（4）Mapper的输出数据是KV对的形式（KV的类型可自定义）  
（5）map()方法（MapTask进程）对每一个<K,V>调用一次

* Reducer阶段  
（1）用户自定义的Reducer要继承自己的父类  
（2）Reducer的输入数据类型对应Mapper的输出数据类型，也是KV  
（3）Reducer的业务逻辑写在reduce()方法中  
（4）ReduceTask进程对每一组相同k的<k,v>组调用一次reduce()方法  
* Driver阶段  
相当于YARN集群的客户端，用于提交我们整个程序到YARN集群，提交的是封装了MapReduce程序相关运行参数的job对象。

## Hadoop序列化
###  序列化概述
* 什么是序列化
序列化就是把内存中的对象，转换成字节序列（或其他数据传输协议）以便于存储到磁盘（持久化）和网络传输。反序列化就是将收到字节序列（或其他数据传输协议）或者是磁盘的持久化数据，转换成内存中的对象。
* 为什么要序列化
一般来说，“活的”对象只生存在内存里，关机断电就没有了。而且“活的”对象只能由本地的进程使用，不能被发送到网络上的另外一台计算机。 然而序列化可以存储“活的”对象，可以将“活的”对象发送到远程计算机。
* 为什么不用Java的序列化
Java的序列化是一个重量级序列化框架（Serializable），一个对象被序列化后，会附带很多额外的信息（各种校验信息，Header，继承体系等），不便于在网络中高效传输。所以，Hadoop自己开发了一套序列化机制（Writable）。  
Hadoop序列化特点：  
（1）紧凑 ：高效使用存储空间。  
（2）快速：读写数据的额外开销小。  
（3）可扩展：随着通信协议的升级而可升级。  
（4）互操作：支持多语言的交互。

### 自定义bean对象实现序列化接口（Writable）
在企业开发中往往常用的基本序列化类型不能满足所有需求，比如在Hadoop框架内部传递一个bean对象，那么该对象就需要实现序列化接口。  
具体实现bean对象序列化步骤如下7步：
1. 必须实现Writable接口
2. 反序列化时，需要反射调用空参构造函数，所以必须有空参构造
	```java
	public FlowBean() {
		super();
	}
	```
3. 重写序列化方法
	```java
	@Override
	public void write(DataOutput out) throws IOException {
		out.writeLong(upFlow);
		out.writeLong(downFlow);
		out.writeLong(sumFlow);
	}
	```
4. 重写反序列化方法
	```java
	@Override
	public void readFields(DataInput in) throws IOException {
		upFlow = in.readLong();
		downFlow = in.readLong();
		sumFlow = in.readLong();
	}
	```
5. 注意反序列化的顺序和序列化的顺序完全一致
6. 要想把结果显示在文件中，需要重写toString()，可用”\t”分开，方便后续用。
7. 如果需要将自定义的bean放在key中传输，则还需要实现Comparable接口，因为MapReduce框中的Shuffle过程要求对key必须能排序。详见后面排序案例。
	```java
	@Override
	public int compareTo(FlowBean o) {
		// 倒序排列，从大到小
		return this.sumFlow > o.getSumFlow() ? -1 : 1;
	}
	```

## MapReduce框架原理
### InputFormat数据输入
1. 切片与MapTask并行度决定机制
   * 问题引出  
	MapTask的并行度决定Map阶段的任务处理并发度，进而影响到整个Job的处理速度。  
	思考：1G的数据，启动8个MapTask，可以提高集群的并发处理能力。那么1K的数据，也启动8个MapTask，会提高集群性能吗？MapTask并行任务是否越多越好呢？哪些因素影响了MapTask并行度？

   * MapTask并行度决定机制  
	数据块：Block是HDFS物理上把数据分成一块一块。  
	数据切片：数据切片只是在逻辑上对输入进行分片，并不会在磁盘上将其切分成片进行存储。
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/maptask-parallelism.png){: .align-right}
	<center>MapTask并行度决定机制</center>

2. Job提交流程源码和切片源码详解

	```java
	waitForCompletion()

	submit();

	// 1建立连接
	connect();	
		// 1）创建提交Job的代理
		new Cluster(getConfiguration());
			// （1）判断是本地yarn还是远程
			initialize(jobTrackAddr, conf); 

	// 2 提交job
	submitter.submitJobInternal(Job.this, cluster)
		// 1）创建给集群提交数据的Stag路径
		Path jobStagingArea = JobSubmissionFiles.getStagingDir(cluster, conf);

		// 2）获取jobid ，并创建Job路径
		JobID jobId = submitClient.getNewJobID();

		// 3）拷贝jar包到集群
	copyAndConfigureFiles(job, submitJobDir);	
		rUploader.uploadFiles(job, jobSubmitDir);

	// 4）计算切片，生成切片规划文件
	writeSplits(job, submitJobDir);
			maps = writeNewSplits(job, jobSubmitDir);
			input.getSplits(job);

	// 5）向Stag路径写XML配置文件
	writeConf(conf, submitJobFile);
		conf.writeXml(out);

	// 6）提交Job,返回提交状态
	status = submitClient.submitJob(jobId, submitJobDir.toString(), job.getCredentials());
	```
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/job-submit.png){: .align-right}
	<center>Job提交流程源码分析</center>
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/fileinputformat-split01.png){: .align-right}
	<center>FileInputFormat切片源码解析(input.getSplits(job))</center>

3. FileInputFormat切片机制
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/fileinputformat-split02.png){: .align-right}
	<center>FileInputFormat切片机制(input.getSplits(job))</center>
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/fileinputformat-split03.png){: .align-right}
	<center>FileInputFormat切片大小的参数设置</center>

4. CombineTextInputFormat切片机制  
	框架默认的TextInputFormat切片机制是对任务按文件规划切片，不管文件多小，都会是一个单独的切片，都会交给一个MapTask，这样如果有大量小文件，就会产生大量的MapTask，处理效率极其低下。  
	1、应用场景：  
	CombineTextInputFormat用于小文件过多的场景，它可以将多个小文件从逻辑上规划到一个切片中，这样，多个小文件就可以交给一个MapTask处理。  
	2、虚拟存储切片最大值设置  
	CombineTextInputFormat.setMaxInputSplitSize(job, 4194304);// 4m  
	3、切片机制  
	生成切片过程包括：虚拟存储过程和切片过程两部分。  
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/combinetextinputformat-split.png){: .align-right}
	<center>CombineTextInputFormat切片机制</center>
	（1）虚拟存储过程：  
	将输入目录下所有文件大小，依次和设置的setMaxInputSplitSize值比较，如果不大于设置的最大值，逻辑上划分一个块。如果输入文件大于设置的最大值且大于两倍，那么以最大值切割一块；当剩余数据大小超过设置的最大值且不大于最大值2倍，此时将文件均分成2个虚拟存储块（防止出现太小切片）。  
	例如setMaxInputSplitSize值为4M，输入文件大小为8.02M，则先逻辑上分成一个4M。剩余的大小为4.02M，如果按照4M逻辑划分，就会出现0.02M的小的虚拟存储文件，所以将剩余的4.02M文件切分成（2.01M和2.01M）两个文件。  
	（2）切片过程：  
	（a）判断虚拟存储的文件大小是否大于setMaxInputSplitSize值，大于等于则单独形成一个切片。  
	（b）如果不大于则跟下一个虚拟存储文件进行合并，共同形成一个切片。  
	（c）测试举例：有4个小文件大小分别为1.7M、5.1M、3.4M以及6.8M这四个小文件，则虚拟存储之后形成6个文件块，大小分别为：  
	1.7M，（2.55M、2.55M），3.4M以及（3.4M、3.4M）  
	最终会形成3个切片，大小分别为：  
	（1.7+2.55）M，（2.55+3.4）M，（3.4+3.4）M  

5. FileInputFormat实现类  
	思考：在运行MapReduce程序时，输入的文件格式包括：基于行的日志文件、二进制格式文件、数据库表等。那么，针对不同的数据类型，MapReduce是如何读取这些数据的呢？FileInputFormat常见的接口实现类包括：TextInputFormat、KeyValueTextInputFormat、NLineInputFormat、CombineTextInputFormat和自定义InputFormat等。
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/textinputformat.png){: .align-right}
	<center>TextInputFormat</center>
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/keyvalueinputformat.png){: .align-right}
	<center>KeyValueInputFormat</center>
	![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/nlineinputformat.png){: .align-right}
	<center>NLineInputFormat</center>

6. 自定义InputFormat
在企业开发中，Hadoop框架自带的InputFormat类型不能满足所有应用场景，需要自定义InputFormat来解决实际问题。  
自定义InputFormat步骤如下：  
（1）自定义一个类继承FileInputFormat。  
（2）改写RecordReader，实现一次读取一个完整文件封装为KV。  
（3）在输出时使用SequenceFileOutPutFormat输出合并文件。  


