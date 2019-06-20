(function(){
    
    var Zaoju = Zaoju || (function() {
        var _dict = {};
        _dict.time = ["新石器时代", "在半封建半殖民地社会时期", "翘课后", "月黑风高的晚上", "刚才", "明天", "9102年", "危机纪元12年", "文艺复兴时期", "此时此刻", "趁不注意"];
        _dict.person = ["你", "你和哲♂学家", "谁", "一位路人", "没有人", "你，没错，就是你！你", "NBA首位新春贺岁形象大使", "游乐娃子", "作者自己", "诸葛村夫"];
        _dict.location = ["洞庭湖", "摸仙堡", "养生馆", "大街上", "路灯下", "小破站上", "直播间", "养生馆", "华农的场子", "异世界", "广场荧幕上", "最接近天的地方", "我军阵前"];
        _dict.event = ["搓脚板", "为爱鼓掌", "裹睡", "捡起一块肥皂", "唱、跳、rap", "登录Github并Star了这个项目，作者一时激动不已为你唱、跳、rap并打起了篮球，因此掉了Follower（手动滑稽）", "干什么呢？雨女无瓜！", "学猫叫", "被说漂亮（嘤嘤嘤）", "吔屎", "说粗鄙之语", "嘤嘤狂吠"];
        var _pattern = [{
            type: "tag",
            value: "time"
        }, {
            type: "text",
            value: "，"
        }, {
            type: "tag",
            value: "person"
        }, {
            type: "text",
            value: "在"
        }, {
            type: "tag",
            value: "location"
        }, {
            type: "tag",
            value: "event"
        }, {
            type: "text",
            value: "。"
        }, ];

        var getDict = function () { return _dict; };
            
        var setDict = function (d) { _dict = d; };

        var clearDict = function () { _dict = {}; };
        
        var getPattern = function () { return _pattern; };
        
        var setPattern = function (p) { _pattern = p; };
        
        var getAllDictTags = function() {
            var tags = [];
            for(var tag in _dict) {
                tags.push(tag);
            }
            return tags;
        }
      
        var regWord = function(val, tags) {
            if (typeof val !== "string" || typeof tags !== "string") {
                throw new TypeError("regWord的参数类型有误");
            }
            val = val.trim();
            if (val === "") {
                throw new Error("诶内容呢？");
                return;
            }
            tags = tags.trim().split(/[,，、]/);
            var i = 0;
            while (i < tags.length) {
                if (tags[i] === "") {
                    tags.splice(i, 1);
                } else {
                    ++i;
                }
            }
            if (i === 0) {
                throw new Error("标签有问题呢~");
                return;
            }
            if (!Array.isArray(tags)) {
                tags = [tags];
            }
            for (var i = 0; i < tags.length; ++i) {
                tags[i] = tags[i].trim();
                if (tags[i] === "") {
                    continue;
                }
                if (!(tags[i]in _dict)) {
                    _dict[tags[i]] = [];
                }
                _dict[tags[i]].push(val);
            }
        };
        var setDictByTag = function(val, tag) {
            var dst = [];

            if (typeof val !== "string" || typeof tag !== "string") {
                throw new TypeError("setDictByTag的参数类型有误")
            }
            val = val.trim();
            if (val === "") {
                throw new Error("诶内容呢？");
                return
            }
            tag = tag.trim();
          
            var t = "";
            var isInBrackets = false;
            for (var i = 0; i < val.length; ++i) {
                if (val[i] === "[" && isInBrackets === false) {
                    isInBrackets = true;
                    continue;
                }
                if (val[i] === "]") {
                    isInBrackets = false;
                    t = t.trim();
                    if (t !== "") {
                        dst.push(t);
                        t = "";
                    }
                    continue;
                }
                if (val[i] === "\\") {
                    t += val[i + 1];
                    ++i;
                    continue;
                }
                if (isInBrackets) {
                    t += val[i];
                }
            }
            _dict[tag] = dst;
        }
        var getDictByTag = function(tag) {
            if (typeof tag !== "string") {
                throw new TypeError("getDictByTag的参数类型有误");
            }
                tag = tag.trim();
            return _dict[tag];
        }
        var setPatternInJSON = function(val) {
            try {
                var newPattern = JSON.parse(val)
            } catch (e) {
                throw new Error("语法似乎不太对呢~");
                return;
            }
            if (!Array.isArray(newPattern)) {
                newPattern = [newPattern];
            }
            try {
                for (var i = 0; i < newPattern.length; ++i) {
                    if (!("type"in newPattern[i]) || !("value"in newPattern[i])) {
                        throw new Error("检查第" + i.toString() + "个元素中type或value的拼写");
                    } else {
                        if (typeof newPattern[i].type !== "string" || newPattern[i].type === "" || typeof newPattern[i].value !== "string" || newPattern[i].value === "") {
                            throw new Error("第" + i.toString() + "个元素的属性值须为非空字符串");
                        }
                    }
                }
            } catch (e) {
                throw e;
                return;
            }
            _pattern = newPattern;
        };
        var setPatternInSPN = function(val) {
            if (typeof val !== "string") {
                throw new Error("setPatternInSPN 参数须为字符串");
            }
            var newPattern = [];
            val = val.trim();
            var curElement = {
                type: "text",
                value: ""
            };
            for (var i = 0; i < val.length; ++i) {
                if (val[i] === "[") {
                    if (curElement.type === "tag") {
                        curElement.value += "[";
                        continue;
                    }
                    newPattern.push(curElement);
                    curElement = {
                        type: "tag",
                        value: ""
                    };
                    continue;
                }
                if (val[i] === "]") {
                    if (curElement.type === "text") {
                        curElement.value += "]";
                        continue;
                    }
                    newPattern.push(curElement);
                    curElement = {
                        type: "text",
                        value: ""
                    };
                    continue;
                }
                if (val[i] === "\\") {
                    curElement.value += val[i + 1];
                    ++i;
                    continue;
                }
                curElement.value += val[i];
                continue;
            }
            newPattern.push(curElement);
            var i = 0;
            while (i < newPattern.length) {
                if (newPattern[i].value === "") {
                    newPattern.splice(i, 1);
                } else {
                    ++i;
                }
            }
            _pattern = newPattern;
        };
        var genSentence = function() {
            var output = "";
            for (var i = 0; i < _pattern.length; ++i) {
                switch (_pattern[i].type) {
                case "text":
                    output += _pattern[i].value;
                    break;
                case "tag":
                    var tagArr = _dict[_pattern[i].value];
                    if (Array.isArray(tagArr)) {
                        output += tagArr[Math.floor(Math.random() * tagArr.length)];
                    }
                    break
                }
            }
            return output;
        };
        /*
    
        // 检查两个生成规则(pattern)是否相等，注意：不检查结构是否合法
        var comparePatterns = function (p1, p2) {
            if (!Array.isArray(p1) || !Array.isArray(p2))
                throw new TypeError('arguments of function comparePatterns should be arrays.');
        
            if (p1.length !== p2.length)
                return false;
        
            for ( var i = 0; i < p1.length; ++i) {
                if (p1[i].type !== p2[i].type || p1[i].value !== p2[i].value)
                    return false;
            }
        
            return true;
        };
    
        */
        return {
            getDict: getDict,
            setDict: setDict,
            clearDict: clearDict,
            getPattern: getPattern,
            setPattern: setPattern,
            getAllDictTags: getAllDictTags,
            getDictByTag: getDictByTag,
            regWord: regWord,
            setDictByTag: setDictByTag,
            setPatternInJSON: setPatternInJSON,
            setPatternInSPN: setPatternInSPN,
            genSentence: genSentence,
        };
    }());

    
    
    var zaoju = Zaoju;
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = zaoju;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function() { return zaoju; });
    } else {
        this.Zaoju = zaoju;
    }
}).call(function() {
    return this || (typeof window !== 'undefined' ? window : global);
}());
