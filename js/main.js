var deleted = [];

(function( $ ) {
	$.fn.addIcon = function( no ) {
		if(!(window.localStorage.getItem("name") === null)){
			var name = JSON.parse(window.localStorage.name);
			if(no in name)
				this.append(
				$("<img>")
					.attr("src","icon/"+ no +".png")
					.attr("width",36)
					.attr("height",36)
					.attr("class","material-display")//tootipster has been used
					.attr("title",name[no].chinese)
				);
		}
		return this;
	};
}( jQuery ));

(function( $ ) {
	$.fn.showAction = function( no ) {
		if(!(window.localStorage.getItem("evolution") === null)){
			var evolution = JSON.parse(window.localStorage.evolution);
			$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-remove")
					.attr("title","刪除")
					.click(function(){
						var id = $(this).parent().parent().attr('id');
						var box = dataLoad("box");
						var evolution = JSON.parse(window.localStorage.evolution);
						var ultimate = JSON.parse(window.localStorage.ultimate);
						var choice = $("#mainTable table #" + id).attr("data-choice");
						var need = [];
						var text = $("#mainTable table #" + id).children().eq(0).text();
						var diff = 0;
						for(var i in deleted){
							if(deleted[i] < id)
								diff++;
						}
						deleteMonster((id-diff),box);
						var string = JSON.stringify(box);
						window.localStorage.box = string;
						var resort = true;
						$("#mainTable table #" + id).remove();
						$("#mainTable table").trigger("update", [resort]);
						deleted.push(id);
						if(text in evolution){
							if(evolution[text].status == 'y'){
								need = evolution[text].need;
							}
							else if(evolution[text].status == 'u'){
								if(choice > 0){
									var i = 1;
									var ultimateNeed = [];
									while(ultimate[i].result!=choice){
										i++;
										ultimateNeed = ultimate[i].need;
									}
									need = ultimateNeed;
								}
							}
							for(var index in need){
								var x = -1;
									for(var key in materialAttr){
										if(materialAttr[key].no == need[index])
											x = key;
									}
									if(x != -1){
										var needQty = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
										var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
										total++;
										needQty--;
										$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(needQty);
										$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
									}
							}
						}
					})
				).append(" ");
			if(no in evolution && evolution[no].status != "n")
				$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-forward")
					.attr("title","進化")
					.click(no,function(){
						var text = $( this ).parent().parent().children().first().text();
						var id = $( this ).parent().parent().attr("id");
						var evolution = JSON.parse(window.localStorage.evolution);
						var ultimate = JSON.parse(window.localStorage.ultimate);
						var box = dataLoad("box");
						var material = dataLoad("material");
						var need = [];
						var notHave = [];
						var result = 0;
						var notIn = [];
						var error = 0;
						var choice = $( this ).parent().parent().attr("data-choice");
						if(text in evolution){
							if(evolution[text].status == 'y'){
								need = evolution[text].need;
								if(evolution[evolution[text].result].status == 'y' || evolution[evolution[text].result].status == 'u')
									result = evolution[text].result;
							}
							else if(evolution[text].status == 'u'){
								if(choice > 0){
									var i = 1;
									var ultimateNeed = ultimate[i].need;
									while(ultimate[i].result!=choice){
										i++;
										ultimateNeed = ultimate[i].need;
										result = ultimate[i].result;
									}
									need = ultimateNeed;
								}
								else{
									alert("error!");
									error = 1;
								}
							}
							else if(evolution[text].status == 'n'){
								alert("無法進化");
								error = 1;
							}
						}else{
							alert("錯誤");
							error = 1;
						}
						if(error == 0){
							for(var index in need){
								var i = 0;
								while(material[i].no != parseInt(need[index]) && i<45){
									i++;
								}
								if(material[45].no != parseInt(need[index]) && i==45)
									i++;
								if(i<46){
									material[i].quantity --;
									if(material[i].quantity < 0){
										error = 2;
										notHave.push(need[index]);
									}
								}else{
									notIn.push(need[index]);
								}
							}
						}
						if(error == 0){
							if(notIn.length == 0)
								var accept = confirm ("真的要進化嗎？");
							else
								var accept = confirm ("沒有統計" + notIn + "\n真的要進化嗎？");
							if(window.localStorage.getItem("settingA") === null){
								var settingA = confirm ("要自動將以進化的寵物加至box中嗎？\n設定可在\"關於\"分頁中修改");
								if(settingA == true)
									window.localStorage.settingA = 1;
								else
									window.localStorage.settingA = 0;
							}
						}
						if(error == 0 && accept == true){
							var string = JSON.stringify(material);
							window.localStorage.material = string;
							var diff = 0;
							for(var i in deleted){
								if(deleted[i] < id)
									diff++;
							}
							deleteMonster((id-diff),box);
							if(result != 0 && window.localStorage.settingA == 1)
								addMonster(result,1,box);
							string = JSON.stringify(box);
							window.localStorage.box = string;
							deleted.push(id);
							for(var index in need){
								var x = -1;
								for(var key in materialAttr){
									if(materialAttr[key].no == need[index])
										x = key;
								}
								if(x != -1){
									var available = $("#material span[data-id='" + x + "']").parent().parent().children().eq(3).text();
									var needQty = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
									available--;
									needQty--;
									$("#material span[data-id='" + x + "']").parent().parent().children().eq(3).text(available);
									$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(needQty);
								}
							}
							var resort = true;
							$("#mainTable table #" + id).remove();
							$("#mainTable table").trigger("update", [resort]);
						}else if(error == 0){
						}
						if(error == 2){
							alert(notHave + "不存在\n無法進化");
						
						}
					})
				);
		}
		return this;
	};
}( jQuery ));

function dataLoad( target )
{
	var result = [];
	if(!(window.localStorage.getItem(target) === null)){
		var string = window.localStorage.getItem(target);
		result = JSON.parse(string);
		return result;
	}else{
		if(target == "box")
			window.localStorage.boxid = 0;
		else if(target == "material"){
			var string = "[{\"no\":147,\"quantity\":\"0\"},{\"no\":148,\"quantity\":0},{\"no\":149,\"quantity\":0},{\"no\":150,\"quantity\":0},{\"no\":151,\"quantity\":0},{\"no\":321,\"quantity\":0},{\"no\":1176,\"quantity\":0},{\"no\":161,\"quantity\":0},{\"no\":171,\"quantity\":0},{\"no\":166,\"quantity\":0},{\"no\":162,\"quantity\":0},{\"no\":172,\"quantity\":0},{\"no\":167,\"quantity\":0},{\"no\":1294,\"quantity\":0},{\"no\":163,\"quantity\":0},{\"no\":173,\"quantity\":0},{\"no\":168,\"quantity\":0},{\"no\":1295,\"quantity\":0},{\"no\":164,\"quantity\":0},{\"no\":174,\"quantity\":0},{\"no\":169,\"quantity\":0},{\"no\":165,\"quantity\":0},{\"no\":175,\"quantity\":0},{\"no\":170,\"quantity\":0},{\"no\":234,\"quantity\":0},{\"no\":152,\"quantity\":0},{\"no\":153,\"quantity\":0},{\"no\":154,\"quantity\":0},{\"no\":227,\"quantity\":0},{\"no\":1085,\"quantity\":0},{\"no\":1086,\"quantity\":0},{\"no\":1087,\"quantity\":0},{\"no\":155,\"quantity\":0},{\"no\":156,\"quantity\":0},{\"no\":157,\"quantity\":0},{\"no\":158,\"quantity\":0},{\"no\":159,\"quantity\":0},{\"no\":160,\"quantity\":0},{\"no\":246,\"quantity\":0},{\"no\":247,\"quantity\":0},{\"no\":248,\"quantity\":0},{\"no\":249,\"quantity\":0},{\"no\":250,\"quantity\":0},{\"no\":251,\"quantity\":0},{\"no\":915,\"quantity\":0},{\"no\":916,\"quantity\":0}]";
			window.localStorage.material = string;
			result = JSON.parse(string);
		}
		return result;
	}
}

function boxDisplay( box )
{
	var i = 0;
	var choice;
	for(i=0;i<box.length;i++){
		if(box[i].hasOwnProperty('choice'))
			choice = box[i].choice;
		else
			choice = 0;
		$("#mainTable tbody").append( $(" <tr> ").attr( 'id' , i ).attr( 'data-choice' , choice )
						.append( $(" <td> ").text( box[i].no )));
	}	
}

(function( $ ) {
	$.fn.showNeedMaterial = function( no , id , choice ) {
		if(!(window.localStorage.getItem("evolution") === null && window.localStorage.getItem("ultimate") === null)){
			var evolution = JSON.parse(window.localStorage.evolution);
			var ultimate = JSON.parse(window.localStorage.ultimate);
			var name = JSON.parse(window.localStorage.name);
			var allNeed = [];
			if(no in evolution){
				if(evolution[no].status == 'y'){
					for(var key in evolution[no].need){
						$( this ).addIcon(evolution[no].need[key]);
						if(key < evolution[no].need.length - 1)
							$( this ).append(" ");
					}
					var j = 0;
					for(j=0;j<evolution[no].need.length;j++){
						if(evolution[no].need[j] in allNeed)
							allNeed[evolution[no].need[j]] ++;
						else
							allNeed[evolution[no].need[j]] = 1;
					}
				}
				else if(evolution[no].status == 'u'){
					if(choice > 0){
						var i = 1;
						var ultimateNeed = ultimate[i].need;
						while(ultimate[i].result!=choice){
							i++;
							ultimateNeed = ultimate[i].need;
						}
						for(var key in ultimateNeed){
							$( this ).addIcon(ultimateNeed[key]);
							if(key < ultimateNeed.length - 1)
								$( this ).append(" ");
						}
						for(j=0;j<ultimateNeed.length;j++){
							if(ultimateNeed[j] in allNeed)
								allNeed[ultimateNeed[j]] ++;
							else
								allNeed[ultimateNeed[j]] = 1;
						}
					}
					else{
						$( this ).append($("<button>")
								.text("請選取究極進化分支")
								.addClass("btn btn-warning")
								.attr("data-toggle","modal")
								.attr("data-target","#ultimateBranch")
								.click(id,function(){
									var i = 1;
									var ultimateResult = [];
									if(ultimateResult.length > 0)
										ultimateResult.length = 0;
									while(i < ultimate.length){
										if(no == ultimate[i].no)
											ultimateResult.push(ultimate[i].result);
										i++;
									}
									$.each(ultimateResult,function(index,value){
										$("#ultimateBranch .modal-body form").append($("<label>")
											.append($("<input>")
												.attr("type","radio")
												.attr("value",value)
												.attr("data-id",id)
												.attr("name","ultimateChoose")
											).append("   " + value + " - " + name[value].chinese + " - " + name[value].japanese )
										);
									});
								})
							);
	//
					}
				}
				else if(evolution[no].status == 'n')
					$( this ).text("無法進化");
			}
		}
		return this;
	};
}( jQuery ));

function materialDisplay( material )
{
	$("#material").empty();
	$("#material").append(
		$("<div>").addClass("col-md-7 mainTable").append(
			$("<h2>").text("火曜日　星期二")
		).append(
			$("<table>").attr("id","tue").append(
				$("<thead>").append(
					$("<tr>").append(
						$("<th>").text("No.")
					).append(
						$("<th>")
					).append(
						$("<th>").text("名稱")
					).append(
						$("<th>").text("現有")
					).append(
						$("<th>").text("需要")
					).append(
						$("<th>").text("總計")
					).append(
						$("<th>").text("動作")
					)
				)
			).append($("<tbody>"))
		).append(
			$("<h2>").text("水曜日　星期三")
		).append(
			$("<table>").attr("id","wed").append(
				$("<thead>").append(
					$("<tr>").append(
						$("<th>").text("No.")
					).append(
						$("<th>")
					).append(
						$("<th>").text("名稱")
					).append(
						$("<th>").text("現有")
					).append(
						$("<th>").text("需要")
					).append(
						$("<th>").text("總計")
					).append(
						$("<th>").text("動作")
					)
				)
			).append($("<tbody>"))
		)
	).append(
		$("<div>").addClass("col-md-7 mainTable").append(
			$("<h2>").text("木曜日　星期四")
		).append(
			$("<table>").attr("id","thu").append(
				$("<thead>").append(
					$("<tr>").append(
						$("<th>").text("No.")
					).append(
						$("<th>")
					).append(
						$("<th>").text("名稱")
					).append(
						$("<th>").text("現有")
					).append(
						$("<th>").text("需要")
					).append(
						$("<th>").text("總計")
					).append(
						$("<th>").text("動作")
					)
				)
			).append($("<tbody>"))
		).append(
			$("<h2>").text("金曜日　星期五")
		).append(
			$("<table>").attr("id","fri").append(
				$("<thead>").append(
					$("<tr>").append(
						$("<th>").text("No.")
					).append(
						$("<th>")
					).append(
						$("<th>").text("名稱")
					).append(
						$("<th>").text("現有")
					).append(
						$("<th>").text("需要")
					).append(
						$("<th>").text("總計")
					).append(
						$("<th>").text("動作")
					)
				)
			).append($("<tbody>"))
		)
	);
	var day = ["tue","wed","thu","fri"];
	for(var key1 in materialTemplate[0]){
		for(var key2 in materialTemplate[0][key1]){
			$("#" + day[key1] + " tbody").append(
				$("<tr>").addClass(materialAttr[materialTemplate[0][key1][key2]].element).append(
					$("<td>").text(materialAttr[materialTemplate[0][key1][key2]].no)
				).append(
					$("<td>").addIcon(materialAttr[materialTemplate[0][key1][key2]].no)
				).append(
					$("<td>").text(materialAttr[materialTemplate[0][key1][key2]].name)
				).append(
					$("<td>").text(material[materialTemplate[0][key1][key2]].quantity)
				).append(
					$("<td>").text("0")
				).append(
					$("<td>").text("0")
				).append(
					$("<td>").append(
						$("<span>").addClass("glyphicon glyphicon-plus add-material").attr("title","+1").attr("data-id",materialTemplate[0][key1][key2])
						.click(function(){
							var id = $(this).attr('data-id');
							$.debounce( 250, addMaterial(id) );
						})
					).append(" ")
					.append(
						$("<span>").addClass("glyphicon glyphicon-minus minus-material").attr("title","-1").attr("data-id",materialTemplate[0][key1][key2])
						.click(function(){
							var id = $(this).attr('data-id');
							$.debounce( 250, minusMaterial(id) );
						})
					).append(" ")
					.append(
						$("<span>").addClass("glyphicon glyphicon-pencil edit-material").attr("title","修改").attr("data-id",materialTemplate[0][key1][key2])
						.attr("data-toggle","modal")
						.attr("data-target","#material-modal")
						.click(function(){
							var id = $(this).attr('data-id');
							var material = dataLoad("material");
							$("#material-modal .modal-body form input").val(material[id].quantity);
							$("#material-modal .modal-body form input").attr("data-id",id);
						})
					)
				)
			);
		}
	}
}

function boxReset()
{
	$("#mainTable table").remove();
}

function internalLoad( load_times )
{
	if(!(window.localStorage.getItem("name") === null)&&!(window.localStorage.getItem("evolution") === null)&&!(window.localStorage.getItem("ultimate") === null)){
		var name = JSON.parse(window.localStorage.name);
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		if(window.localStorage.getItem("time") === null){
			var date1 = new Date(0);
		}
		else
			var date1 = new Date(window.localStorage.time);
		var date2 = new Date();
		var delta = date2 - date1;
		if(delta > (86400000 * 7) && load_times < 1){
			window.localStorage.time = date2;
			return false;
		}
		var data_date = new Date(evolution[0].time);
		var curr_date = data_date.getDate();
		var curr_month = data_date.getMonth();
		curr_month++;
		var curr_year = data_date.getFullYear();
		$(".data-date").text(curr_year + "/" + curr_month + "/" + curr_date);
		$("#mainTable").append($("<table>")
			.append("<thead><tr><th>No.</th><th></th><th>中文名</th><th>日文名</th><th>進化素材</th><th>動作</th></tr></thead>")	
			.append($("<tbody>"))
		);
		var box = dataLoad("box");
		var material = dataLoad("material");
		var allNeed = [];
		boxDisplay(box);
		materialDisplay(material);
		$("#mainTable tbody tr").each(function() {
			var text = $( this ).children().text();
			var choice = $( this ).attr('data-choice');
			var id  = $(this).attr('id');
			//顯示圖片
			$( this ).append($("<td>").addIcon(text));
			//顯示中文名
			if(text in name){
				$( this ).append($("<td>").text(name[text].chinese));
			//顯示日文名
				$( this ).append($("<td>").text(name[text].japanese));
			}else
				$( this ).append($("<td>")).append($("<td>"));
			//顯示進化素材
			$( this ).append($("<td>").showNeedMaterial(text,id,choice));
			if(text in evolution){
				if(evolution[text].status == 'y'){
					var j = 0;
					for(j=0;j<evolution[text].need.length;j++){
						if(evolution[text].need[j] in allNeed)
							allNeed[evolution[text].need[j]] ++;
						else
							allNeed[evolution[text].need[j]] = 1;
					}
				}
				else if(evolution[text].status == 'u'){
					if(choice > 0){
						var i = 1;
						var ultimateNeed = ultimate[i].need;
						while(ultimate[i].result!=choice){
							i++;
							ultimateNeed = ultimate[i].need;
						}
						for(j=0;j<ultimateNeed.length;j++){
							if(ultimateNeed[j] in allNeed)
								allNeed[ultimateNeed[j]] ++;
							else
								allNeed[ultimateNeed[j]] = 1;
						}
					}
				}
			}
			//顯示動作
			$( this ).append($("<td>").showAction(text));
			
		});
		$(".material-display").tooltipster(); //active tooltipster
		$("#material tbody tr").each(function(){
			var no = $(this).children().first().text();
			$(this).children().eq(4).text(allNeed[no]);
			var total = $(this).children().eq(3).text() - $(this).children().eq(4).text();
			$(this).children().eq(5).text(total);
		});
		$("#mainTable table").tablesorter();
	}else
		return false;
}

function externalLoad()
{
	$.ajax({
		dataType: 'jsonp',
		url: "https://api.github.com/repos/sdw113322/padboxer/contents/name.json?ref=data-source", 
		success: function(data){
			var string = atob(data.data.content);
			window.localStorage.name = string;
		},
		error: function(request,error) 
		{
		 alert ( "錯誤: " + error );
		}
	});
	$.ajax({
		dataType: 'jsonp',
		url: "https://api.github.com/repos/sdw113322/padboxer/contents/evolution.json?ref=data-source", 
		success: function(data){
			var string = atob(data.data.content);
			window.localStorage.evolution = string;
		},
		error: function(request,error) 
		{
		 alert ( "錯誤: " + error );
		}
	});
	$.ajax({
		dataType: 'jsonp',
		url: "https://api.github.com/repos/sdw113322/padboxer/contents/ultimate.json?ref=data-source", 
		success: function(data){
			var string = atob(data.data.content);
			window.localStorage.ultimate = string;
		},
		error: function(request,error) 
		{
		 alert ( "錯誤: " + error );
		}
	});
}

function deleteMonster(id,box)//不是 property 裡的 id，是指索引值
{
		box.splice(id,1);
}

function addMaterial( id )
{
	var material = dataLoad("material");
	material[id].quantity ++;
	var string = JSON.stringify(material);
	window.localStorage.material = string;
	$("#material tr").each(function(){
		if($(this).children().eq(6).children().attr("data-id") == id){
			var available = Number($(this).children().eq(3).text()) + 1;
			var total = Number($(this).children().eq(5).text()) + 1;
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
		}
	});
}

function minusMaterial( id )
{
	var material = dataLoad("material");
	material[id].quantity --;
	var string = JSON.stringify(material);
	window.localStorage.material = string;
	$("#material tr").each(function(){
		if($(this).children().eq(6).children().attr("data-id") == id){
			var available = Number($(this).children().eq(3).text()) - 1;
			var total = Number($(this).children().eq(5).text()) - 1;
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
		}
	});
}

function addMonster(no,times,box)
{
	var name = JSON.parse(window.localStorage.name);
	var evolution = JSON.parse(window.localStorage.evolution);
	var ultimate = JSON.parse(window.localStorage.ultimate);
	var mon = {};
	var i = 0;
	var resort = true;
	var choice = 0;
	for(i=0;i<times;i++){
		mon["id"] = window.localStorage.boxid;
		mon["no"] = no;
		box.push(mon);
		window.localStorage.boxid ++;
		$row = $("<tr>").attr("id",box.length+deleted.length-1).attr("data-choice",0)
				.append($("<td>").text(no))
				.append($("<td>").addIcon(no))
				.append($("<td>").text(name[no].chinese))
				.append($("<td>").text(name[no].japanese))
				.append($("<td>").showNeedMaterial(no,box.length-1,0))
				.append($("<td>").showAction(no));
		$("#mainTable table").find('tbody').append($row).trigger("addRows", [$row, resort]);
		if(no in evolution){
			if(evolution[no].status == 'y'){
				for(var key in evolution[no].need){
					var x = -1;
					for(var index in materialAttr){
						if(materialAttr[index].no == evolution[no].need[key])
							x = index;
					}
					if(x != -1){
						var need = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
						var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
						need++;
						total--;
						$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(need);
						$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
					}
				}
			}
			else if(evolution[no].status == 'u'){
				if(choice > 0){
					var i = 1;
					var ultimateNeed = ultimate[i].need;
					while(ultimate[i].result!=choice){
						i++;
						ultimateNeed = ultimate[i].need;
					}
					for(var key in ultimateNeed){
						var x = -1;
						for(var index in materialAttr){
							if(materialAttr[index].no == ultimateNeed[key])
								x = index;
						}
						if(x != -1){
							var need = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
							var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
							need++;
							total--;
							$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(need);
							$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
						}
					}
				}
			}
		}
	}
	var string = JSON.stringify(box);
	window.localStorage.box = string;
	$("#add input[name='no']").val("");
	$("#add input[name='quantity']").val("1");
	$(".material-display").tooltipster(); //active tooltipster
} 

$(document).ready(function() {
	if(internalLoad(0) == false){
		externalLoad();
		window.setTimeout("internalLoad(1);",5000);
	}
	$("#add #btn-add-enter").click(function(){
		var box = dataLoad("box");
		var a = $("#add input[name='no']").val();
		var b = $("#add input[name='quantity']").val();
		$.debounce( 250, addMonster(a,b,box) );
	});
	$("#ultimateBranch .btn-primary").click(function(){
		var branchChoice = $("input[type='radio']:checked", "#ultimateBranch").val();
		var id = $("input[type='radio']:checked", "#ultimateBranch").attr("data-id");
		var box = dataLoad("box");
		var ultimate = JSON.parse(window.localStorage.ultimate);
		var diff = 0;
		for(var i in deleted)
			if(deleted[i] < id)
				diff++;
		box[id-diff].choice = branchChoice;
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		//boxReset();
		//internalLoad();
		$("#mainTable table tr[id='"+ id +"']").children().eq(4).empty().showNeedMaterial(box[id-diff].no,id,branchChoice);
		$("#mainTable table tr[id='"+ id +"']").attr("data-choice",branchChoice);
		$(".material-display").tooltipster(); //active tooltipster
		var i = 1;
		var ultimateNeed = ultimate[i].need;
		var choice = branchChoice;
		while(ultimate[i].result!=choice){
			i++;
			ultimateNeed = ultimate[i].need;
		}
		for(j=0;j<ultimateNeed.length;j++){
			var x = -1;
			for(var index in materialAttr){
				if(materialAttr[index].no == ultimateNeed[j])
					x = index;
			}
			if(x != -1){
				var need = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
				var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
				need++;
				total--;
				$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(need);
				$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
			}
		}
		
		$('#ultimateBranch').modal('hide');
	});
	$('#ultimateBranch').on('hidden.bs.modal', function (e) {
		$("#ultimateBranch .modal-body form").remove();
		$("#ultimateBranch .modal-body").append($("<form>"));
	});
	$("#btn-add").click(function(){
		$("#add").show( 400 );
		$("#btn-add").addClass("active");
	});
	$("#btn-add-preview").click(function(){
		var name = JSON.parse(window.localStorage.name);
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		var no = $("#add input[name='no']").val();
		var qty = $("#add input[name='quantity']").val();
		$("#preview-modal .modal-body").empty().append($("<span>").attr("id","preview-status"));
		$("#preview-modal h4").text(no + " - " + name[no].chinese);
		if(evolution[no].status == "y"){
			$("#preview-modal #preview-status").text("可以進化")
			$("#preview-modal .modal-body").append($("<h5>").text( "進化為 " + evolution[no].result +" - "+name[evolution[no].result].chinese + "需要：" ));
			$("#preview-modal .modal-body").append($("<table>").addClass("table table-bordered").append($("<thead>").append($("<tr>").append($("<th>").text("名稱")).append($("<th>").text("現有")).append($("<th>").text("總共")))));
			for(var key in evolution[no].need){
				
				$("#preview-modal .modal-body table").append($("<tr>")
					.append($("<td>").text(evolution[no].need[key] + " - " + name[evolution[no].need[key]].chinese))
					.append($("<td>").text($("#material table tr td:first-child:contains('" + evolution[no].need[key] + "')").next().next().text()))
					.append($("<td>").text($("#material table tr td:first-child:contains('" + evolution[no].need[key] + "')").next().next().next().next().text()))
				);
			}
		}else if(evolution[no].status == "u"){
			$("#preview-modal #preview-status").text("可以究極進化");
			var i = 1;
			var ultimateResult = [];
			if(ultimateResult.length > 0)
			ultimateResult.length = 0;
			while(i < ultimate.length){
				if(no == ultimate[i].no)
					ultimateResult.push(ultimate[i]);
				i++;
			}
			$.each(ultimateResult,function(index,value){
				$("#preview-modal .modal-body").append($("<h5>").text( "進化為 " + value.result +" - "+name[value.result].chinese + "需要：" ));
				$("#preview-modal .modal-body").append($("<table>").addClass("table table-bordered").attr("data-number",index).append($("<thead>").append($("<tr>").append($("<th>").text("名稱")).append($("<th>").text("現有")).append($("<th>").text("總共")))));
				for(var key in value.need){
					$("#preview-modal .modal-body table[data-number='"+ index +"']").append($("<tr>")
						.append($("<td>").text(value.need[key] + " - " + name[value.need[key]].chinese))
						.append($("<td>").text($("#material table tr td:first-child:contains('" + value.need[key] + "')").next().next().text()))
						.append($("<td>").text($("#material table tr td:first-child:contains('" + value.need[key] + "')").next().next().next().next().text()))
					);
				}
			});
		}else
			$("#preview-modal #preview-status").text("不能進化");
	});
	$(".btn-add-hide").click(function(){
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});
	$("#btn-material").click(function(){
		$("#mainTable").hide( 400 );
		$("#about").hide( 400 );
		window.setTimeout("$(\"#material\").show( 400 );",400);
		$("#btn-add").attr("disabled","disabled");
		$("#btn-material").parent().addClass("active").siblings('.active').removeClass('active');
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});	
	$("#btn-box").click(function(){
		$("#material").hide( 400 );
		$("#about").hide( 400 );
		window.setTimeout("$(\"#mainTable\").show( 400 );",400);
		$("#btn-add").removeAttr("disabled");
		$("#btn-box").parent().addClass("active").siblings('.active').removeClass('active');
	});	
	$("#btn-about").click(function(){
		$("#mainTable").hide( 400 );
		$("#material").hide( 400 );
		window.setTimeout("$(\"#about\").show( 400 );",400);
		$("#btn-about").parent().addClass("active").siblings('.active').removeClass('active');
		$("#btn-add").attr("disabled","disabled");
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});	
	$("#add input").keyup(function(event){
		if(event.keyCode == 13){
			$("#add #btn-add-enter").click();
		}
	});
	$("#clear").click(function(){
		var accept = confirm ("真的要清空嗎？");
		if(accept == true){
			window.localStorage.clear();
			document.location.reload(true);
		}
	});
	$("#backup").click(function(){
		var backup = window.localStorage.boxid + "      " + window.localStorage.box + "      " + window.localStorage.material;
		$("#backup-modal .modal-body textarea").val(backup);
	});
	$("#material-modal .btn-primary").click(function(){
		var value = $("#material-modal .modal-body form input").val();
		var id = $("#material-modal .modal-body form input").attr("data-id");
		var material = dataLoad("material");
		material[id].quantity = value;
		var string = JSON.stringify(material);
		window.localStorage.material = string;
		$("#material tr").each(function(){
		if($(this).children().eq(6).children().attr("data-id") == id){
			var available = value;
			var total = value - Number($(this).children().eq(4).text());
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
		}
	});
		$('#material-modal').modal('hide');
	});
	$("#import-modal .btn-primary").click(function(){
		var value = $("#import-modal .modal-body textarea").val();
		var splits = value.split("      ");
		window.localStorage.boxid = splits[0];
		window.localStorage.box = splits[1];
		window.localStorage.material = splits[2];
		boxReset();
		internalLoad();
		$("#import-modal .modal-body textarea").val();
		$('#import-modal').modal('hide');
	});
	$("#update").click(function(){
		window.localStorage.removeItem("time");
		document.location.reload(true);
	});
	$("#preview-modal .btn-primary").click(function(){
		$('#preview-modal').modal('hide');
		var no = $("#add input[name='no']").val();
		var qty = $("#add input[name='quantity']").val();
		var box = dataLoad("box");
		$.debounce( 250, addMonster(no,qty,box) );
	});
	if(window.localStorage.settingA == 0 || window.localStorage.getItem("settingA") === null)
		$("#settingA").prop('checked',false);
	else
		$("#settingA").prop('checked',true);
	$("#settingA").click(function(){
		if($("#settingA").prop( "checked" )){
			window.localStorage.settingA = 1;		
		}else{
			window.localStorage.settingA = 0;
		}
	});
	$(".version").append(version);
});