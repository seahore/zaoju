var Zaoju = require('../src/zaoju.js');

var expect = require('chai').expect;

var $ = require('jquery');

describe('zaoju.js: ', function() {
    it('No problem with regWord().', function() {
        Zaoju.regWord('JIM', 'my-friend');
		expect($.inArray('JIM', Zaoju.getgetWordWithTag('my-friend'))).not.to.be.equal(-1);
		
        Zaoju.regWord('曾景明', '俺兄弟');
		expect($.inArray('曾景明', Zaoju.getgetWordWithTag('俺兄弟'))).not.to.be.equal(-1);
         
    	Zaoju.regWord('Louis Victor de Broglie', 'Franch physical scientist');
		expect($.inArray('Louis Victor de Broglie', Zaoju.getgetWordWithTag('Franch physical scientist'))).not.to.be.equal(-1);
    
    });
});