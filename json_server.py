#!/usr/bin/env  python2.7
from flask import Flask, jsonify
from nlp import NlpKit

app = Flask(__name__)

kit = NlpKit()

@app.route('/similarity/<text>')
def hello_world(text):
  result = {
    "data": text#kit.analyze(text, "data/wakati_words.txt")
  }
  return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
