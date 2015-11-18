/**
 * Created by jledun on 18/11/15.
 */

var ads = require('ads');
var logger = require('winston');
var async = require('async');
var tag = "test";
var connection = {
    host: "192.168.52.204",
    amsNetIdTarget: "5.24.97.112.1.1",
    amsNetIdSource: "192.168.50.101.1.1"
};
var handles = [
    {symname: '.SARTICLEOFTALON', bytelength: ads.STRING, propname: 'value'},
    {symname: '.SARTICLETALON', bytelength: ads.STRING, propname: 'value'},
    {symname: '.NENSACHEUSEFORMATTALON', bytelength: ads.DINT, propname: 'value'},
    {symname: '.NENSACHEUSEFORMATORDER', bytelength: ads.DINT, propname: 'value'},
    {symname: '.NTALONCOUNTERTOT', bytelength: ads.DINT, propname: 'value'},
    {symname: '.NENSACHEUSECONVEYORTALON', bytelength: ads.DINT, propname: 'value'},
    {symname: '.BWATCHDOGFILLINGTOTALON', bytelength: ads.INT, propname: 'value'}
];

var stocker = ads.connect(connection, function () {

    logger.info(tag + " - création d'une nouvelle connexion avec : " + JSON.stringify(connection));

    stocker.readDeviceInfo(function (err, result) {
        logger.info(err);
        logger.info(result);

        logger.info("Lecture des entrées");
        self.async.eachSeries(handles, function (handle, each_cb) {

            /**LECTURE DES VARIABLES */
            self.stocker.read(handle, function (err, newhandle) {
                logger.info(tag + " donnée : ");
                logger.info(newhandle);
                if (err) {
                    var errmsg = tag + " - mainInterval : erreur lecture des données : " + err;
                    return each_cb(new Error(errmsg));
                }
                each_cb(null);
            });

        }, function (err) {

            logger.debug(self.conf.tag + " - fin de cycle lecture des données : " + (new Date().getTime() - self.start) + " ms depuis de le départ");

            stocker.end();
        });

    });

});

//    // READ DEVICE INFO
//    self.stocker.readDeviceInfo(function (err, result) {
//        logger.debug(tag + " - lecture des infos");
//        // LECTURE DES INFO SUR LE SERVEUR
//        if (err) {
//            var errmsg = tag + " - readDeviceInfo : " + JSON.stringify(err);
//            return cb(new Error(errmsg));
//        }
//        //logger.info(self.conf.tag + " - deviceInfo : " + JSON.stringify(result));
//        self.deviceInfo = result;
//
//        // LECTURE DE LA TABLE D'ENTRÉES
//        self.newInputData = {};
//
//        // CONTRÔLE CONTENU TABLE D'ENTRÉES
//        if (self[self.conf.gethandles].length == 0) {
//            logger.debug(self.conf.tag + " - pas de données à lire");
//            return cb(null);
//        }
//        self.start = new Date().getTime();
//
//        logger.debug(self.conf.tag + " - dcy lecture données : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//        self.async.eachSeries(self[self.conf.gethandles], function (handle, each_cb) {
//
//            /**LECTURE DES VARIABLES */
//            self.stocker.read(handle, function (err, newhandle) {
//                logger.verbose(self.conf.tag + " - lecture données : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                if (err) {
//                    var errmsg = self.conf.tag + " - mainInterval : erreur lecture des données : " + err;
//                    return each_cb(new Error(errmsg));
//                }
//                self.newInputData[newhandle.symname.substring(1, newhandle.symname.length)] = newhandle.value;
//                each_cb(null);
//            });
//
//        }, function (err) {
//
//            logger.debug(self.conf.tag + " - fin de cycle lecture des données : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//            if (err) return cb(err);
//
//            self.async.series([
//                    // EXPLOITATION DES DONNÉES
//                    function (series_cb) {
//                        logger.debug(self.conf.tag + " - dcy getData : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                        getData(series_cb);
//                    },
//
//                    /**LECTURE DES DÉCLENCHEURS */
//                        function (series_cb) {
//                        logger.debug(self.conf.tag + " - dcy process : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                        process(series_cb)
//                    },
//
//                    /**PRÉPARATION DES SORTIES */
//                        function (series_cb) {
//                        logger.debug(self.conf.tag + " - dcy setData : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                        setData(series_cb);
//                    },
//
//                    /**ÉCRITURE DES SORTIES */
//                        function (series_cb) {
//                        logger.debug(self.conf.tag + " - dcy écriture des sorties : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//
//                        if (self[self.conf.sethandles].length == 0) {
//                            logger.debug(self.conf.tag + " - rien à écrire : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                            return series_cb(null);
//                        }
//
//                        self.async.eachSeries(self[self.conf.sethandles], function (handle, each_cb2) {
//
//                            /**CONTRÔLE EXISTANCE VARIABLE */
//                            if (typeof handle.value == 'undefined') return each_cb2(null);
//                            if (handle.value == '') return each_cb2(null);
//
//                            /**ÉCRITURE DES VARIABLES */
//                                //self.stocker.write(handle, function (err) {
//                                //    if (err) {
//                                //        var errmsg = self.conf.tag + " - mainInterval : erreur écriture des données : " + err;
//                                //        return each_cb2(new Error(errmsg));
//                                //    }
//                            each_cb2(null);
//                            //});
//
//                        }, function (err) {
//                            logger.debug(self.conf.tag + " - fin écriture données : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                            //if (err) return series_cb(err);
//                            series_cb(err);
//                        });
//                    }
//
//                ], function (err) {
//                    logger.debug(self.conf.tag + " - fin de cycle général : " + (new Date().getTime() - self.start) + " ms depuis de le départ");
//                    cb(err);
//                }
//            );
//        });
//
//    });
//});

stocker.on('error', function (err) {
    logger.warn(tag + " - connection error event : " + err);
});

stocker.on('timeout', function (err) {
    logger.warn(tag + " - connection timeout event : " + err);
});

