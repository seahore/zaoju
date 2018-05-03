if ("undefined" === typeof jQuery)
    throw new Error("歪，jQuery吗？快来啊，就差你啦");

var Zaoju = window.Zaoju || ( function () {

    var _dict = {};
    
    _dict.time = ["汉武帝时期", "解放前", "上课时", "月黑风高的晚上"];
    _dict.location = ["洞庭湖", "麻将馆", "养生馆", "大街上", "路灯下"];
    _dict.person = ["你", "班主任", "总统先生", "一位路人"];
    _dict.event = ["搓脚板", "洗澡", "为爱鼓掌", "裸睡", "捡肥皂"];

    var _pattern = [
        {type: "tag", value: "time"},
        {type: "text", value: "，"},
        {type: "tag", value: "person"},
        {type: "text", value: "在"},
        {type: "tag", value: "location"},
        {type: "tag", value: "event"},
        {type: "text", value: "。"},
    ];

    var regWord = function (val, tags) {
        val = $.trim(val);
    
        if (val === "") {
            throw new Error("诶内容呢？");
            return;
        }
        
        tags = $.trim(tags);
        tags = tags.split(/[,，、]/);
        // 去除tags数组内所有的空字符串
        var i = 0;
        while(i < tags.length) {
            if(tags[i] === "")
                tags.splice(i, 1);
            else
                ++i;
        }
        // 此时i === tags.length
        if (i === 0) {
            throw new Error("标签有问题呢~");
            return;
        }
        
        // types如果不是数组,转化成数组
        if (!Array.isArray(tags))
            tags = [tags];
        // 将body加入各个标签分类数组
        for (var i = 0; i < tags.length; ++i) {
            if (tags[i] === "") continue;
            if (!(tags[i] in _dict))
                _dict[tags[i]] = [];
            _dict[tags[i]].push(val);
        }
    }

    var setPattern = function (val) {
        var backupPattern = _pattern;

        try {
            _pattern = JSON.parse(val);
        }
        catch (e) {
            throw new Error("语法似乎不太对呢~");
            return;
        }
    
        if (!Array.isArray(_pattern)) {
            _pattern = [_pattern];
        }
    
        try {
            for (var i = 0; i < _pattern.length; ++i) {
                if (!("type" in _pattern[i]) || !("value" in _pattern[i]))
                    throw new Error("检查第" + i.toString() + "个元素中type或value的拼写");
                else if (typeof _pattern[i].type !== "string" || _pattern[i].type === "" || typeof _pattern[i].value !== "string" || _pattern[i].value === "")
                    throw new Error("第" + i.toString() + "个元素的属性值须为非空字符串");
            }
        }
        catch (e) {
            _pattern = backupPattern;
            throw e;
            return;
        }
    }
    
    var genSentence = function () {
        var output = "";
        for (var i = 0; i < _pattern.length; ++i) {
            switch (_pattern[i].type) {
                case "text":
                    output += _pattern[i].value;
                    break;
                case "tag":
                    var tagArr = _dict[_pattern[i].value];
                    if(Array.isArray(tagArr))
                        output += tagArr[Math.floor(Math.random() * tagArr.length)];
                    break;
            }
        }
        return output;
    };

    return {
        regWord: regWord,
        setPattern: setPattern,
        genSentence: genSentence,
    };
  }());