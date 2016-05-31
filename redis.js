/**
 * Created by lixiaodong on 16/5/26.
 */
var redislock = require('redislock') ;
var client = require('redis').createClient();
var queue = require('./queue.js');

var lock   = require('redislock').createLock(client,{
    timeout: 10000,
    retries: 3,
    delay: 100
});

var LockAcquisitionError = redislock.LockAcquisitionError;
var LockReleaseError     = redislock.LockReleaseError;

var key = "redis-lock:";

exports.getRedisData = function(key,callback){
    lock.acquire(key, function (err) {
        if(!!err){
            console.log('redis has been locked!');
            var result = queue.enqueue({
                key :   key,
                callback    :   callback
            });
            if(!!result){//queue full
                callback('full');
            }
        } else {
            console.log('redis has been released!');
            client.get(key, function (err,data) {
                callback(err,data);
                lock.release(function () {
                    var obj = queue.unqueue();
                    if(!!obj){
                        console.log('queue shift!');
                        exports.getRedisData(obj.key,obj.callback);
                    }
                });
            });
        }
    });
}

exports.setRedisData = function(key,value,callback){

}