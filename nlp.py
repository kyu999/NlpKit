# coding:utf-8

import xmlpumpkin
from gensim.models import word2vec
import MeCab
import six

"""
問題はmecabから取得した文字列ではなく、ファイル書き込み自体にある。
分かち書き自体も問題ない。
コンテントではなくpythonによるファイル作成自体に問題がある。
TypeError: can't concat bytes to str
バイト文字列と通常の文字列をどこかで連結しているがためにエラーが起きている。mecabでわかちファイルを作成した場合問題ないので、
エンコーディング周りが原因だと思われる。
"""
# 問題はわかちがきのテキストファイル。
def text_to_words(text, valid_speeches):
    mecab = MeCab.Tagger()
    nodes = mecab.parseToNode(text)
    words = []

    while True:
        if(nodes == None):
            break
        # if the speech is valid, append, otherwise do nothing
        features = nodes.feature.split(",")
        if(features[0] in valid_speeches):
            words.append(nodes.surface)
        nodes = nodes.next

    return words
    #return mecab.parse(text)

def text_to_phrases(text):
    tree = xmlpumpkin.parse_to_tree(text)
    return [node.surface for node in tree.chunks]

def read_file(file_name):
    with open(file_name, mode = 'r') as fh:
        return fh.read()

def generate_file(text, file_name):
    with open(file_name, mode = 'w', encoding = 'utf-8') as fh:
        fh.write(text)

def find_similarities(list, wakati_file):
    data = word2vec.Text8Corpus(wakati_file)
    model = word2vec.Word2Vec(data, size=200, window=5, min_count=1, workers=4)
    return [model.most_similar(token) for token in list]

"""
sg defines the training algorithm. By default (sg=1), skip-gram is used. Otherwise, cbow is employed.

size is the dimensionality of the feature vectors.

window is the maximum distance between the current and predicted word within a sentence.

alpha is the initial learning rate (will linearly drop to zero as training progresses).

seed = for the random number generator. Initial vectors for each word are seeded with a hash of the concatenation of word + str(seed).

min_count = ignore all words with total frequency lower than this.

sample = threshold for configuring which higher-frequency words are randomly downsampled;
default is 0 (off), useful value is 1e-5.
workers = use this many worker threads to train the model (=faster training with multicore machines).

"""

def text_analyze(text):
    words = text_to_words(text, {"名詞"})
    wakati_words = " ".join(words).strip()

    phrases = text_to_phrases(text)
    wakati_phrases = " ".join(phrases).strip()

    words_file = "data/wakati_words.txt"
    phrases_file = "data/wakati_phrases.txt"
    
    generate_file(wakati_words, words_file)
    generate_file(wakati_phrases, phrases_file)

    words_similars = find_similarities(words, words_file)
    phrases_similars = find_similarities(phrases, phrases_file)

    print("words_similars")
    print(words_similars)
    print("phrases_similars")
    print(phrases_similars)
"""

text = """戦争孤児の少年。低い身分から自らの腕で「天下の大将軍」となることを目指す。1話冒頭で「李信」と呼ばれている。豪気且つ直情径行で、自分の意志を貫く頑強な心を持つ。ただ礼儀作法は知らず、秦王である嬴政も堂々と呼び捨てている。相手が格上であってもそれに比例して自分の実力を底上げする武の天稟の持ち主。漂によると「自分が勝てない相手に信は勝つことができる」と言う。当初は自分の武力で全てを片付けようとする猪突猛進型であったが、王騎からの修行や助言、幾多の経験を経て「将軍」としての実力を身につけていく。王都奪還編後、昌文君から恩賞として土地と家（小屋）を与えられ下僕から平民となる。更に対魏国戦争における武勲により、まだ少年ながら百人将へ取り立てられる。趙軍侵攻編では王騎に「飛信隊」の名を貰い、趙将の馮忌を討ち取ると言う大功を上げる。その後、龐煖の夜襲によって大半の隊員を失うものの、生き残った仲間たちと王騎の最期に立ち会い、王騎から矛を譲り受けた[注 1]。趙との戦争の後は三百人将へ格上げされ、廉頗率いる魏軍との決戦直前には蒙恬や王賁とともに臨時千人将となった。その戦いの終盤、廉頗四天王の一人である輪虎を激戦の末に討ち果たした大功を認められ、正式に千人将へと昇進する。昇進直後は羌瘣が離脱したことと千人隊の規模の大きさが災いして連戦連敗を喫したが、貂が軍師として参入したことで持ち直した。対合従軍戦では麃公軍へと組み込まれ、趙将の万極を討ち取った。この際、本能型の才気があると認めてくれた麃公の軍から隊員を臨時補充され、二千人将の扱いとなる。その後、最期を見届けた麃公から遺品となる盾を託された。そして、叢の戦いの終盤では、龐煖を一騎打ちの末に撃退する。対合従軍戦終結後、論功行賞で三つの特別準功の一つとして正式に三千人将へ昇進し、飛信隊を率いて国境の防衛と復興に向かった。屯留の反乱では、謀略に嵌められた成蟜を救出する密命を課せられる。その際すでに四千人将に昇進しており、王騎の矛を使う準備の為に矛を使い始めている。だが、成矯の救出には間に合わなかった。著雍争奪戦では、魏軍本陣をわずか３日で陥落させる為の三つの主攻の一つを任された。だが初日から敵将・凱孟の挑発に乗って一騎打ちに興じるあまり、河了貂を荀早隊に拿捕されて動揺してしまい、唯一人で奪回を試みて失敗した羌瘣を責めた。幸いにも羌瘣が捕えていた荀早との人質交換が翌日に成立するも、貴重な2日目を台無しにする。その夜には羌瘣へ謝罪した。翌朝に河了貂から示された作戦で臨んだ最終日では、魏軍本陣を狙った羌瘣隊を欠いたことで凱孟軍に追い詰められるが、作戦通りに現れた隆国軍の救援を得て窮地を脱した。そして、遅ればせながら魏軍本陣へ向かう途中で呉鳳明の一行と遭遇し襲撃するが、呉鳳明の咄嗟の機転から、誤認した霊凰の方を討ち取った。著雍戦後には五千人将に昇進した。"""
#data = read_file("data/raw.txt")
#print(data)
text_analyze(text)

# cabocha

"""
戦争孤児の 少年。 低い 身分から 自らの 腕で
"""

# mecab

"""
戦争 孤児 の 少年 。 低い 身分 から 自ら の 腕 で 
"""

"""
{やりたいこと: 係受け解析と形態素解析を融合したコンパクトな分析, 
 コンパクトな分析とは: 数万件のデータを入力するのではなく、少数のデータで理解可能で有用な知見を発掘する,
 戦略: [係受け解析, 形態素解析, 次元圧縮, 潜在意味解析],
 武器: [mecab, cabocha, gensim]
"""