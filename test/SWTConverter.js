contract('MiniMeToken', function(accounts) {

  var deposit_address = accounts[1];

  var swtToken; // this is the MiniMeToken version
  var arcToken; // this is the old ARC token contract
  var swtConverter; // this is the controller
  var self = this;

  describe('Deploy ARC Token', function() {
    it("should deploy ARC token contract", function(done) {

      ARCToken.new(accounts[1], 1, 2).then(function(_arcToken) {
        //            assert.ifError(err);
        assert.ok(_arcToken.address);
        arcToken = _arcToken;
        done();
      });


    });
  });

  describe('Deploy MiniMeToken Token', function() {
    it("should deploy MiniMeToken contract", function(done) {

      MiniMeToken.new(
        "Swarm Token",
        18,
        "SWT",
      ).then(function(_miniMeToken) {
        //            assert.ifError(err);
        assert.ok(_miniMeToken.address);
        swtToken = _miniMeToken;
        done();
      });
    });

  });



  describe('Deploy SWTConverter Controller', function() {
    it("should deploy SWTConverter Controller", function(done) {
      SWTConverter.new(deposit_address, swtToken.address, arcToken.address).then(function(instance) {
        swtConverter = instance;
        assert.isNotNull(swtConverter);
        done();
      });
    });

    it("should set SWTToken's controller to SWTConverter", function(done) {

      swtToken.changeController(swtConverter.address).then(function() {
        done();
      }).catch(function(e) {
        assert.fail('this function should not throw', e);
        done();
      });

    });

  });

  describe('Convert ARC to SWT fails without having an allowance', function() {
    it("should not be able to convert without allowance", function(done) {

      swtConverter.convert(1).then(function() {
        assert.fail('this function should throw');
        done();
      }).catch(function() {
        done();
      });


    });
  });

  describe('Convert ARC to SWT with allowance', function() {
    it("should have correct balance on random token contract", function(done) {
      var balance = arcToken.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 1000 * 1e18, "account not correct amount");
        done();
      });
    });

    it("should have zero balance on SWT token contract", function(done) {
      var balance = swtToken.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 0, "account not correct amount");
        done();
      });
    });

    it("should give allowance to convert", function(done) {
      var balance = arcToken.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 1000 * 1e18, "account not correct amount");
        arcToken.approve(swtConverter.address, balance).then(function() {
          done();
        });
      });
    });

    it("allowance should be visible in ARC token contract", function(done) {
      var balance = arcToken.allowance.call(accounts[0], swtConverter.address).then(function(allowanceamount) {
        assert.equal(allowanceamount.valueOf(), 1000 * 1e18, "allowanceamount not correct");
        done();
      });
    });

    it("should convert", function(done) {
      var balance = arcToken.balanceOf.call(accounts[0]).then(function(balance) {
        swtConverter.convert(balance.valueOf(), {
          gas: 400000
        }).then(function() {
          done();
        }).catch(function(e) {
          assert.fail('this function should not throw', e);
          done();
        });
      });
    });

    it("should have new balance on SWT token contract", function(done) {
      var balance = swtToken.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 1000 * 1e18, "account not correct amount");
        done();
      });
    });

    it("should have zero balance on ARC token contract", function(done) {
      var balance = arcToken.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 0, "account not correct amount");
        done();
      });
    });

    it("there should be an ARC balance on the deposit wallet", function(done) {
      var balance = arcToken.balanceOf.call(deposit_address).then(function(balance) {
        assert.equal(balance.valueOf(), 1000 * 1e18, "account not correct amount");
        done();
      });
    });

  });
});