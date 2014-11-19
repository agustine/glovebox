    var proxyBridge = {};
    var token = {
        "token": "502486c9909443458d603edf4c11e65e111",
        "intType": 1
    };
    proxyBridge.back = function(){
        alert('back');
    };
    proxyBridge.userLogin =  function(args){
        var token = {
            "token": "502486c9909443458d603edf4c11e65e",
            "intType": 0
        };
        var callback = JSON.parse(args).callback;
        window[callback](token.token,token.intType);
    };
    proxyBridge.getUserToken =  function(){
        return JSON.stringify(token);
    };