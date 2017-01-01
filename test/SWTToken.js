contract('SWTToken', function(accounts) {

  var deposit_address = accounts[1];

  var swttokencontract;
  var randomtokencontract;
  var self = this;

  describe('Deploy Random Token', function() {
    it("should deploy Token contract", function(done) {
      RandomToken.new().then(function(instance) {
        randomtokencontract = instance;
        assert.isNotNull(randomtokencontract);
        done();
      });
    });
  });

  describe('Deploy SWT Token', function() {
    it("should deploy Token contract", function(done) {
      SWTToken.new(deposit_address,randomtokencontract.address).then(function(instance) {
        swttokencontract = instance;
        assert.isNotNull(swttokencontract);
        done();
      });
    });
  });

  describe('Convert Random to SWT fails without having an allowance', function() {
    it("should not be able to convert without allowance", function(done) {
     
        swttokencontract.convert().then(function() {    
          assert.fail('this function should throw');
          done();
        }).catch(function(){
          done();
        });
                
      
    });
  });

  describe('Convert Random to SWT with allowance', function() {
    it("should have correct balance on random token contract", function(done) {
      var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
        done();
      });
    });

    it("should have correct balance on SWT token contract", function(done) {
      var balance = swttokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "account not correct amount");
        done();
      });
    });

    it("should give allowance to convert", function(done) {
       var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
        randomtokencontract.approve(swttokencontract.address,balance).then(function() {
            done();
        });
      });
    });

    it("should convert", function(done) {
        swttokencontract.convert().then(function() {
            done();
        }).catch(function(){
          assert.fail('this function should not throw');
          done();
        });
    });

    it("should have new balance on SWT token contract", function(done) {
      var balance = swttokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 3 * 1e18, "account not correct amount");
        done();
      });
    });

    it("should have zero balance on random token contract", function(done) {
      var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "account not correct amount");
        done();
      });
    });

    it("should have Randomtoken balance on deposit wallet", function(done) {
      var balance = randomtokencontract.balanceOf.call(deposit_address).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
        done();
      });
    });

  });
});
