# redisLockTest

```javascript
//redis.js
var redis = require('redis');
var redislock = require('redislock');
var client = redis.createClient('127.0.0.1',6379);
```

```javascript
exports.lockPlayer = function(key, callback){
    var playerlock = redislock.createLock(client);
    playerlock.acquire(key+":lock", function (err) {
        callback(err,playerlock);
    });
}
```

```javascript
exports.releasePlayerLock = function(playerlock,callback){
    playerlock.release(function (err) {
        callback(err);
    });
}
```

```javascript
//redisUtil.js
var async = require('async');
var redisUtil = require('../redis.js');
var async = require('async');
```

```javascript
//1
var playlock ;
async.waterfall([
    function (cb) {
        redisUtil.lockPlayer('lock_xiaodong', function (err,data) {
            console.log('lock player error:',err);//null
            if(!err && !!data){
                playlock = data;
            }
            cb(err);
        });
    },
    function (cb) {
        setTimeout(function () {
            redisUtil.lockPlayer('lock_xiaodong', function (err,data) {
                console.log('lock player error1:',err);//null
                if(!err && !!data){
                    playlock = data;
                }
            });
        },10000);
        cb();
    },
    function (cb) {
        redisUtil.releasePlayerLock(playlock, function (err) {
            console.log('release player lock error:',err);//null
            cb(err);
        });
    }
], function (err) {
    if(!!err){
        redisUtil.releasePlayerLock(playlock, function (err) {
            console.log('release player lock error1:',err);
        });
    } else {
        console.log('lock and release lock success!!');
    }
});
```

```javascript
//2
async.waterfall([
    function (cb) {
        redisUtil.lockPlayer('lock_xiaodong', function (err,data) {
            console.log('lock player error:',err);
            if(!err && !!data){
                playlock = data;
            }
            cb(err);
        });
    },
    function (cb) {
        //error cannot acquire
        redisUtil.lockPlayer('lock_xiaodong', function (err,data) {
            console.log('lock player error1:',err);
            if(!err && !!data){
                playlock = data;
            }
            cb(err);
        });
    },
    function (cb) {
        redisUtil.releasePlayerLock(playlock, function (err) {
            console.log('release player lock error:',err);
            cb(err);
        });
    }
], function (err) {
    if(!!err){
        /*
        { [LockAcquisitionError: Could not acquire lock on "lock_xiaodong:lock"]
            name: 'LockAcquisitionError',
                message: 'Could not acquire lock on "lock_xiaodong:lock"' }
        */
        redisUtil.releasePlayerLock(playlock, function (err) {
            console.log('release player lock error1:',err);
        });
    } else {
        console.log('lock and release lock success!!');
    }
});
```
