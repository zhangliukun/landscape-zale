title: AngularJS
date: 2014-12-06 00:32:00
categories: web前端
tags: [AngularJS,web前端,javascript]
desctiption: 一篇自己对java NIO的理解

---

##AngularJS简介

AngularJS 是一个 JavaScript 框架。它可通过 script 标签添加到 HTML 页面。

AngularJS 通过 指令 扩展了 HTML，且通过 表达式 绑定数据到 HTML。

AngularJS 是以一个 JavaScript 文件形式发布的，可通过 script 标签添加到网页中：

<!--<script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script> -->

**我们建议把脚本放在 <body> 元素的底部。这会提高网页加载速度，因为 HTML 加载不受制于脚本加载。**

<!--more-->

##AngularJS 扩展了 HTML
AngularJS 通过 ng-directives 扩展了 HTML。

**ng-app** 指令定义一个 AngularJS 应用程序。

**ng-model** 指令把元素值（比如输入域的值）绑定到应用程序。

**ng-bind** 指令把应用程序数据绑定到 HTML 视图。

例：
```javascript
<!DOCTYPE html>
<html>
<body>

<div ng-app="">
  <p>在输入框中尝试输入：</p>
  <p>姓名：<input type="text" ng-model="name"></p>
  <p ng-bind="name"></p>
</div>

<script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script>

</body>
</html>
```

实例讲解：

当网页加载完毕，AngularJS 自动开启。

ng-app 指令告诉 AngularJS，div 元素是 AngularJS 应用程序 的"所有者"。

ng-model 指令把输入域的值绑定到应用程序变量 name。

ng-bind 指令把应用程序变量 name 绑定到某个段落的 innerHTML。

**如果您移除了 ng-app 指令，HTML 将直接把表达式显示出来，不会去计算表达式的结果。**

##AngularJS 表达式
AngularJS 表达式写在双大括号内：{{ expression }}。

AngularJS 表达式把数据绑定到 HTML，这与 ng-bind 指令有异曲同工之妙。

AngularJS 将在表达式书写的位置"输出"数据。

AngularJS 表达式 很像 JavaScript 表达式：它们可以包含文字、运算符和变量。

实例 {{ 5 + 5 }} 或 {{ firstName + " " + lastName }}

##AngularJS 对象
AngularJS 对象就像 JavaScript 对象：

```javascript
<div ng-app="" ng-init="person={firstName:'John',lastName:'Doe'}">

<p>姓为 {{ person.lastName }}</p>

</div> 
```

##AngularJS 数组
AngularJS 数组就像 JavaScript 数组：
```javascript
<div ng-app="" ng-init="points=[1,15,19,2,40]">

<p>第三个值为 {{ points[2] }}</p>

</div> 
```

##AngularJS 指令
AngularJS 通过被称为 指令 的新属性来扩展 HTML

AngularJS 指令是扩展的 HTML 属性，带有前缀 ng-。

ng-app 指令初始化一个 AngularJS 应用程序。

ng-init 指令初始化应用程序数据。

ng-model 指令把应用程序数据绑定到 HTML 元素。

**一个网页可以包含多个运行在不同元素中的 AngularJS 应用程序。**

##数据绑定
{{ firstName }} 是通过 ng-model="firstName" 进行同步。

在下一个实例中，两个文本域是通过两个 ng-model 指令同步的：
```javascript
<div ng-app="" ng-init="quantity=1;price=5">

<h2>价格计算器</h2>

数量： <input type="number" ng-model="quantity">
价格： <input type="number" ng-model="price">

<p><b>总价：</b> {{ quantity * price }}</p>

</div>
```
**使用 ng-init 不是很常见。您将在控制器一章中学习到一个更好的初始化数据的方式**

##重复 HTML 元素

```javascript
ng-repeat 指令会重复一个 HTML 元素等于读出数组中所有的值

<div ng-app="" ng-init="names=['Jani','Hege','Kai']">
  <p>使用 ng-repeat 来循环数组</p>
  <ul>
    <li ng-repeat="x in names">
      {{ x }}
    </li>
  </ul>
<div>
```

##AngularJS 控制器
AngularJS 应用程序被控制器控制。

ng-controller 指令定义了应用程序控制器。

控制器是 JavaScript 对象，由标准的 JavaScript 对象的构造函数 创建。

控制器的 $scope 是控制器所指向的应用程序 HTML 元素。

```javascript
<div ng-app="" ng-controller="personController">

名： <input type="text" ng-model="person.firstName"><br>
姓： <input type="text" ng-model="person.lastName"><br>
<br>
姓名： {{person.firstName + " " + person.lastName}}

</div>

<script>
function personController($scope) {
    $scope.person = {
        firstName: "John",
        lastName: "Doe"
    };
}
</script>
```

实例讲解：

AngularJS 应用程序由 ng-app 定义。应用程序在 <div> 内运行。

ng-controller 指令把控制器命名为 object。

函数 personController 是一个标准的 JavaScript 对象的构造函数。

控制器对象有一个属性：$scope.person。

person 对象有两个属性：firstName 和 lastName。

ng-model 指令绑定输入域到控制器的属性（firstName 和 lastName）。

##控制器属性
控制器也可以把函数作为对象属性
```javascript
<div ng-app="" ng-controller="personController">

名： <input type="text" ng-model="person.firstName"><br>
姓： <input type="text" ng-model="person.lastName"><br>
<br>
姓名： {{person.fullName()}}

</div>

<script>
function personController($scope) {
    $scope.person = {
        firstName: "John",
        lastName: "Doe",
        fullName: function() {
            var x;
            x = $scope.person;
            return x.firstName + " " + x.lastName;
        }
    };
}
</script> 
```


##控制器方法
控制器也可以带有方法
```javascript
<div ng-app="" ng-controller="personController">

名： <input type="text" ng-model="person.firstName"><br>
姓： <input type="text" ng-model="person.lastName"><br>
<br>
姓名： {{fullName()}}

</div>

<script>
function personController($scope) {
    $scope.person = {
        firstName: "John",
        lastName: "Doe",
     };
     $scope.fullName = function() {
         var x;
         x = $scope.person;
         return x.firstName + " " + x.lastName;
     };
}
</script> 
```

##外部文件中的控制器
在大型的应用程序中，通常是把控制器存储在外部文件中。


```javascrt

<div ng-app="" ng-controller="personController">

名： <input type="text" ng-model="person.firstName"><br>
姓： <input type="text" ng-model="person.lastName"><br>
<br>
姓名： {{person.firstName + " " + person.lastName}}

</div>

<script src="personController.js"></script> 
```

##AngularJS 过滤器
AngularJS 过滤器可用于转换数据：

过滤器     描述

currency     格式化数字为货币格式。

filter 	从数组项中选择一个子集。

lowercase 	格式化字符串为小写。

orderBy 	根据某个表达式排列数组。

uppercase 	格式化字符串为大写。


uppercase 过滤器格式化字符串为大写：

```javascript
<div ng-app="" ng-controller="personController">

<p>姓名为 {{ person.lastName | 'lowercase' }}</p>

</div> 
```

###过滤输入
输入过滤器可以通过一个管道字符（|）和一个过滤器添加到指令中，该过滤器后跟一个冒号和一个模型名称。

filter 过滤器从数组中选择一个子集：



##AngularJS XMLHttpRequest
$http 是 AngularJS 中的一个核心服务，用于读取远程服务器的数据。

###AngularJS $http

AngularJS $http 是一个用于读取web服务器上数据的服务。

$http.get(url) 是用于读取服务器数据的函数。 

```javascript
<div ng-app="" ng-controller="customersController">

<ul>
  <li ng-repeat="x in names">
    {{ x.Name + ', ' + x.Country }}
  </li>
</ul>

</div>

<script>
function customersController($scope,$http) {
    $http.get("http://www.w3cschool.cc/try/angularjs/data/Customers_JSON.php")
    .success(function(response) {$scope.names = response;});
}
</script> 
```

应用解析:

AngularJS 应用通过 ng-app 定义。应用在 <div> 中执行。

ng-controller 指令设置了 controller 对象 名。

函数 customersController 是一个标准的 JavaScript 对象构造器。

控制器对象有一个属性: $scope.names。

$http.get() 从web服务器上读取静态 JSON 数据。

服务器数据文件为：  http://www.w3cschool.cc/try/angularjs/data/Customers_JSON.php。

当从服务端载入 JSON 数据时，$scope.names 变为一个数组。

**以上代码也可以用于读取数据库数据。**

##AngularJS 表格

排序显示
```javascript
<!DOCTYPE html>
<html>
<head>
<style>
table, th , td  {
  border: 1px solid grey;
  border-collapse: collapse;
  padding: 5px;
}
table tr:nth-child(odd)    {
  background-color: #f1f1f1;
}
table tr:nth-child(even) {
  background-color: #ffffff;
}
</style>
</head>

<body>

<div ng-app="" ng-controller="customersController"> 

<table>
  <tr ng-repeat="x in names | orderBy : 'Country'">
    <td>{{ x.Name }}</td>
    <td>{{ x.Country }}</td>
  </tr>
</table>

</div>

<script>
function customersController($scope,$http) {
	$http.get("http://www.w3cschool.cc/try/angularjs/data/Customers_JSON.php")
  .success(function(response) {$scope.names = response;});
}
</script>

<script src="http://apps.bdimg.com/libs/angular.js/1.2.15/angular.min.js"></script>

</body>
</html>
```

##AngularJS HTML DOM

AngularJS 有自己的 HTML 属性指令。

###ng-disabled 指令

```javascript
<div ng-app="">

<p>
<button ng-disabled="mySwitch">点我！</button>
</p>

<p>
<input type="checkbox" ng-model="mySwitch">按钮
</p>

</div> 
```

###ng-show 指令

```javascript
<div ng-app="">

<p ng-show="true">我是可见的。</p>

<p ng-show="false">我是不可见的。</p>

</div> 
```
您可以使用一个评估为 true or false 的表达式（比如 ng-show="hour < 12"）来隐藏和显示 HTML 元素。

##AngularJS HTML 事件
AngularJS 有自己的 HTML 事件指令。

###ng-click 指令
```javascript
<div ng-app="" ng-controller="myController">

<button ng-click="count = count + 1">点我！</button>

<p>{{ count }}</p>

</div>
```

###隐藏 HTML 元素
ng-hide 指令用于设置应用的一部分 不可见 。

ng-hide="true" 让 HTML 元素 不可见。

ng-hide="false" 让元素可见。

ng-show 指令可用于设置应用中的一部分可见 。

ng-show="false" 可以设置 HTML 元素 不可见。

ng-show="true" 可以以设置 HTML 元素可见。

```javascript
<div ng-app="" ng-controller="personController">

<button ng-click="toggle()">隐藏/显示</button>

<p ng-hide="myVar">
名: <input type="text" ng-model="person.firstName"><br>
姓: <input type="text" ng-model="person.lastName"><br>
<br>
姓名: {{person.firstName + " " + person.lastName}}
</p>

</div>

<script>
function personController($scope) {
    $scope.person = {
        firstName: "John",
        lastName: "Doe"
    };
    $scope.myVar = false;
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
    };
}
</script> 
```

##AngularJS 模块

模块定义了您的应用程序。

所有的控制器都应该属于一个模块。

模块保持全局命名空间中的整洁。

###AngularJS 模块实例

在本实例中，"myApp.js" 包含了一个应用程序模块定义，"myCtrl.js" 包含了一个控制器：

```javascript
<!DOCTYPE html>
<html>
<body>

<div ng-app="myApp" ng-controller="myCtrl">
{{ firstName + " " + lastName }}
</div>

<script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script>

<script src="myApp.js"></script>
<script src="myCtrl.js"></script>

</body>
</html> 
```

使用一个由 模块 替代的控制器：

```javascript
<!DOCTYPE html>
<html>
<head>
<script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script>
</head>

<body>

<div ng-app="myApp" ng-controller="myCtrl">
{{ firstName + " " + lastName }}
</div>

<script>
var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
</script>

</body>
</html> 

###模块定义应放置在何处？
对于 HTML 应用程序，通常建议把所有的脚本都放置在 <body> 元素的最底部。

这会提高网页加载速度，因为 HTML 加载不受制于脚本加载。

在上面的多个 AngularJS 实例中，您将看到 AngularJS 库是在文档的 <head> 区域被加载。

在上面的实例中，AngularJS 在 <head> 元素中被加载，因为对 angular.module 的调用只能在库加载完成后才能进行。

另一个解决方案是在 <body> 元素中加载 AngularJS 库，但是必须放置在您的 AngularJS 脚本前面

```javascript
 <!DOCTYPE html>
<html>
<body>

<div ng-app="myApp" ng-controller="myCtrl">
{{ firstName + " " + lastName }}
</div>

<script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script>

<script>
var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
</script>

</body>
</html> 
```

###AngularJS 应用程序文件
现在您已经知道模块是什么以及它们是如何工作的，现在您可以尝试创建您自己的应用程序文件。

您的应用程序至少应该有一个模块文件，一个控制器文件。

首先，创建模块文件 "myApp.js"：

```javascript
var app = angular.module("myApp", []); 
```
然后，创建控制器文件。本实例中是 "myCtrl.js"：

```javascript
app.controller("myCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
```

最后，编辑您的 HTML 页面：

```javascript
<!DOCTYPE html>
<html>
<body>

<div ng-app="myApp" ng-controller="myCtrl">
{{ firstName + " " + lastName }}
</div>

<script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script>

<script src="myApp.js"></script>
<script src="myCtrl.js"></script>

</body>
</html> 
```
##HTML 表单

```javascript
<div ng-app="" ng-controller="formController">
  <form novalidate>
    First Name:<br>
    <input type="text" ng-model="user.firstName"><br>
    Last Name:<br>
    <input type="text" ng-model="user.lastName">
    <br><br>
    <button ng-click="reset()">RESET</button>
  </form>
  <p>form = {{user}}</p>
  <p>master = {{master}}</p>
</div>

<script>
function formController ($scope) {
    $scope.master = {firstName: "John", lastName: "Doe"};
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();
};
</script> 
```

**HTML 属性 novalidate 用于禁用浏览器的默认验证**

##AngularJS 输入验证
AngularJS 表单和控件可以提供验证功能，并对用户输入的非法数据进行警告。

**     客户端的验证不能确保用户输入数据的安全，所以服务端的数据验证也是必须的。**

```java
 <!DOCTYPE html>
<html>

<body>
<h2>Validation Example</h2>

<form  ng-app=""  ng-controller="validateCtrl"
name="myForm" novalidate>

<p>Username:<br>
  <input type="text" name="user" ng-model="user" required>
  <span style="color:red" ng-show="myForm.user.$dirty && myForm.user.$invalid">
  <span ng-show="myForm.user.$error.required">Username is required.</span>
  </span>
</p>

<p>Email:<br>
  <input type="email" name="email" ng-model="email" required>
  <span style="color:red" ng-show="myForm.email.$dirty && myForm.email.$invalid">
  <span ng-show="myForm.email.$error.required">Email is required.</span>
  <span ng-show="myForm.email.$error.email">Invalid email address.</span>
  </span>
</p>

<p>
  <input type="submit"
  ng-disabled="myForm.user.$dirty && myForm.user.$invalid ||
  myForm.email.$dirty && myForm.email.$invalid">
</p>

</form>

<script src="//apps.bdimg.com/libs/angular.js/1.2.15/angular.min.js"></script>
<script>
function validateCtrl($scope) {
    $scope.user = 'John Doe';
    $scope.email = 'john.doe@gmail.com';
}
</script>

</body>
</html> 
```

##AngularJS Bootstrap

AngularJS 的首选样式表是 Twitter Bootstrap， Twitter Bootstrap 是目前最受欢迎的前端框架。

###Bootstrap

你可以在你的 AngularJS 应用中加入 Twitter Bootstrap，你可以在你的 <head>元素中添加如下代码:
```javascript
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
```
如果站点在国内，建议使用百度静态资源库的Bootstrap，代码如下：
```javascript
<link rel="stylesheet" href="//apps.bdimg.com/libs/bootstrap/3.2.0/css/bootstrap.min.css">
```
以下是一个完整的 HTML 实例, 使用了 AngularJS 指令和 Bootstrap 类。

HTML 代码
```javascript
<html ang-app="">
<head>
<link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.2.0/css/bootstrap.min.css">
</head>

<body ng-controller="userController">
<div class="container">

<h3>Users</h3>

<table class="table table-striped">
  <thead><tr>
    <th>Edit</th>
    <th>First Name</th>
    <th>Last Name</th>
  </tr></thead>
  <tbody><tr ng-repeat="user in users">
    <td>
      <button class="btn" ng-click="editUser(user.id)">
      <span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit
      </button>
    </td>
    <td>{{ user.fName }}</td>
    <td>{{ user.lName }}</td>
  </tr></tbody>
</table>

<hr>
<button class="btn btn-success" ng-click="editUser('new')">
  <span class="glyphicon glyphicon-user"></span> Create New User
</button>
<hr>

<h3 ng-show="edit">Create New User:</h3>
<h3 ng-hide="edit">Edit User:</h3>

<form class="form-horizontal">
<div class="form-group">
  <label class="col-sm-2 control-label">First Name:</label>
  <div class="col-sm-10">
    <input type="text" ng-model="fName" ng-disabled="!edit" placeholder="First Name">
  </div>
</div>
<div class="form-group">
  <label class="col-sm-2 control-label">Last Name:</label>
  <div class="col-sm-10">
    <input type="text" ng-model="lName" ng-disabled="!edit" placeholder="Last Name">
  </div>
</div>
<div class="form-group">
  <label class="col-sm-2 control-label">Password:</label>
  <div class="col-sm-10">
    <input type="password" ng-model="passw1" placeholder="Password">
  </div>
</div>
<div class="form-group">
  <label class="col-sm-2 control-label">Repeat:</label>
  <div class="col-sm-10">
    <input type="password" ng-model="passw2" placeholder="Repeat Password">
  </div>
</div>
</form>

<hr>
<button class="btn btn-success" ng-disabled="error || incomplete">
  <span class="glyphicon glyphicon-save"></span> Save Changes
</button>
</div>

<script src = "http://apps.bdimg.com/libs/angular.js/1.2.15/angular.min.js"></script>
<script src = "myUsers.js"></script>
<button ng-click="clear()">清除</button>
</p>

<p>剩下的字符数：<span ng-bind="left()"></span></p>

</div>

<script src="myTodoApp.js"></script>
<script src="myTodoCtrl.js"></script> 
```
应用程序文件 "myTodoApp.js"：

```javascript
var app = angular.module("myTodoApp", []); 
```

控制器文件 "myTodoCtrl.js"：

```javascript
app.controller("myTodoCtrl", function($scope) {
    $scope.message = "";
    $scope.left  = function() {return 100 - $scope.message.length;};
    $scope.clear = function() {$scope.message="";};
    $scope.save  = function() {$scope.message="";};
}); 
```

HTML 页面中的一个 <div>，指向 ng-app="myTodoApp" 和 ng-controller="myTodoCtrl"：
```javascript
<div ng-app="myTodoApp" ng-controller="myTodoCtrl">
```

一个 ng-model 指令，绑定一个 textarea 到控制器变量 message：
```javascript
<textarea ng-model="message" cols="40" rows="10"></textarea>
```
两个 ng-click 事件，调用控制器函数 clear() 和 save()：
```javascript
<button ng-click="save()">保存</button>
<button ng-click="clear()">清除</button>
```
一个 ng-bind 指令，绑定控制器函数 left() 到一个 <span>，字符会向左对齐显示：
```javascript
剩下的字符数：<span ng-bind="left()"></span>
```

两个应用程序库被添加到 HTML 页面：
```javascript
<script src="myTodoApp.js"></script>
<script src="myTodoCtrl.js"></script>
```


***[更多AngularJS参考手册](http://www.w3cschool.cc/angularjs/angularjs-reference.html)***
</body>
</html>

```

###Bootstrap 类解析

```javascript
元素        Bootstrap 类       定义
<div>       container           内容容器
<table>   table               表格
<table>   table-striped       带条纹背景的表格
<button>  btn               按钮
<button>  btn-success       成功按钮
<span>      glyphicon           字形图标
<span>      glyphicon-pencil  铅笔图标
<span>      glyphicon-user    用户图标
<span>      glyphicon-save    保存图标
<form>      form-horizontal   水平表格
<div>     form-group        表单组
<label>   control-label     控制器标签
<label>   col-sm-2          跨越 2 列
<div>     col-sm-10         跨越 10 列

```


###JavaScript 代码



```javascript
function userController($scope) {
$scope.fName = '';
$scope.lName = '';
$scope.passw1 = '';
$scope.passw2 = '';
$scope.users = [
{id:1, fName:'Hege',  lName:"Pege" },
{id:2, fName:'Kim',   lName:"Pim" },
{id:3, fName:'Sal',   lName:"Smith" },
{id:4, fName:'Jack',  lName:"Jones" },
{id:5, fName:'John',  lName:"Doe" },
{id:6, fName:'Peter', lName:"Pan" }
];
$scope.edit = true;
$scope.error = false;
$scope.incomplete = false;

$scope.editUser = function(id) {
  if (id == 'new') {
    $scope.edit = true;
    $scope.incomplete = true;
    $scope.fName = '';
    $scope.lName = '';
    } else {
    $scope.edit = false;
    $scope.fName = $scope.users[id-1].fName;
    $scope.lName = $scope.users[id-1].lName;
  }
};

$scope.$watch('passw1',function() {$scope.test();});
$scope.$watch('passw2',function() {$scope.test();});
$scope.$watch('fName', function() {$scope.test();});
$scope.$watch('lName', function() {$scope.test();});

$scope.test = function() {
  if ($scope.passw1 !== $scope.passw2) {
    $scope.error = true;
    } else {
    $scope.error = false;
  }
  $scope.incomplete = false;
  if ($scope.edit && (!$scope.fName.length ||
  !$scope.lName.length ||
  !$scope.passw1.length || !$scope.passw2.length)) {
       $scope.incomplete = true;
  }
};

}
```

###JavaScript 代码解析

```javascript
Scope 属性     用途
$scope.fName  模型变量 (用户名)
$scope.lName  模型变量 (用户姓)
$scope.passw1   模型变量 (用户密码 1)
$scope.passw2   模型变量 (用户密码 2)
$scope.users  模型变量 (用户的数组)
$scope.edit   当用户点击创建用户时设置为true。
$scope.error  如果 passw1 不等于 passw2 设置为 true
$scope.incomplete   如果每个字段都为空(length = 0)设置为 true
$scope.editUser   设置模型变量
$scope.watch  监控模型变量
$scope.test   验证模型变量的错误和完整性

```

##AngularJS Include（包含）
使用 AngularJS, 你可以在 HTML 中包含 HTML 文件。

###服务端包含

大部分web服务器支持服务端脚本的包含 (SSI：Server Side Includes)。

使用 SSI, 你可以在HTML页面发送至浏览器前包含 HTML。
PHP 实例
```php
<?php require("navigation.php"); ?>
```

###客户端包含

客户端在 HTML 中使用 JavaScript 有多种方式可以包含 HTML 文件。

通常我们使用 http 请求 (AJAX) 从服务端获取数据，返回的数据我们可以通过 使用 innerHTML 写入到 HTML 元素中。 


###AngularJS 包含

使用 AngularJS, 你可以使用 ng-include 指令来包含 HTML 内容:
实例
```javascript
<body>

<div class="container">
  <div ng-include="'myUsers_List.htm'"></div>
  <div ng-include="'myUsers_Form.htm'"></div>
</div>
```
</body>

##AngularJS 应用程序实例

###Html文件

```javascript
 <div ng-app="myTodoApp" ng-controller="myTodoCtrl">

<h2>我的笔记</h2>

<p><textarea ng-model="message" cols="40" rows="10"></textarea></p>

<p>
<button ng-click="save()">保存</button>