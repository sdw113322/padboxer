describe("Data", function() {
	it("全新使用",function(){
		localStorage.clear();
		Data.load();
		var entry = JSON.parse(localStorage.padboxer_main);
		expect(entry[0].name).toBe("主帳號");
		expect(entry[0].boxid).toEqual(0);
		expect(entry[0].box).toEqual([]);
		expect(entry[0].material).toEqual([{"no":147,"quantity":0},{"no":148,"quantity":0},{"no":149,"quantity":0},{"no":150,"quantity":0},{"no":151,"quantity":0},{"no":321,"quantity":0},{"no":1176,"quantity":0},{"no":161,"quantity":0},{"no":171,"quantity":0},{"no":166,"quantity":0},{"no":162,"quantity":0},{"no":172,"quantity":0},{"no":167,"quantity":0},{"no":1294,"quantity":0},{"no":163,"quantity":0},{"no":173,"quantity":0},{"no":168,"quantity":0},{"no":1295,"quantity":0},{"no":164,"quantity":0},{"no":174,"quantity":0},{"no":169,"quantity":0},{"no":165,"quantity":0},{"no":175,"quantity":0},{"no":170,"quantity":0},{"no":234,"quantity":0},{"no":152,"quantity":0},{"no":153,"quantity":0},{"no":154,"quantity":0},{"no":227,"quantity":0},{"no":1085,"quantity":0},{"no":1086,"quantity":0},{"no":1087,"quantity":0},{"no":155,"quantity":0},{"no":156,"quantity":0},{"no":157,"quantity":0},{"no":158,"quantity":0},{"no":159,"quantity":0},{"no":160,"quantity":0},{"no":246,"quantity":0},{"no":247,"quantity":0},{"no":248,"quantity":0},{"no":249,"quantity":0},{"no":250,"quantity":0},{"no":251,"quantity":0},{"no":915,"quantity":0},{"no":916,"quantity":0},{"no":1325,"quantity":0},{"no":1326,"quantity":0},{"no":1327,"quantity":0},{"no":1328,"quantity":0},{"no":1329,"quantity":0}]);
	});
	//以下相依
	it("從先前版本匯入",function(){
		localStorage.clear();
		localStorage.boxid = 1;
		localStorage.setting = "[false,false,null,[true,true,true,true,true,true,true,true,true],false,0]";
		localStorage.box = "[{\"id\":\"0\",\"no\":\"2\",\"priority\":0,\"quantity\":\"1\"}]";
		localStorage.material = "[{\"no\":147,\"quantity\":1},{\"no\":148,\"quantity\":1},{\"no\":149,\"quantity\":1},{\"no\":150,\"quantity\":0},{\"no\":151,\"quantity\":0},{\"no\":321,\"quantity\":0},{\"no\":1176,\"quantity\":0},{\"no\":161,\"quantity\":0},{\"no\":171,\"quantity\":0},{\"no\":166,\"quantity\":0},{\"no\":162,\"quantity\":0},{\"no\":172,\"quantity\":0},{\"no\":167,\"quantity\":0},{\"no\":1294,\"quantity\":0},{\"no\":163,\"quantity\":0},{\"no\":173,\"quantity\":0},{\"no\":168,\"quantity\":0},{\"no\":1295,\"quantity\":0},{\"no\":164,\"quantity\":0},{\"no\":174,\"quantity\":0},{\"no\":169,\"quantity\":0},{\"no\":165,\"quantity\":0},{\"no\":175,\"quantity\":0},{\"no\":170,\"quantity\":0},{\"no\":234,\"quantity\":0},{\"no\":152,\"quantity\":0},{\"no\":153,\"quantity\":0},{\"no\":154,\"quantity\":0},{\"no\":227,\"quantity\":0},{\"no\":1085,\"quantity\":0},{\"no\":1086,\"quantity\":0},{\"no\":1087,\"quantity\":0},{\"no\":155,\"quantity\":0},{\"no\":156,\"quantity\":0},{\"no\":157,\"quantity\":0},{\"no\":158,\"quantity\":0},{\"no\":159,\"quantity\":0},{\"no\":160,\"quantity\":0},{\"no\":246,\"quantity\":0},{\"no\":247,\"quantity\":0},{\"no\":248,\"quantity\":0},{\"no\":249,\"quantity\":0},{\"no\":250,\"quantity\":0},{\"no\":251,\"quantity\":0},{\"no\":915,\"quantity\":0},{\"no\":916,\"quantity\":0},{\"no\":1325,\"quantity\":0},{\"no\":1326,\"quantity\":0},{\"no\":1327,\"quantity\":0},{\"no\":1328,\"quantity\":0},{\"no\":1329,\"quantity\":0}]";
		Data.load();
		var entry = JSON.parse(localStorage.padboxer_main);
		expect(entry[0].name).toBe("主帳號");
		expect(entry[0].boxid).toEqual(1);
		expect(entry[0].box).toEqual([{"id":"0","no":"2","priority":0,"quantity":"1"}]);
		expect(entry[0].material).toEqual([{"no":147,"quantity":1},{"no":148,"quantity":1},{"no":149,"quantity":1},{"no":150,"quantity":0},{"no":151,"quantity":0},{"no":321,"quantity":0},{"no":1176,"quantity":0},{"no":161,"quantity":0},{"no":171,"quantity":0},{"no":166,"quantity":0},{"no":162,"quantity":0},{"no":172,"quantity":0},{"no":167,"quantity":0},{"no":1294,"quantity":0},{"no":163,"quantity":0},{"no":173,"quantity":0},{"no":168,"quantity":0},{"no":1295,"quantity":0},{"no":164,"quantity":0},{"no":174,"quantity":0},{"no":169,"quantity":0},{"no":165,"quantity":0},{"no":175,"quantity":0},{"no":170,"quantity":0},{"no":234,"quantity":0},{"no":152,"quantity":0},{"no":153,"quantity":0},{"no":154,"quantity":0},{"no":227,"quantity":0},{"no":1085,"quantity":0},{"no":1086,"quantity":0},{"no":1087,"quantity":0},{"no":155,"quantity":0},{"no":156,"quantity":0},{"no":157,"quantity":0},{"no":158,"quantity":0},{"no":159,"quantity":0},{"no":160,"quantity":0},{"no":246,"quantity":0},{"no":247,"quantity":0},{"no":248,"quantity":0},{"no":249,"quantity":0},{"no":250,"quantity":0},{"no":251,"quantity":0},{"no":915,"quantity":0},{"no":916,"quantity":0},{"no":1325,"quantity":0},{"no":1326,"quantity":0},{"no":1327,"quantity":0},{"no":1328,"quantity":0},{"no":1329,"quantity":0}]);
		expect(entry[0].setting).toEqual([false,false,null,[true,true,true,true,true,true,true,true,true],false,0]);
		expect(localStorage.boxid).toBeUndefined();
		expect(localStorage.setting).toBeUndefined();
		expect(localStorage.box).toBeUndefined();
		expect(localStorage.material).toBeUndefined();
	});
	it("正常讀取",function(){
		Data.load();
		var entry = JSON.parse(localStorage.padboxer_main);
		expect(entry[0].name).toBe("主帳號");
		expect(entry[0].boxid).toEqual(1);
		expect(entry[0].box).toEqual([{"id":"0","no":"2","priority":0,"quantity":"1"}]);
		expect(entry[0].material).toEqual([{"no":147,"quantity":1},{"no":148,"quantity":1},{"no":149,"quantity":1},{"no":150,"quantity":0},{"no":151,"quantity":0},{"no":321,"quantity":0},{"no":1176,"quantity":0},{"no":161,"quantity":0},{"no":171,"quantity":0},{"no":166,"quantity":0},{"no":162,"quantity":0},{"no":172,"quantity":0},{"no":167,"quantity":0},{"no":1294,"quantity":0},{"no":163,"quantity":0},{"no":173,"quantity":0},{"no":168,"quantity":0},{"no":1295,"quantity":0},{"no":164,"quantity":0},{"no":174,"quantity":0},{"no":169,"quantity":0},{"no":165,"quantity":0},{"no":175,"quantity":0},{"no":170,"quantity":0},{"no":234,"quantity":0},{"no":152,"quantity":0},{"no":153,"quantity":0},{"no":154,"quantity":0},{"no":227,"quantity":0},{"no":1085,"quantity":0},{"no":1086,"quantity":0},{"no":1087,"quantity":0},{"no":155,"quantity":0},{"no":156,"quantity":0},{"no":157,"quantity":0},{"no":158,"quantity":0},{"no":159,"quantity":0},{"no":160,"quantity":0},{"no":246,"quantity":0},{"no":247,"quantity":0},{"no":248,"quantity":0},{"no":249,"quantity":0},{"no":250,"quantity":0},{"no":251,"quantity":0},{"no":915,"quantity":0},{"no":916,"quantity":0},{"no":1325,"quantity":0},{"no":1326,"quantity":0},{"no":1327,"quantity":0},{"no":1328,"quantity":0},{"no":1329,"quantity":0}]);
		expect(entry[0].setting).toEqual([false,false,null,[true,true,true,true,true,true,true,true,true],false,0]);
		expect(localStorage.boxid).toBeUndefined();
		expect(localStorage.setting).toBeUndefined();
		expect(localStorage.box).toBeUndefined();
		expect(localStorage.material).toBeUndefined();
	});
	it("新增資料",function(){
		Data.newEntry("2");
		var entry = JSON.parse(localStorage.padboxer_main);
		expect(entry[1].name).toBe("2");
		expect(entry[1].boxid).toEqual(0);
		expect(entry[1].box).toEqual([]);
		expect(entry[1].material).toEqual([{"no":147,"quantity":0},{"no":148,"quantity":0},{"no":149,"quantity":0},{"no":150,"quantity":0},{"no":151,"quantity":0},{"no":321,"quantity":0},{"no":1176,"quantity":0},{"no":161,"quantity":0},{"no":171,"quantity":0},{"no":166,"quantity":0},{"no":162,"quantity":0},{"no":172,"quantity":0},{"no":167,"quantity":0},{"no":1294,"quantity":0},{"no":163,"quantity":0},{"no":173,"quantity":0},{"no":168,"quantity":0},{"no":1295,"quantity":0},{"no":164,"quantity":0},{"no":174,"quantity":0},{"no":169,"quantity":0},{"no":165,"quantity":0},{"no":175,"quantity":0},{"no":170,"quantity":0},{"no":234,"quantity":0},{"no":152,"quantity":0},{"no":153,"quantity":0},{"no":154,"quantity":0},{"no":227,"quantity":0},{"no":1085,"quantity":0},{"no":1086,"quantity":0},{"no":1087,"quantity":0},{"no":155,"quantity":0},{"no":156,"quantity":0},{"no":157,"quantity":0},{"no":158,"quantity":0},{"no":159,"quantity":0},{"no":160,"quantity":0},{"no":246,"quantity":0},{"no":247,"quantity":0},{"no":248,"quantity":0},{"no":249,"quantity":0},{"no":250,"quantity":0},{"no":251,"quantity":0},{"no":915,"quantity":0},{"no":916,"quantity":0},{"no":1325,"quantity":0},{"no":1326,"quantity":0},{"no":1327,"quantity":0},{"no":1328,"quantity":0},{"no":1329,"quantity":0}]);
		expect(Data.get("name")).toBe("主帳號");
		expect(Data.get("boxid")).toEqual(1);
	});
	it("切換資料",function(){
		Data.switchEntry("2");
		expect(Data.get("name")).toBe("2");
	});
});