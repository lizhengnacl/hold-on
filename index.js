/**
 * * Created by lee on 2018/8/20
 */
const EventEmitter = require('events');

class HoldOn {
    constructor (props = {}) {
        this.emitter = new EventEmitter();
        /**
         * 20 * 机器数 = 并发数
         * 根据并发数设置
         */
        this.emitter.setMaxListeners(props.setMaxListeners || 20);
        this.schedule = {}
        this.eventName = props.eventName || 'change';
        this.timeout = props.timeout || 10000;
    }

    async wait (key) {
        return new Promise(async (resolve) => {
            if(this.schedule[key] === 'hold') {
                // 以setTimeout来hold住进程
                let timer = setTimeout(() => {
                    resolve('timeout');
                    clearTimeout(timer);
                }, this.timeout);

                let handler = ({ key: k, status: s }) => {
                    if(k === key && s === 'release') {
                        resolve(s);
                        clearTimeout(timer);
                        this.emitter.removeListener(this.eventName, handler);
                    }
                };
                this.emitter.on(this.eventName, handler);
            } else {
                resolve('release');
            }
        });
    }

    hold (key) {
        this.schedule[key] = 'hold';
        this.emitter.emit(this.eventName, {
            key,
            status: 'hold'
        });
        return this.schedule[key];
    }

    release (key) {
        this.schedule[key] = 'release';
        this.emitter.emit(this.eventName, {
            key,
            status: 'release'
        });
        return this.schedule[key];
    }

    get (key) {
        return this.schedule[key] || 'release';
    }
}

module.exports = HoldOn;
