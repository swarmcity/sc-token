contract('SWCToken', function(accounts) {

  var multisig_address = accounts[1];

  var swctokencontract;
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

  describe('Deploy SWC Token', function() {
    it("should deploy Token contract", function(done) {
      SWCToken.new(multisig_address,randomtokencontract.address).then(function(instance) {
        swctokencontract = instance;
        assert.isNotNull(swctokencontract);
        done();
      });
    });
  });

  describe('Convert Random to SWC', function() {
    it("should have correct balance on random token contract", function(done) {
      var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
        done();
      });
    });

    it("should have correct balance on SWC token contract", function(done) {
      var balance = swctokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "account not correct amount");
        done();
      });
    });

    it("should give allowance to convert", function(done) {
       var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
        randomtokencontract.approve(swctokencontract.address,balance).then(function() {
            done();
        });
      });
    });

    it("should convert", function(done) {
        swctokencontract.convert().then(function() {
            done();
        });
    });

    it("should have new balance on SWC token contract", function(done) {
      var balance = swctokencontract.balanceOf.call(accounts[0]).then(function(balance) {
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

    it("should have Randomtoken balance on multisig contract", function(done) {
      var balance = randomtokencontract.balanceOf.call(multisig_address).then(function(balance) {
      assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
        done();
      });
    });

  });
});
