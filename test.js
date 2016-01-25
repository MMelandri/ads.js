/**
 * Created by jledun on 18/11/15.
 */

var ads = require('./ads.js');
var logger = require('winston');
var async = require('async');
var tag = "test";
var connection = {
    host: "192.168.52.201",
    amsNetIdTarget: "5.25.51.96.1.1",
    amsNetIdSource: "192.168.50.101.1.1"
};
var handles = [
        //~ {symname: '.NBUFFERCOUNTERSACHETSFORMAT1', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.NBUFFERCOUNTERSACHETSFORMAT2', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.SARTICLEBUFFERFORMAT1', bytelength: ads.STRING, propname: 'value'},
        //~ {symname: '.SARTICLEBUFFERFORMAT2', bytelength: ads.STRING, propname: 'value'},
        //~ {symname: '.NENSACHEUSEFORMAT1PRODUCED', bytelength: ads.DINT, propname: 'value'},
        //~ {symname: '.NENSACHEUSEFORMAT2PRODUCED', bytelength: ads.DINT, propname: 'value'},
        //~ {symname: '.STCOUNTERTOT', bytelength: ads.DINT, propname: 'value'},
        //~ {symname: '.BWATCHDOGFILLINGTOTALON', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.NACCUCOUNTERFORMAT1', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.NACCUCOUNTERFORMAT2', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.NEJECTCOUNTERFORMAT1', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.NEJECTCOUNTERFORMAT2', bytelength: ads.INT, propname: 'value'},
        //~ {symname: '.SARTICLEENSACHEUSE', bytelength: ads.STRING, propname: 'value'},
        //~ {symname: '.INDOOR1CLOSED', bytelength: ads.BOOL, propname: 'value'},
        //~ {symname: '.INPHOTOCELLBOX5B8ACCUMULATIONBELTSTART', bytelength: ads.BOOL, propname: 'value'},
        //~ {symname: '.INPHOTOCELLBOX5B9ACCUMULATIONBELTSTOP', bytelength: ads.BOOL, propname: 'value'},
        //~ {symname: '.BAUTOMATIC', bytelength: ads.BOOL, propname: 'value'},
    {
        symname: '.STBUFFERJOB',
        bytelength: [
                ads.STRING,
                ads.STRING,
                ads.WORD,
                ads.WORD,
                ads.WORD,
                ads.WORD,
                ads.WORD,
                ads.WORD,
                ads.WORD,
                ads.WORD,
                ads.UINT,
                ads.DINT,
                ads.UINT,
                ads.BOOL,
                ads.BOOL,
                ads.STRING,
                ads.REAL,
                ads.REAL,
                ads.INT,
                ads.INT,
                ads.INT,
        ],
        propname: [
                'ArticleOF',
                'Article',
                'DateTime_wYear',
                'DateTime_wMonth',
                'DateTime_wDayOfWeek',
                'DateTime_wDay',
                'DateTime_wHour',
                'DateTime_wMinute',
                'DateTime_wSecond',
                'DateTime_wMilliseconds ',
                'Quantity',
                'Color',
                'State',
                'Button',
                'ButtonOld',
                'TextAddress',
                'PositionX',
                'PositionY',
                'MoveMode',
                'Depth',
                'BufferNr',
        ]
    }
];
var handles2 = [
        {
            symname: [
                '.NBUFFERCOUNTERSACHETSFORMAT1',
                '.NBUFFERCOUNTERSACHETSFORMAT2',
                '.SARTICLEBUFFERFORMAT1',
                '.SARTICLEBUFFERFORMAT2',
                '.NENSACHEUSEFORMAT1PRODUCED',
                '.NENSACHEUSEFORMAT2PRODUCED',
                '.STCOUNTERTOT',
                '.BWATCHDOGFILLINGTOTALON',
                '.NACCUCOUNTERFORMAT1',
                '.NACCUCOUNTERFORMAT2',
                '.NEJECTCOUNTERFORMAT1',
                '.NEJECTCOUNTERFORMAT2',
                '.SARTICLEENSACHEUSE',
                '.INDOOR1CLOSED',
                '.INPHOTOCELLBOX5B8ACCUMULATIONBELTSTART',
                '.INPHOTOCELLBOX5B9ACCUMULATIONBELTSTOP',
                '.BAUTOMATIC', 
            ],
            bytelength: [
                ads.INT,
                ads.INT,
                ads.STRING,
                ads.STRING,
                ads.DINT, 
                ads.DINT, 
                ads.DINT, 
                ads.INT,
                ads.INT,
                ads.INT,
                ads.INT,
                ads.INT,
                ads.STRING,
                ads.BOOL,
                ads.BOOL,
                ads.BOOL,
                ads.BOOL,
            ],
            propname: [
                'NBUFFERCOUNTERSACHETSFORMAT1',
                'NBUFFERCOUNTERSACHETSFORMAT2',
                'SARTICLEBUFFERFORMAT1',
                'SARTICLEBUFFERFORMAT2',
                'NENSACHEUSEFORMAT1PRODUCED',
                'NENSACHEUSEFORMAT2PRODUCED',
                'STCOUNTERTOT',
                'BWATCHDOGFILLINGTOTALON',
                'NACCUCOUNTERFORMAT1',
                'ACCUCOUNTERFORMAT2',
                'NEJECTCOUNTERFORMAT1',
                'NEJECTCOUNTERFORMAT2',
                'SARTICLEENSACHEUSE',
                'INDOOR1CLOSED',
                'INPHOTOCELLBOX5B8ACCUMULATIONBELTSTART',
                'INPHOTOCELLBOX5B9ACCUMULATIONBELTSTOP',
                'BAUTOMATIC', 
            ]
        }
    ];
var tags = {};

function readData(handles, api, cb) {
        async.eachSeries(handles, function (handle, each_cb) {

                /**LECTURE DES VARIABLES */
                stocker.read(handle, function (err, newhandle) {
                    tags[newhandle.symname.substring(1, newhandle.symname.length)] = newhandle;
                    logger.info(tags);
                    if (err) {
                        var errmsg = tag + " - mainInterval : erreur lecture des données : " + err;
                        return each_cb(new Error(errmsg));
                    }
                    each_cb(null);
                });

            }, function (err) {

                logger.info(tag + " - fin de cycle lecture des données");
                if (err) logger.info(err);

                return cb(err);
             }
        );
}

var stocker = ads.connect(connection, function () {

    logger.info(tag + " - création d'une nouvelle connexion avec : " + JSON.stringify(connection));

    stocker.readDeviceInfo(function (err, result) {
        logger.info(err);
        logger.info(result);

        logger.info("Lecture des entrées");

        function callback(err) {
                if (err) {
                        stocker.end();
                        process.exit();
                }
                setTimeout(startReadData, 200);
        };
        function startReadData() {
                readData(handles, stocker, callback);
        };
        startReadData();
        
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

