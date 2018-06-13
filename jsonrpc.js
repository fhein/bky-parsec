var JsonRpcClient = (function (rpc, undefined) {
  rpc.call = function (method, params) {
    return new Promise(function (resolve, reject) {
      var url = "http://localhost/mxc-parsec/public/index.php";

      var body = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
      };
      if (params) {
        body.params = params;
      }
      var http = new XMLHttpRequest();
      http.open('POST', url, true);
      http.setRequestHeader('Content-Type', 'application/json');
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.status == 200) {
            //console.log(http.response);
            try {
              // is the response valid json?
              var answer = JSON.parse(http.response);
              if (answer.error) {
                reject('JSON-RPC Error [' + answer.error.code + '] : ' + answer.error.message);
              }
              resolve(answer);
            } catch (e) {
              reject(http.response);
            }
          } else {
            reject('HTTP error. Status: ' + http.status);
          }
        }
      }
      http.send(JSON.stringify(body));
    });
  }
  return rpc;
})(JsonRpcClient || {})
