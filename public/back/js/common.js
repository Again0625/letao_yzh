



// //引入了nprogress.js文件后，就有了一个全局对象NProgress对象
// //开启进度条  测试
// NProgress.start();
// setTimeout(function () {

//     //关闭进度条
//     NProgress.done();
// }, 2000)
/*
需求：在第一个ajax发送的时候，开启进度条
在全部的ajax回来的时候，关闭进度条

ajax全局事件
    .ajaxComplete()  当每个ajax完成时，调用  (不管成功还是失败)
    .ajaxSuccess()   当ajax返回成功时调用
    .ajaxError()     当ajax返回失败时调用
    .ajaxSend()      当ajax发送前调用

    .ajaxStart()     当第一个ajax发送时调用
    .ajaxStop()      当全部的ajax请求完成时调用

// */
$(document).ajaxStart(function () {
    // 当第一个ajax发送时，开启进度条
    NProgress.start()
});
$(document).ajaxStop(function () {
    // 模拟网络延迟
    setTimeout(function () {
        //当全部的ajax请求完成时调用,关闭进度条
        NProgress.done()

    }, 500)
})

//等待页面dom结构加载后执行
$(function () {
    // 功能1：左侧二级导航切换效果
    $('.lt_aside .category').click(function () {
        $('.lt_aside .child').stop().slideToggle()
    })
    // 功能2：左侧菜单切换效果
    $('.icon_left').click(function () {
        $('.lt_aside').toggleClass("hidemenu")
        $('.lt_main').toggleClass("hidemenu")
        $('.lt_topbar').toggleClass("hidemenu")
    })
    // 功能3： 退出功能
    // 给右侧按钮注册点击事件，让模态框显示
    $('.icon_right').click(function () {
        // 让模态框显示
        $('#logoutModal').modal('show')
    })

    // 退出两种方式：
    // 1. 发ajax让后台, 销毁当前用户的登录状态, 实现退出   (推荐)
    // 2. 清除浏览器缓存, 将cookie清空, 本地存储的 sessionId 也没了
    // 给退出按钮添加点击事件，需要在退出时，销毁当前用户的登录状态
    $('#logoutBtn').click(function () {
        // 发送ajax请求， 让后端销毁当前用户的登录状态
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType: "json",
            success: function (info) {
                console.log(info)
                if (info.success) {
                    location.href = "login.html"
                }
            }
        })
    })
})