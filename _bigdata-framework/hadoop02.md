---
title: "大数据技术之Hadoop(HDFS)" 
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


## HDFS概述
### HDFS产生背景及定义
&emsp;&emsp;随着数据量越来越大，在一个操作系统存不下所有的数据，那么就分配到更多的操作系统管理的磁盘中，但是不方便管理和维护，迫切需要一种系统来管理多台机器上的文件，这就是分布式文件管理系统。HDFS只是分布式文件管理系统中的一种。  
&emsp;&emsp;HDFS（Hadoop Distributed File System），它是一个文件系统，用于存储文件，通过目录树来定位文件；其次，它是分布式的，由很多服务器联合起来实现其功能，集群中的服务器有各自的角色。  
&emsp;&emsp;HDFS的使用场景：适合一次写入，多次读出的场景，且不支持文件的修改。适合用来做数据分析，并不适合用来做网盘应用。
### HDFS的优缺点
* 优点
   * 高容错性
        * 数据自动保存多个副本。它通过增加副本的形式，提高容错性。
        * 某一个副本丢失以后，它可以自动恢复。
   * 适合处理大数据
        * 数据规模：能够处理数据规模达到GB、TB、甚至PB级别的数据；
        * 文件规模：能够处理百万规模以上的文件数量，数量相当之大。
   * 可构建在廉价机器上，通过多副本机制，提高可靠性。
* 缺点
   * 不适合低延时数据访问，比如毫秒级的存储数据，是做不到的。
   * 无法高效的对大量小文件进行存储。
        * 存储大量小文件的话，它会占用NameNode大量的内存来存储文件目录和块信息。这样是不可取的，因为NameNode的内存总是有限的；
        * 小文件存储的寻址时间会超过读取时间，它违反了HDFS的设计目标。
   * 不支持并发写入、文件随机修改。
        * 一个文件只能有一个写，不允许多个线程同时写；
        * 仅支持数据append（追加），不支持文件的随机修改。

### HDFS组成架构
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/hdfs-framework01.png){: .align-right}
<center>HDFS架构图</center>
### HDFS文件块大小
HDFS中的文件在物理上是分块存储（Block），块的大小可以通过配置参数( dfs.blocksize)来规定，默认大小在Hadoop2.x版本中是128M，老版本中是64M。
如果寻址时间约为10ms，即查找到目标block的时间为10ms。寻址时间为传输时间的1%时，则为最佳状态。因此，传输时间=10ms/0.01=1000ms=1s，而目前磁盘的传输速率普遍为100MB/s。
100MB/S * 1s=100MB，考虑到磁盘是用二进制存储，那么最接近100MB的是128MB。  
寻址时间=寻道时间+旋转延迟  
寻道时间 Tseek是指将读写磁头移动至正确的磁道上所需要的时间。寻道时间越短，I/O操作越快，目前磁盘的平均寻道时间一般在3－15ms。  
旋转延迟 Trotation是指盘片旋转将请求数据所在扇区移至读写磁头下方所需要的时间。旋转延迟取决于磁盘转速，通常使用磁盘旋转一周所需时间的1/2表示。比如，7200 rpm的磁盘平均旋转延迟大约为60*1000/7200/2 = 4.17ms，而转速为15000 rpm的磁盘其平均旋转延迟为2ms。  
由于一个map对应一个block，blocksize也不能太大，合理使用集群资源。HDFS的块设置太小，会增加寻址时间，程序一直在找块的开始位置；如果块设置的太大，从磁盘传输数据的时间会明显大于定位这个块开始位置所需的时间。导致程序在处理这块数据时，会非常慢。HDFS块的大小设置主要取决于磁盘传输速率。

## HDFS的shell操作
1. 基本语法 hadoop fs 具体命令 或者 hdfs dfs 具体命令
2. 命令大全

```shell
$> bin/hdfs dfs -help

[-appendToFile <localsrc> ... <dst>]
[-cat [-ignoreCrc] <src> ...]
[-checksum <src> ...]
[-chgrp [-R] GROUP PATH...]
[-chmod [-R] <MODE[,MODE]... | OCTALMODE> PATH...]
[-chown [-R] [OWNER][:[GROUP]] PATH...]
[-copyFromLocal [-f] [-p] <localsrc> ... <dst>]
[-copyToLocal [-p] [-ignoreCrc] [-crc] <src> ... <localdst>]
[-count [-q] <path> ...]
[-cp [-f] [-p] <src> ... <dst>]
[-createSnapshot <snapshotDir> [<snapshotName>]]
[-deleteSnapshot <snapshotDir> <snapshotName>]
[-df [-h] [<path> ...]]
[-du [-s] [-h] <path> ...]
[-expunge]
[-get [-p] [-ignoreCrc] [-crc] <src> ... <localdst>]
[-getfacl [-R] <path>]
[-getmerge [-nl] <src> <localdst>]
[-help [cmd ...]]
[-ls [-d] [-h] [-R] [<path> ...]]
[-mkdir [-p] <path> ...]
[-moveFromLocal <localsrc> ... <dst>]
[-moveToLocal <src> <localdst>]
[-mv <src> ... <dst>]
[-put [-f] [-p] <localsrc> ... <dst>]
[-renameSnapshot <snapshotDir> <oldName> <newName>]
[-rm [-f] [-r|-R] [-skipTrash] <src> ...]
[-rmdir [--ignore-fail-on-non-empty] <dir> ...]
[-setfacl [-R] [{-b|-k} {-m|-x <acl_spec>} <path>]|[--set <acl_spec> <path>]]
[-setrep [-R] [-w] <rep> <path> ...]
[-stat [format] <path> ...]
[-tail [-f] <file>]
[-test -[defsz] <path>]
[-text [-ignoreCrc] <src> ...]
[-touchz <path> ...]
[-usage [cmd ...]]
```
## HDFS客户端操作
### HDFS客户端环境准备
1. 根据自己电脑的操作系统拷贝对应的编译后的hadoop jar包到非中文路径（例如：D:\Develop\hadoop-2.7.2）。
2. 配置HADOOP_HOME环境变量、配置Path环境变量
3. 创建一个Maven工程HdfsClientDemo
4. 导入相应的依赖坐标+日志添加

	```xml
	<dependencies>
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>RELEASE</version>
		</dependency>
		<dependency>
			<groupId>org.apache.logging.log4j</groupId>
			<artifactId>log4j-core</artifactId>
			<version>2.8.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-common</artifactId>
			<version>2.7.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-client</artifactId>
			<version>2.7.2</version>
		</dependency>
		<dependency>
			<groupId>org.apache.hadoop</groupId>
			<artifactId>hadoop-hdfs</artifactId>
			<version>2.7.2</version>
		</dependency>
		<dependency>
			<groupId>jdk.tools</groupId>
			<artifactId>jdk.tools</artifactId>
			<version>1.8</version>
			<scope>system</scope>
			<systemPath>${JAVA_HOME}/lib/tools.jar</systemPath>
		</dependency>
	</dependencies>
	注意：如果Eclipse/Idea打印不出日志，在控制台上只显示
	log4j:WARN No appenders could be found for logger (org.apache.hadoop.util.Shell).  
	log4j:WARN Please initialize the log4j system properly.  
	log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
	需要在项目的src/main/resources目录下，新建一个文件，命名为“log4j.properties”，在文件中填入
	log4j.rootLogger=INFO, stdout
	log4j.appender.stdout=org.apache.log4j.ConsoleAppender
	log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
	log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n
	log4j.appender.logfile=org.apache.log4j.FileAppender
	log4j.appender.logfile.File=target/spring.log
	log4j.appender.logfile.layout=org.apache.log4j.PatternLayout
	log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] - %m%n
	```

5. 创建包名：com.atguigu.hdfs
6. 创建HdfsClient类

	```java
	public class HdfsClient{	
		@Test
		public void testMkdirs() throws IOException, InterruptedException, URISyntaxException{
			
			// 1 获取文件系统
			Configuration configuration = new Configuration();
			// 配置在集群上运行
			// configuration.set("fs.defaultFS", "hdfs://hadoop100:9000");
			// FileSystem fs = FileSystem.get(configuration);

			FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
			
			// 2 创建目录
			fs.mkdirs(new Path("/1108/daxian/banzhang"));
			
			// 3 关闭资源
			fs.close();
		}
	}

	```
7. 执行程序  
&emsp;&emsp;运行时需要配置用户名称，客户端去操作HDFS时，是有一个用户身份的。默认情况下，HDFS客户端API会从JVM中获取一个参数来作为自己的用户身份：-DHADOOP_USER_NAME=atguigu，atguigu为用户名称。

### HDFS的API操作
#### HDFS文件上传（测试参数优先级）
1. 编写源代码
	```java
	@Test
	public void testCopyFromLocalFile() throws IOException, InterruptedException, URISyntaxException {

		// 1 获取文件系统
		Configuration configuration = new Configuration();
		configuration.set("dfs.replication", "2");
		FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");

		// 2 上传文件
		fs.copyFromLocalFile(new Path("e:/banzhang.txt"), new Path("/banzhang.txt"));

		// 3 关闭资源
		fs.close();

		System.out.println("over");
	}
	```
2. 将hdfs-site.xml拷贝到项目的根目录下
	```xml
	<?xml version="1.0" encoding="UTF-8"?>
	<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

	<configuration>
		<property>
			<name>dfs.replication</name>
		<value>1</value>
		</property>
	</configuration>
	```
3. 参数优先级  
参数优先级排序：客户端代码中设置的值 > ClassPath下的用户自定义配置文件 > 然后是服务器的默认配置

#### HDFS文件下载
```java
@Test
public void testCopyToLocalFile() throws IOException, InterruptedException, URISyntaxException{

	// 1 获取文件系统
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
	
	// 2 执行下载操作
	// boolean delSrc 指是否将原文件删除
	// Path src 指要下载的文件路径
	// Path dst 指将文件下载到的路径
	// boolean useRawLocalFileSystem 是否开启文件校验
	fs.copyToLocalFile(false, new Path("/banzhang.txt"), new Path("e:/banhua.txt"), true);
	
	// 3 关闭资源
	fs.close();
}
```
#### HDFS文件夹删除
```java
@Test
public void testDelete() throws IOException, InterruptedException, URISyntaxException{

	// 1 获取文件系统
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
		
	// 2 执行删除
	fs.delete(new Path("/0508/"), true);
		
	// 3 关闭资源
	fs.close();
}
```
#### HDFS文件名更改
```java
@Test
public void testRename() throws IOException, InterruptedException, URISyntaxException{

	// 1 获取文件系统
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu"); 
		
	// 2 修改文件名称
	fs.rename(new Path("/banzhang.txt"), new Path("/banhua.txt"));
		
	// 3 关闭资源
	fs.close();
}
```
#### HDFS文件详情查看
```java
//查看文件名称、权限、长度、块信息
@Test
public void testListFiles() throws IOException, InterruptedException, URISyntaxException{

	// 1获取文件系统
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu"); 
		
	// 2 获取文件详情
	RemoteIterator<LocatedFileStatus> listFiles = fs.listFiles(new Path("/"), true);
		
	while(listFiles.hasNext()){
		LocatedFileStatus status = listFiles.next();
			
		// 输出详情
		// 文件名称
		System.out.println(status.getPath().getName());
		// 长度
		System.out.println(status.getLen());
		// 权限
		System.out.println(status.getPermission());
		// 分组
		System.out.println(status.getGroup());
			
		// 获取存储的块信息
		BlockLocation[] blockLocations = status.getBlockLocations();
			
		for (BlockLocation blockLocation : blockLocations) {
				
			// 获取块存储的主机节点
			String[] hosts = blockLocation.getHosts();
				
			for (String host : hosts) {
				System.out.println(host);
			}
		}
			
		System.out.println("-----------班长的分割线----------");
	}

// 3 关闭资源
fs.close();
}
```
#### HDFS文件和文件夹判断
```java
@Test
public void testListStatus() throws IOException, InterruptedException, URISyntaxException{
		
	// 1 获取文件配置信息
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
		
	// 2 判断是文件还是文件夹
	FileStatus[] listStatus = fs.listStatus(new Path("/"));
		
	for (FileStatus fileStatus : listStatus) {
		
		// 如果是文件
		if (fileStatus.isFile()) {
				System.out.println("f:"+fileStatus.getPath().getName());
			}else {
				System.out.println("d:"+fileStatus.getPath().getName());
			}
		}
		
	// 3 关闭资源
	fs.close();
}
```

### HDFS的I/O流操作
上面我们学的API操作HDFS系统都是框架封装好的。那么如果我们想自己实现上述API的操作该怎么实现呢？  
我们可以采用IO流的方式实现数据的上传和下载。

#### HDFS文件上传
1. 需求：把本地e盘上的banhua.txt文件上传到HDFS根目录
2. 编写代码
	```java
	@Test
	public void putFileToHDFS() throws IOException, InterruptedException, URISyntaxException {

		// 1 获取文件系统
		Configuration configuration = new Configuration();
		FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");

		// 2 创建输入流
		FileInputStream fis = new FileInputStream(new File("e:/banhua.txt"));

		// 3 获取输出流
		FSDataOutputStream fos = fs.create(new Path("/banhua.txt"));

		// 4 流对拷
		IOUtils.copyBytes(fis, fos, configuration);

		// 5 关闭资源
		IOUtils.closeStream(fos);
		IOUtils.closeStream(fis);
	    fs.close();
	}
	```

#### HDFS文件下载
1. 需求：从HDFS上下载banhua.txt文件到本地e盘上
2. 编写代码
	```java
	// 文件下载
	@Test
	public void getFileFromHDFS() throws IOException, InterruptedException, URISyntaxException{

		// 1 获取文件系统
		Configuration configuration = new Configuration();
		FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
			
		// 2 获取输入流
		FSDataInputStream fis = fs.open(new Path("/banhua.txt"));
			
		// 3 获取输出流
		FileOutputStream fos = new FileOutputStream(new File("e:/banhua.txt"));
			
		// 4 流的对拷
		IOUtils.copyBytes(fis, fos, configuration);
			
		// 5 关闭资源
		IOUtils.closeStream(fos);
		IOUtils.closeStream(fis);
		fs.close();
	}
	```

#### 定位文件读取
1. 需求：分块读取HDFS上的大文件，比如根目录下的/hadoop-2.7.2.tar.gz
2. 编写代码
	```java
	//下载第一块
	@Test
	public void readFileSeek1() throws IOException, InterruptedException, URISyntaxException{

		// 1 获取文件系统
		Configuration configuration = new Configuration();
		FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
			
		// 2 获取输入流
		FSDataInputStream fis = fs.open(new Path("/hadoop-2.7.2.tar.gz"));
			
		// 3 创建输出流
		FileOutputStream fos = new FileOutputStream(new File("e:/hadoop-2.7.2.tar.gz.part1"));
			
		// 4 流的拷贝
		byte[] buf = new byte[1024];
			
		for(int i =0 ; i < 1024 * 128; i++){
			fis.read(buf);
			fos.write(buf);
		}
			
		// 5关闭资源
		IOUtils.closeStream(fis);
		IOUtils.closeStream(fos);
	fs.close();
	}
	```
	```java
	//下载第二块
	@Test
	public void readFileSeek2() throws IOException, InterruptedException, URISyntaxException{

		// 1 获取文件系统
		Configuration configuration = new Configuration();
		FileSystem fs = FileSystem.get(new URI("hdfs://hadoop100:9000"), configuration, "atguigu");
			
		// 2 打开输入流
		FSDataInputStream fis = fs.open(new Path("/hadoop-2.7.2.tar.gz"));
			
		// 3 定位输入数据位置
		fis.seek(1024*1024*128);
			
		// 4 创建输出流
		FileOutputStream fos = new FileOutputStream(new File("e:/hadoop-2.7.2.tar.gz.part2"));
			
		// 5 流的对拷
		IOUtils.copyBytes(fis, fos, configuration);
			
		// 6 关闭资源
		IOUtils.closeStream(fis);
		IOUtils.closeStream(fos);
	}
	```
3. 合并文件  
在Window命令窗口中进入到目录E:\，然后执行如下命令，对数据进行合并type hadoop-2.7.2.tar.gz.part2 >> hadoop-2.7.2.tar.gz.part1  
合并完成后，将hadoop-2.7.2.tar.gz.part1重新命名为hadoop-2.7.2.tar.gz。解压发现该tar包非常完整。

## HDFS的数据流
### HDFS的写数据流程
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/hdfs-write.png){: .align-right}
<center>HDFS的写数据流程</center>
1. 客户端通过Distributed FileSystem模块向NameNode请求上传文件，NameNode检查目标文件是否已存在，父目录是否存在，以及权限。
2. NameNode返回是否可以上传。
3. 客户端请求第一个 Block上传到哪几个DataNode服务器上。
4. NameNode返回3个DataNode节点，分别为dn1、dn2、dn3。
5. 客户端通过FSDataOutputStream模块（wraps a DFSDataOutputStream which handles communication with the datanodes and namenode. ）请求dn1上传数据，dn1收到请求会继续调用dn2，然后dn2调用dn3，将这个通信管道建立完成。Dataqueue
6. dn1、dn2、dn3逐级应答客户端。Ackqueue
7. 客户端开始往dn1上传第一个Block（先从磁盘读取数据放到一个本地内存缓存），以Packet为单位，
(DFSDataOutputStream splits file into packets) (DateStreamer--consume data queue--NN, DN)
dn1收到一个Packet就会传给dn2，dn2传给dn3；dn1每传一个packet会放入一个应答队列等待应答。
8. 当一个Block传输完成之后，客户端再次请求NameNode上传第二个Block的服务器。（重复执行3-7步）。
如果在传输的过程中dn fail 了，首先通信管道将会关闭，ack队列中的任何数据包packet都将放到data队列的前面，防止fail node下流节点无法收到数据。同时该block所在的正常节点会联系NN，这样failed节点再回复后被nn通知删除该块数据，将faild节点从管道中移除，该块的剩余数据写到好的两个节点。同时nn知道该块是under-replicated（副本数不足），并安排在另一个节点上创建另一个副本，之后的数据按照正常处理。有可能但不太可能，在block写入过程中多个dn挂掉，只要block满足最小副本数（dfs.replication.min）默认是1，那么就认为写入成功了。nn会安排异步备份直到满足要求的副本数（dfs.replication）默认是3。

### 网络拓扑-节点距离计算
在HDFS写数据的过程中，NameNode会选择距离待上传数据最近距离的DataNode接收数据。那么这个最近距离怎么计算呢？  
节点距离：两个节点到达最近的共同祖先（经过交换机的次数）的跃点数。  
例如，假设有数据中心d1机架r1中的节点n1。该节点可以表示为/d1/r1/n1。利用这种标记，这里给出四种距离描述，如下图所示。
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/net-topo01.png){: .align-right}
<center>网络拓扑概念</center>  
大家算一算每两个节点之间的距离，如下图所示。
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/net-topo02.png){: .align-right}
<center>网络拓扑</center>

### 机架感知-副本存储节点选择
[**官方说明**](http://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Data_Replication)  
For the common case, when the replication factor is three, HDFS’s placement policy is to put one replica on one node in the local rack, another on a different node in the local rack, and the last on a different node in a different rack.

**自定义机架感知**
1. 创建类实现DNSToSwitchMapping接口。
	```java
	public class MyDNSToSwitchMapping implements DNSToSwitchMapping {
		/**
		 * 传递的是客户端的IP列表，返回机架感知的列表。
		 */
		public List<String> resolve(List<String> names) {
			List<String> list=new ArrayList<String>();
			if (names!=null && names.size()>0) {
				for (String name : names) {
					//主机名是s201 s202 ...
					int ip=0;
					if (name.startsWith("s")) {
						String no=name.substring(1);
						ip=Integer.parseInt(no);
					}
					else if (name.startsWith("192")) {
						String no=name.substring(name.lastIndexOf(".")+1);
						ip=Integer.parseInt(no);
					}
					if (ip<203) {
						list.add("/rack1/"+ip);
					}else {
						list.add("/rack2/"+ip);
					}
				}
			}
			//写入文件中
			try {
				FileOutputStream fos=new FileOutputStream("/home/ubuntu/dns.txt");
				for(String name:list) {
					fos.write((name+"\r\n").getBytes());
				}
				fos.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			return list;
		}

		public void reloadCachedMappings() {

		}

		public void reloadCachedMappings(List<String> names) {

		}

	}
	```
2. 编译程序打成jar包，分发到所有节点hadoop的classpath下。
3. 修改core-site.xml配置文件并分发
	```xml
	<!--core-site.xml-->
	<configuration>
		<property>
			<name>net.topology.node.switch.mapping.impl</name>
			<value>hadoop.david.rackaware.MyDNSToSwitchMapping</value>
		</property>
	</configuration>
	```

**Hadoop2.7.2副本节点选择**
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/rep-location.png){: .align-right}
<center>Hadoop2.7.2副本节点选择</center>

### Coherency Model-数据一致性
&emsp;&emsp;Client创建文件时，在文件系统的名字空间是立即可见的。但是我们写入的数据不足一个块大小时，并不保证对于其他client是可见的，即使我们的流使用flash（）。只有当文件写入超过一个块时，第一块才是可见的，并且正在写入的块总是不可见的。Hdfs提供了一种方式强制所有的buffer flash到dn通过FSOutputStream. hflush ()方法。Hdfs保证此时文件写入管道中的所有数据都到dn上，并且对新的reader可见。但只是保证在datanode的内存中存在，如果此时断电还是可能会丢失数据。为了更强的保障，可以使用hsync（）。
FSOutputStream在关闭时会隐式的调用hflush()方法。

### HDFS读数据流程
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/hdfs-read.png){: .align-right}
<center>HDFS的读数据流程</center>
1. 客户端通过Distributed FileSystem向NameNode请求下载文件，NameNode通过查询元数据，找到文件块所在的DataNode地址。
2. 挑选一台DataNode（就近原则，然后随机）服务器，请求读取数据。
3. DataNode开始传输数据给客户端（从磁盘里面读取数据输入流，以Packet为单位来做校验）。
4. 客户端以Packet为单位接收，先在本地缓存，然后写入目标文件。
同写入一样DFInputStream包裹着DFSInputStream，文件的所有block是按照顺序依次读取的，在DFSInputStream连接dn是，还会向nn请求下一批block的dn列表。从client角度就是连续从一个流里读取数据。如果在读取时某个dn挂掉了，那么client会记住这个dn，之后的数据将不会尝试从该dn读取，同时还会对block进行校验，如果发现block损坏了，在client从该block下一最近结点读取之前，会报告给nn。  
Client是在namenode的指导下直接与datanode打交道的。

## 名称节点和辅助名称节点
### NN和2NN工作机制
思考：NameNode中的元数据是存储在哪里的？  
&emsp;&emsp;首先，我们做个假设，如果存储在NameNode节点的磁盘中，因为经常需要进行随机访问，还有响应客户请求，必然是效率过低。因此，元数据需要存放在内存中。但如果只存在内存中，一旦断电，元数据丢失，整个集群就无法工作了。因此产生在磁盘中备份元数据的FsImage。  
&emsp;&emsp;这样又会带来新的问题，当在内存中的元数据更新时，如果同时更新FsImage，就会导致效率过低，但如果不更新，就会发生一致性问题，一旦NameNode节点断电，就会产生数据丢失。因此，引入Edits文件(只进行追加操作，效率很高)。每当元数据有更新或者添加元数据时，修改内存中的元数据并追加到Edits中。这样，一旦NameNode节点断电，可以通过FsImage和Edits的合并，合成元数据。  
&emsp;&emsp;但是，如果长时间添加数据到Edits中，会导致该文件数据过大，效率降低，而且一旦断电，恢复元数据需要的时间过长。因此，需要定期进行FsImage和Edits的合并，如果这个操作由NameNode节点完成，又会效率过低。因此，引入一个新的节点SecondaryNamenode，专门用于FsImage和Edits的合并。  
NN和2NN工作机制，如下图所示。
![image-left]({{ site.url }}{{ site.baseurl }}/assets/images/bigdata-framework/hadoop/nn-2nn.png){: .align-right}
<center>NN和2NN工作机制</center>
* 第一阶段：NameNode启动  
（1）第一次启动NameNode格式化后，创建Fsimage和Edits文件。如果不是第一次启动，直接加载编辑日志和镜像文件到内存。只有重建完内存中的文件系统的元素据，nn才开始监听rpc请求和http request，此时处于safemode下，client只能读取数据，严格意义上来说，只能读取文件的元数据信息（查看一个目录列表）。只有当文件block的一组datanode可用时，才可以查看文件。当集群中99.9%（default）的block满足副本配置时，nn才会退出安全模式（plus 30 seconds）。  
（2）客户端对元数据进行增删改的请求。  
（3）NameNode记录操作日志，更新滚动日志。  
（4）NameNode在内存中对数据进行增删改。
* 第二阶段：Secondary NameNode工作  
（1）Secondary NameNode询问NameNode是否需要CheckPoint。直接带回NameNode是否检查结果。  
（2）Secondary NameNode请求执行CheckPoint。  
（3）NameNode滚动正在写的Edits日志。  
（4）将滚动前的编辑日志和镜像文件拷贝到Secondary NameNode。  
（5）Secondary NameNode加载编辑日志和镜像文件到内存，并合并。  
（6）生成新的镜像文件fsimage.chkpoint。  
（7）拷贝fsimage.chkpoint到NameNode。  
（8）NameNode将fsimage.chkpoint重新命名成fsimage。  
* NN和2NN工作机制详解  
Fsimage：NameNode内存中元数据序列化后形成的文件。  
Edits：记录客户端更新元数据信息的每一步操作（可通过Edits运算出元数据）。  
&emsp;&emsp;NameNode启动时，先滚动Edits并生成一个空的edits.inprogress，然后加载Edits和Fsimage到内存中，此时NameNode内存就持有最新的元数据信息。Client开始对NameNode发送元数据的增删改的请求，这些请求的操作首先会被记录到edits.inprogress中（查询元数据的操作不会被记录在Edits中，因为查询操作不会更改元数据信息），如果此时NameNode挂掉，重启后会从Edits中读取元数据的信息。然后，NameNode会在内存中执行元数据的增删改的操作。  
&emsp;&emsp;由于Edits中记录的操作会越来越多，Edits文件会越来越大，导致NameNode在启动加载Edits时会很慢，所以需要对Edits和Fsimage进行合并（所谓合并，就是将Edits和Fsimage加载到内存中，照着Edits中的操作一步步执行，最终形成新的Fsimage）。SecondaryNameNode的作用就是帮助NameNode进行Edits和Fsimage的合并工作。  
&emsp;&emsp;SecondaryNameNode首先会询问NameNode是否需要CheckPoint（触发CheckPoint需要满足两个条件中的任意一个，定时时间到和Edits中数据写满了）。直接带回NameNode是否检查结果。SecondaryNameNode执行CheckPoint操作，首先会让NameNode滚动Edits并生成一个空的edits.inprogress，滚动Edits的目的是给Edits打个标记，以后所有新的操作都写入edits.inprogress，其他未合并的Edits和Fsimage会拷贝到SecondaryNameNode的本地，然后将拷贝的Edits和Fsimage加载到内存中进行合并，生成fsimage.chkpoint，然后将fsimage.chkpoint拷贝给NameNode，重命名为Fsimage后替换掉原来的Fsimage。NameNode在启动时就只需要加载之前未合并的Edits和Fsimage即可，因为合并过的Edits中的元数据信息已经被记录在Fsimage中。
* 官方说明
1. The secondary asks the primary to roll its in-progress edits file, so new edits go to a
new file. The primary also updates the seen_txid file in all its storage directories.
2. The secondary retrieves the latest fsimage and edits files from the primary (using
HTTP GET).
3. The secondary loads fsimage into memory, applies each transaction from edits, then
creates a new merged fsimage file.
4. The secondary sends the new fsimage back to the primary (using HTTP PUT), and
the primary saves it as a temporary .ckpt file.
5. The primary renames the temporary fsimage file to make it available.
At the end of the process, the primary has an up-to-date fsimage file and a short inprogress
edits file (it is not necessarily empty, as it may have received some edits while
the checkpoint was being taken). It is possible for an administrator to run this process
manually while the namenode is in safe mode, using the hdfs dfsadmin -saveNamespace
command.

### Fsimage和Edits解析



