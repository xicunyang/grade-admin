/**
 * 高亮显示搜索结果
 */
layui.define([], function (exports) {
    function key2Light(key, keyHtml) {
        var sKey = "<span name='addSpan' style='color:red'>" + key + "</span>",
            num = -1,
            rStr = new RegExp(key, "i"),
            rHtml = new RegExp("\<.*?\>", "ig"), //匹配html元素
            aHtml = keyHtml.match(rHtml); //存放html元素的数组

        keyHtml = keyHtml.replace(rHtml, '{~}');  //替换html标签
        keyHtml = keyHtml.replace(rStr, sKey); //替换key
        keyHtml = keyHtml.replace(/{~}/g, function () {  //恢复html标签
            num++;
            return aHtml[num];
        });
        return keyHtml;
    }

    exports("heightLight", {
        setKey2Light: function (keyword, This) {
            var cnameHtml = This.children().html();
            var lightHtml = key2Light(keyword, cnameHtml);
            This.children().html(lightHtml);
        }
    })
});
