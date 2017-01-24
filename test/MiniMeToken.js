contract('MiniMeToken', function(accounts) {

  var myToken; // this is the MiniMeToken version
  var miniMeTokenFactory;
  var sampleController; // sample controller
  var clone0; // a clone token
  var clone1; // a clone token

  var self = this;

  describe('Deploy MiniMeToken TokenFactory', function() {

    it("should deploy MiniMeToken contract", function(done) {
      gasEstimate = self.web3.eth.estimateGas({
        data: MiniMeTokenFactory.all_networks.default.unlinked_binary
      });
      console.log('estimated gas=', gasEstimate);
      MiniMeTokenFactory.new({
        gas: gasEstimate
      }).then(function(_miniMeTokenFactory) {
        assert.ok(_miniMeTokenFactory.address);
        miniMeTokenFactory = _miniMeTokenFactory;
        console.log('miniMeTokenFactory created at address', _miniMeTokenFactory.address);
        process.exit();
        done();
      });
    });
  });

  describe('Deploy MiniMeToken Token', function() {

    it("should deploy MiniMeToken contract", function(done) {
      MiniMeToken.new(
        miniMeTokenFactory.address,
        0,
        0,
        "My Minime Token",
        18,
        "MMT",
        true
      ).then(function(_miniMeToken) {
        assert.ok(_miniMeToken.address);
        console.log('myToken created at address', _miniMeToken.address);
        myToken = _miniMeToken;
        done();
      });
    });
  });

  describe('Deploy SampleController Controller', function() {

    it("should deploy SampleController Controller", function(done) {
      SampleController.new(self.web3.toHex(myToken.address)).then(function(instance) {
        sampleController = instance;
        assert.isNotNull(sampleController);
        done();
      });
    });

    it("should set myToken controller to SampleController", function(done) {
      myToken.changeController(sampleController.address).then(function() {
        done();
      }).catch(function(e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });

    it("should not be able to change the controller again", function(done) {
      myToken.changeController(0).then(function() {
        assert.fail(null, null, 'this function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });
  });

  describe('Use SampleController Controller', function() {

    it("should call a controller function that mints some tokens", function(done) {
      sampleController.mintTokens(accounts[0], 1 * 1e18, {
        gas: 400000
      }).then(function() {
        assert.fail(null, null, 'This function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });
  });

  describe('Minting and burning tokens should not be possible by someone else than the controller', function() {

    it("should be impossible to call generateTokens", function(done) {
      myToken.generateTokens(accounts[0], 1, {
        gas: 400000
      }).then(function() {
        assert.fail(null, null, 'This function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });

    it("should be impossible to call destroyTokens", function(done) {
      myToken.destroyTokens(accounts[0], 1, {
        gas: 400000
      }).then(function() {
        assert.fail(null, null, 'This function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });
  });

  describe('Cloning of contract at current block', function() {

    it("should be able to clone this contract at block " + self.web3.eth.blockNumber, function(done) {

      var watcher = myToken.NewCloneToken();
      watcher.watch(function(error, result) {
        console.log('new clone contract at ', result.args._cloneToken);
        clone0 = MiniMeToken.at(self.web3.toHex(result.args._cloneToken));
        watcher.stopWatching();
        done();
      });

      myToken.createCloneToken(
        "My Voting Token",
        18,
        "MVT",
        Number.MAX_SAFE_INTEGER, // if the blocknumber > current block, minime defaults to the current block.
        true, {
          gas: 2000000
        }).then(function(txhash) {
        // the event watcher will call done()
      }).catch(function(e) {
        console.log('Error', e);
        assert.fail(null, null, 'This function should not throw', e);
        done();
      });
    });

    it("should be have the same balance as the original ", function(done) {
      var balance = clone0.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 1 * 1e18, "account not correct amount");
        done();
      });
    });
  });


  describe('Cloning of contract at block 0', function() {

    it("should be able to clone this contract at block 0", function(done) {
      var watcher = myToken.NewCloneToken();
      watcher.watch(function(error, result) {
        console.log('new clone contract at ', result.args._cloneToken);
        clone1 = MiniMeToken.at(self.web3.toHex(result.args._cloneToken));
        watcher.stopWatching();
        done();
      });

      myToken.createCloneToken(
        "My Discount Token",
        18,
        "MDT",
        0,
        true, {
          gas: 2000000
        }).then(function(txhash) {
        // the event watcher will call done()
      }).catch(function(e) {
        console.log('Error', e);
        assert.fail(null, null, 'This function should not throw', e);
        done();
      });
    });

    it("should be have a zero myToken balance ", function(done) {
      var balance = clone1.balanceOf.call(accounts[0]).then(function(balance) {
        assert.equal(balance.valueOf(), 0, "account not correct amount");
        done();
      });
    });
  });

  describe('Transfer coins in myToken', function() {

    it("should be transfer tokens", function(done) {
      myToken.transfer(accounts[1], 1, {
        gas: 400000
      }).then(function() {
        done();
      }).catch(function(e) {
        assert.fail(null, null, 'This function should not throw', e);
        done();
      });
    });
    it("receiving account should have a token ", function(done) {
      var balance = myToken.balanceOf.call(accounts[1]).then(function(balance) {
        assert.equal(balance.valueOf(), 1, "account not correct amount");
        done();
      });
    });
  });

  describe('approval + transfers', function() {

    it("should give an approval transfer tokens", function(done) {
      myToken.approve(accounts[1], 1, {
        gas: 400000
      }).then(function() {
        done();
      }).catch(function(e) {
        assert.fail(null, null, 'This function should not throw', e);
        done();
      });
    });

    it("should use the approved coins", function(done) {
      myToken.transferFrom(accounts[0], accounts[2], 1, {
        gas: 400000,
        from: accounts[1]
      }).then(function() {
        done();
      }).catch(function(e) {
        assert.fail(null, null, 'This function should not throw', e);
        done();
      });
    });

    it("receiving account should have a token ", function(done) {
      var balance = myToken.balanceOf.call(accounts[2]).then(function(balance) {
        assert.equal(balance.valueOf(), 1, "account not correct amount");
        done();
      });
    });

    it("should not be able to spend more than the approved coins", function(done) {
      myToken.transferFrom(accounts[0], accounts[2], 1, {
        gas: 400000,
        from: accounts[1]
      }).then(function() {
        assert.fail(null, null, 'This function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });
  });

});