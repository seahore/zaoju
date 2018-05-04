var Zaoju = require('../src/zaoju.js');

var expect = require('chai').expect;

var $ = require('jquery');

describe('zaoju.js: ', function() {
    it('regWord("JIM", "my-friend") should be ok.', function() {
        Zaoju.regWord('JIM', 'my-friend');
		expect($.inArray('JIM', Zaoju.getWordWithTag('my-friend'))).not.to.be.equal(-1);
	});
	it('regWord("曾景明", "俺兄弟") should be ok. - Non-ASCII strings', function() {
        Zaoju.regWord('曾景明', '俺兄弟');
		expect($.inArray('曾景明', Zaoju.getWordWithTag('俺兄弟'))).not.to.be.equal(-1);
	});
	it('regWord("Louis Victor de Broglie", "Franch physical scientist") should be ok. - Empty spaces', function() {
    	Zaoju.regWord('Louis Victor de Broglie', 'French physical scientist');
		expect($.inArray('Louis Victor de Broglie', Zaoju.getWordWithTag('Franch physical scientist'))).not.to.be.equal(-1);
    
    });
});