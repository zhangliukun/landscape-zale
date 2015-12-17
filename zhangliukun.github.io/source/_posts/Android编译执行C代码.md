title: android 编译调用C代码
date: 2014-10-22 21:54:00
categories: android
tags: [android,交叉编译,C,assets]
desctiption: 在android平台执行由C编译出来的可执行文件

---

#前言
##需求来源
这几天帮别人做一个简单的android客户端，也没什么功能，主要就是调用C代码来对手机的Wifi网络进行设置，于是也就引出了技术难点所在，如何去调用**C程序**达到我们所需要的效果。

##解决方案
对于这个，我想出了两种解决方案：

<!--  more -->
1. 第一种方案是利用[**JNI**](http://baike.baidu.com/view/1272329.htm?fr=aladdin)来进行本地调用。关于什么是JNI呢，JNI其实是**Java Native Interface**的简称，也就是java本地接口，它提供了若干API实现了java和其他语言的通信（主要是C和C++）。

2. 第二种方法是将要执行的C代码编译成**可执行文件**，然后将这个可执行文件和程序一起打包成APK，在需要使用的时候调用这个可执行文件。

##最终选择
最后我选择了第二种方案，理由是第二种方法在我已经有了可执行文件的条件下总体来说比较简单，可操作性强。而第一种方案的话因为还要下载android的[NDK](http://www.cnblogs.com/devinzhang/archive/2012/02/29/2373729.html)，NDK是一系列工具的集合，提供了帮助开发者快速开发C或则C++的动态库，并能自动将so和java应用一起打包成apk，十分方便。

#技术实现

##可执行文件
首先需要得到一个可执行文件，当然想要的到可执行文件并不是想象中的那么简单，不是在linux中直接**gcc**就能到的，这里需要对C代码进行[**交叉编译**](http://baike.baidu.com/view/650389.htm?fr=aladdin)获得可以在android机子上运行的可执行文件，具体如何对C文件进行交叉编译，这里就不再赘述，大家可以上网查找一下。另外，NDK也是个不错的工具。

##资源存储
这里的资源存储页算是个小坑，平常我们在写java程序的时候，如果要打开一个文件的话就直接输入路径，比如如果所要使用的文件就在项目的目录下，直接输入文件名就可以调用了，但是这里的运行环境是嵌入式设备，不是PC，这就涉及到一个问题，资源如何存储了。


这里先谈一下Android中的**asset文件夹**和**res/raw文件夹**的异同：

- 相同点
    - 两者目录下的文件在打包后都会**原封不动**的保存在apk包中，不会被编译成二进制。
- 不同点
    - res/raw中的文件会被映射到R.java中，访问的时候直接使用资源ID即可，而assets文件夹下的文件不会被映射到R.java。
    - res/raw不可以有**目录结构**，而assets目录下可以再建立文件夹。


##资源获取
这里顺带说一下**res/raw**下的文件资源的读取方法，通过以下方式获取输入流来进行写操作
```java
InputStream is =getResources().openRawResource(R.id.filename);  
```

接下来才是我用到的读取**assets**下的方法，同样也是通过获取输入流的方式来进行写操作
```java
AssetManager am = null; 
am = getAssets(); 
InputStream is = am.open("filename");  

```
**注意点：**据说Assert只能放单个文件不超过**1M**的文件，但是不是真的具体还没考证过，如果碰到问题了应该考虑一下这个注意点。

虽然读取是成功了，但是要用**shell**脚本执行的话，应该在手机的存储上应该有这个文件，光是读取的话在手机里面是找不见的，所以我们需要一个存文件的操作。这里我写了一个存文件的函数，其中将获取assets中数据的方法也结合进去了。
```java
public  void copyDataToSD(String outFileName)throws IOException
{
	InputStream myInputStream;
	OutputStream myOutputStream = new FileOutputStream(outFileName);
	myInputStream = this.getAssets().open("a.out");
	byte[] buffer = new byte[1024];
	int length = myInputStream.read(buffer);
	while (length > 0) {
		myOutputStream.write(buffer, 0, length);
		length = myInputStream.read(buffer);
	}
	myOutputStream.flush();
	myInputStream.close();
	myOutputStream.close();
}
```
然后我定义的传入的outFileName是定义的文件路径加文件名
```java
private static String EXE_PATH = "data/data/com.example.g3wifi/a.out";
private static File exe_file;
```

##shell命令执行
到这里的话就是“万事俱备，只欠东风”了，我们需要执行所得到的可执行文件，因为android是基于**linux**的，所以一些基本的命令还是支持的，在android中要执行shell命令的话就按如下格式即可：
```java
public  void exeC(String cmd)throws IOException
{
	Runtime runtime =Runtime.getRuntime();
	Process process = runtime.exec(cmd);
    //Process process = runtime.exec(new String[]{"su","reboot"});//可以执行两条命令
    //这可以得到执行shell命令后的结果
    BufferedReader ie = new BufferedReader(new InputStreamReader(process.getErrorStream()));
}
```
