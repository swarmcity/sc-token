contract('SWCToken', function(accounts) {

  var multisig_address = accounts[1];

  var self = this;

  describe('Deploy ARC Token', function() {
    it("should deploy Token contract", function(done) {
      SWCToken.new(multisig_address).then(function(instance) {
        swctokencontract = instance;
        assert.isNotNull(swctokencontract);
        done();
      });
    });
  });

});
