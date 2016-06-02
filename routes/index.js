var express = require('express');
var router = express.Router();
var async = require('async');
var redisModel = require('../redis.js');

/* GET home page. */
router.post('/login', function(req, res) {
    var redisKey = 'app:feature:lock';
    async.waterfall([
        function (cb) {
            var obj = {id:1,name:'xiaodong'};
            redisModel.setRedisData(redisKey,obj, function (error) {
                cb(error);
            });
        },
        function (cb) {
            redisModel.getRedisData(redisKey,function(err,data){
                console.log('redis data:',err,data);
                cb(err);
            });
        },
        function (cb) {
            redisModel.releaseLock(redisKey, function (error) {
                console.log('redis release lock ->',Date.now());
                cb(error);
            });
        }
    ], function (err) {
        if(!err){
            return res.send({status : 'ok'});
        } else {
            console.log('error:',err,new Error().stack);
            return res.send({status : 'fail'});
        }
    });
});



module.exports = router;
