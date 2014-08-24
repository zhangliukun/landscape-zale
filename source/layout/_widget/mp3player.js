<div class="widget-wrap">
    <h3 class="widget-title">music</h3>
    <div class="widget">
    
    <input id="songInfo" type="text" value="我好想你,苏打绿(中间用，间隔)" style="width:260px; font-size:16px; height:20px; line-height:20px; vertical-align:middle" onkeydown="return SubmitKeyClick(this,event)"  />
    <button id="playGo" style="height:26px; line-height:26px; padding:0 10px; font-size:14px; vertical-align:middle">搜索歌曲</button>

    </div>
</div>

    <span id="songplay">我好想你,苏打绿</span>

<script type="text/javascript">
function play(name,artist,auto){
    var qwert = '<div style="width:300px; height:77px; background:url([url]http://zzhie.sinaapp.com/code/img.gif[/url]) no-repeat;"><embed style="width:300px; height:50px; margin:0px; padding:0px; float:right;"src="http://box.baidu.com/widget/flash/mbsong.swf?name='+name+'&artist='+artist+'&autoPlay='+auto+'" width="310" height="51" allowscriptaccess="never" allownetworking="internal" type="application/x-shockwave-flash" /></div>';
document.getElementById('songplay').innerHTML = qwert;
}
song = document.getElementById('songplay').innerHTML;
if(typeof(song) !='undefined' && song !=''){
    d = song.split(',');
    var a = '';
    if(d[2] ='undefined'){a = 'true';}
    if(d[2] !='undefined'){a = 'false';}
    play(d[0],d[1],a);
}
function playSong(songVal){
    if(typeof(songVal) !='undefined' && songVal !=''){
        var d = songVal.split('，');
        var a = '';
        if(d[2] ='undefined'){a = 'true';}
        if(d[2] !='undefined'){a = 'false';}
        play(d[0],d[1],a);
    }   
}
var playBtn = document.getElementById("playGo");
playBtn.onclick=function(){
    playSong(document.getElementById("songInfo").value);
}
function SubmitKeyClick(obj, evt) {
    evt = (evt) ? evt : ((window.event) ? window.event : "")
    keyCode = evt.keyCode ? evt.keyCode : (evt.which ? evt.which : evt.charCode);
    if (keyCode == 13) {
        playSong(document.getElementById("songInfo").value);
    }
}

</script>

<!--
//百度音乐api   [url]http://box.baidu.com/widget/flash/mbsong.swf?name=[/url]泪桥&artist=伍佰&autoPlay=true
//span,p,div,等都可以,ID 必须是songplay
//参数说明,第一个是歌曲名字,第二个是演唱者,最后一个如果为空则自动播放,不为空则手动播放
//参数间用中文逗号 ， 分隔   ,点击按钮或者回车都可以播放
-->

