var Material = (function() {
	var materials = [];
	function countMaterial() {
		var evolution = {};
		var ultimate = {};
		var box = Box.allMonsters();
		var allNeed = {};
		var PallNeed = {};
		for(var i in box){
			var need = [];
			var monster = Box.get(box[i]);
			evolution = Index.get(monster.no,"evolution");
			if(evolution.status === "y"){
				need = evolution.need;
			}else if(evolution.status === "u" && typeof monster.choice !== "undefined"){
				var branches = Index.get(monster.no,"ultimate");
				for(var i in branches)
					if(Number(branches[i].result) === Number(monster.choice)){
						need = branches[i].need;
					}
			}
			for(var j in need){
				if(typeof allNeed[need[j]] === "undefined" )
					allNeed[need[j]] = monster.quantity;
				else
					allNeed[need[j]] += monster.quantity;
				if(typeof PallNeed[need[j]] === "undefined" )
					PallNeed[need[j]] = monster.quantity;
				else
					PallNeed[need[j]] += monster.quantity;
			}
		}
		for(var k in materials){
			var need = allNeed[materials[k].no];
			var Pneed = PallNeed[materials[k].no];
			if(need !== undefined)
				materials[k].need = need;
			else
				materials[k].need = 0;
			if(Pneed !== undefined)
				materials[k].Pneed = Pneed;
			else
				materials[k].Pneed = 0;
		}
	}
    function transform( no ) { 
        var x = -1;
		for(var key in materialAttr){
			if(materialAttr[key].no == no)
				x = key;
		}
		return x;
    }
	function getState( id ) {
		var available = materials[id].quantity;
		var total = materials[id].quantity - materials[id].need;
		if(total > 0)
			return "notation-success";
		else if(total <= 0 && available > 0)
			return "notation-warning";
		else
			return "notation-important";
	}
    return {
		load: function() {
			materials = Data.get("material");
			countMaterial();
		},
		include: function(no){
			var x = -1;
			for(var key in materialAttr){
				if(materialAttr[key].no == no)
					x = key;
			}
			if(x === -1)
				return false;
			else
				return true;
		},
		boxEdit: function(no,quantity,choice,prior){
			var res = Index.getMaterials(no,choice);
			if(prior === true){
				for(var i in res.need){
					if(Material.include(res.need[i]) === true)
						materials[transform(res.need[i])].Pneed += quantity;
				}
			}else{
				for(var j in res.need){
					if(Material.include(res.need[j]) === true)
						materials[transform(res.need[j])].need += quantity;
				}
			}
		},
		drift: function(id,offset){
			materials[id].quantity += offset;
		},
		edit: function(id,quantity){
			materials[id].quantity = quantity;
		},
		evolution: function(no,choice,prior){
			var res = Index.getMaterials(no,choice);
			if(prior === true){
				for(var i in res.need){
					if(Material.include(res.need[i]) === true){
						materials[transform(res.need[i])].Pneed --;
						materials[transform(res.need[j])].need --;
						materials[transform(res.need[j])].quantity --;
					}
				}
			}else{
				for(var j in res.need){
					if(Material.include(res.need[j]) === true){
						materials[transform(res.need[j])].need --;
						materials[transform(res.need[j])].quantity --;
					}
				}
			}
		},
		state: function( no ) {
			if(Material.include(no) === true)
				return getState( transform(no) );
			else
				return false;
		},
		get: function( no ){
			if(Material.include(no) === true)
				return materials[transform(no)];
			else
				return false;
		},
		quantity: function( id ) {
				return materials[id].quantity;
		},
		need:  function( id ) {
				return materials[id].need;
		},
		Pneed: function( id ) {
				return materials[id].Pneed;
		},
		total: function( id ) {
				return materials[id].quantity - materials[id].need;
		},
		Ptotal: function( id ) {
				return materials[id].quantity - materials[id].Pneed;
		}
    };
}());