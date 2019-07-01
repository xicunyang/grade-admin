layui.config({
    base: '/grade-admin/static/utils/'
});
layui.define(['jquery', 'layer','mtLocalStorage'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var mtLocalStorage = layui.mtLocalStorage;

    var BASE_URL = "http://localhost:4567/grade/";


    exports('mtAjax', {
        get: function (obj) {
            obj.success = obj.success || function(){};
            obj.innerSuccess = obj.innerSuccess || function(){};
            obj.fullSuccess = obj.fullSuccess || function(){};
            obj.error = obj.error || function(){};

            // 设置传递参数
            // 2.1 拼接请求参数
            let paramsStr = "";
            let params = obj.data || {};
            if (params !== null) {
                Object.keys(params).forEach(key => {
                    paramsStr += key + "=" + params[key] + '&';
                })
            }

            // 2.2 过滤掉最后的&
            if (paramsStr !== "") {
                paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf("&"));
            }

            // 2.3 拼接完整路径
            obj.url += "?" + paramsStr;

            let loading = layer.load(2);
            // 发起get请求
            $.ajax({
                type: "GET",
                url: BASE_URL + obj.url,
                headers: {'token': mtLocalStorage.readDataFromLocal("token")},
                'xhrFields': {withCredentials: true},
                crossDomain: true,
                success:function (data) {
                    layer.close(loading);
                    // 普通
                    obj.success(data);
                    if(data.code === 2333){
                        layer.msg("登录信息失效,请稍后重新登录");
                        return;
                    }
                    // success 成功
                    if(data.success){
                        obj.innerSuccess(data);
                    }else{
                        layer.msg("网络出错,请稍后重试");
                        return;
                    }
                    // 完全成功
                    if(data.success){
                        if(data.innerSuccess){
                            obj.fullSuccess(data.data);
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                },
                error:function (data) {
                    layer.close(loading);
                    obj.error(data);
                    layer.msg("网络请求错误,请稍后重试");
                }
            })
        },
        post:function (obj) {
            obj.success = obj.success || function(){};
            obj.innerSuccess = obj.innerSuccess || function(){};
            obj.fullSuccess = obj.fullSuccess || function(){};
            obj.error = obj.error || function(){};

            let loading = layer.load(2);

            // 发起get请求
            $.ajax({
                type: "POST",
                url: BASE_URL + obj.url,
                data:JSON.stringify(obj.data),
                dataType: "json",
                contentType: 'application/json;charset=UTF-8',
                headers: {'token': mtLocalStorage.readDataFromLocal("token")},
                'xhrFields': {withCredentials: true},
                crossDomain: true,
                success:function (data) {
                    layer.close(loading);
                    // 普通
                    obj.success(data);
                    if(data.code === 2333){
                        layer.msg("登录信息失效,请稍后重新登录");
                        return;
                    }
                    // success 成功
                    if(data.success){
                        obj.innerSuccess(data);
                    }else{
                        layer.msg("网络出错,请稍后重试");
                        return;
                    }
                    // 完全成功
                    if(data.success){
                        if(data.innerSuccess){
                            obj.fullSuccess(data.data);
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                },
                error:function (data) {
                    layer.close(loading);
                    obj.error(data);
                    layer.msg("网络请求错误,请稍后重试");
                }
            })
        },
        get_base_url :function () {
            return BASE_URL;
        }
    })
});
