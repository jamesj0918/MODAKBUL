from flask import Flask, render_template, redirect, request, jsonify
import MySQLdb
import os
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')
@app.route('/sign-in')
def login():
	return render_template('login.html')
@app.route('/board')
def board():
	return render_template('board.html')

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=80, debug = True)