import socket
import threading
import struct
from flask import Flask, json, request
from flask_cors import CORS
from time import sleep

app = Flask(__name__)
CORS(app)

socket.setdefaulttimeout(20)

lock = threading.Lock()
client_connected = False
running = True

# Sat related fields
stepsPerRevolution = 200
scanSpeed = 10
retreatSpeed = 40
arcSize = int(stepsPerRevolution / 4)

@app.route('/client-connection', methods=['GET'])
def client_connection():
    global client_connected
    with lock:
        return json.dumps({'client_connected': client_connected})

@app.route('/update-values', methods=['POST'])
def update_values():
    global client_connected
    global stepsPerRevolution
    global scanSpeed
    global retreatSpeed
    global arcSize
    with lock:
        if not client_connected:
            return 'Client is not connected'
        res = request.json
        stepsPerRevolution = int(res['stepsPerRevolution'], 10)
        scanSpeed = int(res['scanSpeed'], 10)
        retreatSpeed = int(res['retreatSpeed'], 10)
        arcSize = int(res['arcSize'], 10)
    return 'OK'
        

def serve():
    global client_connected
    global running
    global stepsPerRevolution
    global scanSpeed
    global retreatSpeed
    global arcSize
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        ip, port = '192.168.250.90', 1234
        print(f'listenning on ip: {ip} on port: {port}')
        server.bind((ip, port))
        server.listen()
        while (running):
            print('Waiting for client to connect...')
            conn, addr = server.accept()
            with conn:
                with lock:
                    client_connected = True
                while True:
                    message = ''
                    with lock:
                        message = struct.pack('H', stepsPerRevolution) + \
                            struct.pack('H', scanSpeed) + \
                            struct.pack('H', retreatSpeed) + \
                            struct.pack('H', arcSize)
                    try:
                        if conn.recv(8) == b'ready':
                            conn.send(message)
                        # TODO: Add reading from camera
                    except (socket.timeout, ConnectionResetError):
                        print('client disconnected')
                        break
                    sleep(5)
            with lock:
                client_connected = False

podIntegration = threading.Thread(target=serve)
podIntegration.start()

app.run()
running = False
podIntegration.join()
