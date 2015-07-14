describe("Data", function() {
	it("從先前版本匯入",function(){
		
	});
	it("新資料",function(){
		Data.load();
		expect(localStorage.padboxer_main).toBeDefined();
	});
});