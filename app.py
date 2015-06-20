# coding:utf-8

from twitter import *
import json
from flask import Flask, jsonify
from nlp import NlpKit

app = Flask(__name__)
app.debug=True

kit = NlpKit()

@app.route('/')
def hello_world():
    return "Hello world!"

@app.route('/nlp/<text>')
def nlp(text):
  result = {
    "data": kit.analyze(text, "data/wakati_words.txt")
  }
  return jsonify(result)

@app.route('/twitter/<keyword>')
def twitter(keyword):

    data = t.search.tweets(q="#" + keyword)
    with open('twitter.json', 'w') as f:
        # ensure_ascii=Falseにしないと日本語がエスケープされて "/u0434"みたくなる
        json.dump(data, f, sort_keys=True, indent=4, ensure_ascii=False)

    return jsonify(data)

if __name__ == '__main__':
    app.run()