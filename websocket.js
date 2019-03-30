const WebSocket = require('ws');
const pako = require('pako');

class IIRoseWebSocket {
    constructor() {
        this.open();
        setInterval(() => {
            if (this.websocket.readyState === WebSocket.OPEN) {
                this.send('u');
            }
        }, 36e4);
    }

    open() {
        this.websocket = new WebSocket('wss://m.iirose.com/', {
            rejectUnauthorized: false,
        });
        this.websocket.binaryType = 'arraybuffer';
        this.setCallBacks();
    }

    setCallBacks() {
        this.websocket.onopen = () => this.onopen();
        this.websocket.onmessage = event => {
            let array = new Uint8Array(event.data);

            let message;
            if (array[0] === 1) {
                message = pako.inflate(array.slice(1), {
                    to: 'string'
                });
            } else {
                message = Buffer.from(array).toString('utf8');
            }

            this.onmessage(message);
        };
        this.websocket.onclose = () => this.open();
    }

    close() {
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.terminate();
        }
    }

    send(data) {
        let buffer = Buffer.from(data);
        let array = Uint8Array.from(buffer);

        if (array.size > 256) {
            let deflatedData = pako.gzip(data);
            let deflatedArray = new Uint8Array(deflatedData.length + 1);
            deflatedArray[0] = 1;
            deflatedArray.set(deflatedData, 1);
            this.websocket.send(deflatedArray);
        } else {
            this.websocket.send(array);
        }
    }
}

module.exports = new IIRoseWebSocket();