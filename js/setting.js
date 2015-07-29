var Setting = (function() {
	var setting = [];
	return{
		load: function(){
			setting = Data.get("setting");
		},
		get: function(id){
			return setting[id];
		},
		edit: function(id,val){
			setting[id] = val;
			Data.edit("setting",setting);
		}
	}
}());