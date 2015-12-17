title: Android侧拉菜单SlidingMenu的配置和使用
date: 2014-09-25 18:17:00
categories: android
tags: [android,SlidingMenu,ActionBarSherlock,侧拉菜单,UI]
desctiption: 使用开源项目SlidingMenu侧拉菜单

---

![demo]({{BASE_PATH}}/image/demo.gif)

#前言
很多**android菜单**都做的很炫，其中用的做多的就数**侧拉菜单**了，比如说唱吧，以前的人人，当然也有很多客户端改版后可能用其他的了，但是**SlidingMenu**的确是一个很强大的工具。

<!--more-->

#环境配置
很多工具有炫丽的效果来吸引用户的眼球，但是这些炫丽的效果肯定需要一些代价，那就是很多代码的支持，这个项目页不例外，在配置环境时很有可能会遇到一系列问题，下面就写一下具体**配置的步骤**和**可能遇到的问题**。

##准备工作
- 首先去网上下载相应的依赖工程，这里主要下载在**github**上面的两个项目，一个是[**SlidingMenu**](https://github.com/jfeinstein10/SlidingMenu)，另外一个是[**ActionBarSherlock**](https://github.com/JakeWharton/ActionBarSherlock)。把这两个工程导入eclipse，其中在SlidingMenu导入eclipse后可以得到两个项目，一个是**exampleListActivity**，另外一个是**library**，这个library是作为前面一个工程的依赖包的。
- 具体如何将一个项目作为另一个项目的依赖呢？可以右击这个项目，然后选择属性，在android那一栏有一个**is Library**选项，勾选以后这个项目就能作为其他项目的依赖了。
- 然后将下载的**ActionBarSherlock**这个工程也添加到eclipse中来，将添加进来的工程也配置成一个**Library**，然后在**exampleListActivity**中添加这个依赖。

##依赖和版本统一
- 如果你的各个导入的项目的**API等级**不同的话在加载的时候就会报错，因此这时候最好将每个导入的文件的API等级换成一样的就行了。
- 如果你的各个导入的项目的**android-support-v4.jar**的版本不同的话也会报错，这时就需要手动将各个版本的jar包换成统一的。

##修改代码
- 打开在**Library**项目中的**SlidingFragmentActivity**这个类，并且添加以下的代码来声明这个类

```java
import com.actionbarsherlock.app.SherlockFragmentActivity;
```
- 然后进行替换代码，将这个文件内的

```java
class SlidingFragmentActivity extends FragmentActivity implements SlidingActivityBase
```
- 替换成下面这行

```java
public class SlidingFragmentActivity extends SherlockFragmentActivity implements SlidingActivityBase
```

##测试
如果不出意外的话，现在就可以运行侧拉菜单的示例程序了，示例程序只是一个大体的轮廓，具体的配置需要你手动去调整，下面这幅图就是一个使用SlidingMenu的应用的截图

![demo]({{BASE_PATH}}/image/android_demo.png)


#使用方法

##SlidingMenu常用属性设置
```java
menu.setMode(SlidingMenu.LEFT);//设置左滑菜单
menu.setTouchModeAbove(SlidingMenu.TOUCHMODE_FULLSCREEN);//设置滑动的屏幕范围，该设置为全屏区域都可以滑动
menu.setShadowDrawable(R.drawable.shadow);//设置阴影图片
menu.setShadowWidthRes(R.dimen.shadow_width);//设置阴影图片的宽度
menu.setBehindOffsetRes(R.dimen.slidingmenu_offset);//SlidingMenu划出时主页面显示的剩余宽度
menu.setBehindWidth(400);//设置SlidingMenu菜单的宽度
menu.setFadeDegree(0.35f);//SlidingMenu滑动时的渐变程度
menu.attachToActivity(this, SlidingMenu.SLIDING_CONTENT);//使SlidingMenu附加在Activity上
menu.setMenu(R.layout.menu_layout);//设置menu的布局文件
menu.toggle();//动态判断自动关闭或开启SlidingMenu
menu.showMenu();//显示SlidingMenu
menu.showContent();//显示内容
menu.setOnOpenListener(onOpenListener);//监听slidingmenu打开
//关于关闭menu有两个监听，简单的来说，对于menu close事件，一个是when,一个是after
menu.OnClosedListener(OnClosedListener);//监听slidingmenu关闭时事件
menu.OnClosedListener(OnClosedListener);//监听slidingmenu关闭后事件
//左右都可以划出SlidingMenu菜单只需要设置
menu.setMode(SlidingMenu.LEFT_RIGHT);属性，然后设置右侧菜单的布局文件
menu.setSecondaryShadowDrawable(R.drawable.shadowright);//右侧菜单的阴影图片
```

##使用Fragment实现SlidingMenu:   
1. 首先Activity继承自SlidingMenu包下的SlidingFragmentActivity
2. setContentView(R.layout.content_frame);//该layout为一个全屏的FrameLayout
3. setBehindContentView(R.layout.menu_frame);//设置SlidingMenu使用的布局，同样是一个全屏的FrameLayout
4. 设置SlidingMenu左侧菜单的Fragment

```java
setBehindContentView(R.layout.menu_frame);
FragmentTransaction t = this.getSupportFragmentManager().beginTransaction();  
leftMenuFragment = new MenuFragment();  
t.replace(R.id.menu_frame, leftMenuFragment);  
t.commit();  
```

MenuFragment其实就是一个Fragment，显示一个ListView
然后点击ListView的每一项的时候，通知Activity切换不同的Fragment为了看清效果，我们新建5个Frament，分别是Fragment1, Fragment2, Fragment3, Fragment4, Fragment5,在SlidingMenu中用ListView显示。

设置主页面显示的Fragment:
```java
if (savedInstanceState == null) {//== null的时候新建Fragment1  
contentFragment = new Fragment1();  
} else {//不等于null，直接get出来  
//不等于null，找出之前保存的当前Activity显示的Fragment  
contentFragment = getSupportFragmentManager().getFragment(savedInstanceState, "contentFragment");  
}  
//设置内容Fragment  
getSupportFragmentManager()  
.beginTransaction()  
.replace(R.id.content_frame, contentFragment)  
.commit();  
```

在Activity的onSaveInstanceState中保存当前显示的Fragment
getSupportFragmentManager().putFragment(outState, "contentFragment", contentFragment);

##设置ActionBar可以被点击
```java
getSupportActionBar().setHomeButtonEnabled(true);//actionbar主按键可以被点击
getSupportActionBar().setDisplayHomeAsUpEnabled(true);//显示向左的图标
setSlidingActionBarEnabled(false);//左右两侧slidingmenu的fragment是否显示标题栏
```

##切换主页面显示的Fragment
```java
public void switchContent(Fragment f) {
//给内容Fragment赋值，并在onSaveInstanceState时保存这个Fragment
contentFragment = f;
FragmentTransaction  t = getSupportFragmentManager().beginTransaction();
t.replace(R.id.content_frame, f);
t.commit();
sm.showContent();
```

##使用普通Activity实现SlidingMenu
```java
slidingMenu menu = new SlidingMenu(this);//直接new，而不是getSlidingMenu  
menu.setMode(SlidingMenu.LEFT);  
menu.setTouchModeAbove(SlidingMenu.TOUCHMODE_FULLSCREEN);  
menu.setShadowDrawable(R.drawable.shadow);  
menu.setShadowWidthRes(R.dimen.shadow_width);  
menu.setBehindOffsetRes(R.dimen.slidingmenu_offset);  
menu.setBehindWidth(400);//设置SlidingMenu菜单的宽度  
menu.setFadeDegree(0.35f);  
menu.attachToActivity(this, SlidingMenu.SLIDING_CONTENT);//必须调用  
menu.setMenu(R.layout.menu_layout_left);//就是普通的layout布局  
menu.setBehindCanvasTransformer(mTransformer);  
```
>相应SlidingMenu里的点击事件，因为SlidingMenu已经被包含在了Activity中了，所以直接findViewById(id),拿到view之后就可以进行相应的处理。

##更换SlidingMenu的动画
SlidingMenu支持左滑或者右滑时定义不同的动画，包括拉伸，缩放，旋转等动画。就是在滑动的过程中，SlidingMenu如何出现的动画。
动画使用也很简单

首先定义CanvasTransformer mTransformer变量:
```java
mTransformer = new CanvasTransformer() {  
@Override  
public void transformCanvas(Canvas canvas, float percentOpen) {  
    float scale = (float) (percentOpen*0.25 + 0.75);  
    canvas.scale(scale, scale, canvas.getWidth()/2, canvas.getHeight()/2);  
    }  
};  
```
然后将mTransformer对象设置给SlidingMenu即可，这个是缩放动画:
```java
private void initSlidUpCanvasTransformer() {  
    mTransformer = new CanvasTransformer() {  
    @Override  
    public void transformCanvas(Canvas canvas, float percentOpen) {  
        canvas.translate(0, canvas.getHeight()*(1-interp.getInterpolation(percentOpen)));  
    }};  
}  
  
private static Interpolator interp = new Interpolator() {  
    @Override  
    public float getInterpolation(float t) {  
    t -= 1.0f;  
    return t * t * t + 1.0f;  
    }  
};  
```
##拉伸动画:
```java
mTransformer = new CanvasTransformer() {  
    @Override  
    public void transformCanvas(Canvas canvas, float percentOpen) {  
    canvas.scale(percentOpen, 1, 0, 0);  
    }  
});  
```

#参考链接
[Installing SlidingMenu Android library and example](http://boroniatechnologies.com/installing-slidingmenu-android-library-and-example/)

http://blog.csdn.net/t12x3456/article/details/12798157