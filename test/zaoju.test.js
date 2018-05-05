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
        expect(inArray('JIM', Zaoju.getWordWithTag('my-friend'))).not.to.equal(-1);
    });
    it('regWord("曾景明", "俺兄弟") should be ok. - Non-ASCII strings', function() {
        Zaoju.regWord('曾景明', '俺兄弟');
        expect(inArray('曾景明', Zaoju.getWordWithTag('俺兄弟'))).not.to.equal(-1);
    });
    it('regWord("Louis Victor de Broglie", "French physical scientist") should be ok. - Empty spaces', function() {
        Zaoju.regWord('Louis Victor de Broglie', 'French physical scientist');
        expect(inArray('Louis Victor de Broglie', Zaoju.getWordWithTag('French physical scientist'))).not.to.equal(-1);
    
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
    
    it('JSON pattern 1 - valid, should be accepted and be as expected', function() {
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
    it('JSON pattern 3 - not an array, should be accepted and be as expected', function() {
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
	
	var p1 = [{type: "text", value: "哎呀"}, {type: "tag", value: "person"}, {type: "text", value: "，你不要在"}, {type: "tag", value: "location"}, {type: "text", value: "脱裤子啊......"}];
	var p2 = [{type: "tag", value: "person"}, {type: "text", value: "在"}, {type: "tag", value: "location"}];
	var p3 = [{type: "text", value: "嘿，"}, {type: "tag", value: "person"}, {type: "text", value: "，要使用tag，只要这样：[tag-name]。"}];
	var p4 = [{type: "text", value: "我是乱打的："}, {type: "tag", value: "["}, {type: "text", value: "]"}];
	var p5 = [{type: "text", value: "我还是乱打的："}];
	
    it('SPN pattern 1 - valid, should be accepted and be as expected', function() {
        Zaoju.setPatternInSPN(s1);
        expect(Zaoju.getPattern()).to.deep.equal(p1);
    });
	it("SPN pattern 2 - valid, start with '[', should be accepted and be as expected", function() {
        Zaoju.setPatternInSPN(s2);
        expect(Zaoju.getPattern()).to.deep.equal(p2);
    });
	it("SPN pattern 3 - valid, contains escape chars, should be accepted and be as expected", function() {
        Zaoju.setPatternInSPN(s3);
        expect(Zaoju.getPattern()).to.deep.equal(p3);
    });
	it("SPN pattern 4 - valid, contains nested brackets, should be accepted and be as expected", function() {
        Zaoju.setPatternInSPN(s4);
        expect(Zaoju.getPattern()).to.deep.equal(p4);
    });
	it("SPN pattern 5 - valid, contains empty tags, should be accepted and be as expected", function() {
        Zaoju.setPatternInSPN(s5);
        expect(Zaoju.getPattern()).to.deep.equal(p5);
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
    