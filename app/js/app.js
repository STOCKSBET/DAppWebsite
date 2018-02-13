var stocksBetContract;
var account;
var instance;

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 TestTicker, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider)
      // window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      // window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
    }
    App.start()
  })

window.App = {
    start: function () {

        abi = JSON.parse('[{"constant": true,"inputs": [  {"name": "","type": "bytes32"  }],"name": "stocksIndex","outputs": [  {"name": "totalPool","type": "uint256"  },  {"name": "priceStart","type": "uint256"  },  {"name": "priceEnd","type": "uint256"  },  {"name": "betsCount","type": "uint256"  },  {"name": "canceledBetsCount","type": "uint256"  },  {"name": "isWinner","type": "bool"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [  {"name": "myid","type": "bytes32"  },  {"name": "result","type": "string"  }],"name": "__callback","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"  },  {"constant": true,"inputs": [  {"name": "","type": "address"  }],"name": "bettorsIndex","outputs": [  {"name": "betsCount","type": "uint256"  },  {"name": "canceledBetsCount","type": "uint256"  },  {"name": "isRewarded","type": "bool"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": true,"inputs": [],"name": "rewardCheck","outputs": [  {"name": "","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": true,"inputs": [],"name": "actionStatus","outputs": [  {"name": "isOpen","type": "bool"  },  {"name": "isStart","type": "bool"  },  {"name": "isEnd","type": "bool"  },  {"name": "isVoided","type": "bool"  },  {"name": "duration","type": "uint256"  },  {"name": "durationLockBetReceiving","type": "uint256"  },  {"name": "durationBettingResult","type": "uint256"  },  {"name": "momentStart","type": "uint256"  },  {"name": "momentCloseValue","type": "string"  },  {"name": "momentOpen1MValue","type": "string"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [  {"name": "myid","type": "bytes32"  },  {"name": "result","type": "string"  },  {"name": "proof","type": "bytes"  }],"name": "__callback","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"  },  {"constant": true,"inputs": [],"name": "queryProp","outputs": [  {"name": "","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": true,"inputs": [],"name": "version","outputs": [  {"name": "","type": "string"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": true,"inputs": [],"name": "getBettorInfo","outputs": [  {"name": "","type": "uint256"  },  {"name": "","type": "bytes32[]"  },  {"name": "","type": "uint256[]"  },  {"name": "","type": "bool[]"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [],"name": "refundKill","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"  },  {"constant": true,"inputs": [  {"name": "index","type": "bytes32"  }],"name": "getStockInfo","outputs": [  {"name": "","type": "uint256"  },  {"name": "","type": "uint256"  },  {"name": "","type": "uint256"  },  {"name": "","type": "uint256"  },  {"name": "","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [],"name": "rewardClaim","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"  },  {"constant": true,"inputs": [],"name": "totalReward","outputs": [  {"name": "","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": true,"inputs": [  {"name": "s","type": "string"  }],"name": "stringToUintNormalize","outputs": [  {"name": "result","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": true,"inputs": [],"name": "owner","outputs": [  {"name": "","type": "address"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [  {"name": "stock","type": "bytes32"  }],"name": "sendBet","outputs": [],"payable": true,"stateMutability": "payable","type": "function"  },  {"constant": true,"inputs": [],"name": "stocks","outputs": [  {"name": "oddsAAPL","type": "int256"  },  {"name": "oddsMSFT","type": "int256"  },  {"name": "oddsGOOG","type": "int256"  },  {"name": "AAPL","type": "bytes32"  },  {"name": "MSFT","type": "bytes32"  },  {"name": "GOOG","type": "bytes32"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [],"name": "recovery","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"  },  {"constant": false,"inputs": [  {"name": "momentCloseValue","type": "string"  },  {"name": "momentOpen1MValue","type": "string"  },  {"name": "durationLockBetReceiving","type": "uint256"  },  {"name": "durationBettingResult","type": "uint256"  }],"name": "setupBetting","outputs": [  {"name": "","type": "bool"  }],"payable": true,"stateMutability": "payable","type": "function"  },  {"constant": true,"inputs": [],"name": "totalPool","outputs": [  {"name": "","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"constant": false,"inputs": [  {"name": "stock","type": "bytes32"  }],"name": "cancelAllBet","outputs": [],"payable": true,"stateMutability": "payable","type": "function"  },  {"constant": true,"inputs": [],"name": "getRewardTotal","outputs": [  {"name": "","type": "uint256"  }],"payable": false,"stateMutability": "view","type": "function"  },  {"inputs": [],"payable": true,"stateMutability": "payable","type": "constructor"  },  {"anonymous": false,"inputs": [  {"indexed": false,"name": "description","type": "string"  }],"name": "newOraclizeQuery","type": "event"  },  {"anonymous": false,"inputs": [  {"indexed": false,"name": "price","type": "uint256"  }],"name": "newPriceTicker","type": "event"  },  {"anonymous": false,"inputs": [  {"indexed": false,"name": "from","type": "address"  },  {"indexed": false,"name": "val","type": "uint256"  }],"name": "Deposit","type": "event"  },  {"anonymous": false,"inputs": [  {"indexed": false,"name": "to","type": "address"  },  {"indexed": false,"name": "val","type": "uint256"  }],"name": "Withdraw","type": "event"  }]');
        
        stocksBetContract = web3.eth.contract(abi);
        account = web3.eth.accounts[0];

        console.info('account:', account)
        instance = stocksBetContract.at('0xb228cc24ecf9dd7068a7743180f0defcdc385f13')
        console.info('instance:', instance)
    
        //console.info('owner', instance.owner())
        console.info('instance.address', instance.address)
        $('#contractAddress').html('<a href="https://ropsten.etherscan.io/address/' + instance.address + '">Smart Contract Address</a>');

        
        //new Date(timestamp)

        instance.owner((err, result) => {
            console.info("owner:", result);
          });

        instance.actionStatus((err, result) => {
            if (result[0]) {
                $('#statusCurrentBetting').html("(Open)");
            }
            if (result[1]) {
                $('#statusCurrentBetting').html("(Start)");
                $('#rewardUserResultButtonCancel').hide();
            }
            if (result[2]) {
                $('#statusCurrentBetting').html("(End)");
                $('#rewardUserResultButtonCancel').hide();
                $('.buttonPlaceBet').hide();
                // $('#rewardUserInfo').append("The betting is completed");
                $('.divReward').show();
            }
            if (result[3]) {
                $('#statusCurrentBetting').html("(Voided)");
            }
            
            //console.info("actionStatus.isOpen:", result[0]);
            //console.info("actionStatus.isStart:", result[1]);
            //console.info("actionStatus.isEnd:", result[2]);
            //console.info("actionStatus.isVoided:", result[3]);

            $('#durationCurrentBetting').html(result[4].toString() + " sec");
            
            //web3.utils.fromWei(reward,"ether")
            //console.info("actionStatus.duration:", result[4].toString());
            //console.info("actionStatus.durationLockBetReceiving:", result[5].toString());
            //console.info("actionStatus.durationBettingResult:", result[6].toString());
            //console.info("actionStatus.momentStart:", parseInt(result[7].toString()));
            //console.info("actionStatus.momentCloseValue:", result[8]);
            //console.info("actionStatus.momentOpen1MValue:", result[9]);
            console.info("actionStatus.momentSetup:", result[10]);
            $('.momentCloseValue').html(result[8] + " 16:00");
            $('.momentOpen1MValue').html(result[9].replace("00:00", "00"));
        });

          
        //instance.getRewardTotal((errTP, resultTP) => {
        instance.totalPool((errTP, resultTP) => {

          //parseFloat
          let totalPool = parseInt(resultTP.toString());
           //console.info("totalPoolTP:", totalPool);

          var stocksList = "MSFT,AAPL,GOOG".split(",");
          for (var i = 0, l = stocksList.length; i < l; i++) {
              let code = stocksList[i];
              instance.getStockInfo(code, (err, result) => {
                  //console.info(code + ".totalPool", result[0].toString());
                  //console.info(code + ".priceStart", result[1].toString());
                  //console.info(code + ".priceEnd", result[2].toString());
                  //console.info(code + ".betsCount", parseInt(result[3].toString()));
                  //console.info(code + ".isWinner", result[5]);
                  //console.info(code + ".canceledBetsCount", parseInt(result[4].toString()));
                  if (result[5] == true) {
                    $('#' + code + 'isWinner').html('<i class="fa fa-trophy icon-3x text-primary"></i>');
                  }
                  
                  let odds = 0
                  var tp = parseInt(result[0].toString());
                  if (tp > 0) {
                    odds =  Math.round((totalPool / tp) * 100 - 100) / 100;
                  }
  
                  $('#' + code + 'Odds').html(odds);
                  $('.' + code + 'totalPool').html(parseInt(result[0].toString()));
                  $('#' + code + 'priceStart').html("$" + result[1].toString());
                  $('#' + code + 'priceEnd').html("$" + result[2].toString());
                  $('#' + code + 'betsCount').html(parseInt(result[3].toString()) - parseInt(result[4].toString()));

                  $('#containerBetting').show();
                  $('#footer').show();
              });
          }


        });

/*
        instance.totalReward((err, result) => {
            console.info("totalReward:", parseInt(result.toString()));
        });
*/


        /*
        instance.getRewardTotal((err, result) => {
            console.info("rewardTotal:", result.toString());
            $('#rewardUserResult').append("Total reward: " + result.toString() + " ETH");
        });
        */
        
        instance.rewardCheck((err, result) => {
          $('#rewardUserResult').append("Your reward in this betting: " + result.toString() + " ETH");
          if (result.toString() != "0") {
            $('#rewardUserResultButtonClaim').show();
          }
        });


        instance.getBettorInfo((err, result) => {
            // console.info("bettorInfo.betsCount:", result[0].toString());
            $('#rewardUserInfo').append("Your bets count: " + result[0].toString());
            for (var i = 0; i < result[1].length; i++) {
              $('#rewardUserInfo').append("<br>" + result[1][i] + " " + result[2][i] + "ETH ");
              if (!result[3][i]) {
                $('#rewardUserInfo').append("Cancelled");
              }
              //console.info("bettorInfo.bettorStocks:", result[1][i]);
              //console.info("bettorInfo.bettorAmounts:", result[2][i]);
              //console.info("bettorInfo.isCancelled:", result[3][i]);
            }
        });

        /*
        instance.stocks((err, result) => {
            console.info("oddsAAPL:", result[0].toString());
            console.info("oddsMSFT:", result[1].toString());
            console.info("oddsGOOG:", result[2].toString());
        });
        */
    },

    selectBetting: function (inst) {
      console.log(inst.value);
    },

    cancelAllBets: function () {

    },

    rewardClaim: function () {

    },

    sendBet: function (code) {
        instance.sendBet(code, {value: 100000000000000000 }, function(err, result) { 
            console.info("err:", err);
            console.info("result:", result);
        });
    },

    setStatus: function (message) {
      var status = document.getElementById('status')
      status.innerHTML = message
    },
  
    refreshBalance: function () {
      /*
      var self = this
  
      var meta
      stocksBetContract.deployed().then(function (instance) {
        meta = instance
        return meta.getBalance.call(account, { from: account })
      }).then(function (value) {
        var balance_element = document.getElementById('balance')
        balance_element.innerHTML = value.valueOf()
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error getting balance; see log.')
      })
      */
    },
  
    sendCoin: function () {
      var self = this
  
      var amount = parseInt(document.getElementById('amount').value)
      var receiver = document.getElementById('receiver').value
  
      this.setStatus('Initiating transaction... (please wait)')
  
      var meta
      stocksBetContract.deployed().then(function (instance) {
        meta = instance
        return meta.sendCoin(receiver, amount, { from: account })
      }).then(function () {
        self.setStatus('Transaction complete!')
        self.refreshBalance()
      }).catch(function (e) {
        console.log(e)
        self.setStatus('Error sending coin; see log.')
      })
    }
  }
  

  