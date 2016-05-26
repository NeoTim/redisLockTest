/**
 * Created by lixiaodong on 16/5/26.
 */
var request = require('request');
//
for(var i = 0 ; i < 10 ; i++){
    request.post(
        {
            url:'http://localhost:3000/login',
            form:{

            }
        }
        , function (err,data) {
            console.log(Date.now() + '',err);
            if(!!data){
                console.log('data->',data.body);
            }
        });
}


