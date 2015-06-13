if( 'undefined' === typeof window){
    self.importScripts('rakutenma.js', 'model_ja.js', 'hanzenkaku.js');
}
// 形態素解析のためにrakutenMAをロードする
rma = new RakutenMA(model_ja);
rma.featset = RakutenMA.default_featset_ja;
rma.hash_func = RakutenMA.create_hash_func(15);

onmessage = function(e) {
  console.log(e.data)
  postMessage(rma.tokenize(e.data))
};