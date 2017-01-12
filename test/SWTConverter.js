contract('MiniMeToken', function(accounts) {

  var deposit_address = accounts[1];

  var miniMeToken;
  var arcToken;
  var swtConverter;
  var self = this;

  describe('Deploy ARC Token', function() {
    it("should deploy ARC token contract", function(done) {

  ARCToken.new(accounts[1],1,2
        ).then(function(_arcToken) {
//            assert.ifError(err);
            assert.ok(_arcToken.address);
            arcToken = _arcToken;
            done();
        });

    
    });
  });


 //function ARCToken(address multisigInput, uint startBlockInput, uint endBlockInput) {

  describe('Deploy MiniMeToken Token', function() {
    it("should deploy MiniMeToken contract", function(done) {

  MiniMeToken.new(
            "Swarm Token",
            18,
            "SWT",
        ).then(function(_miniMeToken) {
//            assert.ifError(err);
            assert.ok(_miniMeToken.address);
            miniMeToken = _miniMeToken;
            done();
        });

    
    });
  });

  describe('Deploy SWTConverter Controller', function() {
    it("should deploy SWTConverter Controller", function(done) {
      SWTConverter.new(deposit_address,miniMeToken.address,arcToken.address).then(function(instance) {
        swtConverter = instance;
        assert.isNotNull(swtConverter);
        done();
      });
    });
  });

  // describe('Convert Random to SWT fails without having an allowance', function() {
  //   it("should not be able to convert without allowance", function(done) {
     
  //       swttokencontract.convert().then(function() {    
  //         assert.fail('this function should throw');
  //         done();
  //       }).catch(function(){
  //         done();
  //       });
                
      
  //   });
  // });

  // describe('Convert Random to SWT with allowance', function() {
  //   it("should have correct balance on random token contract", function(done) {
  //     var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
  //     assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
  //       done();
  //     });
  //   });

  //   it("should have correct balance on SWT token contract", function(done) {
  //     var balance = swttokencontract.balanceOf.call(accounts[0]).then(function(balance) {
  //     assert.equal(balance.valueOf(), 0, "account not correct amount");
  //       done();
  //     });
  //   });

  //   it("should give allowance to convert", function(done) {
  //      var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
  //     assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
  //       randomtokencontract.approve(swttokencontract.address,balance).then(function() {
  //           done();
  //       });
  //     });
  //   });

  //   it("should convert", function(done) {
  //       swttokencontract.convert().then(function() {
  //           done();
  //       }).catch(function(){
  //         assert.fail('this function should not throw');
  //         done();
  //       });
  //   });

  //   it("should have new balance on SWT token contract", function(done) {
  //     var balance = swttokencontract.balanceOf.call(accounts[0]).then(function(balance) {
  //     assert.equal(balance.valueOf(), 100 * 3 * 1e18, "account not correct amount");
  //       done();
  //     });
  //   });

  //   it("should have zero balance on random token contract", function(done) {
  //     var balance = randomtokencontract.balanceOf.call(accounts[0]).then(function(balance) {
  //     assert.equal(balance.valueOf(), 0, "account not correct amount");
  //       done();
  //     });
  //   });

  //   it("should have Randomtoken balance on deposit wallet", function(done) {
  //     var balance = randomtokencontract.balanceOf.call(deposit_address).then(function(balance) {
  //     assert.equal(balance.valueOf(), 100 * 1e18, "account not correct amount");
  //       done();
  //     });
  //   });

  // });
});
