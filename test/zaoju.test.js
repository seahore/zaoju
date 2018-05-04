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
    
    it('JSON pattern 1 - valid, should be accepted', function() {
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
    it('JSON pattern 3 - not an array, should be accepted', function() {
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
    it('JSON pattern 5, bad values should throw an error and the pattern should remain', function() {
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
    