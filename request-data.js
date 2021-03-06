///[readme.md]

function getRequestData(maxSize, raw, callback){

    if(typeof maxSize !== 'number'){
        callback = raw;
        raw = maxSize;
        maxSize = null;
    }

    if(typeof raw !== 'boolean'){
        callback = raw;
        raw = null;
    }

    return function(){
        var data = '',
            args = Array.prototype.slice.call(arguments),
            request = args[0],
            response = args[1];

        request.on('data',function(chunk){
            if(data.length > (maxSize || getRequestData.maxRequestSize || 1e6)){
                // flood attack, kill.
                request.connection.destroy();
            }
            data += chunk.toString();
        });

        request.on('end', function(){
            callback.apply(null, args.concat([raw ? data : data ? JSON.parse(data) : undefined]));
        });
    };
}
module.exports = getRequestData;