# coding:utf-8

import json

class Tool:

    @staticmethod
    def read_file(file_name):
        with open(file_name, mode = 'r') as fh:
            return fh.read()

    @staticmethod
    def generate_file(text, file_name):
        with open(file_name, mode = 'w', encoding = 'utf-8') as fh:
            fh.write(text)

    @staticmethod
    def generate_json_file(dictionary, file_name):
        with open(file_name, 'w') as f:
            # ensure_ascii=Falseにしないと日本語がエスケープされて "/u0434"みたくなる
            json.dump(dictionary, f, sort_keys=False, indent=4, ensure_ascii=False)
