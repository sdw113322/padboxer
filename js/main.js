function monster(id,no,choice)
{
	this.id = id;
	this.no = no;
	this.choice = choice;
}

function boxLoad()
{
	var box = [];
	if(!(window.localStorage.getItem("box") === null)){
		var string = window.localStorage.box;
		box = JSON.parse(string);
		return box;
	}else{
		window.localStorage.boxid = 0;
		return box;
	}
}

function boxDisplay( box )
{
	var i = 0;
	var choice;
	var allHave = [];
	for(i=0;i<box.length;i++){
		if(box[i].hasOwnProperty('choice'))
			choice = box[i].choice;
		else
			choice = 0;
		$("#mainTable tbody").append( $(" <tr> ").attr( 'id' , i ).attr( 'data-choice' , choice )
						.append( $(" <td> ").text( box[i].no )));
		if(box[i].no in allHave)
			allHave[box[i].no] ++;
		else
			allHave[box[i].no] = 1;
	}
		$("#material tbody tr").each(function(){
			var no = $(this).children().first().text();
			$(this).children().eq(2).text(allHave[no]);
		});
	}

function boxReset()
{
	$("#mainTable tbody").empty();
}

function internalLoad()
{
	if(!(window.localStorage.getItem("name") === null)&&!(window.localStorage.getItem("evolution") === null)&&!(window.localStorage.getItem("ultimate") === null)){
		var name = JSON.parse(window.localStorage.name);
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		console.log(ultimate);
		var allNeed = [];
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
				//$("#material").text("");
			}else
				$( this ).append($("<td>"));
			//顯示動作
			$( this ).append($("<td>")
				.append($("<span>")
					.addClass("glyphicon glyphicon-remove")
					.click(function(){
						var id = $(this).parent().parent().attr('id');
						var box = boxLoad();
						deleteMonster(id,box);
						var string = JSON.stringify(box);
						window.localStorage.box = string;
						box = boxLoad();
						boxReset();
						boxDisplay(box);
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
	var box = boxLoad();
	boxDisplay(box);
	if(internalLoad() == false){
		externalLoad();
		window.setTimeout("internalLoad();",5000);
	}
	console.log(box);
	console.log(window.localStorage.box);
	$("#add #btn-add-enter").click(function(){
		var box = boxLoad();
		var a = $("#add input[name='no']").val();
		var b = $("#add input[name='quantity']").val();
		var i = 0;
		for(i=0;i<b;i++){
			addMonster(a,box);
		}
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		box = boxLoad();
		boxReset();
		boxDisplay(box);
		internalLoad();
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
	});
	$("#ultimateBranch .btn-primary").click(function(){
		var branchChoice = $("input[type='radio']:checked", "#ultimateBranch").val();
		var id = $("input[type='radio']:checked", "#ultimateBranch").attr("data-id");
		var box = boxLoad();
		console.log(id);
		console.log(branchChoice);
		box[id].choice = branchChoice;
		$("#ultimateBranch .modal-body form").remove();
		$("#ultimateBranch .modal-body").append($("<form>"));
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		box = boxLoad();
		boxReset();
		boxDisplay(box);
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
});