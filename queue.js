/**
 * Created by lixiaodong on 16/5/26.
 */
var queue = [];

exports.enqueue = function(obj){
    if(queue.length >= 20){
        return 'full';
    }
    queue.push(obj);
    return 0;
}

exports.unqueue = function () {
    var obj = queue.shift();
    return obj;
}