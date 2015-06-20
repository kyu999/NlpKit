from pymongo import MongoClient
import json
from twitter import *

class DAO:
    secret = json.load(open("secret.json"))
    tw_secret = secret["twitter"]
    twit = Twitter(auth=OAuth(tw_secret["access_token_key"], tw_secret["access_token_secret"], tw_secret["consumer_key"], tw_secret["consumer_secret"]))

    mongo_info = secret["mongo"]
    client = MongoClient("mongodb://" + mongo_info["user"] + ":" + mongo_info["ps"] + "@" + mongo_info["cluster"] + ".mongolab.com:" + mongo_info["node_id"] + "/" + mongo_info["database"])
    db = client["nlpkit"]
    config_coll = db["config"]
    tw_coll = db["tweets"]
    w2v_coll = db["word2vec"]