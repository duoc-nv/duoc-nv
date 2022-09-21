/**
* ログイン状態をクエリで渡さなければならないため、インターセプト用JSファイルを読み込み
**/
$.getScript('/dormyinn/common/js/intercept.php');


/*
--------------------------------------------------
	Javascript Direct In 空室カレンダー
	version: 2014
-------------------------------------------------- */

// タブ切替
var PersonSwitcher = function(){
	return {
		init: function(selector){
			if($(selector).length == 0) return;
			FormInit();

			// 最低検索人数 ( li a.selectedから値を読み取る。もしselectedがなければ2 )
			var person_num = $(selector).find("li a.selected").attr("id").replace("person-","");
			if(person_num == undefined){
				person_num = 1;
			}

			SelectHotelCustom(person_num);

			$(selector).find("li").click(
				function(){
					$(this).find("a").addClass("selected");
					$(this).siblings("li").find("a").removeClass("selected");
					var person_num = $(this).find("a").attr("id").replace("person-","");
					LoadVCal(person_num);
					return false;
				}
			);
		}
	}
}();
$(function(){
	PersonSwitcher.init("#person-switcher");
});

// 空室カレンダー切替
function SelectHotelCustom(person_num){
	LoadVCal(person_num);
}

function SelectDate(date_y, date_m){
	$("#VCal_y")[0].value = date_y;
	$("#VCal_m")[0].value = date_m;
	$("#VCal_d")[0].value = 1;
	LoadVCal();
}

function LoadVCal(person_num){

	var VCal_Person;
	var VCal_year;
	var VCal_month;
	var VCal_day;

	// 人数切替
	if(person_num == undefined) {

		VCal_Person = $("#VCal_psn")[0].value;

	} else {

		$("#VCal_psn")[0].value = person_num;
		VCal_Person = person_num;

	}

	VCal_year  = $("#VCal_y")[0].value;
	VCal_month = $("#VCal_m")[0].value;
	VCal_day   = $("#VCal_d")[0].value;

	DisabledItems();

	$.ajax({
		type: "GET",
		url: "https://asp.hotel-story.ne.jp/ver3d/jsonp.asp",
		dataType: "jsonp",
		cache: false,
		data:{
			json: "VacantRoomCalendarwithprice",
			hcod1: jsonp_hcod1,
			hcod2: jsonp_hcod2,
			j1: VCal_Person,
			j2: VCal_year,
			j3: VCal_month,
			j4: VCal_day,
			j5: 1
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			// 取得失敗処理
			EnabledItems();
		},
		success: function(jsonp){
			// 取得成功処理
			if(jsonp.value1 != ''){
				$("#Create_VCal")[0].innerHTML = jsonp.value1;
				EnabledItems();
			}
			else{
				// エラー処理
				EnabledItems();
			}
		}
	});
}

function DisabledItems(){
	$("#VCal_psn").attr("disabled", "disabled");
	document.body.style.cursor = 'wait';
}

function EnabledItems(){
	$("#VCal_psn").removeAttr("disabled");
	document.body.style.cursor = 'auto';
}

function FormInit(){
	dtToday = new Date();
	LoadVCal();

	$("#VCal_y")[0].value = dtToday.getYear();
	$("#VCal_m")[0].value = dtToday.getMonth() + 1;
	$("#VCal_d")[0].value = dtToday.getDay();
}

// 人数タブ制御
var count;
var person_max = 5;


function person_tab(){

	for(count=1; count <= person_max; count++){

		if(count == 1){
			document.write('<li><a href="javascript:void(0);" id="person-' + count + '" class="selected">' + count + '名利用</a></li>');
		}else{
			document.write('<li><a href="javascript:void(0);" id="person-' + count + '">' + count + '名利用</a></li>');
		}
	}

}

function person_value(){

	for(count=1; count <= person_max; count++){

		if(count == 1){
			document.write('<option value="' + count + '" selected>' + count + '</option>');
		}else{
			document.write('<option value="' + count + '">' + count + '</option>');
		}
	}

}


