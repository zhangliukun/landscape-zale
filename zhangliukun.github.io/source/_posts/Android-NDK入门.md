title: Android NDK 入门
date: 2015-05-16 16:02:00
categories: android
tags: [android,NDK]
desctiption: Android NDK 入门

---

#Android NDK 入门

##简介
NDK是一系列工具的集合：

- NDK提供一系列帮助开发者开发C，C++的动态库，并能自动将so和java应用一起打包成apk。
- NDK继承了交叉编译器，并提供了相应的mk文件隔离CPU，平台，ABI等差异，开发人员只要简单修改mk文件，就可以创建出so。
- NDK提供了一份稳定功能有限的API头文件声明。


<!--more-->

##开发环境搭建

1. 下载NDK压缩包。
2. 配置NDK环境变量。
3. 运行ndk-build 测试环境是否安装成功。
4. 测试需要的环境是否具备：make -v ，gcc -v，其中make的版本要在3.81以上。

##编写JAVA代码
1. **建立一个工程，创建一个主Activity，我们要实现一个用本地代码写的加法运算。**

**MainActivity.java**
```java
public class MainActivity extends Activity {

    Button jniTestButton;
	TextView showTextview;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		jniTestButton = (Button)findViewById(R.id.button1);
		showTextview = (TextView)findViewById(R.id.textView1);
        
		jniTestButton.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				JNITest jniTest = new JNITest();
				showTextview.setText(String.valueOf(jniTest.add(1, 2)));
			}
		});
		
	}
}
```

**JNITest.java**
```java
public class JNITest {
    
	//静态方法表明程序开始运行时就会加载jnitest,static区的方法会先于onCreate方法执行如果程序中有多个类，而且如果JNITest这个类不是你应用程序的入口，那么JNITest（完整的名字是lib JNITest.so）这个库会在第一次使用JNITest这个类的时候加载。
	static{
		//加载自定义的so库
		System.loadLibrary("jnitest");
	}
	
	//本地方法，是通过(C/C++)实现的，这里只是声明
	public native int add(int a,int b);
}

```

***这两个java文件的功能就是创建一个按钮，在按钮按下时进行加法运算。具体的说明已经在代码中解释了，参照以上代码***

2.** 生成.h文件**

在C/C++文件编写之前，需要用javah这个工具生成相应的.h文件，然后根据生成的这个文件编写相应的C/C++代码。

在工程目录下执行：

```shell
javah -classpath cpath -d dir com.example.ndktest.JNITest
```

其中-classpath 表示类路径， -d 表示生成的.h文件存放目录，输入完成后我们会发现生成了一个.h文件：com_ example_ ndktest_JNITest.h

打开这个文件可以看到如下的代码：

```c
/* DO NOT EDIT THIS FILE - it is machine generated */
#include <jni.h>
/* Header for class com_example_ndktest_JNITest */

#ifndef _Included_com_example_ndktest_JNITest
#define _Included_com_example_ndktest_JNITest
#ifdef __cplusplus
extern "C" {
#endif
/*
 * Class:     com_example_ndktest_JNITest
 * Method:    add
 * Signature: (II)I
 */
JNIEXPORT jint JNICALL Java_com_example_ndktest_JNITest_add
  (JNIEnv *, jobject, jint, jint);

#ifdef __cplusplus
}
#endif
#endif
```

**说明：**

上面代码中的JNIEXPORT 和 JNICALL 是jni的宏，在android的jni中不需要，当然写上去也不会有错。
函数名比较长但是完全按照：java_pacakege_class_mathod 形式来命名。

也就是说：

TestNDK.java中stringTestNdk() 方法对应于 C/C++中的 
Java_com_blueeagle_example_testNDK_ stringTestNdk() 方法

这里为空是指除了JNIEnv *, jobject 这两个参数之外没有其他参数，JNIEnv*, jobject是所有jni函数必有的两个参数，分别表示jni环境和对应的java类（或对象）本身

##编写C/C++文件
直接用.h文件然后实现相应的方法就行了。

```c
/* DO NOT EDIT THIS FILE - it is machine generated */
#include <jni.h>
/* Header for class com_example_ndktest_JNITest */

#ifndef _Included_com_example_ndktest_JNITest
#define _Included_com_example_ndktest_JNITest
#ifdef __cplusplus
extern "C" {
#endif
/*
 * Class:     com_example_ndktest_JNITest
 * Method:    add
 * Signature: (II)I
 */

//需要自己给参数取名字，然后把方法实现,其余不动
JNIEXPORT jint JNICALL Java_com_example_ndktest_JNITest_add(JNIEnv *env,
    	jobject jo, jint ji1, jint ji2) {
	return ji1 + ji2;
}

#ifdef __cplusplus
}
#endif
#endif

```

##编译生成相应的库
1. 首先需要编写Android.mk的文件：在.c文件的同级目录下新建一个android.mk文件。

```c
#一个Android.mk文件首先必须定义好LOCAL_PATH变量，它用于在开发树中查找源文件。这里的宏函数由编译系统提供，用于返回当前包含
#Android.mk文件的路径
LOCAL_PATH:=$(call my-dir)

#CLEAR_VARS由编译系统提供，指定让GUN MAKEFILE为你清除许多LOCAL_xxx变量，除了LOCAL_PATH.这是必要的，
#因为所有的编译控制文件都在同一个GNU MAKE执行环境中，所有的变量都是全局的。
include $(CLEAR_VARS)

#库文件名,编译的目标对象，自己定义，编译系统会自动产生合适的前缀和后缀，生成.so文件
LOCAL_MODULE := jnitest

#原文件名称，要编译打包进模块中的C或C++源代码文件。不用在这里列出头文件和包含文件，
#因为编译系统将会自动为你找出依赖型的文件；仅仅列出直接传递给编译器的源代码文件就好
LOCAL_SRC_FILES := com_example_ndktest_JNITest.c

#BUILD_SHARED_LIBRARY表示编译生成共享库，是编译系统提供的变量，指向一个GNU Makefile脚本，负责收集自从上次调
#用'include $(CLEAR_VARS)'以来，定义在LOCAL_XXX变量中的所有信息，并且决定编译什么，如何正确地去做。
#还有 BUILD_STATIC_LIBRARY变量表示生成静态库：lib$(LOCAL_MODULE).a， BUILD_EXECUTABLE 表示生成可执行文件。
include $(BUILD_SHARED_LIBRARY)
```

2.进行编译，进入到工程根目录，输入ndk-build即可生成相应的库libs/armeabi/libjnitest.so

##在eclipse中重新编译工程，生成apk
重新编译工程，将so包导入工程apk包，即可以看到结果。