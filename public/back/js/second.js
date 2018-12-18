$(function () {
    var currentPage = 1; //当前页
    var pageSize = 5; //每页条数

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                var htmlStr = template('secondTpl', info);
                $('tbody').html(htmlStr);

                // 分页
                $('#paginator').bootstrapPaginator({
                    // 版本
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        // console.log(page);
                        currentPage = page;
                        // 重新渲染页面
                        render();


                    }
                })

            }
        })
    }

    // 点击按钮，显示模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show');

        // 显示模态框, 就立刻发送ajax请求, 请求一级分类的全部数据, 渲染下拉列表
        // 通过 page: 1, pageSize: 100, 获取数据, 模拟获取全部数据的接口

        $.ajax({
            type: 'get',
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                console.log(info);

                var htmlStr = template('dropdownTpl', info);
                $(".dropdown-menu").html(htmlStr)

            }
        })
    });

    // 3. 给下拉列表的 a 注册点击事件, 让下拉列表可选 (通过事件委托注册)
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取a的文本
        var txt = $(this).text();
        // 设置给按钮
        $('#dropdownText').text(txt);

        // 获取a存的id，一级分类id
        var id = $(this).data("id");

        // 赋值给隐藏域(input:hidden)
        $('[name="categoryId"]').val(id);

        //更新隐藏域的校验状态成  校验成功
        $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID")

    })

    // 4.调用fileupload方法完成文件上传初始化
    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data);
            var result = data.result; //后台返回的对象
            var picUrl = result.picAddr; //图片路径

            // 设置给img src
            $('#imgBox img').attr('src', picUrl);

            // 设置图片地址给隐藏域, 用于提交
            $('[name="brandLogo"]').val(picUrl);

            //更新隐藏域的校验状态成  校验成功
            $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        }
    });

    /*
     * 思路: 选择完图片完成预览时, 发送了一个异步文件上传请求, 真正预览时, 文件已经上传到了服务器
     * 使用插件步骤:
     *   1. 引包   注意依赖问题
     *   2. 指定   name后台接收的name值    data-url 指定后台接口地址
     *   3. 使用 fileupload 初始化, 配置 dataType 和 done 方法即可
     * */

    //  5.表单校验
    $('#form').bootstrapValidator({

        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],
        // 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 指定校验字段
        fields: {
            // 校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    });

    // 6. 阻止默认的提交, 通过ajax提交 (注册表单校验成功事件)
    $('#form').on('success.form.bv', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $("#form").serialize(),
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染页面
                    currentPage = 1;
                    render();

                    // 重置表单
                    $("#form").data("bootstrapValidator").resetForm(true);

                    // 由于下拉列表和图片不是表单元素,需要手动重置
                    $("#dropdownText").text("请选择一级分类");
                    $("#imgBox img").attr("src", "./images/none.png");
                }

            }
        })
    })




})