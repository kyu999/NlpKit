# coding:utf-8

import json
from dao import DAO

class TwitAPI:

    @staticmethod
    def search(keywords):
        data = DAO.twit.search.tweets(q=" ".join(keywords), count= 100, lang= "ja", result_type= "mixed")
        tweets = [status["text"] for status in data["statuses"]]
        TwitAPI.insert_tweets(keywords, tweets)

    @staticmethod
    def insert_tweets(keywords, tweets):
        DAO.tw_coll.insert({"keywords": keywords, "tweets": tweets})

TwitAPI.search(["翁長"])