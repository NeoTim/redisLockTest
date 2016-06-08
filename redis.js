/**
 * Created by lixiaodong on 16/5/26.
 */
var redislock = require('redislock') ;
var client = require('redis').createClient();
var queue = require('./queue.js');
var _ = require('underscore');


var LockAcquisitionError = redislock.LockAcquisitionError;
var LockReleaseError     = redislock.LockReleaseError;

exports.test = function (callback) {
    var lock   = redislock.createLock(client);

    lock.acquire('test:lock', function(err1) {
        // if (err) ... Failed to acquire the lock
        console.log(err1);
            console.log('lock->',lock);
            lock.release(function (error1) {
                console.log('error1==>>',error1);
                callback();
            });
    });
}

exports.getRedisData = function(key,callback){
    var lock   = redislock.createLock(client);

    lock.acquire(key+':lock', function (err) {
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
        client.set(key,JSON.stringify(value), function (err) {
            callback();
        });
}

exports.mset = function (sets, callback) {
    client.mset(sets,callback);
}

exports.redisZAdd = function(key,sets){
    client.zadd(key,sets, function (err,response) {});
}

exports.redisZAddSets = function(key,sets,callback){
    var args = [ 'myzset', 1, 'one', 2, 'two', 3, 'three', 99, 'ninety-nine' ];

    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('added '+response+' items.');//added 4 items.

        // -Infinity and +Infinity also work
        var args1 = [ 'myzset', '+inf', '-inf' ];
        client.zrevrangebyscore(args1, function (err, response) {
            if (err) throw err;
            console.log('example1', response);//example1 [ 'ninety-nine', 'three', 'two', 'one' ]
            // write your code here
        });

        var max = 3, min = 1, offset = 1, count = 2;
        var args2 = [ 'myzset', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
        client.zrevrangebyscore(args2, function (err, response) {
            if (err) throw err;
            console.log('example2', response);//example2 [ 'two', '2', 'one', '1' ]
            // write your code here
        });
    });
}


exports.lockPlayer = function(key, callback){
    var playerlock = redislock.createLock(client);
    playerlock.acquire(key+":lock", function (err) {
        callback(err,playerlock);
    });
}

exports.releasePlayerLock = function(playerlock,callback){
    playerlock.release(function (err) {
        callback(err);
    })
}