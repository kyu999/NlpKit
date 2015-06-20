# coding:utf-8

from twitter import *
import json

from dao import DAO

"""
tweet区分:
    1. positive
    2. negative
    3. not interested or neutoral

    * if retweet one tweet, the attitude of retweet is same with the attitude of original tweet
"""

class TwitAPI():
    def __init__(self):
        f = open("secret.json")
        secret = json.load(f)
        tw_secret = secret["twitter"]
        self.twit = Twitter(auth=OAuth(tw_secret["access_token_key"], tw_secret["access_token_secret"], tw_secret["consumer_key"], tw_secret["consumer_secret"]))
        self.dao = DAO()

    def generate_json_file(self, dictionary, file_name):
        with open(file_name, 'w') as f:
            # ensure_ascii=Falseにしないと日本語がエスケープされて "/u0434"みたくなる
            json.dump(dictionary, f, sort_keys=False, indent=4, ensure_ascii=False)

    def search(self, keywords, file_name = None):
        data = self.twit.search.tweets(q=" ".join(keywords), count= 100, lang= "ja", result_type= "mixed")
        tweets = [status["text"] for status in data["statuses"]]
        self.dao.insert_tweets(keywords, tweets)
        if(file_name is None):
            return data
        self.generate_json_file(file_name, {"statuses": tweets})
"""
keywords = ["アクティブラーニング"]
twit = TwitAPI()
twit.search(keywords)
"""