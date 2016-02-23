#!/usr/bin/python
import os
import json
import hashlib
from selenium import webdriver
from flask import Flask

BUF_SIZE = 65536
app = Flask('__app__', static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/css/')
def css_send():
    return app.send_static_file('style.css')

@app.route('/js/')
def js_send():
    return app.send_static_file('main.js')

@app.route('/data/')
def json_send():
    return app.send_static_file('data.json')

def hash_file(hash_obj, file_name):
    with open(file_name, "rb") as f:
        while True:
            data = f.read(BUF_SIZE)
            if not data:
                break
            hash_obj.update(data)
    value = str(hash_obj.hexdigest())
    return "SHA1: %s" % (value)

def save(data):
    with open("./static/data.json", "w") as f:
        f.write(data)

def open_browser():
    driver = webdriver.Firefox()
    driver.get("http://localhost:8000/")

def file_search(dirs, filters):
    result = []
    for dir in dirs:
        for root, directories, filenames in os.walk(dir):
            for filename in filenames:
                if filters != []:
                    contains_filters = True
                    for filter in filters:
                        if filter not in filename:
                            contains_filters = False
                    if(contains_filters):
                        result.append(os.path.join(root, filename))
                else:
                    result.append(os.path.join(root, filename))
    return result

def main():
    print("[+] Starting Duplicate Finder")
    files_dict = []

    print("[*] Please input starting directories separated by commas ','")
    user_input = raw_input(">> ")
    while user_input == "":
        print("[-] Must input value")
        user_input = raw_input(">> ")

    search = []
    if "," in user_input:
        search = user_input.split(",")
    else:
        search = [user_input]

    print("[*] Please input any substring that must be in filename separated by commas (Not required)")
    user_input = raw_input(">> ")

    SHA1 = hashlib.sha1()
    if user_input != "":
        if "," in user_input:
            for file in file_search(search, user_input.split(",")):
                files_dict.append({"file": file, "hash": hash_file(SHA1, file)})
                SHA1 = hashlib.sha1()
        else:
            for file in file_search(search, [user_input]):
                files_dict.append({"file": file, "hash": hash_file(SHA1, file)})
                SHA1 = hashlib.sha1()
    else:
        for file in file_search(search, []):
            files_dict.append({"file": file, "hash": hash_file(SHA1, file)})
            SHA1 = hashlib.sha1()

    save(json.dumps(files_dict))
    open_browser()
    app.run(host = '127.0.0.1', port = 8000)

if __name__ == "__main__":
    main()
