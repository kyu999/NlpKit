#!/usr/bin/env  python2.7
from flask import Flask, jsonify
#from nlp import NlpKit

app = Flask(__name__)
app.debug=True

kit = NlpKit()

@app.route('/')
def hello_world():
    return "Hello world!"

@app.route('/nlp/<text>')
def nlp(text):
  result = {
    "data": text#kit.analyze(text, "data/wakati_words.txt")
  }
  return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0')