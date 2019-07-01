layui.config({
    base: '/grade-admin/static/utils/'
});

let useArr = [
    'jquery',
    'table',
    'form',
    'admin',
    'mtAjax',
    'layer',
    'mtLocalStorage',
    'heightLight'];

layui.use(useArr, function () {
    var $ = layui.jquery;
    var mtAjax = layui.mtAjax;
    var layer = layui.layer;
    var table = layui.table;
    var mtLocalStorage = layui.mtLocalStorage;
    var heightLight = layui.heightLight;
    var form = layui.form;

    var data = {
        table_teacherList: null,
        layerIndex_addTeacher_panel:null,
        layerIndex_editTeacher_panel:null,
        isAddOrEdit:0,// 1:add 2:edit
    };

    init();


    function init() {
        // 初始化教师列表
        init_teacherList();
        // 打开添加教师页面
        $(".add-teacher-btn").click(open_addTeacherPanel);
        // 绑定事件 - 添加面板 - 添加按钮
        $(".add-course-panel .submit").click(addCoursePanelSubmitClick);
        // 绑定事件 - 搜索按钮
        $(".search-teacher-btn").click(searchTeacherBtnClick);
        // 绑定事件 - 列表编辑按钮
        // 成绩走向按钮点击事件
        $("body").delegate(".icon-edit", "click", editBtnClick);
        // 搜索框被清空时的事件
        $("input[name='keyword']").bind("input propertychange", ()=>{
            if($("input[name='keyword']").val()===""){ searchTeacherBtnClick();}
        });
        // 搜索框回车事件
        $("input[name='keyword']").keypress((e)=>{
            if (e.which === 13) { searchTeacherBtnClick(); }
        });
        // 绑定事件 - 添加面板 - 添加按钮
        $(".add-course-panel .clear").click(()=>{
            $(".add-course-panel input").val("");
        });
    }

    function editBtnClick() {
        let id = $(this).parents("tr").find("td[data-field='id']").find('div').html();
        // 根据ID查询相关信息
        mtAjax.get({
            url:'admin/teacher/find-teacher-by-id',
            data:{id:id},
            fullSuccess:function (res) {
                console.log(res);
                // 数据回显
                $("input[name='teacherName']").val(res.teaName);
                $("input[name='teacherNo']").val(res.teaNo);
                $("#id").val(res.id);
                // 设置编辑标识
                data.isAddOrEdit = 2;
                // 弹出页面
                data.layerIndex_editTeacher_panel = layer.open({
                    title: "修改教师信息",
                    type: 1,
                    content: $(".add-course-panel"),
                    area: '600px',
                    // offset: ['150px', width],
                    cancel: function (index, layero) {
                        layer.close(index);
                    }
                })
            }
        });
    }

    function searchTeacherBtnClick() {
        var param = $("input[name='keyword']").val();
        data.table_teacherList.reload({
            where:{
                param:param
            },
            done:function (res) {
                $(".fr span").html(res.count);
                // 高亮显示
                // 高亮查询结果返回值
                $("td[data-field='teaNo']").each(function () {
                    heightLight.setKey2Light(param, $(this));
                });
                // 高亮查询结果返回值
                $("td[data-field='teaName']").each(function () {
                    heightLight.setKey2Light(param, $(this));
                });
            }
        });
    }



    function addCoursePanelSubmitClick() {
        // 获取信息 - 校验信息正误
        var teaName = $("input[name='teacherName']").val();
        var teaNo = $("input[name='teacherNo']").val();
        var teaPwd = $("input[name='teacherPwd']").val();
        var teaPwdR = $("input[name='teacherPwdR']").val();

        if(teaName === null || teaName === ''){
            layer.msg("教师姓名不能为空,请校验后重试");
            return;
        }
        if(teaNo === null || teaNo === ''){
            layer.msg("教师编号不能为空,请校验后重试");
            return;
        }

        if(data.isAddOrEdit === 1){
            if(teaPwd === null || teaPwd === ''){
                layer.msg("教师密码不能为空,请校验后重试");
                return;
            }

            if(teaPwdR === null || teaPwdR === ''){
                layer.msg("教师重复密码不能为空,请校验后重试");
                return;
            }

            // 校验 密码 与 重复密码
            if(teaPwd !== teaPwdR){
                layer.msg("两次密码不一致,请校验后重试");
                return;
            }
        }

        // 根据 添加 or 编辑 标识 - 区分
        if(data.isAddOrEdit === 1){
            // 添加
            mtAjax.post({
                url: "admin/teacher/add-teacher",
                data:{
                    teaNo:teaNo,
                    teaName:teaName,
                    teaPwd:teaPwd
                },
                fullSuccess:function(){
                    layer.msg("添加教师信息成功");
                    layer.close(data.layerIndex_addTeacher_panel);
                    // 刷新列表
                    data.table_teacherList.reload();
                }
            })
        }else{
            // 编辑
            mtAjax.post({
                url: "admin/teacher/edit-teacher",
                data:{
                    id:$("#id").val(),
                    teaNo:teaNo,
                    teaName:teaName,
                    teaPwd:teaPwd
                },
                fullSuccess:function(){
                    layer.msg("更新教师信息成功");
                    layer.close(data.layerIndex_editTeacher_panel);
                    // 刷新列表
                    data.table_teacherList.reload();
                }
            })
        }
    }

    function open_addTeacherPanel() {
        // 清空form中的所有信息
        $(".layui-form-item input").val("");
        // 设置添加标识
        data.isAddOrEdit = 1;
        // 打开编辑页面
        data.layerIndex_addTeacher_panel = layer.open({
            title: "添加教师信息",
            type: 1,
            content: $(".add-course-panel"),
            area: '600px',
            // offset: ['150px', width],
            cancel: function (index, layero) {
                layer.close(index);
            }
        });
    }

    function init_teacherList() {
        // 将信息渲染至table中
        data.table_teacherList = table.render({
            elem: '#teacherList',
            cellMinWidth: 80,
            cols: [
                [{
                    type: 'numbers', title: '序号'
                }, {
                    field: 'id', title: 'ID', hide: true
                }, {
                    field: 'teaNo', title: '教师编号', templet: '#usernameTpl', align: 'center'
                }, {
                    field: 'teaName', title: '教师姓名', align: 'center'
                }, {
                    field: 'edit', title: '编辑', align: 'center',

                    templet: function () {
                        return '<span class="iconfont icon-edit" style="color: #33aca0;font-size: 23px;cursor: pointer"></span>';
                    },
                    width: '10%'
                }, {
                    field: 'isDel',
                    title: '删除',

                    templet: function (d) {
                        if (d.isDel === 1) {
                            return '<input type="checkbox" name="cb-del" lay-skin="switch" lay-text="已删除|未删除" checked data="'+d.isDel+'">'
                        } else {
                            return '<input type="checkbox" name="cb-del" lay-skin="switch" lay-text="已删除|未删除" data="'+d.isDel+'">'
                        }
                    },
                    unresize: true,
                    align: 'center',
                    width: '10%'
                }
                ]
            ],
            event: true,
            page: true,
            limit:10,
            limits:[10,15,20,25,30,35,40],
            text: {
                none: '暂无相关数据' //默认：无数据。注：该属性为 layui 2.2.5 开始新增
            },
            // 异步请求数据
            url: mtAjax.get_base_url() + "admin/teacher/search-teacher-list",
            method: "post",
            where: {},
            headers: {'token': mtLocalStorage.readDataFromLocal("token")},
            'xhrFields': {withCredentials: true},
            crossDomain: true,
            contentType: 'application/json',
            done: function (res) {
                console.log(res);
                $(".fr span").html(res.count);

                form.on("switch", function (data) {
                    var flag = $(this).parent().children("input").attr("name");
                    var id = $(this).parents("tr").children("td[data-field='id']").children().html();
                    var isDelOrNot = $(this).parent().find("input[name='cb-del']").attr('data');
                    console.log(isDelOrNot);

                    if(flag === "cb-del"){
                        switch2Del(id,$(this),isDelOrNot);
                    }
                })
            }
        })
    }

    function switch2Del(id,This,isDelOrNot) {
        // 校验参数
        if(id === null || id === ""){
            layer.msg("数据有误,请稍后重试");
        }
        mtAjax.get({
            url:"admin/teacher/del-teacher",
            data:{id:id},
            success:function (res) {
                if(res.success){
                    if(res.innerSuccess){
                        layer.msg("更新教师状态成功");
                    }else{
                        DelRollBack(This,isDelOrNot);
                    }
                }else{
                    DelRollBack(This,isDelOrNot);
                }
            },
            error:function () {
                DelRollBack(This,isDelOrNot);
            }
        })
    }

    /**
     * 删除失败- 回滚 - 暂时 - 刷新表格
     * @param This
     * @param isDelOrNot
     * @constructor
     */
    function DelRollBack(This,isDelOrNot) {
        data.table_teacherList.reload();
    }
});
