// importScriptsが見つからないケースを避けるため
if( 'undefined' === typeof window){
    self.importScripts('rakutenma.js', 'model_ja.js', 'hanzenkaku.js');
}

// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

// tokenizeがとても重たい処理なのでweb workerとして並列処理する
onmessage = function(e) {
  postMessage(rma.tokenize(e.data))
};