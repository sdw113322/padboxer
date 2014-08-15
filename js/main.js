function monster(id,no,choice)
{
	this.id = id;
	this.no = no;
	this.choice = choice;
}

function material(no,qty)
{
	this.no = no;
	this.quantity = qty;
}

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
			result[0] = new material(147,0);
			result[1] = new material(148,0);
			result[2] = new material(149,0);
			result[3] = new material(150,0);
			result[4] = new material(151,0);
			result[5] = new material(321,0);
			result[6] = new material(1176,0);
			result[7] = new material(161,0);
			result[8] = new material(171,0);
			result[9] = new material(166,0);
			result[10] = new material(162,0);
			result[11] = new material(172,0);
			result[12] = new material(167,0);
			result[13] = new material(1294,0);
			result[14] = new material(163,0);
			result[15] = new material(173,0);
			result[16] = new material(168,0);
			result[17] = new material(1295,0);
			result[18] = new material(164,0);
			result[19] = new material(174,0);
			result[20] = new material(169,0);
			result[21] = new material(165,0);
			result[22] = new material(175,0);
			result[23] = new material(170,0);
			result[24] = new material(234,0);
			result[25] = new material(152,0);
			result[26] = new material(153,0);
			result[27] = new material(154,0);
			result[28] = new material(227,0);
			result[29] = new material(1085,0);
			result[30] = new material(1086,0);
			result[31] = new material(1087,0);
			result[32] = new material(155,0);
			result[33] = new material(156,0);
			result[34] = new material(157,0);
			result[35] = new material(158,0);
			result[36] = new material(159,0);
			result[37] = new material(160,0);
			result[38] = new material(246,0);
			result[39] = new material(247,0);
			result[40] = new material(248,0);
			result[41] = new material(249,0);
			result[42] = new material(250,0);
			result[43] = new material(251,0);
			result[44] = new material(915,0);
			result[45] = new material(916,0);
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
	
function materialDisplay( material )
{
	$("#material tbody tr").each(function( index ){
		var no = $(this).children().first().text();
		$(this).children().eq(2).text(material[index].no);
	});
}

function boxReset()
{
	$("#mainTable table").remove();
}

function internalLoad()
{
	if(!(window.localStorage.getItem("name") === null)&&!(window.localStorage.getItem("evolution") === null)&&!(window.localStorage.getItem("ultimate") === null)){
		var name = JSON.parse(window.localStorage.name);
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		console.log(ultimate);
		var allNeed = [];
		$("#mainTable").append($("<table>")
			.append("<thead><tr><th>No.</th><th>中文名</th><th>日文名</th><th>進化素材</th><th>動作</th></tr></thead>")	
			.append($("<tbody>"))
		);
		var box = dataLoad("box");
		var material = dataLoad("material");
		boxDisplay(box);
		materialDisplay(material);
		$("#mainTable tbody tr").each(function() {
			var text = $( this ).children().text();
			var choice = $( this ).attr('data-choice');
			//顯示中文名
			if(text in name){
				$( this ).append($("<td>").text(name[text].chinese));
			//顯示日文名
				$( this ).append($("<td>").text(name[text].japanese));
			}else
				$( this ).append($("<td>")).append($("<td>"));
			//顯示進化素材
			if(text in evolution){
				if(evolution[text].status == 'y'){
					$( this ).append("<td>" + evolution[text].need + "</td>");
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
						while(ultimate[i].result!=choice){
							var ultimateNeed = ultimate[i].need;
							i++;
						}
						$( this ).append("<td>" + ultimateNeed + "</td>");
						for(j=0;j<ultimateNeed.length;j++){
							if(ultimateNeed[j] in allNeed)
								allNeed[ultimateNeed[j]] ++;
							else
								allNeed[ultimateNeed[j]] = 1;
						}
					}
					else{
						var id  = $(this).attr('id');
						$( this ).append($("<td>")
							.append($("<button>")
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
										if(text == ultimate[i].no)
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
									console.log(ultimateResult);
								})
							)
						);
	//
						$("#ultimateBranch [data-dismiss='modal']").click(function(){
							$("#ultimateBranch .modal-body form").remove();
							$("#ultimateBranch .modal-body").append($("<form>"));
						});
					}
				}
				else if(evolution[text].status == 'n')
					$( this ).append("<td>" + "無法進化" + "</td>");
			}else
				$( this ).append($("<td>"));
			//顯示動作
			$( this ).append($("<td>")
				.append($("<span>")
					.addClass("glyphicon glyphicon-remove")
					.click(function(){
						var id = $(this).parent().parent().attr('id');
						var box = dataLoad("box");
						deleteMonster(id,box);
						var string = JSON.stringify(box);
						window.localStorage.box = string;
						boxReset();
						internalLoad();
					})
				)
			);
		});
		console.log(allNeed);
		$("#material tbody tr").each(function(){
			var no = $(this).children().first().text();
			$(this).children().eq(3).text(allNeed[no]);
			var total = $(this).children().eq(2).text() - $(this).children().eq(3).text();
			$(this).children().eq(4).text(total);
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
		 console.log(arguments);
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
		 console.log(arguments);
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
		 console.log(arguments);
		 alert ( "錯誤: " + error );
		}
	});
}

function addMonster(no,box)
{
	var mon = new monster;
	mon.id = window.localStorage.boxid;
	mon.no = no;
	box.push(mon);
	window.localStorage.boxid ++;
} 

function deleteMonster(id,box)//不是 property 裡的 id，是指索引值
{
		box.splice(id,1);
}

$(document).ready(function() {
	if(internalLoad() == false){
		externalLoad();
		window.setTimeout("internalLoad();",5000);
	}
	$("#add #btn-add-enter").click(function(){
		var box = dataLoad("box");
		var a = $("#add input[name='no']").val();
		var b = $("#add input[name='quantity']").val();
		var i = 0;
		for(i=0;i<b;i++){
			addMonster(a,box);
		}
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		boxReset();
		internalLoad();
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
	});
	$("#ultimateBranch .btn-primary").click(function(){
		var branchChoice = $("input[type='radio']:checked", "#ultimateBranch").val();
		var id = $("input[type='radio']:checked", "#ultimateBranch").attr("data-id");
		var box = dataLoad("box");
		console.log(id);
		console.log(branchChoice);
		box[id].choice = branchChoice;
		$("#ultimateBranch .modal-body form").remove();
		$("#ultimateBranch .modal-body").append($("<form>"));
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		boxReset();
		internalLoad();
		$('#ultimateBranch').modal('hide');
	});
	$("#btn-add").click(function(){
		$("#add").show( 400 );
		$("#btn-add").parent().addClass("active");
	});
	$(".btn-add-hide").click(function(){
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").parent().removeClass("active");
	});
	$("#btn-material").click(function(){
		$("#mainTable").hide( 400 );
		window.setTimeout("$(\"#material\").show( 400 );",400);
		$("#btn-add").parent().addClass("disabled");
		$("#btn-box").parent().removeClass("active");
		$("#btn-material").parent().addClass("active");
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").parent().removeClass("active");
	});	
	$("#btn-box").click(function(){
		$("#material").hide( 400 );
		window.setTimeout("$(\"#mainTable\").show( 400 );",400);
		$("#btn-add").parent().removeClass("disabled");
		$("#btn-box").parent().addClass("active");
		$("#btn-material").parent().removeClass("active");
	});	
	$("#add input").keyup(function(event){
		if(event.keyCode == 13){
			$("#add #btn-add-enter").click();
		}
	});
	$("#clear").click(function(){
		window.localStorage.clear();
	});
});