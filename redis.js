/**
 * Created by lixiaodong on 16/5/26.
 */
var redislock = require('redislock') ;
var client = require('redis').createClient();

var queue = [];

var lock   = require('redislock').createLock(client,{
    timeout: 10000,
    retries: 3,
    delay: 100
});

var LockAcquisitionError = redislock.LockAcquisitionError;
var LockReleaseError     = redislock.LockReleaseError;

var key = "redis-lock:";

exports.getRedisData = function(key,callback){
    console.log('hello !!!!');
    lock.acquire(key, function (err) {
        if(!!err){
            console.log('redis has been locked!',queue.length);
            queue.push({
                key :   key,
                callback    :   callback
            });
        } else {
            console.log('redis has been released!',queue.length);
            client.get(key, function (err,data) {
                callback(err,data);
                lock.release(function () {
                    if(queue.length > 0){
                        console.log('queue shift!');
                        var obj = queue.shift();
                        exports.getRedisData(obj.key,obj.callback);
                    }
                });
            });
        }
    });
}

exports.setRedisData = function(key,value,callback){

}