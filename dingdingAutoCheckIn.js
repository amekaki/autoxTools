let QQ = "xxx" //QQ号码
let pwd = 'xxx' //锁屏密码（锁屏需设置为数字密码）

events.observeNotification()    
events.on("notification", function(n) {
    notificationHandler(n)
});
function sendQQMsg(message){
    app.launchApp("QQ");
    app.startActivity({ 
        action: "android.intent.action.VIEW", 
        data:"mqq://im/chat?chat_type=wpa&version=1&src_type=web&uin=" + QQ, 
        packageName: "com.tencent.mobileqq", 
    });
    sleep(2000);
    id("input").findOne().setText(message)
    text("发送").findOne().click()
}

function CheckIn () {
    let Appname = ("钉钉");
    app.launchApp(Appname);
    var url_scheme = "dingtalk://dingtalkclient/page/link?url=https://attend.dingtalk.com/attend/index.html"

    var a = app.intent({
        action: "VIEW",
        data: url_scheme,
    });
    app.startActivity(a);
    sleep(3000);
    if (null != textMatches("下班打卡").clickable(true).findOne(1000)) {
        btn_clockin = textMatches("下班打卡").clickable(true).findOnce()
        btn_clockin.click()
        console.log("打卡")
    }else{
        click(device.width / 2, device.height * 0.560)
    }
}
notificationHandler = function(n) {
    var text = n.getText()
    console.log('receive'+text);

    if(!text){
        return
    }

    if (text==='开始钉钉打卡'){
        unlockIfNeed()
        sendQQMsg('已接收')
        CheckIn ()
    }

    if(text.includes("打卡·成功")){
        unlockIfNeed()
        sendQQMsg(text)
    }

    if(text.includes("QQ消息接收测试")){
        unlockIfNeed()
        sendQQMsg("QQ消息接收正常")
    }
}

function getDisplaySize (doNotForcePortrait) {
    let { width, height } = device;
    if (width == 0) {
        let metrics = context.getResources().getDisplayMetrics();
        width = metrics.widthPixels;
        height = metrics.heightPixels;
    }
    if (doNotForcePortrait)
        return [width, height]
    return [
        Math.min(width, height),
        Math.max(width, height)
    ];
}
function unlockIfNeed () {
    
    if (!device.isScreenOn()) {
        device.wakeUp();
        sleep(1000);
        let [width, height] = getDisplaySize();
        swipe(width / 2, height * 0.6, width / 2, 0, 1000);
    }
    if (!isLocked()) {
        return;
    }
    enterPwd(pwd);
}

function isLocked () {
    var km = context.getSystemService(android.content.Context.KEYGUARD_SERVICE);
    return km.isKeyguardLocked() && km.isKeyguardSecure();
}

function enterPwd (pwd) {
    if (text(0).clickable(true).exists()) {
        for (var i = 0; i < pwd.length; i++) {
            a = pwd.charAt(i)
            sleep(200);
            text(a).clickable(true).findOne().click()
        }
    } else {
        for (var i = 0; i < pwd.length; i++) {
            a = pwd.charAt(i)
            sleep(200);
            desc(a).clickable(true).findOne().click()
        }
    }
}