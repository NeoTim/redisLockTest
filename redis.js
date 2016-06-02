/**
 * Created by lixiaodong on 16/5/26.
 */
var redislock = require('redislock') ;
var client = require('redis').createClient();
var queue = require('./queue.js');
var _ = require('underscore');

var lock   = redislock.createLock(client);

var LockAcquisitionError = redislock.LockAcquisitionError;
var LockReleaseError     = redislock.LockReleaseError;

exports.test = function (callback) {
    lock.acquire('test', function(err1) {
        // if (err) ... Failed to acquire the lock
        console.log(err1);
        var value = {id:1,name:'xiaodong'};
        client.set('test',JSON.stringify(value), function (err) {
            console.log(err);
            lock.release(function (error1) {
                console.log(error1);
                callback(err);
            });
        });
    });
}

exports.getRedisData = function(key,callback){
    lock.acquire(key+'lock', function (err) {
        if(!!err){
            callback(err);
            return;
        }
        client.get(key,function(err,data){
            lock.release(function () {
                callback(err,data);
            });
        });
    });
}

exports.releaseLock = function (key, callback) {
    var locks = redislock.getAcquiredLocks();
    var currLock = _.findWhere(locks,{_key : key+'lock'});
    console.log('locks-->>',locks);
    console.log('currLock-->>',currLock);
    if(!!currLock){
        currLock.release(function (err) {
            callback(err);
        });
    } else {
        callback();
    }
}

exports.setRedisData = function(key,value,callback){
    lock.acquire(key, function(err1) {
        // if (err) ... Failed to acquire the lock
        client.set(key,JSON.stringify(value), function (err) {
            console.log(err);
            lock.release(function (error1) {
                callback(err);
            });
        });
    });
}