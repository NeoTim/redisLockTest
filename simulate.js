/**
 * Created by lixiaodong on 16/5/26.
 */
var request = require('request');

function initRobot(next){
    request.post(
        {
            url:'http://localhost:4001/initRobot',
            form:{
                version :   "0.0.0.179"
            }
        }
        , function (err,data) {
            console.log(Date.now() + '',err);
            if(!!data){
                console.log('data->',data.body);
            }
            next();
        });
}

function getPvpPlayer(){
    request.post(
        {
            url:'http://localhost:4001/getPvpPkPlayer',
            form:{
                id  :   '5747e221fb36bd387e364273',
                version :   "0.0.0.179"
            }
        }
        , function (err,data) {
            console.log(Date.now() + '',err);
            if(!!data){
                console.log('data->',data.body);
            }
        });
}
//initRobot(function () {
//    getPvpPlayer();
//});

function getRedisLock(){
    request.post(
        {
            url:'http://localhost:3000/login',
            form:{
                id  :   '5747e221fb36bd387e364273',
                version :   "0.0.0.179"
            }
        }
        , function (err,data) {
            console.log(Date.now() + '',err);
            if(!!data){
                console.log('data->',data.body);
            }
        });
}
//getRedisLock();

function testRedisLock(){
    request.post(
        {
            url:'http://localhost:4001/testRedisLock',
            form:{
                id  :   '5747e221fb36bd387e364273',
                version :   "0.0.0.208"
            }
        }
        , function (err,data) {
            console.log(Date.now() + '',err);
            if(!!data){
                console.log('data->',data.body);
            }
        });
}

//testRedisLock();

function getPvpPlayer(){
    request.post(
        {
            url:'http://localhost:4001/getPvpPlayer',
            form:{
                id  :   '57512a9ef55b664ea2de3c60',
                version :   "0.0.0.223",
                type:2
            }
        }
        , function (err,data) {
            console.log(Date.now() + '',err);
            if(!!data){
                console.log('data->',data.body);
            }
        });
}

getPvpPlayer();