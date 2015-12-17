title: java自制线程池
date: 2014-10-26 23:56:00
categories: java
tags: [java,线程池,JDK,性能,DIY]
desctiption: 介绍了JDK自带的常用线程池以及自己动手写一个java线程池

---
   
#简介
##线程池
线程池的基本思想是一种对象池的思想，先开辟一块内存空间，开许多等待任务的线程，一旦有任务出现就直接使用线程池中的线程来进行任务，等到任务结束后再将这个线程放入线程池中，池中的执行调度由线程池管理器来管理。

##线程池作用
线程池的作用就是更好的对系统中的线程进行管理，根据系统的环境，可以自动或者手动的设置线程数量，达到运行的最佳效果。


<!-- more -->
##线程池优点
相对于不使用线程池来说，使用线程池有什么优点呢？

1. 减少了创建和销毁线程的次数，每个工作线程都可以被重复利用，用完以后可以再用。
2. 可以根据系统的能力，自由的控制线程池的大小，防止在没有使用线程池的且对线程没有进行很好的管理的条件下服务器消耗过多的内存而宕机

##JDK自带线程池
自从JDK1.5之后加入java.util.concurrent包后，线程池得到了极大的优化，现在只要按照提供的API来使用，我们就可以非常容易的使用JDK自带的线程池，为我们在写自己的程序时提供了极大的方便。

ThreadPoolExecutor
先来看看ThreadPoolExecutor的完整构造方法
```java
ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, 
        TimeUnit unit, BlockingQueue<Runnable> workQueue,
        ThreadFactory threadFactory, RejectedExecutionHandler handler) 
```
对于里面的参数含义如下：

**corePoolSize - 池中所保存的线程数，包括空闲线程。**
**maximumPoolSize - 池中允许的最大线程数。**
**keepAliveTime - 当线程数大于核心时，此为终止前多余的空闲线程等待新任务的最长时间。**
**unit - keepAliveTime 参数的时间单位。**
**workQueue - 执行前用于保持任务的队列。此队列仅保持由 execute 方法提交的 Runnable 任务。**
**threadFactory - 执行程序创建新线程时使用的工厂。**
**handler - 由于超出线程范围和队列容量而使执行被阻塞时所使用的处理程序。**
    
**下面介绍一些常用的线程池：**

- **newSingleThreadExecutor**：创建一个单线程的线程池。这个线程池只有一个线程在工作，也就是相当于单线程串行执行所有任务。如果这个唯一的线程因为异常结束，那么会有一个新的线程来替代它。此线程池保证所有任务的执行顺序按照任务的提交顺序执行。 

**对应的构造方法**
    ```java
    public static ExecutorService newSingleThreadExecutor() {  
        return new FinalizableDelegatedExecutorService  
            (new ThreadPoolExecutor(1, 1,  
                                    0L, TimeUnit.MILLISECONDS,  
                                    new LinkedBlockingQueue<Runnable>()));  
    }  
    ```
   

**使用方法示例**
   

    ```java
    //创建一个单线程的线程池
    ExecutorService pool = Executors.newSingleThreadExecutor();
    //创建实现了Runnable接口对象，Thread对象当然也实现了Runnable接口
    Thread t1 = new MyThread();
    //将线程放入池中进行执行
    pool.execute(t1);
    //关闭线程池
    pool.shutdown(); 
    ```

- **newFixedThreadPool**：创建固定大小的线程池。每次提交一个任务就创建一个线程，直到线程达到线程池的最大大小。线程池的大小一旦达到最大值就会保持不变，如果某个线程因为执行异常而结束，那么线程池会补充一个新线程。 

**对应的构造方法**
    ```java
    public static ExecutorService newFixedThreadPool(int nThreads) {  
        return new ThreadPoolExecutor(nThreads, nThreads,  
                                      0L, TimeUnit.MILLISECONDS,  
                                      new LinkedBlockingQueue<Runnable>());  
        }  
    ```

**使用方法示例**

    ```java
    //创建一个可重用固定线程数的线程池
    ExecutorService pool = Executors.newFixedThreadPool(2);
    //创建实现了Runnable接口对象，Thread对象当然也实现了Runnable接口
    Thread t1 = new MyThread();
    //将线程放入池中进行执行
    pool.execute(t1);
    //关闭线程池
    pool.shutdown(); 
    ```

- **newCachedThreadPool**：创建一个可缓存的无界线程池。如果线程池的大小超过了处理任务所需要的线程，那么就会回收部分空闲（60秒不执行任务）的线程，当任务数增加时，此线程池又可以智能的添加新线程来处理任务。此线程池不会对线程池大小做限制，线程池大小完全依赖于操作系统（或者说JVM）能够创建的最大线程大小。

**对应的构造方法**
    ```java
    public static ExecutorService newCachedThreadPool() {  
            return new ThreadPoolExecutor(0, Integer.MAX_VALUE,  
                                          60L, TimeUnit.SECONDS,  
                                          new SynchronousQueue<Runnable>());  
        }  
    ```
    
**使用方法示例**

    ```java
    //创建一个可根据需要创建新线程的线程池，但是在以前构造的线程可用时将重用它们
    ExecutorService pool = Executors.newCachedThreadPool(); 
    //创建实现了Runnable接口对象，Thread对象当然也实现了Runnable接口
    Thread t1 = new MyThread();
    //将线程放入池中进行执行
    pool.execute(t1);
    //关闭线程池
    pool.shutdown(); 
    ```

- **newScheduledThreadPool**：创建一个大小无限的线程池。此线程池支持定时以及周期性执行任务的需求。

**使用方法示例**

    ```java
    ////创建一个线程池，它可安排在给定延迟后运行命令或者定期地执行。 
    ExecutorService pool = Executors.newScheduledThreadPool(2);  
    //创建实现了Runnable接口对象，Thread对象当然也实现了Runnable接口
    Thread t1 = new MyThread();
    Thread t2 = new MyThread();
    //将线程放入池中进行执行
    pool.execute(t1);
    //使用延迟执行风格的方法
    pool.schedule(t2, 10, TimeUnit.MILLISECONDS); 
    //关闭线程池
    pool.shutdown(); 
    ```

#自制线程池
现在让我们来自己动手写一个线程池。这只是一个简单的线程池，有助于我们更好的了解线程池的原理。
##线程池主体类
**MyThread.java**
```java
import java.util.LinkedList;

/**
 * 
 * @author zlk
 *    线程池，继承ThreadGroup，ThreadGroup用于处理一组线程的类，它是一种树状结构，它的下层节点还是可以是ThreadGroup对象
 */
public class MyThreadPool extends ThreadGroup{

    
    private boolean isAlive;//标志线程池是否开启
    private LinkedList taskQueue;//线程池中的任务队列
    private int threadID;//线程池中的线程ID
    private static int threadPoolID;//线程池ID
    
    /**
     * 创建新的线程池，numThreads是池中的线程数
     * @param numThreads
     */
    public MyThreadPool(int numThreads) {
        super("ThreadPool-"+(threadPoolID++));
        //设置该线程池是daemon属性为true，表示当该线程池中所有的线程都被销毁时，该线程池会被自动销毁。
        super.setDaemon(true);
        this.isAlive = true;
        //新建一个任务队列
        this.taskQueue = new LinkedList();
        //启动numThreads个工作线程
        for (int i = 0; i < numThreads; i++) {
            new PooledThread().start();
        }
    }
    
    /**
     * 添加新任务
     * @param task
     */
    public synchronized void performTask(Task task)
    {
        if(!this.isAlive)
        {
            //线程池被关则抛出IllegalStateException异常
            throw new IllegalStateException();
        }
        if (task != null) {
            //将任务放到任务队列的尾部
            this.taskQueue.add(task);
            //通知工作线程取任务
            notify();
        }
    }
    
    /**
     * 获取任务
     */
    protected synchronized Task getTask()throws InterruptedException {
        //如果任务列表为空，而且线程池没有被关闭,则继续等待任务
        while (this.taskQueue.size() == 0) {
            if (!this.isAlive) {
                return null;
            }
            wait();
        }
        //取任务列表中的第一个任务
        return (Task)this.taskQueue.removeFirst();
    }
    
    /**
     * 关闭线程池，所有线程停止，不再执行任务
     */
    
    public synchronized void forceclose()
    {
        if (isAlive) {
            this.isAlive = false;
            //清除任务
            this.taskQueue.clear();
            //终止线程池中的所有线程
            this.interrupt();
        }
    }
    
    /**
     * 关闭线程池，并且等待线程池中的所有任务被运行完毕，但是不能接受新的任务
     */
    
    public void shutdown(){
        //通知其他等待线程“该线程池已关闭“的消息
        synchronized (this) {
            isAlive = false;
            notify();
        }
        
        //等待所有线程完成
        //首先建立一个新的线程数组。activeCount方法获取线程池中活动线程的估计数
        Thread[] threads = new Thread[this.activeCount()];
        
        //将线程池中的活动线程拷贝到新创建的线程数组中
        int count = this.enumerate(threads);
        for (int i = 0; i < count; i++) {
            try {
                //等待线程运行结束
                threads[i].join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    
    /**
     * 内部类，用于执行任务的工作线程
     */
    private class PooledThread extends Thread{
        //构造方法
        public PooledThread()
        {
            //第一个参数为该线程所在的线程组的对象，即当前线程池的对象
            //第二个参数为线程名字
            super(MyThreadPool.this,"PooledThread-"+(threadID++));
        }
        
        public void run()
        {
            //如果线程没有被终止
            while (!isInterrupted()) {
                //获取任务
                Task task = null;
                try {
                    task = getTask();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                
                //只要线程池的任务列表不为空，getTask方法总能够得到一个任务。
                //若getTask()返回null，则表示线程池中已经没有任务了，而且线程池已被关闭。
                if(task == null){
                    return;
                }
                
                //运行任务，吸收异常
                try {
                    task.perform();
                } catch (Throwable t) {
                    //当线程组中的线程有未被捕获的异常发生时，JVM就回去调用uncaughtException方法
                    uncaughtException(this, t);
                }
            }
        }
    }
    

}
```
##任务类
**Task.java** //作为执行任务的总接口
```java
public interface Task {
    /**
     * 执行任务
     * throws Exception 执行过程中可能出现的异常 
     */
    public void  perform()throws Exception;
}
```

**MyTask.java** //实现了任务接口
```java
public class MyTask implements Task{

    private int taskID = 0; //任务的ID
    
    public MyTask(int id) {
        this.taskID = id;
    }
    
    /**
     * 实现Task接口的perform方法
     */
    @Override
    public void perform() throws Exception {
        System.out.println("MyTask"+ taskID + ":start");
        //休眠一秒
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("MyTask" + taskID + ":end");
    }

}
```

##测试类
**PoolTest.java** //测试自制线程池
```java
import com.zale.threadpool.MyTask;
import com.zale.threadpool.MyThreadPool;

public class PoolTest {
    
    public static void main(String[] args)
    {
        int numThreads = 3; //线程池中的线程数
        MyThreadPool threadPool = new MyThreadPool(numThreads);//生成线程池
        
        int numTasks = 10;  //任务数
        //运行任务
        for (int i = 0; i < numTasks; i++) {
            threadPool.performTask(new MyTask(i));
        }
        
        //关闭线程池并等待所有任务完成
        threadPool.shutdown();
    }
}

```