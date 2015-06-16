# coding:utf-8

import oauth2 as oauth
from urllib import urlencode

consumer_key=''
consumer_secret=''
access_token_key=''
access_token_secret=''
 
client  = oauth.Client(
    oauth.Consumer(key=consumer_key, secret=consumer_secret),
    oauth.Token(access_token_key, access_token_secret)
)
 
data = client.request('https://twitter.com/search?q=anime','GET')

f = open('data.txt', 'w')
f.write(data)
f.close()
