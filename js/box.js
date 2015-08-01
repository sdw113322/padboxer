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
				"quantity": quantity,
				"priority": 0
			};
			if(from !== null)
				monster.from = from;
			boxid++;
			box.push(monster);
			Data.edit("boxid",boxid);
			Data.edit("box",box);
			return boxid - 1;
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
			var monster = Box.get(id);
			var evol = Index.getMaterials(monster.no,monster.choice);
			var need = [];
			var result = {};
			//找需要的素材及進化結果
			switch(evol.status){
				case "n":
				case "?":
				throw new Error("不能進化");
				break;
				case "u":
				if(typeof monster.choice === "undefined")
					throw new Error("未指定究極進化選項");
				case "y":
				need = evol.need;
				result = evol.result;
				break;
			}
			//確認是否有足夠素材
			var mater = { };
			var notEnough = [];
			var notIn = [];
			for(i = 0; i < need.length; ++i) {
				if(!mater[need[i]])
					mater[need[i]] = 0;
				++mater[need[i]];
			}
			for(var j in mater){
				if(Material.include(j) === true){
					if(Material.get(j).quantity < mater[j])
						notEnough.push(j);
				}else
					notIn.push(j);
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
			if(notIn.length == 0)
				var accept = confirm ("真的要進化嗎？");
			else
				var accept = confirm ("沒有統計" + notIn + "\n真的要進化嗎？");
			if(accept === true){
				var product = Number(evol.result);
				//修改素材數量
				var prior = (monster.priority > 0);
				Material.evolution(monster.no,monster.choice,prior);
				if(Setting.get(0) === true && (evol.status === "y" || evol.status === "u")){
					Material.boxEdit(product,1,monster.choice,false);
					if(monster.priority > 0)
						Material.boxEdit(product,1,monster.choice,true);
				}
				//修改box
				if(Setting.get(0) === true && (Index.get(product,"evolution").status === "y" || Index.get(product,"evolution").status === "u")){
					var to = -1;
					for(var i in box)
						if(box[i].from !== undefined)
							if(box[i].from === monster.id)
								to = box[i].id;
					if(monster.quantity === 1){
						if(to === -1){
							var newMon = Box.add(product,1,null);
							Box.remove(id);
							return {"delete" : [id],"add":[newMon]};
						}else{
							Box.edit(to,"quantity",Box.get(to).quantity+1);
							if(monster.priority > 0){
								Box.edit(to,"priority",Box.get(to).priority+1);
							}
							Box.remove(id);
							return {"delete" : [id],"edit":[to]};
						}
					}else{
						if(to === -1){
							var newMon = Box.add(product,1,monster.id);
							if(monster.priority > 0)
								Box.edit(newMon,"priority",1);
						}else{
							Box.edit(to,"quantity",Box.get(to).quantity+1);
							if(monster.priority > 0){
								Box.edit(to,"priority",Box.get(to).priority+1);
							}
						}
						Box.edit(id,"quantity",Box.get(id).quantity-1);
						if(monster.priority > 0)
							Box.edit(id,"priority",Box.get(id).priority-1);
						if(to === -1)
							return {"add" : [newMon],"edit" : [id]};
						else
							return {"edit" : [id,to]};
					}
				}else{
					if(monster.quantity === 1){
						Box.remove(id);
						return{"delete" : [id]};
					}else{
						if(monster.priority > 0)
							Box.edit(id,"priority",Box.get(id).priority-1);
						Box.edit(id,"quantity",Box.get(id).quantity-1);
						return {"edit" : [id]};
					}
				}
			}
		}
	}
}());