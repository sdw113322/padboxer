describe("Data", function() {
	it("從先前版本匯入",function(){
		
	});
	it("新資料",function(){
		Data.load();
		var entry = JSON.parse(localStorage.padboxer_main);
		expect(entry.name).toBe("主帳號");
		expect(entry.boxid).toEqual(0);
		expect(entry.box).toBe([]);
	});
});