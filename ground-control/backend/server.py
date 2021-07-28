import socket
import threading
from flask import Flask, json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

lock = threading.Lock()
client_connected = False
running = True

@app.route('/client-connection', methods=['GET'])
def client_connection():
    global client_connected
    with lock:
        return json.dumps({'client_connected': client_connected})

@app.route('/update-values', methods=['POST'])
def update_values():
    global client_connected
    with lock:
        if not client_connected:
            return 'Client is not connected'

def serve():
    global client_connected
    global running
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind(('localhost', 1234))
        server.listen()
        while (running):
            conn, addr = server.accept()
            with conn:
                with lock:
                    client_connected = True
                print(conn.recv(120))
            with lock:
                client_connected = False

podIntegration = threading.Thread(target=serve)
podIntegration.start()

app.run()
running = False
podIntegration.join()
