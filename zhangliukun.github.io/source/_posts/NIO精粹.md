title: java NIO详解
date: 2014-09-17 15:39:00
categories: java
tags: [NIO,java,非阻塞]
desctiption: 一篇自己对java NIO的理解

---

![javaNIO]({{BASE_PATH}}/image/javaboy.jpg)

#前言

我们在写java程序的时候，为了进行优化，把全部的精力用在了处理效率上，但是对IO的关注却很少。这也可能是由以前java早期时JVM在解释字节码时速度慢，运行速率大大低于本地编译代码，因此以前往往忽视了IO的优化。   

但是现在[JVM](http://baike.baidu.com/view/160708.htm)在运行时优化已前进了一大步，现在的java应用程序更多的是受IO的束缚，也就是将时间花在等待数据传输上。现在有了[NIO](http://baike.baidu.com/view/1007976.htm?from_id=13029359&type=syn&fromtitle=java+nio&fr=aladdin)，就可以减少[IO](http://baike.baidu.com/subview/1142749/5362454.htm)的等待时间，从而提升IO的效率。

<!--more-->
##java NIO的思维导图: 

![javaNIO]({{BASE_PATH}}/image/javaNIO.png)


###JVM利弊
JVM 是把双刃剑。它提供了统一的操作环境,让 Java 程序员不用再为操作系统环境的区别而烦恼。与特定平台相关的细枝末节大都被隐藏了起来,因而代码写得又快又容易。但是隐藏操作系统的技术细节也意味着某些个性鲜明、功能强大的特性被挡在了门外。

怎么办呢?如果您是程序员,可以使用 Java 本地接口([JNI](http://baike.baidu.com/view/1272329.htm))编写本地代码,直接使用操作系统特性。这样的话，不同的操作系统的局限性就体现出来了。为了解决这一问题,java.nio 软件包提供了新的抽象。具体地说,就是 Channel 和 Selector类。它们提供了使用 I/O 服务的通用 API,JDK 1.4 以前的版本是无法使用这些服务的。天下还是没有免费的午餐:您无法使用每一种操作系统的每一种特性,但是这些新类还是提供了强大的新框架,涵盖了当今商业操作系统普遍提供的高效 I/O 特性。不仅如此,java.nio.channels.spi还提供了新的服务提供接口(SPI),允许接入新型通道和选择器,同时又不违反规范的一致性。

随着 NIO 的面世,Java 已经为严肃的商业、娱乐、科研和学术应用做好了准备。在这些领域,高性能 I/O 是必不可少的。

#NIO原理

##NIO与IO的区别
首先来讲一下传统的IO和NIO的区别，传统的IO又称BIO，即阻塞式IO，NIO就是非阻塞IO了。还有一种[AIO](http://stevex.blog.51cto.com/4300375/1284437)就是异步IO，这里不加阐述了。

Java IO的各种流是阻塞的。这意味着，当一个线程调用read() 或 write()时，该线程被阻塞，直到有一些数据被读取，或数据完全写入。该线程在此期间不能再干任何事情了。 Java NIO的非阻塞模式，使一个线程从某通道发送请求读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用时，就什么都不会获取。而不是保持线程阻塞，所以直至数据变的可以读取之前，该线程可以继续做其他的事情。 非阻塞写也是如此。一个线程请求写入一些数据到某通道，但不需要等待它完全写入，这个线程同时可以去做别的事情。 线程通常将非阻塞IO的空闲时间用于在其它通道上执行IO操作，所以一个单独的线程现在可以管理多个输入和输出通道（channel）。

##缓冲区Buffer
一个Buffer对象是固定数量的数据的容器。其作用是一个存储器,或者分段运输区,在这里数据可被存储并在之后用于检索。尽管缓冲区作用于它们存储的原始数据类型,但缓冲区十分倾向于处理字节。非字节缓冲区可以在后台执行从字节或到字节的转换,这取决于缓冲区是如何创建的。

缓冲区的工作与通道紧密联系。通道是 I/O 传输发生时通过的入口,而缓冲区是这些数据传输的来源或目标。对于离开缓冲区的传输,您想传递出去的数据被置于一个缓冲区,被传送到通道。对于传回缓冲区的传输,一个通道将数据放置在您所提供的缓冲区中。这种在协同对象(通常是您所写的对象以及一到多个 Channel 对象)之间进行的缓冲区数据传递是高效数据处理的关键。

以下是一个新创建的ByteBuffer:
![ByteBuffer]({{BASE_PATH}}/image/Bytebuffer.png)

位置被设为 0,而且容量和上界被设为 10,刚好经过缓冲区能够容纳的最后一个字节。标记最初未定义。容量是固定的,但另外的三个属性可以在使用缓冲区时改变。


其中的四个属性的含义分别如下：

* 容量（Capacity）：缓冲区能够容纳的数据元素的最大数量。这一个容量在缓冲区创建时被设定，并且永远不能改变。
* 上界(Limit)：缓冲区的第一个不能被读或写的元素。或者说,缓冲区中现存元素的计数。
* 位置(Position)：下一个要被读或写的元素的索引。位置会自动由相应的 get( )和 put( )函数更新。
* 标记(Mark)：下一个要被读或写的元素的索引。位置会自动由相应的 get( )和 put( )函数更新。


**Buffer的常见方法**如下所示:

* flip(): 写模式转换成读模式
* rewind()：将 position 重置为 0 ，一般用于重复读。
* clear() ：清空 buffer ，准备再次被写入 (position 变成 0 ， limit 变成 capacity) 。
* compact(): 将未读取的数据拷贝到 buffer 的头部位。
* mark(): reset():mark 可以标记一个位置， reset 可以重置到该位置。
* Buffer 常见类型： ByteBuffer 、 MappedByteBuffer 、 CharBuffer 、 DoubleBuffer 、 FloatBuffer 、 IntBuffer 、 LongBuffer 、 ShortBuffer 。 

##通道Channel
通道(Channel)是 java.nio 的第二个主要创新。它们既不是一个扩展也不是一项增强,而是全新、极好的 Java I/O 示例,提供与 I/O 服务的直接连接。Channel 用于在字节缓冲区和位于通道另一侧的实体(通常是一个文件或套接字)之间有效地传输数据。

通道是一种途径,借助该途径,可以用最小的总开销来访问操作系统本身的 I/O 服务。缓冲区则是通道内部用来发送和接收数据的端点。通道channel充当连接I/O服务的导管，入下图所示![channel]({{BASE_PATH}}/image/channel.png)

###通道特性
通道可以是单向或者双向的。一个 channel 类可能实现定义read( )方法的 ReadableByteChannel 接口,而另一个 channel 类也许实现 WritableByteChannel 接口以提供 write( )方法。实现这两种接口其中之一的类都是单向的,只能在一个方向上传输数据。如果一个类同时实现这两个接口,那么它是双向的,可以双向传输数据。

每一个 file 或 socket 通道都实现全部三个接口。从类定义的角度而言,这意味着全部 file 和 socket 通道对象都是双向的。这对于 sockets 不是问题,因为它们一直都是双向的,不过对于 files 却是个问题了。我们知道,一个文件可以在不同的时候以不同的权限打开。从 FileInputStream 对象的getChannel( )方法获取的 FileChannel 对象是只读的,不过从接口声明的角度来看却是双向的,因为FileChannel 实现 ByteChannel 接口。在这样一个通道上调用 write( )方法将抛出未经检查的NonWritableChannelException 异常,因为 FileInputStream 对象总是以 read-only 的权限打开文件。

通道会连接一个特定 I/O 服务且通道实例(channel instance)的性能受它所连接的 I/O 服务的特征限制,记住这很重要。一个连接到只读文件的 Channel 实例不能进行写操作,即使该实例所属的类可能有 write( )方法。基于此,程序员需要知道通道是如何打开的,避免试图尝试一个底层 I/O服务不允许的操作。

通道可以以阻塞(blocking)或非阻塞(nonblocking)模式运行。非阻塞模式的通道永远不会让调用的线程休眠。请求的操作要么立即完成,要么返回一个结果表明未进行任何操作。只有面向流的(stream-oriented)的通道,如 sockets 和 pipes 才能使用非阻塞模式。


##选择器Selector
选择器提供选择执行已经就绪的任务的能力，这使得多元I/O成为可能，就绪选择和多元执行使得单线程能够有效率的同时管理多个I/O通道（channels），简单言之就是selector充当一个监视者，您需要将之前创建的一个或多个可选择的通道注册到选择器对象中。一个表示通道和选择器的键将会被返回。选择键会记住您关心的通道。它们也会追踪对应的通道是否已经就绪当您调用一个选择器对象的 select( )方法时,相关的键会被更新,用来检查所有被注册到该选择器的通道。您可以获取一个键的集合,从而找到当时已经就绪的通道。通过遍历这些键,您可以选择出每个从上次您调用 select( )开始直到现在,已经就绪的通道。

###传统的socket监控
传统的监控多个 socket 的 Java 解决方案是为每个 socket 创建一个线程并使得线程可以在 read( )调用中阻塞,直到数据可用。这事实上将每个被阻塞的线程当作了 socket 监控器,并将 Java 虚拟机的线程调度当作了通知机制。这两者本来都不是为了这种目的而设计的。程序员和 Java 虚拟机都为管理所有这些线程的复杂性和性能损耗付出了代价,这在线程数量的增长时表现得更为突出。

###选择器属性
* 选择器（Selector）  
选择器类管理着一个被注册的通道集合的信息和它们的就绪状态。通道是和选择器一起被注册的,并且使用选择器来更新通道的就绪状态。当这么做的时候,可以选择将被激发的线程挂起,直到有就绪的的通道。

* 可选择通道(SelectableChannel)   
SelectableChannel 可以被注册到 Selector 对象上,同时可以指定对那个选择器而言,那种操作是感兴趣的。一个通道可以被注册到多个选择器上,但对每个选择器而言只能被注册一次。

* 选择键(SelectionKey)   
选择键封装了特定的通道与特定的选择器的注册关系。选择键对象被SelectableChannel.register( ) 返回并提供一个表示这种注册关系的标记。选择键包含了两个比特集(以整数的形式进行编码),指示了该注册关系所关心的通道操作,以及通道已经准备好的操作。

**下图体现了就绪选择注册和Selector的关系**
![Selector]({{BASE_PATH}}/image/Selector.png)

一个单独的通道对象可以被注册到多个选择器上。可以调用 isRegistered( )方法来检查一个通道是否被注册到任何一个选择器上。这个方法没有提供关于通道被注册到哪个选择器上的信息,而只能知道它至少被注册到了一个选择器上。此外,在一个键被取消之后,直到通道被注销为止,可能有时间上的延迟。这个方法只是一个提示,而不是确切的答案。

###键对象
键对象表示了一种特定的注册关系。当应该终结这种关系的时候,可以调用 SelectionKey对象的 cancel( )方法。可以通过调用 isValid( )方法来检查它是否仍然表示一种有效的关系。当键被取消时,它将被放在相关的选择器的已取消的键的集合里。注册不会立即被取消,但键会立即失效。当再次调用 select( )方法时(或者一个正在进行的 select()调用结束时),已取消的键的集合中的被取消的键将被清理掉,并且相应的注销也将完成。通道会被注销,而新的SelectionKey 将被返回。

SelectionKey 类定义了四个便于使用的布尔方法来为您测试这些比特值:isReadable( ),isWritable( ),isConnectable( ), 和 isAcceptable( )。每一个方法都与使用特定掩码来测试 readyOps( )方法的结果的效果相同。例如：
```java
if (key.isWritable( ))
等价于:
if ((key.readyOps( ) & SelectionKey.OP_WRITE) != 0)
```
这四个方法在任意一个 SelectionKey 对象上都能安全地调用。不能在一个通道上注册一个它不支持的操作,这种操作也永远不会出现在 ready 集合中。调用一个不支持的操作将总是返回 false,因为这种操作在该通道上永远不会准备好。

###停止选择过程
有三种方式可以唤醒在select（）方法中睡眠的线程。

1. 调用wakeup（）   
调用 Selector 对象的 wakeup( )方法将使得选择器上的第一个还没有返回的选择操作立即返回。如果当前没有在进行中的选择,那么下一次对 select( )方法的一种形式的调用将立即返回。后续的选择操作将正常进行。在选择操作之间多次调用 wakeup( )方法与调用它一次没有什么不同。有时这种延迟的唤醒行为并不是您想要的。您可能只想唤醒一个睡眠中的线程,而使得后续的选择继续正常地进行。您可以通过在调用 wakeup( )方法后调用 selectNow( )方法来绕过这个问题。尽管如此,如果您将您的代码构造为合理地关注于返回值和执行选择集合,那么即使下一个 select( )方法的调用在没有通道就绪时就立即返回,也应该不会有什么不同。不管怎么说,您应该为可能发生的事件做好准备。

2. 调用 close( )   
如果选择器的 close( )方法被调用,那么任何一个在选择操作中阻塞的线程都将被唤醒,就像wakeup( )方法被调用了一样。与选择器相关的通道将被注销,而键将被取消。

3. 调用 interrupt( )   
如果睡眠中的线程的 interrupt( )方法被调用,它的返回状态将被设置。如果被唤醒的线程之后将试图在通道上执行 I/O 操作,通道将立即关闭,然后线程将捕捉到一个异常。这是由于在第三章中已经探讨过的通道的中断语义。使用 wakeup( )方法将会优雅地将一个在 select( )方法中睡眠的线程唤醒。如果您想让一个睡眠的线程在直接中断之后继续执行,需要执行一些步骤来清理中断状态



##简单的NIO服务器
下面是一个简单的NIO服务器的例子，使用select（）来为多个通道提供服务。
```java

import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.nio.ByteBuffer;
import java.nio.channels.SelectableChannel;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;

import javax.swing.text.html.HTMLDocument.Iterator;

/**
* Simple echo-back server which listens for incoming stream connections and
* echoes back whatever it reads. A single Selector object is used to listen to
* the server socket (to accept new connections) and all the active socket
* channels.
* @author zale (zalezone.cn)
*/
public class SelectSockets {
	public static int PORT_NUMBER = 1234;
	public static void main(String[] argv) throws Exception 
	{
		new SelectSockets().go(argv);
	}
	public void go(String[] argv) throws Exception 
	{
		int port = PORT_NUMBER;
		if (argv.length > 0) 
		{ // 覆盖默认的监听端口
			port = Integer.parseInt(argv[0]);
		}
		System.out.println("Listening on port " + port);
		ServerSocketChannel serverChannel = ServerSocketChannel.open();// 打开一个未绑定的serversocketchannel
		ServerSocket serverSocket = serverChannel.socket();// 得到一个ServerSocket去和它绑定	
		Selector selector = Selector.open();// 创建一个Selector供下面使用
		serverSocket.bind(new InetSocketAddress(port));//设置server channel将会监听的端口
		serverChannel.configureBlocking(false);//设置非阻塞模式
		serverChannel.register(selector, SelectionKey.OP_ACCEPT);//将ServerSocketChannel注册到Selector
		while (true) 
		{
			// This may block for a long time. Upon returning, the
			// selected set contains keys of the ready channels.
			int n = selector.select();
			if (n == 0) 
			{
				continue; // nothing to do
			}			
			java.util.Iterator<SelectionKey> it = selector.selectedKeys().iterator();// Get an iterator over the set of selected keys
			//在被选择的set中遍历全部的key
			while (it.hasNext()) 
			{
				SelectionKey key = (SelectionKey) it.next();
				// 判断是否是一个连接到来
				if (key.isAcceptable()) 
				{
					ServerSocketChannel server =(ServerSocketChannel) key.channel();
					SocketChannel channel = server.accept();
					registerChannel(selector, channel,SelectionKey.OP_READ);//注册读事件
					sayHello(channel);//对连接进行处理
				}
				//判断这个channel上是否有数据要读
				if (key.isReadable()) 
				{
					readDataFromSocket(key);
				}
				//从selected set中移除这个key，因为它已经被处理过了
				it.remove();
			}
		}
	}
	// ----------------------------------------------------------
	/**
	* Register the given channel with the given selector for the given
	* operations of interest
	*/
	protected void registerChannel(Selector selector,SelectableChannel channel, int ops) throws Exception
	{
		if (channel == null) 
		{
			return; // 可能会发生
		}
		// 设置通道为非阻塞
		channel.configureBlocking(false);
		// 将通道注册到选择器上
		channel.register(selector, ops);
	}
	// ----------------------------------------------------------
	// Use the same byte buffer for all channels. A single thread is
	// servicing all the channels, so no danger of concurrent acccess.
	//对所有的通道使用相同的缓冲区。单线程为所有的通道进行服务，所以并发访问没有风险
	private ByteBuffer buffer = ByteBuffer.allocateDirect(1024);
	/**
	* Sample data handler method for a channel with data ready to read.
	* 对于一个准备读入数据的通道的简单的数据处理方法
	* @param key
	*
	A SelectionKey object associated with a channel determined by
	the selector to be ready for reading. If the channel returns
	an EOF condition, it is closed here, which automatically
	invalidates the associated key. The selector will then
	de-register the channel on the next select call.
	
	一个选择器决定了和通道关联的SelectionKey object是准备读状态。如果通道返回EOF，通道将被关闭。
	并且会自动使相关的key失效，选择器然后会在下一次的select call时取消掉通道的注册
	*/
	protected void readDataFromSocket(SelectionKey key) throws Exception 
	{
		SocketChannel socketChannel = (SocketChannel) key.channel();
		int count;
		buffer.clear(); // 清空Buffer
		// Loop while data is available; channel is nonblocking
		//当可以读到数据时一直循环，通道为非阻塞
		while ((count = socketChannel.read(buffer)) > 0) 
		{
			buffer.flip(); // 将缓冲区置为可读
			// Send the data; don't assume it goes all at once
			//发送数据，不要期望能一次将数据发送完
			while (buffer.hasRemaining()) 
			{
				socketChannel.write(buffer);
			}
			// WARNING: the above loop is evil. Because
			// it's writing back to the same nonblocking
			// channel it read the data from, this code can
			// potentially spin in a busy loop. In real life
			// you'd do something more useful than this.
			//这里的循环是无意义的，具体按实际情况而定
			buffer.clear(); // Empty buffer
		}
		if (count < 0) 
		{
			// Close channel on EOF, invalidates the key
			//读取结束后关闭通道，使key失效
			socketChannel.close();
		}
	}
	// ----------------------------------------------------------
	/**
	* Spew a greeting to the incoming client connection.
	*
	* @param channel
	*
	The newly connected SocketChannel to say hello to.
	*/
	private void sayHello(SocketChannel channel) throws Exception 
	{
		buffer.clear();
		buffer.put("Hi there!\r\n".getBytes());
		buffer.flip();
		channel.write(buffer);
	}
}
```
---
###原理解释
上面这个例子实现了一个简单的服务器，它创建了 ServerSocketChannel 和 Selector 对象,并将通道注册到选择器上。我们不在注册的键中保存服务器 socket 的引用,因为它永远不会被注销。这个无限循环在最上面先调用了 select( ),这可能会无限期地阻塞。当选择结束时,就遍历选择键并检查已经就绪的通道。

如果一个键指示与它相关的通道已经准备好执行一个 accecpt( )操作,我们就通过键获取关联的通道,并将它转换为 SeverSocketChannel 对象。我们都知道这么做是安全的,因为只有ServerSocketChannel 支持 OP_ACCEPT 操作。我们也知道我们的代码只把对一个单一的ServerSocketChannel 对象的 OP_ACCEPT 操作进行了注册。通过对服务器 socket 通道的引用,我 们调用了它 的 accept( )方法 ,来获取刚到达 的 socket 的句 柄。返回的 对象的类型 是
SocketChannel,也是一个可选择的通道类型。这时,与创建一个新线程来从新的连接中读取数据不同,我们只是简单地将 socket 同多注册到选择器上。我们通过传入 OP_READ 标记,告诉选择器我们关心新的 socket 通道什么时候可以准备好读取数据。

如果键指示通道还没有准备好执行 accept( ),我们就检查它是否准备好执行 read( )。任何一个这么指示的 socket 通道一定是之前 ServerSocketChannel 创建的 SocketChannel 对象之一,并且被注册为只对读操作感兴趣。对于每个有数据需要读取的 socket 通道,我们调用一个公共的方法来读取并处理这个带有数据的 socket。需要注意的是这个公共方法需要准备好以非阻塞的方式处理 socket 上的不完整的数据。它需要迅速地返回,以其他带有后续输入的通道能够及时地得到处理。例 4-1 中只是简单地对数据进行响应,将数据写回 socket,传回给发送者。

在循环的底部,我们通过调用 Iterator(迭代器)对象的 remove()方法,将键从已选择的键的集合中移除。键可以直接从 selectKeys()返回的 Set 中移除,但同时需要用 Iterator 来检查集合,您需要使用迭代器的 remove()方法来避免破坏迭代器内部的状态。

##并发性
选择器对象是线程安全的,但它们包含的键集合不是。通过 keys( )和 selectKeys( )返回的键的集合是 Selector 对象内部的私有的 Set 对象集合的直接引用。这些集合可能在任意时间被改变。已注册的键的集合是只读的。如果您试图修改它,那么您得到的奖品将是一个java.lang.UnsupportedOperationException,但是当您在观察它们的时候,它们可能发生了改变的话,您仍然会遇到麻烦。Iterator 对象是快速失败的(fail-fast):如果底层的 Set 被改变了,它们将会抛出 java.util.ConcurrentModificationException,因此如果您期望在多个线程间共享选择器和/或键,请对此做好准备。您可以直接修改选择键,但请注意您这么做时可能会彻底破坏另一个线程的 Iterator。

如果在多个线程并发地访问一个选择器的键的集合的时候存在任何问题,您可以采取一些步骤来合理地同步访问。在执行选择操作时,选择器在 Selector 对象上进行同步,然后是已注册的键的集合,最后是已选择的键的集合,按照这样的顺序。已取消的键的集合也在选择过程的的第 1步和第 3 步之间保持同步(当与已取消的键的集合相关的通道被注销时)。

在多线程的场景中,如果您需要对任何一个键的集合进行更改,不管是直接更改还是其他操作带来的副作用,您都需要首先以相同的顺序,在同一对象上进行同步。锁的过程是非常重要的。如果竞争的线程没有以相同的顺序请求锁,就将会有死锁的潜在隐患。如果您可以确保否其他线程不会同时访问选择器,那么就不必要进行同步了。

Selector 类的 close( )方法与 slect( )方法的同步方式是一样的,因此也有一直阻塞的可能性。在选择过程还在进行的过程中,所有对 close( )的调用都会被阻塞,直到选择过程结束,或者执行选择的线程进入睡眠。在后面的情况下,执行选择的线程将会在执行关闭的线程获得锁时立即被唤醒,并关闭选择器。

##选择过程的可扩展性
对于单CPU的系统用一个线程来为多个通道提供服务可能是个好主意，但是对于多个CPU的系统来说就可能不能使其他CPU高效发挥作用。  

一个比较好的优化策略是对所有的可选择通道使用一个选择器,并将对就绪通道的服务委托给其他线程。根据部署的条件,线程池的大小是可以调整的(或者它自己进行动态的调整)。  

另外，有些通道要求比其他通道有更高的响应速度，可以通过使用两个选择器来解决：一个为命令连接服务，另一个为普通连接服务。与将所有准备好的通道放到同一个线程池的做法不同,通道可以根据功能由不同的工作线程来处理。它们可能可以是日志线程池,命令/控制线程池,状态请求线程池,等等。

##服务线程池服务器示例
这个例子是上一个简单服务器的一般性的选择循环的扩展。它覆写了 readDataFromSocket( )方法,并使用线程池来为准备好数据用于读取的通道提供服务。与在主线程中同步地读取数据不同,这个版本的实现将 SelectionKey 对象传递给为其服务的工作线程。

###使用线程池来为通道提供服务
```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;
import java.util.LinkedList;
import java.util.List;

/**
* Specialization of the SelectSockets class which uses a thread pool to service
* channels. The thread pool is an ad-hoc implementation quicky lashed togther
* in a few hours for demonstration purposes. It's definitely not production
* quality.
*
* @author Ron Hitchens (ron@ronsoft.com)
*/
public class SelectSocketsThreadPool extends SelectSockets 
{
	private static final int MAX_THREADS = 5;
	private ThreadPool pool = new ThreadPool(MAX_THREADS);
	// -------------------------------------------------------------
	public static void main(String[] argv) throws Exception 
	{
		new SelectSocketsThreadPool().go(argv);
	}
	// -------------------------------------------------------------
	/**
	* Sample data handler method for a channel with data ready to read. This
	* method is invoked from(被调用) the go( ) method in the parent class. This handler
	* delegates（委托） to a worker thread in a thread pool to service the channel,
	* then returns immediately.
	*
	* @param key
	*
	A SelectionKey object representing a channel determined by the
	*
	selector to be ready for reading. If the channel returns an
	*
	EOF condition, it is closed here, which automatically
	*
	invalidates the associated key. The selector will then
	*
	de-register the channel on the next select call.
	*/
	protected void readDataFromSocket(SelectionKey key) throws Exception 
	{
		WorkerThread worker = pool.getWorker();
		if (worker == null) 
		{
			// No threads available. Do nothing. The selection
			// loop will keep calling this method until a
			// thread becomes available. This design could
			// be improved.
			return;
		}
		// Invoking this wakes up the worker thread, then returns
		worker.serviceChannel(key);
	}
	// ---------------------------------------------------------------
	/**
	* A very simple thread pool class. The pool size is set at construction
	* time and remains fixed. Threads are cycled through a FIFO idle queue.
	*/
	private class ThreadPool
	{
		List idle = new LinkedList();
		ThreadPool(int poolSize) 
		{
			// Fill up the pool with worker threads
			for (int i = 0; i < poolSize; i++)
			{
				WorkerThread thread = new WorkerThread(this);
				// Set thread name for debugging. Start it.
				thread.setName("Worker" + (i + 1));
				thread.start();
				idle.add(thread);
			}
		}
		/**
		* Find an idle worker thread, if any. Could return null.
		*/
		WorkerThread getWorker() 
		{
			WorkerThread worker = null;
			synchronized (idle) 
			{
				if (idle.size() > 0) 
				{
					worker = (WorkerThread) idle.remove(0);
				}
			}
			return (worker);
		}
		/**
		* Called by the worker thread to return itself to the idle pool.
		*/
		void returnWorker(WorkerThread worker) 
		{
			synchronized (idle) 
			{
				idle.add(worker);
			}
		}
	}
	/**
	* A worker thread class which can drain（排空） channels and echo-back（回显） the input.
	* Each instance is constructed with a reference（参考） to the owning thread pool
	* object. When started, the thread loops forever waiting to be awakened to
	* service the channel associated with a SelectionKey object. The worker is
	* tasked by calling its serviceChannel( ) method with a SelectionKey
	* object. The serviceChannel( ) method stores the key reference in the
	* thread object then calls notify( ) to wake it up. When the channel has
	* been drained, the worker thread returns itself to its parent pool.
	*/
	private class WorkerThread extends Thread 
	{
		private ByteBuffer buffer = ByteBuffer.allocate(1024);
		private ThreadPool pool;
		private SelectionKey key;
		WorkerThread(ThreadPool pool) 
		{
			this.pool = pool;
		}
		// Loop forever waiting for work to do
		public synchronized void run() 
		{
			System.out.println(this.getName() + " is ready");
			while (true) 
			{
				try 
				{
					// Sleep and release object lock
					//休眠并且释放掉对象锁
					this.wait();
				} 
				catch (InterruptedException e) 
				{
					e.printStackTrace();
					// Clear interrupt status
					this.interrupted();
				}
				if (key == null) 
				{
					continue; // just in case
				}
				System.out.println(this.getName() + " has been awakened");
				try 
				{
					drainChannel(key);
				} 
				catch (Exception e) 
				{
					System.out.println("Caught '" + e + "' closing channel");
					// Close channel and nudge selector
					try 
					{
						key.channel().close();
					} 
					catch (IOException ex) 
					{
						ex.printStackTrace();
					}
					key.selector().wakeup();
				}
				key = null;
				// Done. Ready for more. Return to pool
				this.pool.returnWorker(this);
			}
		}
		/**
		* Called to initiate a unit of work by this worker thread on the
		* provided SelectionKey object. This method is synchronized, as is the
		* run( ) method, so only one key can be serviced at a given time.
		* Before waking the worker thread, and before returning to the main
		* selection loop, this key's interest set is updated to remove OP_READ.
		* This will cause the selector to ignore read-readiness for this
		* channel while the worker thread is servicing it.
		* 通过一个被提供SelectionKey对象的工作线程来初始化一个工作集合，这个方法是同步的，所以
		* 里面的run方法只有一个key能被服务在同一个时间，在唤醒工作线程和返回到主循环之前，这个key的
		* 感兴趣的集合被更新来删除OP_READ，这将会引起工作线程在提供服务的时候选择器会忽略读就绪的通道
		*/
		synchronized void serviceChannel(SelectionKey key) 
		{
			this.key = key;
			key.interestOps(key.interestOps() & (~SelectionKey.OP_READ));
			this.notify(); // Awaken the thread
		}
		/**
		* The actual code which drains the channel associated with the given
		* key. This method assumes the key has been modified prior to
		* invocation to turn off selection interest in OP_READ. When this
		* method completes it re-enables OP_READ and calls wakeup( ) on the
		* selector so the selector will resume watching this channel.
		*/
		void drainChannel(SelectionKey key) throws Exception 
		{
			SocketChannel channel = (SocketChannel) key.channel();
			int count;
			buffer.clear(); // 清空buffer
			// Loop while data is available; channel is nonblocking
			while ((count = channel.read(buffer)) > 0)
			{
				buffer.flip(); // make buffer readable
				// Send the data; may not go all at once
				while (buffer.hasRemaining()) 
				{
					channel.write(buffer);
				}
				// WARNING: the above loop is evil.
				// See comments in superclass.
				buffer.clear(); // Empty buffer
			}
			if (count < 0) 
			{
				// Close channel on EOF; invalidates the key
				channel.close();
				return;
			}
			// Resume interest in OP_READ
			key.interestOps(key.interestOps() | SelectionKey.OP_READ);
			// Cycle the selector so this key is active again
			key.selector().wakeup();
		}
	}
}
```
---
###原理解释
由于执行选择过程的线程将重新循环并几乎立即再次调用 select( ),键的 interest 集合将被修改,并将 interest(感兴趣的操作)从读取就绪(read-rreadiness)状态中移除。这将防止选择器重复地调用 readDataFromSocket( )(因为通道仍然会准备好读取数据,直到工作线程从它那里读取数据)。当工作线程结束为通道提供的服务时,它将再次更新键的 ready 集合,来将 interest 重新放到读取就绪集合中。它也会在选择器上显式地调用 wakeup( )。如果主线程在 select( )中被阻塞,这将使它继续执行。这个选择循环会再次执行一个轮回(可能什么也没做)并带着被更新的键重新进入select( )。

#总结
对于java NIO的常见框架有Mina，Netty等，关于Mina和Netty到底哪个框架比较好，因为还未深入进行研究，
所以也不敢下定论，但个人还是倾向Netty框架吧。下一步准备好好研究一下Netty框架。

**参考文献**：[《java NIO》](http://book.douban.com/subject/1433583/)
