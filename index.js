(function(module) {
    'use strict';
    var winston = module.parent.require('winston'),
        async = module.parent.require('async'),
        file = module.parent.require('./file'),
        plugin = {};

    plugin.init = function(params, callback) {
        callback();
    };

    plugin.upload = function (data, callback) {
        var settings,
            image = data.image;

        async.waterfall([
            function (next) {
                winston.log('image :' + image.path);
                var fileName = new Date().getTime() + image.name;
                file.saveFileToLocal(fileName, 'files', image.path, function (err,data) {
                    if (err) {
                        winston.error(err);
                    } else {
                        winston.log(data);
                    }
                    return next(null, {
                        name: image.name,
                        url: data.url
                    });
                });
            }
        ], callback);
    };

    module.exports=plugin;
}(module));
