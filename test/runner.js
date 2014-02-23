var assert = require("assert");

describe('runner', function(){

  var runner = require("../js/runner");

  describe('#createCell()', function(){
    it('should handle the base case', function() {

      var cell = runner.createCell({
        x: 0,
        y: 0,
        ai: "food"
      }); 

      assert.equal(cell.x, 0);
      assert.equal(cell.y, 0);
      assert.equal(cell.ai, "food");
    })
  })

})
