$(function () {
    var currentPage = 1; //当前页
    var pageSize = 5; //每页条数

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('firstTpl', info);
                $('tbody').html(htmlStr);

                // 分页
                $("#paginator").bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    currentPage: info.page, //当前页
                    totalPages: Math.ceil(info.total / info.size), //总页数
                    onPageClicked: function (a, b, c, page) {
                        console.log(page);
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    // 给添加按钮，注册点击事件，显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show');
    })
    // 校验
    $('#form').bootstrapValidator({
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryName: {
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    })

    // 阻止默认的提交，通过ajax提交
    $('#form').on('success.form.bv', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {

                    $('#addModal').modal('hide');
                    //当前页
                    currentPage = 1;
                    // 重新渲染当前页
                    render();
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })
    // //重置表单，并且会隐藏所有的错误提示和图标


})