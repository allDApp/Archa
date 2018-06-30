
var ArchaAddress = "n1iQGVMajqgCV8YriRTKLJwk3biLqNoWjmX";
$(function() {
	
	
		var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
		var nebpay = new NebPay();


	$("#allArcha").click(function() {
		$("#detailTitle").text("All Archa-全部Archa");

		var to = ArchaAddress;
		var value = "0";
		var callFunction = "getArcha";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function(resp) {
				//console.log(JSON.stringify(resp.result));
				if(resp.result == ""){
					$("#searchresult").html('<div class="panel-body" >没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if(res.length == 0){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}

				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
					if (i == 2){
						i += 1
					}
					if (i % 2 == 0) {
						tempStr += '<div class="panel-body"> ';
					} else {
						tempStr += '<div class="panel-footer">';
					}

					//					
					tempStr += '<p>';
					tempStr += res[i].name+'  保证金:'+ res[i].value/1e15;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += '<small><cite>' + 'Archa ID:' + res[i].author + '</cite></small>';
					tempStr += '<br>';
					tempStr += '<a class="btn" href="javascript:void(0)" id="like" onclick="addMyArcha(';
					tempStr += res[i].index;
					tempStr += ')">查看详细资料</a>';

					tempStr += '</p> </div> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});
	$("#allArcha").click();

	$("#myArcha").click(function() {
		$("#detailTitle").text("My Archa-收藏Archa");



		var to = ArchaAddress;
		var value = "0";
		var callFunction = "getMy";
		var callArgs = "[]";
		nebpay.simulateCall(to, value, callFunction, callArgs, {
			listener: function(resp) {
				//console.log(JSON.stringify(resp.result));
				if(resp.result == ""){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}
				var res = JSON.parse(resp.result);
				if(res.length == 0){
					$("#searchresult").html('<div class="panel-body">没有记录</div>');
					return;
				}
				

				var tempStr = "";

				for (var i = 0; i < res.length; i++) {
					if (i % 2 == 0) {
						tempStr += '<div class="panel-body"> ';
					} else {
						tempStr += '<div class="panel-footer">';
					}

					//					
					tempStr += '<p>';
					tempStr += res[i].name;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += res[i].content;
					tempStr += '</p>';
					tempStr += '<p>';
					tempStr += '<small><cite>' + 'Archa提交ID:' + res[i].author + '  保证金:'+ res[i].value/1e15 +'</cite></small>';
					tempStr += '<br>';
					tempStr += '<a class="btn" href="#" id="unMyArcha" onclick="unMyArcha(';
					tempStr += res[i].index;
					tempStr += ')">移除</a>';
					
					tempStr += '</p> </div> ';
				}
				console.log(tempStr);
				$("#searchresult").html(tempStr);
			}
		});

	});

	$("#newArcha").click(function() {
		$("#detailTitle").text("New Archa-提交新Archa源码")

		var tempStr = '';
		tempStr += '<div class="panel-body"> ';
		tempStr += '<form role="form">';
		tempStr += '<div class="form-group">';
		tempStr += '<p>Archa 考古资料题目 </p>';
		tempStr += '<textarea class="form-control" rows="5" id="name" ></textarea>';
		tempStr += '<p>Archa 资料内容</p>';
		tempStr += '<textarea class="form-control" rows="9" id="content" ></textarea>';
		tempStr += '<p>提交保证金</p>';
		tempStr += '<textarea class="form-control" rows="1" id="bals" >0.001</textarea>';	
		tempStr += '<button type="button" class="btn btn-primary" id="savebutton" onclick="save();">提交资料</button>';		
		tempStr += '</div>';
		tempStr += '</form>';
		tempStr += '</div> ';
		console.log(tempStr);

		$("#searchresult").html(tempStr);
	});

});

function addMyArcha(index){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var to = ArchaAddress;
		var value = "0.000001";
		var callFunction = "adMy";
		var callArgs = "[\"" + index + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function Push(resp) {
				console.log("response of push: " + JSON.stringify(resp))
				var respString = JSON.stringify(resp);
				if(respString.search("rejected by user") !== -1){
					alert("关闭交易,取消上传资料")
				}else if(respString.search("txhash") !== -1){
					alert("上传Hash: " + resp.txhash+"请等待交易确认,如果上传失败请检查内容是否含有特殊字符")
				}
			}
		});
};

function unMyArcha(index){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var to = ArchaAddress;
		var value = "0";
		var callFunction = "unMy";
		var callArgs = "[\"" + index + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function(resp) {
				console.log(JSON.stringify(resp.result));
			}
		});
};

function save(){
	var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
	var nebpay = new NebPay();
		var content = $("#content").val();
		var name = $("#name").val();
		var bal = $("#bals").val();
		if (content == "") {
			alert("请输入内容。");
			return;
		}
		if (name == "") {
			alert("请输入名称。");
			return;
		}
		if (bal == "") {
			alert("请输入保证金。");
			return;
		}
		content= content.replace(/\n/g,"<br>"); 
		name= name.replace(/\n/g,"<br>"); 
		var to = ArchaAddress;
		var value = bal;
		var callFunction = "save";
		var callArgs = "[\"" + name + '","' + content + "\"]";
		nebpay.call(to, value, callFunction, callArgs, {
			listener: function Push(resp) {
				console.log("response of push: " + JSON.stringify(resp))
				var respString = JSON.stringify(resp);
				if(respString.search("rejected by user") !== -1){
					alert("关闭交易,取消上传资料")
				}else if(respString.search("txhash") !== -1){
					alert("上传Hash: " + resp.txhash+"请等待交易确认,如果上传失败请检查内容是否含有特殊字符")
				}
			}
		});
	
};