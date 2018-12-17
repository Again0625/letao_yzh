$(function () {
    // 准备模板引擎，发送ajax请求数据，通过模板引擎将数据动态渲染到页面
    var currentPage = 1; //当前页
    var pageSize = 5; //每页五条

    var currentId; //当前修改的用户Id
    var isDelete; //当前修改的状态

    render();

    function render() {

        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                // template(模板id，数据对象) 在模板总可以任意使用数据对象的所有属性
                var htmlStr = template('userTpl', info);
                $('tbody').html(htmlStr)

                // 分页插件测试
                // 根据返回的数据 实现动态渲染分页插件
                $('#paginator').bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    //添加页码点击事件
                    onPageClicked: function (a, b, c, page) {
                        // console.log(page);
                        //更新当前页
                        currentPage = page;
                        // 重新渲染页面
                        render();

                    }
                })
            }
        })
    }

    // 给所有的按钮，添加点击事件(通过事件委托注册)
    $('tbody').on('click', '.btn', function () {
        $('#userModal').modal('show');
        // 获取存储的id
        currentId = $(this).parent().data('id');
        // 1.启用状态，0.禁用状态 
        // 禁用按钮 ? 0 : 1
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    })
    // 点击模态框确认按钮, 发送请求, 完成启用禁用功能
    $('#submitBtn').click(function () {
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            data: {
                id: currentId,
                isDelete: isDelete,
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 修改成功
                    // 关闭模态框
                    $('#userModal').modal('hide');
                    // 重新渲染页面
                    render()
                }

            }
        })
    })


})