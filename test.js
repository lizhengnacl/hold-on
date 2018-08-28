/**
 * * Created by lee on 2018/8/28
 */

const Koa = require('koa');
const HoldOn = require('./index');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const app = new Koa();
const holdOn = new HoldOn({

});

let count = 0;

app.use(async ctx => {

    // 判断是否进入耗时操作
    const key = 'some key';
    let status = holdOn.get(key);
    if(status !== 'hold') {
        await holdOn.hold(key);
        await delay(3000); // 模拟耗时操作
        await holdOn.release(key);
    }
    await holdOn.wait(key);
    // 结束耗时操作，继续流程

    ctx.body = count++;
});

app.listen(4000);
