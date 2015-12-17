title: Android自定义ActionBar
date: 2015-04-22 23:27:00
categories: android
tags: [android,actionBar,UI]
desctiption: Android自定义ActionBar

---


##简介
Action Bar是一种新增的导航栏功能，在Android 3.0以后加入到系统的API中，它标识了用户当前操作界面的位置，并提供了额外的用户动作，界面导航等功能。

##优点
它提供了一种全局统一的UI界面，使得用户在使用任何一款软件时都懂得如何操作，并且ActionBar还可以自动适应各种不同大小的屏幕。
一般action提供了图标及overflow按钮。overflow按钮可以在actionbar中的组件放不下时收回overflow中，当让，也可以手动指定哪些不被收入overflow中。

<!--more-->

##修改ActionBar
详细的修改ActionBar中的图标，标题，添加按钮等操作见官方API，也可以看这一篇[博客](http://blog.csdn.net/yuzhiboyi/article/details/32709833)，觉得写的挺不错的。里面几乎将官方网站关于ActionBar的内容全部解释了一遍。

##自定义ActionBar
在用ActionBar时我总觉得按照官网上的修改方法太过于复杂麻烦，还不利于个性化。让人头疼。后来发现有一种方式能方便快捷的使用自己定义的ActionBar

###创建样式文件

- 在values文件夹中创建一个theme.xml文件，里面定义自己的样式文件如下:

```xml
<resources xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- ActionBar样式 -->
    <style name="MyActionBar" parent="android:Theme.Light">
        <item name="android:windowTitleSize">46dip</item>
        <item name="android:windowTitleBackgroundStyle">@style/myActionBarBackground</item>
        <item name="android:windowBackground">@color/white</item>
    	<item name="android:textColor">@color/white</item>
    </style>
</resources>
```

- 再在styles.xml文件中加入引用的样式:

```xml
<style name = "myActionBarBackground">
        <item name="android:background">@color/this.green</item>
</style>
```

###在系统中应用主题

- 然后在AndroidMainifest.xml文件中应用自己定义的xml:

```xml
<application
        android:allowBackup="true"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/MyActionBar" >
```

- 这样，你自己定义的主题就产生了，里面包含你对ActionBar的一些配置。当然，现在还没有定制化自己的ActionBar，只是将主题中的颜色文字大小等风格制定了。要真正达到自定义的效果，还要自己写一个ActionBar的样式xml文件。我自己写的一个actionBar.xml文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" >

    <Button
        android:id="@+id/actionbar_back_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerVertical="true"
        android:layout_alignParentLeft="true"
        android:background="@drawable/btn_back_normal"/>

    <TextView
        android:id="@+id/actionbar_title_textview"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="title" />
    
    
    <Button
        android:id="@+id/actionbar_home_button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerVertical="true"
        android:layout_alignParentRight="true"
        android:background="@drawable/home" />

</RelativeLayout>
```

###在Activity中加载自定义ActionBar样式

- 这里面定义了ActionBar中有两个按钮和一个标题文本。最后只要你在Activity中应用就可以显示你自己定义的ActionBar了,在Activity中的应用如下：

```java
 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        requestWindowFeature(Window.FEATURE_CUSTOM_TITLE);
        setContentView(R.layout.activity_login);
        getWindow().setFeatureInt(Window.FEATURE_CUSTOM_TITLE, R.layout.layout_actionbar);

    }
```

- 最后就能显示出你自己定义的ActionBar了，对于里面的组件就像平常定义的组件一样使用即可。再上一张效果图，这里面我将左边和右边ActionBar的按钮设置为不可见了，所以只留了一个中间的登录文本显示框。


![ActionBar]({{BASE_PATH}}/image/ActionBar.png)
