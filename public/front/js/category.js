// 左边导航模板渲染

$(function () {
    // 一进入页面，发送ajax请求，请求左侧分类数据
    $.ajax({
        type: "get",
        url: "/category/queryTopCategory",
        dataType: "json",
        success: function (info) {
            console.log(info);
            var htmlStr = template('leftTpl', info);
            $(".lt_category_left ul").html(htmlStr);

            // 调用方法， 默认渲染第一个一级分类 对应的 二级分类
            renderId(info.rows[0].id);
        }
    })

    // 添加一级分类切换效果（二级联动）（事件委托）
    $('.lt_category_left ul').on('click', 'a', function () {
        //链式编程：
        // $(this).addClass('current').parent().siblings().find('a').removeClass('current');
        // 1. 切换效果, 给自己加上 current 类, 移除其他 a 的current类
        $('.lt_category_left ul a').removeClass('current'); //先移除其他所有的current类
        $(this).addClass('current');

        // 2.渲染二级分类
        // 获取存储的一级分类的id
        var id = $(this).data("id");
        renderId(id);


    })

    // 根据一级分类的id完成二级分类的渲染
    function renderId(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('rightTpl', info);
                $('.lt_category_right ul').html(htmlStr);

            }
        })

    }

})