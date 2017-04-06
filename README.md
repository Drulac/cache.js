# cache.js
Little cache lib using localStorage and promises.

You just have to include [cache.js](cache.js) :
```html
<script type="text/javascript" src="cache.js"></script>
```

## How to use
Create a cache object :
```js
let cache = new Cache();
```
Add a custom method using `cache.newMethod(methodName, promise, validTimeInSecond)` :
```js
cache.newMethod("methodName", (arg1, arg2)=>{
	return new Promise((resolve, reject)=>{
		
		//work
		let result = arg1 + arg2;
		
		resolve(result);
	});
}, 10); //valid time in seconds
```

then you can call your custom method like a normal method :
```js
cache.methodName();
```
That will return a promise. The data is automaticaly updated when she have expirate.
