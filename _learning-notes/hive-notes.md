---
title: "Hive总结笔记" 
excerpt: "常用的一些函数以及数仓表格设计和查询优化。"
header:
  overlay_color: "#169CDE"
  teaser: assets/images/learning-notes/hive-notes-logo.jpg
categories:
  - bigdata
tags:
  - hive
sidebar:
  nav: "learningnotes"
classes: wide
---

# Hive使用场景
数据仓库（ Data Warehouse ），是为企业所有决策制定过程，提供所有系统数据支持的战略集合。通过对数据仓库中数据的分析，可以帮助企业，改进业务流程、控制成本、提高产品质量等。
数据仓库，并不是数据的最终目的地，而是为数据最终的目的地做好准备。这些准备包括对数据的：清洗，转义，分类，重组，合并，拆分，统计等等。

## 数仓分层：

* ODS：original data store 原始数据层，存放原始数据，直接加载原始日志、数据，数据保持原貌不做处理。
* DIM：dimensions 公共维度汇总层，保存维度数据，主要是对业务事实的描述信息，列如何人、何时、何地。
* DWD：data warehouse detail 明细数据层：对ODS层数据进行清洗（去除空值，脏数据，超过极限范围的数据）、脱敏等。保存业务事实明细，一行信息代表一次业务行动，例如一次下单。
* DWS：data warehouse service 以DWD为基础，按天进行轻度汇总。一行信息代表一个主题对象一天的汇总行为，例如一个用户一天下单次数。
* DWT：data warehouse topic 以DWS为基础，对数据进行累积汇总。一行信息代表一个主题对象的累积行为，例如一个用户从注册那天开始至今一共下了多少次单
* ADS：application data store ADS层，为各种统计报表提供数据

## 数据仓库为什么要分层：
* 把复杂问题简单化
  将复杂的任务分解成多层来完成，每一层只处理简单的任务，方便定位问题。
* 减少重复开发
	规范数据分层，通过的中间层数据，能够减少极大的重复计算，增加一次计算结果的复用性。
* 隔离原始数据
	不论是数据的异常还是数据的敏感性，使真实数据与统计数据解耦开。

# Hive的安装以及配置
1. 环境变量

    ```shell
    #[/etc/profile.d/env.sh]
    export HIVE_HOME=/opt/module/hive
    pathmunge $HIVE_HOME/bin
    ```
2. 配置文件

    ```xml
    <!-- [/$HIVE_HOME/conf/hive-site.xml] -->
    <?xml version="1.0"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
      <configuration>
        <property>
          <name>javax.jdo.option.ConnectionURL</name>
          <value>jdbc:mysql://hadoop101:3306/hive_metastore?useSSL=false&amp;
          useUnicode=true&amp;characterEncoding=UTF-8</value>
        </property>
        <property>
          <name>javax.jdo.option.ConnectionDriverName</name>
          <value>com.mysql.jdbc.Driver</value>
        </property>
        <property>
          <name>javax.jdo.option.ConnectionUserName</name>
          <value>root</value>
        </property>
        <property>
          <name>javax.jdo.option.ConnectionPassword</name>
          <value>000000</value>
        </property>
        <property>
          <name>hive.metastore.warehouse.dir</name>
          <value>/user/hive/warehouse</value>
        </property>

        <property>
          <name>hive.server2.thrift.port</name>
          <value>10000</value>
        </property>
        <property>
          <name>hive.server2.thrift.bind.host</name>
          <value>hadoop101</value>
        </property>

        <!-- Hive元数据存储的验证 -->
        <property>
          <name>hive.metastore.schema.verification</name>
          <value>false</value>
        </property>
        <!-- 元数据存储授权  -->
        <property>
          <name>hive.metastore.event.db.notification.api.auth</name>
          <value>false</value>
        </property>

        <!--Spark依赖位置（注意：端口号8020必须和namenode的端口号一致）-->
        <property>
          <name>spark.yarn.jars</name>
          <value>hdfs://hadoop101:8020/spark-jars/*</value>
        </property>
        <!--Hive执行引擎-->
        <property>
          <name>hive.execution.engine</name>
          <value>spark</value>
        </property>
        <!--Hive和Spark连接超时时间-->
        <property>
          <name>hive.spark.client.connect.timeout</name>
          <value>10000ms</value>
        </property>

        <property>
          <name>hive.cli.print.header</name>
          <value>true</value>
        </property>
        <property>
          <name>hive.cli.print.current.db</name>
          <value>true</value>
        </property>

      </configuration>
    ```

3. hive支持中文

  * 在Hive元数据存储的Mysql数据库中，执行以下SQL：

      ```sql
      -- 在mysql中的hive元数据库中执行
      alter table hive_metastore.COLUMNS_V2 modify column COMMENT varchar(256) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      alter table hive_metastore.DBS modify column DBS.DESC varchar(256) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      alter table hive_metastore.TABLE_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      alter table hive_metastore.PARTITION_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      alter table hive_metastore.PARTITION_KEYS modify column PKEY_COMMENT varchar(4000) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      alter table hive_metastore.PARTITION_KEY_VALS modify column PART_KEY_VAL varchar(256) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      alter table hive_metastore.INDEX_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8mb4 COLLATE utf8mb4_unicode_ci;
      ```

  * 修改hive-site.xml中Hive读取元数据的编码
      ```xml
      <property>
       <name>javax.jdo.option.ConnectionURL</name>
       <value>jdbc:mysql://hadoop101:3306/metastore?useSSL=false&amp;
       useUnicode=true&amp;characterEncoding=UTF-8</value>
      </property>
      ```
  注意：在修改之前创建的表不起作用


# Hive中的join
Hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供简单的sql查询功能，可以将sql语句转换为MapReduce任务进行运行。 
sql中的连接查询有inner join(内连接）、left join(左连接)、right join（右连接）、full join（全连接）left semi join(左半连接) 五种方式，它们之间其实并没有太大区别，仅仅是查询出来的结果有所不同。

1. union 和 full join on 的区别，“full join on 列合并和 union 行合并”：

    * full join 使用on条件时，select * 相当于把两个表(左表有m列p行和右表有n列q行)的所有列拼接成了一个有m+n列的结果表。    

      ```sql
      select * from table1 full join table2 on(table1.student_no=table2.student_no);
      ```

    * 而union相当于把相当于把两个查询结果(左查询结果表有m列p行和右查询结果表有n列q行)的所有行进行了拼接，形成具有p+q行的查询结果。

      ```sql
      select student_no tb1_student_no,student_name from table1 union select student_no as tb2_student_no,class_no from table2;
      ```
    
      注意此时 ，左查询结果表和右查询结果表，必须有相同的列，即m=q相等，否则会报如下错误：

      ```shell
      hive>  select student_no tb1_student_no,student_name from table1 union select class_no from table2;
      FAILED: SemanticException Schema of both sides of union should match.
      ```
      

2. union 和 union all 的区别
    * 使用场合：  
        如果我们需要将两个select语句的结果作为一个整体显示出来，我们就需要用到union或者union all关键字。union的作用是将多个结果合并在一起显示出来。
    * 注意事项：  
        union 和 union all都可以将多个结果集合并，而不仅仅是两个，你可以将多个结果集串起来。   
        使用union和union all必须保证各个select 集合的结果有相同个数的列，并且每个列的类型是一样的。但列名则不一定需要相同，oracle会将第一个结果的列名作为结果集的列名。
        注意hive中int不能隐式转换成bigint 先转string 再转 bigint
    * 二者区别：  
      Union：对两个结果集进行并集操作，不包括重复行，同时进行默认规则的排序。Union在进行表链接后会筛选掉重复的记录，所以在表连接后会对所产生的结果集进行排序运算，删除重复的记录再返回结果。
      实际大部分应用中是不会产生重复的记录，最常见的是过程表与历史表Union。  
      Union All：对两个结果集进行并集操作，包括重复行，不进行排序。如果返回的两个结果集中有重复的数据，那么返回的结果集就会包含重复的数据了。
    

3. Inner join是最简单的关联操作，

    * 如果有on 条件的话，则两边关联只取交集。

      ```sql
      select * from table1 join table2 on table1.student_no=table2.student_no ;
      ```

    * 笛卡尔积：如果没有on条件的话，则是左表和右表的列通过笛卡尔积的形式表达出来，下面两个sql就是求笛卡尔积：

      ```sql
      select * from table1 join table2;
      select * from table1 inner join table2;
      ```
      比如table1有m行，table2有n行，最终的结果将有 m*n行

    * Inner join不使用 join 关键字的隐式连接，注意只适用于inner join：

      ```sql
      SELECT
      emp.name, emph.sin_number
      FROM
      employee emp, employee_hr emph -- Only applies for inner join
      WHERE
      emp.name = emph.name;
      ```

4. outer join分为left outer join、right outer join和full outer join。

    * left outer join是以左表驱动，右表不存在的key均赋值为null；

    * right outer join是以右表驱动，左表不存在的key均赋值为null；

    * full outer join全表关联，即是左外连接和右外连接结果集合求并集 ,左右表均可赋值为null。（而不是将两表完整的进行笛卡尔积操作，这种表述是错误的）  
      如果full join不加on过滤条件，计算结果也是笛卡尔积：

      ```sql
      select * from table1 a  full join table2 b ;
      ```

5. left semi join 和 inner join
  
    * LEFT SEMI JOIN
    semi join （即等价于left semi join）最主要的使用场景就是解决exist in。LEFT SEMI JOIN（左半连接）是 IN/EXISTS 子查询的一种更高效的实现。  
    Hive 没有实现 IN/EXISTS 子查询前，你可以用 LEFT SEMI JOIN 重写你的子查询语句。LEFT SEMI JOIN 的限制是， JOIN 子句中右边的表只能在
    ON 子句中设置过滤条件，在 WHERE 子句、SELECT 子句或其他地方过滤都不行。

      ```sql
      SELECT a.key, a.value
      FROM a
      WHERE a.key in
       (SELECT b.key
      FROM B);
      可以被重写为：
      SELECT a.key, a.val
      FROM a LEFT SEMI JOIN b on (a.key = b.key)    
      ```
    注意，在hive 2.1.1版本中，支持子查询，使用in 和 not in关键字，以下两个SQL都是正确的：

      ```sql
       SELECT * FROM TABLE1 WHERE table1.student_no NOT IN (SELECT table2.student_no FROM TABLE2);
       SELECT * FROM TABLE1 WHERE table1.student_no  IN (SELECT table2.student_no FROM TABLE2);
      ```

    * inner join  
      INNER JOIN等价于 JOIN，你可以理解为 JOIN是 INNER JOIN 的缩写。

    * 区别  
      HIVE中都是等值连接（hive 2.2.0版本中支持非等值连接），在JOIN使用的时候，两种写法在理论上是可以达到相同的效果的，但是由于实际情况的不一样，子表中数据的差异导致结果也不太一样。
      当子表中存在重复的数据，使用JOIN ON的时候，A,B表会关联出两条记录，因为ON上的条件符合；
      而使用LEFT SEMI JOIN时，当A表中的记录，在B表上产生符合条件之后就返回，不会再继续查找B表记录了，所以如果B表有重复，也不会产生重复的多条记录。


# Hive优化
* 当需要写一个比较复杂的HQL查询语句时，推荐使用CTE风格重写嵌套的查询语句，如下:

  ```sql
  -- 查询多个临时表 对数据集合汇总 并插入到表格中
  with（select clause） as tmp1,
  ... as tmp2,
  ....
  insert overwrite table table name partition(dt)
  select ... from ... join ... on ...
  ```
* join时的优化  
  1) map-side join:  
  If all but one of the tables being joined are small, the join can be performed as a map only job. The query
    ```sql
      SELECT /*+ MAPJOIN(b) */ a.key, a.value
      FROM a JOIN b ON a.key = b.key
    ```

  does not need a reducer. For every mapper of A, B is read completely. The restriction is that a FULL/RIGHT OUTER JOIN b cannot be performed.   
  2）reduce-side join:  
  Hive converts joins over multiple tables into a single map/reduce job if for every table the same column is used in the join clauses.In every map/reduce stage of the join, the last table in the sequence is streamed through the reducers where as the others are buffered. Therefore, it helps to reduce the memory needed in the reducer for buffering the rows for a particular value of the join key by organizing the tables such that the largest tables appear last in the sequence.  
  In every map/reduce stage of the join, the table to be streamed can be specified via a hint.

    ```sql
    SELECT /*+ STREAMTABLE(a) */ a.val, b.val, c.val 
    FROM a JOIN b ON (a.key = b.key1) JOIN c ON (c.key = b.key1)
    ```

  all the three tables are joined in a single map/reduce job and the values for a particular value of the key for tables b and c are buffered in the memory in the reducers. Then for each row retrieved from a, the join is computed with the buffered rows. If the STREAMTABLE hint is omitted, Hive streams the rightmost table in the join.

  3) Joins occur BEFORE WHERE CLAUSES. So, if you want to restrict the OUTPUT of a join, a requirement should be in the WHERE clause, otherwise it should be in the JOIN clause. A big point of confusion for this issue is partitioned tables:

    ```sql
    SELECT a.val, b.val FROM a LEFT OUTER JOIN b ON (a.key=b.key)
    WHERE a.ds='2009-07-07' AND b.ds='2009-07-07'
    ```
  will join a on b, producing a list of a.val and b.val. The WHERE clause, however, can also reference other columns of a and b that are in the output of the join, and then filter them out. However, whenever a row from the JOIN has found a key for a and no key for b, all of the columns of b will be NULL, including the ds column. This is to say, you will filter out all rows of join output for which there was no valid b.key, and thus you have outsmarted your LEFT OUTER requirement. In other words, the LEFT OUTER part of the join is irrelevant if you reference any column of b in the WHERE clause. Instead, when OUTER JOINing, use this syntax:
    ```sql
    SELECT a.val, b.val FROM a LEFT OUTER JOIN b
    ON (a.key=b.key AND b.ds='2009-07-07' AND a.ds='2009-07-07')
    ```
  ..the result is that the output of the join is pre-filtered, and you won't get post-filtering trouble for rows that have a valid a.key but no matching b.key. The same logic applies to RIGHT and FULL joins.
