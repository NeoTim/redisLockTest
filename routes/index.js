var express = require('express');
var router = express.Router();
var async = require('async');
var redisModel = require('../redis.js');

/* GET home page. */
router.post('/login', function(req, res) {
    async.waterfall([
        function (cb) {
            redisModel.getRedisData('redis-lock',function(err,data){
                cb(err);
            });
        },
        function (cb) {
            console.log('has get redis ->',Date.now());
            cb();
        }
    ], function (err) {
        if(!err){
            return res.send({status : 'ok'});
        } else {
            return res.send({status : 'fail'});
        }
    });
});

module.exports = router;
