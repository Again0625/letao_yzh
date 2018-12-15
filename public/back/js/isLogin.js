// 一进入页面,发送Ajax请求，获取当前用户的登录状态
// 1.如果当前用户登录了，让用户继续访问
// 2.如果当前用户没登录，将用户拦截到登录页
$.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
        console.log(info);
        if (info.error === 400) {
            //没登录就拦截到登录页
            location.href = 'login.html'
        }
        if (info.success) {
            console.log("当前用户已登录");

        }

    }
})