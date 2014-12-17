'use strict';

function Record(pouchdb,$log){
    var recordsDB = pouchdb.create('Record');
        //sync = pouchdb.sync('Record', 'https://recorder.couchappy.com', {live: true});
        //
        //sync.on('change', function (info) {
        //    $log.info('change',info);
        //    // handle change
        //}).on('complete', function (info) {
        //    $log.info('complete',info);
        //    // handle complete
        //}).on('uptodate', function (info) {
        //    $log.info('uptodate',info);
        //    // handle up-to-date
        //}).on('error', function (err) {
        //    $log.error(err);
        //    // handle error
        //});

    var service = {
        save: function(record){
            console.log(record);
            return recordsDB.put(record);
        },
        findAll: function(){
            return recordsDB
                .allDocs()
                .then(function(records){
                    service.list = records.rows;
                });
        },
        findOne: function(id){
            return recordsDB
                .get(id)
                .then(function(record){
                    service.one = record;
                });
        },
        update: function(record){
            return recordsDB.put(record);
        },
        remove: function(record){
            return recordsDB
                .get(record.id)
                .then(recordsDB.remove);
            //return recordsDB.remove(record.id,record.value.rev);
        }
        //sync: sync
    };
    return service;
}

angular.module('app.common.model.record',[])
    .factory('Record',Record);