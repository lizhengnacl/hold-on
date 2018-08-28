## 背景
并发场景下，避免相同耗时操作`action`被重复触发，第`1`个请求触发`action`后，后续`n`个同质请求被`await`住，直到`action`执行结束，`n`个同质请求再继续执行，并直接使用`action`的结果。

## 示例
```
const HoldOn = require('hold-on');
const holdOn = new HoldOn();

// 判断是否进入耗时操作
const key = 'some key';
let status = holdOn.get(key);
if(status !== 'hold') {
    await holdOn.hold(key);
    await action(); // 模拟耗时操作
    await holdOn.release(key);
}
await holdOn.wait(key);
// 结束耗时操作，继续流程
```
