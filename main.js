App.onObjectTouched.Add(function (sender, x, y, tileID, obj) {
    if (obj !== null) {
        if (obj.type == ObjectEffectType.INTERACTION_WITH_ZEPSCRIPTS) {
            // sender.sendMessage(`Your location: ${sender.tileX}x${sender.tileY}`)
            if(obj.param1 == 8217) {
                const walletAddress = sender.walletAddress
                if(walletAddress == null) {
                    sender.sendMessage(`Wallet address is not set`, 0xFFFFFF);
                    return;
                }

                // check if the wallet addr is 0x[0-9a-f]{20}
                const re = /0x[0-9a-fA-F]{20}/;
                if(!re.test(walletAddress)) {
                    sender.sendMessage(`Address is not ethereum format. Address=${walletAddress}`, 0xFFFFFF);
                    return;
                }

                // send request to Klaytn endpoint.
                App.httpPostJson(
                    "https://public-en-cypress.klaytn.net",
                    {"ContentType":"application/json"},
                    {"jsonrpc":"2.0","method":"klay_getBalance","params":[walletAddress, "latest"],"id":1},
                    (res)=> {
                        let response = JSON.parse(res);
                        // sender.sendMessage(`Your KLAY ${response.result}, ${1.0e+18}`)
                        let bal = parseInt(response.result,16)/1.0e+18
                        if(bal < 1) {
                            sender.sendMessage(`You should have more than 1 KLAY. Your balance = ${bal} KLAY`, 0xFF0000);
                        } else {
                            if( 76 < sender.tileX && sender.tileX < 93 &&
                                79 < sender.tileY && sender.tileY < 88 ) {
                                sender.spawnAtLocation('SpawnInside');
                            } else {
                                sender.spawnAtLocation('SpawnOutside');

                            }
                        }
                    }
                )
            }
        }
    } else {
        sender.sendMessage(`obj is null`, 0xFFFFFF);
    }
});