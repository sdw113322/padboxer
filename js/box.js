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
			
		}
	}
}());