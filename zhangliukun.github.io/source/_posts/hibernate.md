title: hibernate入门
date: 2015-04-26 19:07:00
categories: 数据库
tags: [数据库,hibernate,数据持久化]
desctiption: hibernate基础入门篇

---

##hibernate基础语义

###1.Configuration
Configuration类负责管理Hibernate的配置信息。Hibernate运行时需要获取一些底层实现的基本信息。这些属性可以在Hibernate配置文件（hibernate.cfg.xml或hibernate.properties）中加以设定。

<!--more-->

当调用:
```java
Configuration config = new Configuration().configure();
```
时，会自动在当前的CLASSPATH中寻找hibernate.cfg.xml文件并加载到内存中。

Configuraton类一般只有在获取SessionFactory时需要涉及，当SessionFactory实例创建之后，由于配置信息已经绑定在返回的SessionFactory中了，所以一般无需在对其进行操作了。


###2.SessionFactory
SessionFactory负责创建Session实例。可以通过Configuration实例构建SessionFactory：
```java
Configuration config = new Configuration().configure();
SessionFactory sessionFactory = config,buildSessionFactory();
```

SessionFactory实例一旦构造完毕，就被赋予特定的配置信息，之后config的变更将不会影响到已经创建的SessionFactory实例。如果需要改动的话就需要重新建一个SessionFactory的实例。如果要访问多个数据库，那么针对每个数据库，应该分别为其创建对应的SessionFactory实例。

SessionFactory中保存了对应当前数据库配置的所有映射关系，同时也负责维护当前的二级数据缓存和Statement Pool。由此可见，SessiongFactory的创建过程非常复杂，代价高昂。因此在系统设计中要考虑到SessionFactory的重用策略。

SessionFactory采用了线程安全的设计，可由多个线程并发调用，大多情况下，一个应用中针对一个数据库共享一个SessionFactory实例即可。

###3.Session
Session是hibernate持久化操作的基础。这里的session相当于JDBC中的Connection。

Session提供了众多持久化方法，可以透明的完成对象的CURD。

Session的设计是非线程安全的，一个Session只能由一个线程使用，多个线程使用一个Session将导致难以预知的错误。

Session由SessionFactory创建：
```java
Configuration config = new Configuration().configure();
SessionFactory sessionFactory = config,buildSessionFactory();
Session session =sessionFactory.openSession();
```

接下来就可以使用session的方法完成持久层操作了。

- Save

```java
//新增用户记录
TUser user = new TUser();
user.setName("test");
session.save(user);
```
- Get

```java
//获取id=1的记录
TUser user = (TUser)session.get(TUser.class,new Integer(1));

```
- delete

```java
//先取出，再删除
TUser user = (TUser)session.get(TUser.class,new Integer(1));
session.delete(user);

//通过Query接口进行基于HQL的删除操作
String hql ="delete TUser where id =1"
Query query = session.createQuery(hql);
query.executeUpdate();
```
- 查询

1.通过Query接口进行数据查询
```java
String hql = "from TUser user where user.name like ?";
Query query =session.createQuery(hql);
query.setParameter(0,"Cartier");

List list = query.list();

Iterator it = list.iterator();
while(it.hasNext()){
    TUser user = (TUser)it.next();
    System.out.println(user.getName);
}
```
2.通过Criteria接口进行数据查询
```java
Criteria criteria = session.createCriteria(TUser.class);
criteria.add(Expression.eq("name","Cartier"));

List list = criteria.list();

Iterator it = list.iterator();
while(it.hasNext()){
    TUser user = (TUser)it.next();
    System.out.println(user.getName);
}
```

两种查询方式的不同之处在于Query面向HQL和Native SQL，而Criteria则提供面向对象的查询模式。


##基础配置

###1.SessionFactory配置
配置方面就不作过多记录，很多文章都讲的很好了。
- 数据库连接配置
- 数据库连接池配置
    - 默认数据库连接池
    - C3P0
    - dbcp
    - Proxool

##事务管理
为了使用Hibernate的Transaction API，我们必须通过hibernate.transaction.factory_class属性指定一个Transaction实例工厂类。Transaction API隐藏了底层的事务机制，允许Hibernate代码在受管制和非管制的环境下都可以运行。

###1.使用JDBC的事务处理机制
```java
hibernate.transaction.factory_class = net.sf.hibernate.transaction.JDBCTransactionFactory
```
###2.使用JTA
```java
hibernate.transaction.factory_class = net.sf.hibernate.transaction.JTATransactionFactory
jta.UserTransaction jta/usertransaction
```

可选的配置项很多就不一一记录了。

##Hibernate O/R 映射
O/R映射是ORM框架中最为关键的组成部分。

###1.Hibernate基本数据类型
integer是Hibernate基本数据类型之一。Hibernate中提供了丰富的数据类型支持，其中包括了传统的Java数据类型，如String ,Integer，以及JDBC数据类型，如Clob，Blob等。除此之外，Hibernate还提供用户自定义的数据类型支持。

Hibernate基本数据类型覆盖了日常开发中的绝大多数情况，它提供了传统数据库类型与Java数据类型之间的连接纽带。

###2.实体映射
下面介绍了实体映射由浅入深的顺序，分为三个部分：

- 实体映射基础：介绍Hibernate中类/表映射。属性/字段映射的基本技术

- 高级映射技术：
较少自定义数据类型，复合主键，特殊字段的相关映射技术

- 实体映射策略：
围绕实体映射中实体粒度，层次的设计思路进行探讨，对特殊情况下与实体逻辑结构，实体读写性能相关的一些通用设计策略介绍。

####2.1实体映射基础
Hibernate中，类表映射主要包括三个部分：（1）类名-表名映射（2）主键映射（3）字段映射。具体配置现一般采用注解方式配置。

####2.2高级映射技术
- **自定义数据类型：**比如说一个用户可能需要保存多个Email地址信息，当然完全可以在一个String字段中保存一长串用;分割的字符串，但这样做起来不是很优雅，所以可以将email字段映射为一个List集合类型，但是Hibernate并没有提供原生的支持，这时候就需要实现自定义的数据类型了。
- **复合主键：**在实际开发中，可能一开始要求用户名不能重复，但是由于需求变更导致可以允许用户名相同，这时候为了减少更改库表的工作量，需要映入复合主键来解决问题。
- **BLOB，CLOB字段的映射：**例如在User表中，假设要为用户增加两个大型字段，其中image字段用于保存照片（Blog），resume字段用于保存建立（CLOB）。BLOB和CLOB的主要区别在于Blob字段采用单字节存储，适合保存二进制数据，如图片文件。Clob字段采用多字节存储，适合大型文本数据保存。
- **实体映射策略：**就是通过设计将各个部分进一步细分，得到更加细粒度的对象。
    - ***面向设计的粒度细分：***通过对象细化，实现更加清晰的系统逻辑划分，体现出更加清晰合理的设计逻辑。
    - ***面向性能的粒度细分：***针对业务逻辑，通过合理的细粒度对象，提高系统的能耗比。当一个对象中有一个Blob这种重量级的数据时，当我们加载对象时，Hibernate会从库表中读取所有的字段数据，并构造相应的类实例返回。这样对于Blob这种数据就对读取操作的代价提高，如何避免这个问题，Hibernate提供了属性的延迟加载功能，通过这个功能，我们可以在调用TUser.getImage时才真正从数据库中读取数据，
- ***实体层次设计：*** 继承关系是关系型数据库和面向对象数据结构之间的主要差异之一。Hibernate中支持3种类型的继承形式:
    - **Table per concrete class:**表与子表之间的独立一对一关系。
    - **Table per subclass:** 每个子类对应一张子表，并与主类共享主表。
    - **Table per class hierarchy:** 表与类的一对多关系。

##数据关联
对于ORM而言，一个非常关键的特性就是对实体之间关联关系的管理。数据关联是ORM的一个重要特性，但往往也是导致系统性能低下的原因。

###1.一对一关联
一对一关联包括两种类型：

- ***主键关联：***即两张表通过主键形成一对一的映射关系。级联关系设置为all，级联（cascade）在Hibernate映射关系中是个非常重要的概念。它指的是当主控方执行操作时，关联对象（被动方）是否同步执行同一操作。如对主控对象调用save-update或delete方法时，是否同时对关联对象(被动方）进行save-update或delete，设定为all则代表无论主控方执行任何操作都对其关联类进行同样的操作。
- ***唯一外键关联:*** 在一个假定的权限管理系统示例中，每个用户都从属于一个用户组，用户表T_User中包含一个group_id字段，此字段与T_Group的id字段相关联，这就是典型的“唯一外键关联”。

###2.一对多关联
比如每个用户(T_User)都关联到多个地址(TAddress),如一个用户可能有多个电话等等，这样的话就反应为“一对多关联”。分为单一对关系和双向一对多关系。

- ***单向一对多关联：*** 单向一对多的实现相对比较简单，但是存在一个问题，由于是单向关联，为了保持关联关系，我们只鞥通过主控方对被动方进行级联更新，如果被关联方的关联字段为“NOT NULL”，当Hibernate创建或者更新关联关系时，可能出现约束违例。
- ***双向一对多关联：*** 双向一对多关联实际上是一对多和多对一的组合，在主控方配置一对多，在被控方配置多对一。

###3.多对多关联
多对多关联需要借助中间表完成多对多映射信息的保存。但是多对多的性能不佳，应避免使用，应根据情况采用延迟加载机制来避免无谓的性能开销。

##Hibernate数据检索

###1.Criteria Query
Criteria Query通过面向对象化的设计，将数据查询条件封装成一个对象。简单来讲，Criteria Query可以看作是传统SQL的对象化表示,如：
```java
Criteria criteria = session.createCriteria(TUser.class);
criteria.add(Expression.eq("name","Erica");
criteria.add(Expression.eq("sex",new Integer(1));
```
这里的criteria实例本质上是对SQL “Select * from t_user where name = 'Erica' and sex =1”的封装。Hibernate会在运行期间根据Criteria中指定的查询条件(criteria.add方法添加的查询表达式)生成相应的SQL语句。这种方式对于SQL了解有限的程序员比较方便。

####Criteria查询表达式
Criteria本身只是一个查询容器，具体的查询条件需要通过Criteria.add方法添加到Criteria实例中。
####示例查询
Example类实现了Criterion接口，同样它也可以座位Criteria的查询条件，Example的作用是：根据已有对象，查找属性与之相符的其他对象。
###复合查询
也就是查询多个条件的查询。

这里就不详细记录了。

###2.DetachedCriteria
在Hibernate2中，Criteria生命周期位于其宿主session生命周期之内，也就是所session销毁的话有它创建的Criteria实例也就失效了。

在Hibernate3中，提供了新的Criteria实现：DetachedCriteria。

DetachedCriteria可以脱离Session实例独立存在，这样我们就可以将某些通用的Criteria查询条件进行抽离，每次使用时再与当前Session实例绑定以获得更好的代码重用效果。

####Criteria高级特性
- **限定返回的记录范围:** 通过criteria.setFirstResult/setMaxResult方法可以限制一次查询返回的记录范围。

```java
Criteria criteria = session.createCriteria(TUser.class);
//限定查询返回检索结果中，从100条结果开始的20条记录
criteria.setFirstResult(100);
criteria.setMaxResults(20);
```
记录排序：
```java
//查询所有groupId=2的记录，并分别按照姓名（顺序）和groupId（逆序）排序
Criteria criteria = session.createCriteria(TUser.class);

criteria.add(Expression.eq("groupId",new Integer(2)));

criteria.addOrder(Order.asc("name"));
criteria.addOrder(Order.desc("groupId"));
```
####Criteria综述
虽然这个比较简单，但是由于Hibernate实现过程中更加集中在HQL查询语言上，因此在实际开发中还是用官方推荐的HQL语句。


###3.Hibernate Query Language（HQL）
Criteria提供了符合面向对象编程风格的查询封装模式，不过HQL提供了更加丰富灵活的特性，它在涵盖了Criteria功能范围的前提下，提供了强大的查询能力。

完整的HQL 语法结构如下：
```java
[select|update|delete ...] [from ...] [where ...] [group by ... [having ...] ] [order by ...]
```

##HQL实用技术

###1.实体查询
首先来一个最简单的例子：
```java
String hql = "from TUser";
Query query = session.createQuery(hql);
List userList = query.list();
```
取出TUser的所有对应记录，其中在HQL中也可以采用全路径类名，特别在应用中有同类名但包名不同的情况。如：
```java
"from com.zalezone.TUser"
```
**注意：**HQL子句本身大小写无关，但是区中出现的类名和属性名必须注意大小写区分。另外，需要注意的是，查询的目标实体存在着继承关系的判定， 如"from TUser"将返回所有TUser以及TUser子类的记录，假设系统中存在TUser的两个子类，TSysAdmin和TSysOperator，那么将返回包含两个子类的所有数据，即使两个子类的表分别对应了不同的库表。

如我们所知，Java中所有类都继承自java.lang.Object，那么如果这样查"from java.lang.Object"就会返回库表中所有库表的记录。

- **Where子句**
如果我们需要取出指定名称的记录，类似SQL，我们可以通过HQL语句加以限定:

```java
String hql = "from TUser as user where user.name = 'Erica'";
Query query = session.createQuery(hql);
List userList = query.list();
```
这里的as为类名创建了一个别名,as可以忽略，而where子句指定了限定条件。where子句中可以加许多限定如下所示：
```java
from TUser user where user.age >20
from TUser user where user.age between 20 and 30
from TUser user where user.age in (18,28)
from TUser user where user.age is null
from TUser user where user.name like 'er%' 
//也可求算术表达式的值
from TUser user where (user.age%2=1)
//可加and，or来连接各个表达式
from TUser user where (user.age >20) and (user.name like 'er%')
```

###2.属性查询
有时候我们并不需要获取完整的实体对象，如在一个下拉框中显示用户名，我们可能只是需要某个属性就行，我们可以这样来完成。
```java
List list = session.createQuery("select user.name from TUser user").list();
Iterator it = list.iterator();
while(it.hasNext())
{
    System.out.pringln(it.next());
}
```
这里我们只指定获取name属性一个String类型。如果要获取多个属性的话如下：
```java
List list = session.createQuery("select user.name，user.age from TUser user").list();
Iterator it = list.iterator();
while(it.hasNext())
{
    Object[] results =(Object[])it.next();
    System.out.println(results[0]);
    System.out.println(results[1]);
}
```
如果觉得返回数组的方式不符合面向对象的风格，可以在HQL中动态的构造对象实例的方法对这些平面化的数据进行封装。
```java
List list = session.createQuery("select new TUser(user.name,user.age) from TUser user").list();
Iterator it = list.iterator();
while(it.hasNext())
{
    TUser user = (TUser)it.next();
    System.out.pringtln(user.getName());
}
```
通过在HQL中动态的构造对象实例，我们实现了对查询结果的对象化封装。注意此时在查询结果中的TUser对象仅仅是一个普通的Java对象，仅用于对查询结果的封装，出了在构造是赋予的属性值外，其他属性均为未赋值的状态，这也就意味着我们无法通过Session对此对象进行更新，下面代码中，对user对象的更新将导致向数据库中插入一条新的记录，而不是更新原有的记录：
```java
List list = session.createQuery("select new TUser(user.name,user.age) from TUser user").list();
Iterator it = list.iterator();
while(it.hasNext())
{
    TUser user = (TUser)it.next();
    user.setName(“test”);
    session.saveOrUpdate(user);//这里将导致一次insert操作，而非update
}
```
另外，我们也可以在HQL中的Select子句中使用统计函数：
```java
List list = session.createQuery("select count(*),min(user.age) from TUser user").list();
Iterator it = list.iterator();
while(it.hasNext())
{
    Object[] results =(Object[])it.next();
    System.out.println(results[0]);
    System.out.println(results[1]);
}
```
甚至原生SQL函数如：
```java
select upper(user.name) from TUser user;
select distinct user.name from TUser user;
```

###3.实体更新与删除
在Hibernate3中HQL具备了更加强大的功能，其中实体更新和删除是主要特性之一。在2中是先加载实体在更改保存，在hibernate3中的话HQL提供了更加灵活便捷的实现方式。（bulk delete/update）：
```java
Transaction tx = session.beginTransaction();
String hql = "update TUser set age =18 where id =1";
Query query = session.createQuery(hql);
query.executeUpdate();
tx.commit();
```
虽然在对单个对象更新时代码没有减少多少，但是对与批量性更新操作时便捷性和性能提高就很可观。

HQL的delete子句的使用同样非常简单，以下代码删除了所有年龄大于18的用户记录：
```java
Transaction tx = session.beginTransaction();
String hql = "update TUser set age =18 where age >18";
Query query = session.createQuery(hql);
query.executeUpdate();
tx.commit();
```
**注意:**在使用HQL的delte/update子句时，我们必须特别注意它们对缓存策略的影响，delete/update子句极有可能导致缓存同步上的障碍。

总体来看，Hibernate3中的HQL功能已越来越全面，与SQL不同的是，SQL面向的是二维的结构化数据，而HQL则面向数据对象。在对象型数据库尚不成熟时，通过面向对象的查询语言对关系型数据库进行访问，既满足了上层结构中面向对象设计的需求，也充分利用了现有技术平台，这也是Hibernate的优势。

###4.分组与排序
- **Order by子句**

    与SQL类似，HQL通过order by子句对查询结果排序如：

    ```java
    from TUser user order by user.name,user.age desc
    ```
- **Group by子句(having 子句)**
    
    用Group by对子句进行分组统计,如下我们通过Group by子句实现了同龄用户的统计：
    
   ```java
    List list = session.createQuery("select count(user),user.age from TUser user group by user.age having count(user)>10").list();
    Iterator it = list.iterator();
    while(it.hasNext())
    {
        Object[] results =(Object[])it.next();
        System.out.println(results[0]);
        System.out.println(results[1]);
    }
    ```

###5.参数绑定
如上面的许多Hql语句我们可以看到里面的参数都是直接写在里面的，如果要求查询的参数是变量，直接用变量名代替变量如“from TUser user where user.age>” + age;进行HQL拼接的话虽然能实现功能，但是会存在如下缺陷：

- **编码更加凌乱，可读性降低:** 如果存在很多很多的查询参数将混乱无序。
- **难以进行性能优化:**根据JDBC以及数据库的操作原理可知每次SQL执行时，数据库都将对SQL语句进行解析和优化，并将其处理结果保存在缓存中，如果以后有参数不同，语法相同的SQL命令，则直接以此缓存结果加以执行，从而避免了SQL解析和优化的开销，另外从Hibernate角度而言，它使用了PreparedStatement作为底层数据库访问手段，对于相同的SQL，也可以重用以及创建的PrepareStatement，这样如果将参数写在SQL中，将导致每次提交的SQL语句都不同，从系统角度而言不同参数将导致判断为是两个不同的SQL命令，（有些数据库相同内容的SQL大小写不同也视为是不同的SQL命令），从而会将其视为一个全新的SQL语法进行处理，缓存无法得到利用，导致了性能优化策略失效。
- **引入额外的安全风险：**最常见的就是SQL 注入攻击了，就是针对这些SQL字符拼装造成的漏洞。

参数的动态绑定机制可以妥善的处理好以上问题。类似JDBC的SQL操作，我们可以通过顺序占位符“？”对参数进行标识，并在之后对参数内容进行填充，如：

- 在Session.find方法（Hibernate2）中填充参数：

```java
session.find("from TUser user where user.name=?","Erica",Hibernate.STRING);
```
多参数的情况
```java
Object[] args = new Object[]{"Erica",new Integer(20)};
Type[] types = new Type[]{Hibernate,STRING,Hibernate.INTEGER};
session.find("from TUser user where user.name=? and user.age > ?",args,types);
```

- 通过Query接口进行参数填充：

```java
Query query = session.createQuery("from TUser user where user.name =? and user.age>?");
query.setString(0,"Erica");
query.setInteger(1,20);
```

除了用顺序占位符外，Hibernate还支持引用占位符：
```java
String hql = "from TUser where name = :name";
Query query = session.createQuery(hql);
query.setParameter("name","Erica");
Iterator it = query.iterate();
while(it.hasNext()){
    TUser user = (TUser)it.next();
    System.out.pringln(user.getName());
}
```
以上的:name即所谓的引用占位符，它标识了一个名为“name”的查询参数，通过session.createQuery方法构造Query实例后，我们即可以根据此参数名进行参数填充。另外，我们也可以用一个JavaBean封装查询参数。

参数绑定机制可以使得查询语法与具体的参数数值相互独立，这样，对于参数不同，查询语法相同的查询操作，数据库即可以实施性能优化策略，同时，参数绑定机制也杜绝了参数值对查询语法本身的影响，避免SQL注入。

###6.引用查询
有时候会碰到如下编码规范，规定在代码中不允许出现SQL语句，总之，为了避免SQL语句混杂在代码之间，我们可以采取将SQL保存在配置文件中，需要调用的时候再进行读取。Hibernate提供了HQL可配置化的内置支持。

###7.联合查询
SQL通过join子句实现多表之间的联合查询，HQL提供以下几种联合查询机制：

1. inner join
2. left outer join
3. right outer join
4. full join(not usually useful)

这里的概念就是数据库中的连接问题，inner join类似于自然连接，对于Inner join：
```java
from TUser user inner join fetch user.address
```
等于执行了一下语句：select ... from T_User user inner join TAddress addr on user.id =addr.userid

注意到上面HQL语句中的“fetch”关键字表明TAddress对象读出后立即填充到对应的TUser对象中。如果忽略fetch关键字，则在得到的结果集中，每个条目都是一个Object数组，其中包括了一个TUser对象以及对应的TAddress对象。另外，SQL中的on user.id = addr.user_id对于关系在映射文件指定了，所以HQL并没有对应表现。注意fetch关键字只对inner join和left join有效，对于right join而言，由于作为对象容器的TUser对象可能为null，所以也就无法通过fetch关键字强制Hibernate进行集合填充操作。右连接的话就将对象取出然后进行操作。

###8.子查询
HQL同样支持子查询，假设我们需要从一个结果中提取出拥有两条及以上地址信息的TUser对象，那么我们可以这样写HQL：
```java
from TUser user where (select count(*) from user.addresses)>1
```
HQL中，子查询必须出现在where子句中，且必须以一对圆括号包围。

###9.数据加载方式
Hibernate支持以下几种数据加载方式：

1. **即时加载（Immediate Loading）**

    当实体加载完成后，立即加载其关联数据。
    
2. **延迟加载（Lazy Loading）**

    实体加载时，其关联数据并非即刻获取，而是当关联数据第一次被访问时再进行读取。
    
3. **预先加载（Eager Loading）**

    预先加载时，实体及其关联对象同时读取，这与即时加载类似，不过实体及其关联数据是通过一条SQL语句（基于外连接[outer join]）同时读取。
    
4. **批量加载（Batch Loading）**

    对于即时加载和延迟加载，可以采用批量加载的方式进行性能上的优化。就是通过批量提交多个限定条件，一次完成多个数据的读取。如果使用了批量加载机制，Hibernate在进行数据查询操作前，会自动在当前的session中寻找是否还有其他同类型待加载数据，如果有，则将其查询条件合并在当前的select语句中一并提交，这样，通过一次数据库操作即完成了多个读取任务。
    
##10.SQL查询
由于SQL语法本身的庞杂，以及各种数据库原生功能的多样性，HQL不能涵盖所有查询特性，有时候我们不得不借助原生的SQL或存储过程来达到我们的目标。

Hibernate提供了对原生SQL以及存储过程（Hibernate3）的支持，相对于基于JDBC的SQL操作，Hibernate提供了更为妥善的封装。在Hibernate SQL查询接口中，我们只需要指定别名，而ResultSet与实体的映射将由Hibernate自动完成。从一个简单的例子入手：
```java
Select * from TUser where name = 'Erica'
```
上面的sql从表中返回特定名字的记录。如何通过HQL调用这条SQL语句，并返回对应的TUser对象？如下所示：

```java
String sql = "select {user.*} from TUser user";
List list = session.createSQLQuery(sql,"usr",TUser.class).list();
Iterator it = list.iterator();
while(it.hasNext){
    TUser user = (TUser)it.next();
    System.out.println(user.getName());
}
```
上面的SQL片段“select u.id as {usr.id}”,其中u是SQL中TUser表的别名，而usr是我们指定的实体对象别名。在session.createSQLQuery(sql,"usr",TUser.class)方法中，我们将待执行的SQL传入，并指定其实体对象别名为usr，实体对象类型为TUser.class,这样，Hibernate就会根据在SQL中的别名配置，将返回的ResultSet映射到对应的实体对象实例返回。

##11.自定义持久化实现
简单来说就是运行自己定义持久化的实现机制。
