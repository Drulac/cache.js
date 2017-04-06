class Cache {
	constructor (nom) {
		this._methods = [];

		if(typeof(Storage) !== "undefined"){
			this._data = localStorage;
		}else{
			this._data = {};
			console.log("no localstorage :-/\nPlease update your browser.");
		}
		if(this._data._expirations === undefined)
		{
			this._data._expirations = JSON.stringify({});
			this._data._data = JSON.stringify({});
		}
	}

	_timestamp (){
		return Math.floor(Date.now() / 1000);
	}

	_append (data, key, value){
		let tmp = JSON.parse(data);
		tmp[key] = value;
		tmp = JSON.stringify(tmp);

		return tmp;
	}

	_get (data, key){
		let tmp = JSON.parse(data);

		return tmp[key];
	}

	newMethod (name, cb, expirationTime){
		this._methods[name] = cb;

		let updateData = (args)=>{
			let retour = this._methods[name].apply(this, args);
			if(retour instanceof Promise)
			{
				retour.then((retour)=>{
					this._data._data = this._append(this._data._data, name, retour);
					this._data._expirations = this._append(this._data._expirations, name, expirationTime+this._timestamp());
				});
				return retour;
			}else{
				this._data._data = this._append(this._data._data, name, retour);
				this._data._expirations = this._append(this._data._expirations, name, expirationTime+this._timestamp());
				return new Promise((resolve, reject)=>{
					resolve(retour);
				});
			}
		}

		this[name] = function(){
			if(this._get(this._data._expirations, name) === undefined || this._get(this._data._expirations, name) < this._timestamp())
			{
				//if expirate
				if(!navigator.onLine)
				{
					//if offline
					console.log("offline");
					//serv expirate content
					return new Promise((resolve, reject)=>{
						resolve(this._get(this._data._data, name));
					});
				}else{
					//if online -> update data
					return updateData(arguments);
				}
			}else{
				//if not expirate
				return new Promise((resolve, reject)=>{
					resolve(this._get(this._data._data, name));
				});
			}

		}
	}
};
