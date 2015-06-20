from pymongo import MongoClient
import json

class DAO():
    def __init__(self):
        f = open("secret.json")
        mongo_info = json.load(f)["mongo"]
        self.client = MongoClient("mongodb://" + mongo_info["user"] + ":" + mongo_info["ps"] + "@" + mongo_info["cluster"] + ".mongolab.com:" + mongo_info["node_id"] + "/" + mongo_info["coll_name"])
        self.tw_db = self.client["twitter_storage"]
        self.tw_coll = self.tw_db["tweets"]

    def insert_tweets(self, keywords, tweets):
        self.tw_coll.insert({"keywords": keywords, "tweets": tweets})