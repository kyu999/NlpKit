from gensim.models import word2vec

data = word2vec.Text8Corpus('data/wakati.txt')
model = word2vec.Word2Vec(data, size=200)

out=model.most_similar(positive=[u'▲▲▲▲'])