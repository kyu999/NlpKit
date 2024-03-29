# coding:utf-8

import xmlpumpkin
from gensim.models import word2vec
import MeCab
import six
import json

from dao import DAO
from tool import Tool

class NlpKit:

    stopwords = json.load(open("stopwords.json"))["stopwords"]

    @staticmethod
    def is_invallid_word(word):
        return word in NlpKit.stopwords

    @staticmethod
    def filter_speeches(features):
        return features[0] == "名詞"
        #return features[1] == "固有名詞"

    @staticmethod
    def text_to_words(text, filter_speeches):
        mecab = MeCab.Tagger("-Owakati")
        node = mecab.parseToNode(text)
        words = []

        while node is not None:
            # if the speech is valid, append, otherwise do nothing
            features = node.feature.split(",")
            try:
                if(NlpKit.is_invallid_word(node.surface)):
                    node = node.next
                    continue
                if(filter_speeches(features)):
                    words.append(node.surface)
            except:
                print("Error occur by node.surface")

            node = node.next

        return words

    @staticmethod
    def count_freq(tokens):
        counter = {} # {"token1": 12, "token2": 5}
        for token in tokens:
            if(token in counter):
                counter[token] = counter[token] + 1
            else:
                counter[token] = 1
        sc = sorted(counter.items(), key=lambda x:x[1])
        sc.reverse()
        return sc

    @staticmethod
    def text_to_phrases(text):
        tree = xmlpumpkin.parse_to_tree(text)
        return [node.surface for node in tree.chunks]

    @staticmethod
    def find_similarities(words, wakati_file):
        data = word2vec.Text8Corpus(wakati_file)
        result = None
        try:
            model = word2vec.Word2Vec(data, size=200, window=5, min_count=1, workers=4)
            return [{"token": word, "similarity": model.most_similar(word)} for word in words]
        except:
            return [{"error": "#words not enough to analyze"}]

    @staticmethod
    def similarity_analyze(words, file_name):
        # word2vec model requires that wakati file has space after changing the line
        wakati = " ".join(words) + " "
        Tool.generate_file(wakati, file_name)
        similars = NlpKit.find_similarities(words, file_name)
        return similars

    @staticmethod
    def save_analysis(result):
        DAO.w2v_coll.save(result)

    @staticmethod
    def analyze(text, file_name, save_mongo):
        words = NlpKit.text_to_words(text, NlpKit.filter_speeches)
        freq = NlpKit.count_freq(words)
        similars = NlpKit.similarity_analyze(words, file_name)
        result = {"frequency": freq, "similarities": similars}
        if(save_mongo):
            NlpKit.save_analysis(result)
        return result

text = """あらすじ[編集]
嬴政との邂逅 - 王弟反乱（1巻 - 4巻）
時代は、紀元前。500年の争乱が続く春秋戦国時代、中国西方の国・秦の片田舎に「信（しん）」と「漂（ひょう）」と言う名の2人の戦災孤児がいた。2人は、下僕の身分ながら、「武功により天下の大将軍になる」という夢を抱き、日々、剣の修行に明け暮れていた。
やがて、大臣である昌文君に見出されて1人仕官した漂だったが、ある夜、残された信の元へ深手を負って戻って来る。息絶えた漂から託された信が辿り着いた目的地には、漂と瓜二つの少年がいた。その少年こそ秦国・第31代目の王である政（せい）であった。漂が命を落とす原因となった政に怒りをぶつける信だったが、自らに託された漂の思いと自らの夢のために、「王弟の反乱」そして乱世の天下に身を投じるのだった。
初陣（5巻 - 7巻）
反乱鎮圧の功績により平民の身分を得た信は三ヶ月後、兵卒として対魏攻防戦で初陣を迎える。劣勢の秦軍の中で信らの伍は奮闘し、千人将・縛虎申と共に魏軍副将・宮元を斃して戦場の要地を奪る。
そこに突如現れた秦の怪鳥・王騎。信は図らずも天下の大将軍と会話する機会を得る。
戦は秦・魏両軍の総大将同士の一騎打ちで決着し、勝利した秦軍は帰国の途についた。
暗殺者襲来（8巻 - 10巻）
秦王・政を弑すべく、王宮に暗殺者の集団が放たれた。百将に昇進した信はこれを迎え撃つが、暗殺団の中に戦場を共にした羌瘣の姿を見つける。彼、否彼女こそは伝説の刺客「蚩尤」に名を連ねる者だった。舞を思わせる剣技に圧倒されるが、他の暗殺団の到着に図らずも共闘することになる。
辛くも暗殺団を撃退、生き残りの口から出た首謀者の名は現丞相・呂不韋であった。今は手を出せぬ巨大な敵に、政・信らは忍耐を余儀なくされる。
秦趙攻防戦 - 王騎の死（11巻 - 16巻）
韓を攻める秦国の隙をつき、積年の恨みを抱く趙軍が侵攻してきた。急報に防衛軍を編成する秦、率いるは最後の六将王騎。
信の率いる百人隊は緒戦で王騎の特命を受け、趙将馮忌を討つ。飛信隊の名をもらった信は、将軍への道を垣間見た。
蒙武軍の覚醒もあって敵軍師・趙荘の采配を悉く上回る王騎であったが、総大将の三大天・龐煖との決着をつけるべく、罠を承知で本陣を進める。龐煖とは、妻になるはずだった六将・摎を討たれていた王騎にとって因縁深き間柄だった。
本軍同士が激突し、総大将同士が一騎打ちを戦う最高潮の中、突如秦軍の背後に未知の新手が姿を見せる。率いるのはもう一人の三大天・李牧であった。一転して死地に追い込まれた秦軍、一瞬の隙を突かれて王騎も致命傷を負う。
信に背負われ激戦の末脱出に成功した王騎は、信に自らの鉾を託し、蒙武他将兵に多くのものを残して逝った。
秦趙同盟 - 山陽攻略戦（17巻 - 23巻）
王騎亡き後、諸国に国境を侵され始める中、三百人隊に増強された飛信隊は各地を転戦していた。そんな中、丞相・呂不韋の画策により趙国宰相が秦を訪れることが伝わる。その宰相こそ誰あろう李牧その人であり、秦趙同盟というとてつもない土産を携えていた。同盟成立後の宴席で李牧と直接話す機会を得た信は、李牧を戦場で斃すことを宣言した。
秦趙同盟の効果は早くも現れ、要衝の地・山陽の奪取を目的とした、対魏侵攻戦が開始される。総指揮官は白老・蒙驁。遠征軍に加わった飛信隊は同じく三百人隊の玉鳳隊（隊長・王賁）、楽華隊（隊長・蒙恬）と競い合いながら功を挙げていく。
進撃する秦軍の前に立ちはだかった魏軍は、想像だにしなかった大物・元趙軍三大天の廉頗に率いられていた。廉頗の登場で全中華が注目する中、秦・魏両軍は決戦の火ぶたを切る。かつての六将に伍すると評される王翦・桓騎の両名を副将に擁する秦軍と、廉頗四天王が率いる魏軍の間で交わされる激戦の中、信は四天王の輪虎を死闘の末討ち取り、戦功第三位の大手柄を挙げる。
ついに相対した総大将同士の一騎打ちの中、蒙驁は六将と三大天の時代の終わりを廉頗に告げる。自らの存命を理由にそれを否定する廉頗であったが輪虎を討ち取った信から王騎の最期を聴き時代の流れを悟る。敗北を認めた廉頗は信に六将と三大天の伝説を塗り替える唯一の方法を教え、堂々と去って行った。
幕間（23巻 - 24巻）
先の戦功により正式に千人隊に昇格した飛信隊であったが戦術の要であった羌瘣が去り、連戦連敗を重ねていた。隊解散の危機に陥るが、立派な軍師に成長した河了貂の加入により救われる。
他方、秦の山陽奪取により生まれた新たな情勢に対し、李牧はある決意を固め動き出す。
合従軍侵攻 - 函谷関攻防戦（25巻 - 30巻）
南の大国・楚に侵攻されただけでなく、同時に北や東からも攻め寄せて来た敵の大軍勢によって、大小様々な城塞を易々と失陥するという凶報が秦の国都・咸陽へ続々ともたらされた。秦の本営に立て直す間も与えぬ破壊力を示し、かつ進撃を止めぬ侵攻軍。これこそ、李牧が画策し、発動させた多国籍連合『合従軍』であった。
たった一国で他国全部を迎え撃つために、秦国の本営はそれまでの防衛線を一切放棄し、国門・函谷関での集中防衛に国運を賭けた。
合従軍侵攻 - 蕞防衛戦（31巻 - 33巻）
北門の函谷関では秦軍諸将の奮戦もあって最大の窮地を凌ぎきったものの、南門の武関から咸陽に至る道沿いの城が次々と陥落するという不測の事態が発生する。李牧が自ら別働軍を率い、国都咸陽を陥落させるべく電撃戦を開始したのであった。この動きを察知した麃公や飛信隊の猛追が間に合うものの、龐煖との一騎打ちの末に麃公を討たれてしまい、飛信隊も敗走を余儀なくされる。
この頃、呂不韋が不穏な画策をするなど内外から危機の迫る咸陽を、国を守る最後の拠点・蕞を防衛すべく、政は自ら出陣する。
幕間（34巻）
合従軍を辛くも撃退し、亡国の危機を脱した秦国では戦災復興と国境防備の再編に追われていた。一方、列国でも李牧や春申君ら合従軍を主導した要人らが遠征に失敗した責により左遷され、国体の変化を遂げつつあった。
その頃、飛信隊を離脱して久しい羌瘣は、同族の羌明からの情報によって仇敵・幽連の居所を突き止め、決戦の地へ乗り込んだ。しかしその情報も策謀に富む幽連の仕組んだ罠で、待ち伏せていた幽族の手練れ30人余に襲われる羌瘣。それでも絶え間なく迫る白刃を掻い潜り、手練れを幾人も斬り伏せ、幽連に一太刀浴びせんとしたところ、簡単に跳ね返される。巫舞すら要らぬ幽連は、羌瘣の想像を遥かに超える怪物と成っていた。王弟謀反（35巻）合従軍以来、久しく無かった趙軍の襲来を退けた屯留から、突如『王弟謀反』の一報が咸陽にもたらされた。２度目の造反とはいうものの、屯留の危機に自ら立ち上がった成蟜の人間的成長を認める政としては、にわかに信じがたい。そこで新将軍の壁に討伐軍を託すとともに、密命を課した。著雍攻略戦（36巻 - 37巻）戦災復興と防備の再編を経て、再び攻勢に移った秦国は、山陽に続く魏国の『著雍』奪取に狙いを定めた。王騎の遺軍を預かる騰将軍へその任が下ると、独立遊軍の玉鳳隊と飛信隊へも増援招集がかかった。しかし、ただでさえ堅固な『著雍』防衛網に、呉鳳明を急遽呼び寄せてまで要衝の防衛強化に努める魏軍には手を焼かされる。そこで北方の王翦軍に更なる増援を求めようにも、対峙中の趙軍まで招き入れてしまう恐れがある、との王賁による提言で騰将軍は現有戦力だけでの継戦を決断する。それでも王賁の献策で、かすかな綻びを突いて果敢に三方から一斉に攻め込む秦軍だったが、その魏陣営には古参の大将軍たち「火龍」の旗が、幾つも翻っていた。毐国自立と嬴政加冠（37巻 - ）激戦の末、奪取した魏領の著雍を、山陽と並ぶ不退転の要地として要塞化するのに莫大な資金を必要とする難題を、隠棲していたはずの太后が後宮による負担を突如申し出てきたことで解決を見出した。ただし、その見返りに北の辺地・太原での暮らしと、その地方長官へ有能なる宦官・嫪毐を据えさせろとの要求を、大王派ばかりか相国派でさえも呑むこととなった。ところが、やがて千や万の規模で守備兵を引き抜かれた著雍では、魏軍の襲来対応に忙殺される。その兵たちの転出先は北の辺地・太原。しかも、あろうことか『毐国』と国家を僭称した太原では、中央政府からの勧告の使者すら取り合わない始末。秦の内外から人や資金を続々と入手し、国家としての体裁を整えていく『毐国』への対応に手をこまねき、越年した秦では、とうとう政が成人した。そう、内外に向けた正式な王としての宣言であり、大王派と相国派の長きに亘る暗闘に終止符を打つ「加冠の儀」を迎える年である。しかし、その儀式を厳かに執り行えるほど、国内情勢は穏やかではなかった。"""

print(NlpKit.analyze(text, "data/wakati_words.txt", True))
