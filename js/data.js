var version = "2.5";
var Data = (function() {
	var entryArray = [];
	var currentEntry = {};
	var currentEntryNum = 0;
	function getEntry(){
		for(var i in entryArray){
			if(entryArray[i].name === window.localStorage.padboxer_current){
				currentEntry = entryArray[i];
				currentEntryNum = i;
			}
		}
	}
	function createEntry(){
		var tmpEntry = {};
		tmpEntry.name = "主帳號";
		tmpEntry.version = version;
		tmpEntry.boxid = 0;
		tmpEntry.box = [];
		tmpEntry.material = JSON.parse("[{\"no\":147,\"quantity\":0},{\"no\":148,\"quantity\":0},{\"no\":149,\"quantity\":0},{\"no\":150,\"quantity\":0},{\"no\":151,\"quantity\":0},{\"no\":321,\"quantity\":0},{\"no\":1176,\"quantity\":0},{\"no\":161,\"quantity\":0},{\"no\":171,\"quantity\":0},{\"no\":166,\"quantity\":0},{\"no\":162,\"quantity\":0},{\"no\":172,\"quantity\":0},{\"no\":167,\"quantity\":0},{\"no\":1294,\"quantity\":0},{\"no\":163,\"quantity\":0},{\"no\":173,\"quantity\":0},{\"no\":168,\"quantity\":0},{\"no\":1295,\"quantity\":0},{\"no\":164,\"quantity\":0},{\"no\":174,\"quantity\":0},{\"no\":169,\"quantity\":0},{\"no\":165,\"quantity\":0},{\"no\":175,\"quantity\":0},{\"no\":170,\"quantity\":0},{\"no\":234,\"quantity\":0},{\"no\":152,\"quantity\":0},{\"no\":153,\"quantity\":0},{\"no\":154,\"quantity\":0},{\"no\":227,\"quantity\":0},{\"no\":1085,\"quantity\":0},{\"no\":1086,\"quantity\":0},{\"no\":1087,\"quantity\":0},{\"no\":155,\"quantity\":0},{\"no\":156,\"quantity\":0},{\"no\":157,\"quantity\":0},{\"no\":158,\"quantity\":0},{\"no\":159,\"quantity\":0},{\"no\":160,\"quantity\":0},{\"no\":246,\"quantity\":0},{\"no\":247,\"quantity\":0},{\"no\":248,\"quantity\":0},{\"no\":249,\"quantity\":0},{\"no\":250,\"quantity\":0},{\"no\":251,\"quantity\":0},{\"no\":915,\"quantity\":0},{\"no\":916,\"quantity\":0},{\"no\":1325,\"quantity\":0},{\"no\":1326,\"quantity\":0},{\"no\":1327,\"quantity\":0},{\"no\":1328,\"quantity\":0},{\"no\":1329,\"quantity\":0}]");
		tmpEntry.setting = JSON.parse("[false,false,null,[true,true,true,true,true,true,true,true,true],false,0]");
		return tmpEntry;
	}
	return {
		load: function(){
			//for version <= 2.3
			if(window.localStorage.getItem("box") !== null){
				//create current entry
				currentEntry.name = "主帳號";
				currentEntry.version = version;
				currentEntry.boxid = JSON.parse(window.localStorage.boxid);
				currentEntry.box = JSON.parse(window.localStorage.box);
				currentEntry.material = JSON.parse(window.localStorage.material);
				currentEntry.setting = JSON.parse(window.localStorage.setting);
				//相容檢查
				//box
				if(currentEntry.box.length > 0){
					if(currentEntry.box[0].hasOwnProperty('priority') === false)
						for(var i in currentEntry.box)
							currentEntry.box[i].priority = 0;
					if(currentEntry.box[0].hasOwnProperty('quantity') === false)
						for(var j in currentEntry.box)
							currentEntry.box[j].quantity = 1;
				}
				//material
				if(currentEntry.material.length==46){
					currentEntry.material[46] = JSON.parse("{\"no\":1325,\"quantity\":0}");
					currentEntry.material[47] = JSON.parse("{\"no\":1326,\"quantity\":0}");
					currentEntry.material[48] = JSON.parse("{\"no\":1327,\"quantity\":0}");
					currentEntry.material[49] = JSON.parse("{\"no\":1328,\"quantity\":0}");
					currentEntry.material[50] = JSON.parse("{\"no\":1329,\"quantity\":0}");
				}
				//setting
				if(typeof currentEntry.setting[3] == "undefined"){
					currentEntry.setting[3] = [true,true,true,true,true,true,true,true,true];
				}
				if(typeof currentEntry.setting[3][7] == "undefined"){
					currentEntry.setting[3][7] = true;
					currentEntry.setting[3][8] = true;
				}
				if(typeof currentEntry.setting[4] == "undefined"){
					currentEntry.setting[4] = false;
				}
				if(typeof currentEntry.setting[5] == "undefined"){
					currentEntry.setting[5] = 0;
				}
				//save
				entryArray[0] = currentEntry;
				currentEntryNum = 0;
				window.localStorage.padboxer_main = JSON.stringify(entryArray);
				window.localStorage.padboxer_current = JSON.stringify(currentEntry.name);
				//delete
				window.localStorage.removeItem("settingA");
				window.localStorage.removeItem("box");
				window.localStorage.removeItem("boxid");
				window.localStorage.removeItem("material");
				window.localStorage.removeItem("setting");
			}else{
				//for new user
				if(window.localStorage.getItem("padboxer_main") === null){
					currentEntry = createEntry();
					entryArray[0] = currentEntry;
					currentEntryNum = 0;
					window.localStorage.padboxer_main = JSON.stringify(entryArray);
					window.localStorage.padboxer_current = currentEntry.name;
				}else{
					entryArray = JSON.parse(window.localStorage.padboxer_main);
					if(window.localStorage.getItem("padboxer_current") === null){
						currentEntry = entryArray[0];
						currentEntryNum = 0;
						window.localStorage.padboxer_current = currentEntry.name;
					}else{
						getEntry();
					}
				}
			}
		},
		get: function(item){
			return currentEntry[item];
		},
		edit: function(item,value){
			currentEntry[item] = value;
			currentEntry.version = version;
			entryArray[currentEntryNum] = currentEntry;
			window.localStorage.padboxer_main = JSON.stringify(entryArray);
		},
		switchEntry: function(name){
			if(window.localStorage.padboxer_current != name){
				window.localStorage.padboxer_current = name;
				getEntry();
			}
		},
		deleteEntry: function(name){
			if(window.localStorage.padboxer_current != name){
				for(var i in entryArray){
					if(entryArray[i].name === name){
						entryArray.splice(i,1);
						if(currentEntryNum > i)
							currentEntryNum --;
						window.localStorage.padboxer_main = JSON.stringify(entryArray);
					}
				}
			}
		},
		newEntry: function(name){
			entryArray[entryArray.length] = createEntry();
			entryArray[entryArray.length-1].name = name;
			window.localStorage.padboxer_main = JSON.stringify(entryArray);
		},
		rename: function(old_name,new_name){
			for(var i in entryArray){
				if(entryArray[i].name === old_name){
					entryArray[i].name = new_name;
				}
			}
			window.localStorage.padboxer_main = JSON.stringify(entryArray);
		},
		backup: window.localStorage.padboxer_main,
		restore: function(string){
			try {
				JSON.parse(string);
			} catch (e) {
				throw e;
			}
			window.localStorage.padboxer_main = string;
		}
	};
})();