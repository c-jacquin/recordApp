'use strict';

function Record(pouchdb,FileService,$log,Recorder,$q,$timeout){
    var recordsDB = pouchdb.create('Record'),
        meta,
        list,
        one;
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

    return{
        save: function(record){
            return recordsDB.put(record);
        },
        findAll: function(){
            return recordsDB
                .allDocs()
                .then(function(records){
                    list = records.rows;
                });
        },
        findOne: function(id){
            return recordsDB
                .get(id)
                .then(function(record){
                    one = record;
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
        },
        getBase64: function(id){
            return recordsDB
                .getAttachment(id,'attachment')
                .then(FileService.blobToBase64);
        },
        buildData: function(meta,record){
            var deferred = $q.defer(),
                isVideo = Recorder.isVideo(),
                attachments;
            console.log(meta, record
            );
            if(angular.isObject(meta)){
                if(isVideo){
                    meta.type = 'video/webm';
                    attachments = {
                        'video': {
                            'content_type': meta.type,
                            'data': record.videoUrl.replace('data:video/webm;base64,', '')
                        }
                    };
                    if('WebkitAppearance' in document.documentElement.style){
                        meta.type = 'audio/wav';
                        attachments['audio'] = {
                            'content_type': meta.type,
                            'data': record.audioUrl.replace('data:audio/wav;base64,','')
                        }
                    }
                }else{
                    if('WebkitAppearance' in document.documentElement.style) {
                        meta.type = 'audio/wav';
                        attachments = {
                            'audio': {
                                'content_type': meta.type,
                                'data': record.audioUrl.replace('data:audio/wav;base64,', '')
                            }
                        }
                    }else{
                        meta.type = 'video/webm';
                        attachments = {
                            'audio': {
                                'content_type': meta.type,
                                'data': record.audioUrl.replace('data:video/webm;base64,', '')
                            }
                        }
                    }
                }
                $timeout(function(){
                    deferred.resolve(angular.extend(meta, {
                        '_attachments': attachments
                    }));
                });
            }else{
                throw new Error('meta is undefined');
            }
            return deferred.promise;
        },
        setMeta: function(metaData){
            meta = metaData;
        },
        list: function(){
            return list;
        },
        one: function(){
            return one;
        }
        //sync: sync
    };
}

angular.module('app.common.model.record',[])
    .factory('Record',Record);