var Zaoju = require('../src/zaoju.js');

var expect = require('chai').expect;


// Just like the same function in jQuery
var inArray = function( elem, arr, i ) {
    var len;

    if ( arr ) {

        len = arr.length;
        i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

        for ( ; i < len; i++ ) {

            // Skip accessing in sparse arrays
            if ( i in arr && arr[ i ] === elem ) {
                return i;
            }
        }
    }

    return -1;
}



describe('regWord: ', function() {
    it('regWord("JIM", "my-friend") should be ok.', function() {
        Zaoju.regWord('JIM', 'my-friend');
        expect(inArray('JIM', Zaoju.getDictByTag('my-friend'))).not.to.equal(-1);
    });
    it('regWord("曾景明", "俺兄弟") should be ok. - Non-ASCII strings', function() {
        Zaoju.regWord('曾景明', '俺兄弟');
        expect(inArray('曾景明', Zaoju.getDictByTag('俺兄弟'))).not.to.equal(-1);
    });
    it('regWord("Louis Victor de Broglie", "French physical scientist") should be ok. - Empty spaces', function() {
        Zaoju.regWord('Louis Victor de Broglie', 'French physical scientist');
        expect(inArray('Louis Victor de Broglie', Zaoju.getDictByTag('French physical scientist'))).not.to.equal(-1);
    });
    it('regWord("Amiya", "hare,donkey"), should be ok. - Multi-tag word', function() {
        Zaoju.regWord("Amiya", "hare,donkey");
        expect(inArray('Amiya', Zaoju.getDictByTag('hare')) && inArray('Amiya', Zaoju.getDictByTag('donkey'))).not.to.equal(-1);
    });
    it('regWord("  Cai Xukun  ", "nba   ,  basketball player,   kun  "), should be ok. - Trim test', function() {
        Zaoju.regWord("  Cai Xukun  ", "nba   ,  basketball player,   kun  ");
        expect(inArray('Cai Xukun', Zaoju.getDictByTag('nba')) && inArray('Cai Xukun', Zaoju.getDictByTag('basketball player')) && inArray('Cai Xukun', Zaoju.getDictByTag('kun'))).not.to.equal(-1);
    });
});

describe('setDictByTag: ', function() {
	var d1 = {time: ["新石器时代", "在半封建半殖民地社会时期", "翘课后", "月黑风高的晚上", "刚才", "明天", "9102年", "危机纪元12年", "文艺复兴时期", "此时此刻", "趁不注意"]};
	var d2 = d1;
	var d3 = {time: ["你", "你和哲♂学家", "\\"]};
	var d4 = {time: ["[", "[["]};
	var d5 = {time: []};
	var d6 = {time: ["that's right"]};
	var d7 = d6;
	
	var l1 = "[你][你和哲♂学家][谁][一位路人][没有人][你，没错，就是你！你][NBA首位新春贺岁形象大使][游乐娃子][作者自己][诸葛村夫]";
	var l2 = "233[你]233[你和哲♂学家]233[谁]233[一位路人]233[没有人]233[你，没错，就是你！你]233[NBA首位新春贺岁形象大使]233[游乐娃子]233[作者自己]233[诸葛村夫]";
	var l3 = "[\\你][你和\\哲\\♂学家][\\\\]";
	var l4 = "我是乱打的：[[]][[[]]]";
	var l5 = "我是还乱打的：[][][][][][][][]";
	var l6 = "【全角括号不行的】[that's right]";
	var l7 = "[     that's right ]";
	
	it('dict line 1 - valid, should be accepted and behave as expected', function() {
        Zaoju.setDictByTag(l1, "time");
        expect(Zaoju.getDict()).to.deep.equal(d1);
    });
	it('dict line 2 - valid, valid, with characters outside brackets, should be accepted and behave as expected', function() {
        Zaoju.setDictByTag(l2, "time");
        expect(Zaoju.getDict()).to.deep.equal(d2);
    });
	it('dict line 3 - valid, contains escape chars, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(l3, "time");
        expect(Zaoju.getPattern()).to.deep.equal(d3);
    });
	it('dict line 4 - valid, contains nested brackets, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(l4, "time");
        expect(Zaoju.getPattern()).to.deep.equal(d4);
    });
	it('dict line 5 - valid, contains empty tags, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(l5, "time");
        expect(Zaoju.getPattern()).to.deep.equal(d5);
    });
	it('dict line 6 - valid, uses full-width bracket, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(l6, "time");
        expect(Zaoju.getPattern()).to.deep.equal(d6);
    });});
	it('dict line 7 - valid, trimming test, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(l7, "time");
        expect(Zaoju.getPattern()).to.deep.equal(d7);
    });
});

describe('setPatternInJSON: ', function() {
    
    var d = [ { type: "tag", value: "default" } ];
    
    var j1 = ['[',
              '    {"type": "tag", "value": "time"},',
              '    {"type": "text", "value": "，"},',
              '    {"type": "tag", "value": "person"},',
              '    {"type": "text", "value": "。"}',
              ']'
    ].join('\n');
    var j2 = j1 + ';';
    var j3 = '{"type": "text", "value": "not an array"}';
    var j4 = '[{"epyt": "text", "value": "foo"}]';
    var j5 = '[{"type": "", "value": "foo"}]';
    
    it('JSON pattern 1 - valid, should be accepted and behave as expected', function() {
        Zaoju.setPattern(d);
        Zaoju.setPatternInJSON(j1);
        expect(Zaoju.getPattern()).to.deep.equal(JSON.parse(j1));
    });
    it('JSON pattern 2 - invalid syntax, should throw an error and the pattern should remain', function() {
        Zaoju.setPattern(d);
        try {
            Zaoju.setPatternInJSON(j2);
        }
        catch (e) {
            expect(Zaoju.getPattern()).to.deep.equal(d);
            return;
        }
        throw new Error('No error was throwed when parsing JSON pattern 2.');
    });
    it('JSON pattern 3 - not an array, should be accepted and behave as expected', function() {
        Zaoju.setPattern(d);
        Zaoju.setPatternInJSON(j3);
        expect(Zaoju.getPattern()).to.deep.equal( [ JSON.parse(j3) ] );
    });
    it('JSON pattern 4 - bad keys, should throw an error and the pattern should remain', function() {
        Zaoju.setPattern(d);
        try {
            Zaoju.setPatternInJSON(j4);
        }
        catch (e) {
            expect(Zaoju.getPattern()).to.deep.equal(d);
            return;
        }
        throw new Error('No error was throwed when parsing JSON pattern 4.');
    });
    it('JSON pattern 5 - bad values should throw an error and the pattern should remain', function() {
        Zaoju.setPattern(d);
        try {
            Zaoju.setPatternInJSON(j5);
        }
        catch (e) {
            expect(Zaoju.getPattern()).to.deep.equal(d);
            return;
        }
        throw new Error('No error was throwed when parsing JSON pattern 5.');
    });
});

describe('setPatternInSPN: ', function() {
    
    var s1 = '哎呀[person]，你不要在[location]脱裤子啊......';
	var s2 = '[person]在[location]';
	var s3 = '\\嘿，[per\\s\\o\\n]，要使用\\t\\a\\g，只要这样：\\[tag-name\\]。';
    var s4 = '我是乱打的：[[]]';
	var s5 = '我还是乱打的：[][][]';
	var s6 = "【全角括号不能括标签】[that's right]";
	var s7 = "[     that's right   ]";
	
	var p1 = [{type: "text", value: "哎呀"}, {type: "tag", value: "person"}, {type: "text", value: "，你不要在"}, {type: "tag", value: "location"}, {type: "text", value: "脱裤子啊......"}];
	var p2 = [{type: "tag", value: "person"}, {type: "text", value: "在"}, {type: "tag", value: "location"}];
	var p3 = [{type: "text", value: "嘿，"}, {type: "tag", value: "person"}, {type: "text", value: "，要使用tag，只要这样：[tag-name]。"}];
	var p4 = [{type: "text", value: "我是乱打的："}, {type: "tag", value: "["}, {type: "text", value: "]"}];
	var p5 = [{type: "text", value: "我还是乱打的："}];
	var p6 = [{type: "text", value: "【全角括号不能括标签】"}, {type: "tag", value: "that's right"}];
	var p7 = [{type: "tag", value: "that's right"}];
	
    it('SPN pattern 1 - valid, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(s1);
        expect(Zaoju.getPattern()).to.deep.equal(p1);
    });
	it("SPN pattern 2 - valid, start with '[', should be accepted and behave as expected", function() {
        Zaoju.setPatternInSPN(s2);
        expect(Zaoju.getPattern()).to.deep.equal(p2);
    });
	it("SPN pattern 3 - valid, contains escape chars, should be accepted and behave as expected", function() {
        Zaoju.setPatternInSPN(s3);
        expect(Zaoju.getPattern()).to.deep.equal(p3);
    });
	it("SPN pattern 4 - valid, contains nested brackets, should be accepted and behave as expected", function() {
        Zaoju.setPatternInSPN(s4);
        expect(Zaoju.getPattern()).to.deep.equal(p4);
    });
	it("SPN pattern 5 - valid, contains empty tags, should be accepted and behave as expected", function() {
        Zaoju.setPatternInSPN(s5);
        expect(Zaoju.getPattern()).to.deep.equal(p5);
    });
	it('SPN pattern 6 - valid, uses full-width bracket, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(s6);
        expect(Zaoju.getPattern()).to.deep.equal(p6);
    });});
	it('SPN pattern 7 - valid, trimming test, should be accepted and behave as expected', function() {
        Zaoju.setPatternInSPN(s7);
        expect(Zaoju.getPattern()).to.deep.equal(p7);
    });
});
    
describe('genSentence: ', function() {
    
    var p1 = [{"type": "tag", "value": "time"},{"type": "text", "value": "，"},{"type": "tag", "value": "person"},{"type": "text", "value": "在"},{"type": "tag", "value": "location"},{"type": "tag", "value": "event"},{"type": "text", "value": "。"}];
    
    it('Test 1', function() {
        Zaoju.clearDict();
        Zaoju.setPattern(p1);
        Zaoju.regWord('现在','time');
        Zaoju.regWord('你','person');
        Zaoju.regWord('电脑前','location');
        Zaoju.regWord('看测试','event');
        expect(Zaoju.genSentence()).to.equal('现在，你在电脑前看测试。');
    })
});
    