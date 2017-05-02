(function(module) {

    'use strict';
    var winston = module.parent.require('winston'),
    async = module.parent.require('async'),
    file = module.parent.require('./file'),
    user = module.parent.require('./user'),
    fs = require('fs'),
    path = require('path'),
    nconf = require('nconf');

    var plugin = {};

    plugin.init = function(params, callback) {
        callback();
    };

    plugin.upload = function (data, callback) {
        var settings;
        var image = data.image;
        var uid = data.uid;
        var folder = 'files';
        async.waterfall([
            function (next) {
                winston.log('image '+image.path);
                var fileName = new Date().getTime()+image.name;
                var uploadPath = path.join(nconf.get('upload_path'), folder, ''+uid);
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath);
                } else {
                    winston.log('Folder exists');
                }

                file.saveFileToLocal(fileName, 'files/'+uid, image.path, function(err, data){
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
