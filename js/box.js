var Box = (function() {
	var box = [];
	return{
		load: function(){
			box = Data.get("box");
		},
		add: function(no,quantity,from){
			var boxid = Data.get("boxid");
			var monster = {
				"id": boxid,
				"no": no,
				"quantity": quantity
			};
			if(from !== null)
				monster.from = from;
			boxid++;
			box.push(monster);
			Data.edit("boxid",boxid);
			Data.edit("box",box);
		},
		allMonsters: function(){
			var list = [];
			for(var i=0;i<box.length;i++)
				list.push(box[i].id);
			return list;
		},
		edit: function(id,item,value){
			for(var i in box)
				if(box[i].id === id){
					box[i][item] = value;
				}
			Data.edit("box",box);
		},
		get: function(id){
			for(var i in box)
				if(box[i].id === id){
					return box[i];
				}
		},
		remove: function(id){
			for(var i in box)
				if(box[i].id === id){
					box.splice(i,1);
				}
			Data.edit("box",box);
		},
		evolution: function(id){
			var monster = box[id];
			var evol = Index.get(monster.no,"evolution");
			var need = [];
			var result = {};
			//找需要的素材及進化結果
			switch(evol.status){
				case "n":
				case "?":
				throw new Error("不能進化");
				break;
				case "y":
				need = evol.need;
				result = evol.result;
				break;
				case "u":
				if(typeof monster.choice === "undefined")
					throw new Error("未指定究極進化選項");
				var branches = Index.get(monster.no,"ultimate");
				for(var i in branches)
					if(Number(branches[i].result) === Number(monster.choice)){
						need = branches[i].need;
						result = branches[i].result;
					}
			}
			//確認是否有足夠素材
			var mater = { };
			var notEnough = [];
			for(i = 0; i < need.length; ++i) {
				if(!mater[need[i]])
					mater[need[i]] = 0;
				++mater[need[i]];
			}
			for(var j in mater){
				if(Material.include(j) === true)
					if(Material.quantity(j) < mater[j])
						notEnough.push(j);
			}
			if(notEnough.length > 0){
				var errmsg = "缺少下列素材:";
				for(var k in notEnough){
					errmsg += notEnough[k];
					errmsg += " - ";
					errmsg += Index.get(notEnough[k],"name").chinese;
					errmsg +=  "\n";
				}
				throw new Error(errmsg);
			}
			//修改素材數量
			var prior = (monster.priority > 0);
			Material.evolution(monster.no,monster.choice,prior);
		}
	}
}());