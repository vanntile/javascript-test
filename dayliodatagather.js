function alert(alertclass) {
 	$(alertclass).slideToggle();
 	window.setTimeout(function() {
    $(alertclass).slideToggle("slow");
	}, 2000);
}

function copyToClipboard() {
	let $temp = $("<input>");

	$("body").append($temp);
	$temp.val($(".panel-body").html()).select();
	document.execCommand("copy");
	$temp.remove();

	alert("#alert-copy");
}

function jsonDownload() {
	let data = "data:text/json;charset=utf-8," + $(".panel-body").html(),
		download = document.getElementById('dldLink');

	download.setAttribute("href", data);
	download.click();

	alert("#alert-download");
}

function process() {
	let moods = [0, 0, 0, 0, 0],
		activities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		firstTime = 1;

	$(".panel-body").append("[]");

	$('button', $('#moods')).each(function (index) {
    $(this).click(function () {
    	let initial = moods[index];

    	moods = Array.apply(null, Array(5)).map(Number.prototype.valueOf,0);
    	moods[index] = 1 - initial;

    	$('button', $('#moods')).each(function() {
    		$(this).removeClass("btn-success");
    	});

    	if (moods[index] === 1) {
    		$("#moods button:nth-child(" + (index + 1) + ")").addClass("btn-success");
    	}
		});
	});

	$('button', $('#activities')).each(function (index) {
    $(this).click(function () {
    	$(this).toggleClass("btn-primary");
			activities[index] = 1 - activities[index];
		});
	});

	// set Date interaction
	$('#date').click(function() {
		!Date.parse($('.form-control').val()) ? alert("#alertdate") :
		alert("#alertdateset");
	});

	// copy to clipboard
	$("#copy").click(copyToClipboard);

	// download as .json
	$("#json").click(jsonDownload);

	$("#submit").click(function() {
		let inputValue = $('.form-control').val(),
			date = new Date(inputValue),
			inputDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" +
				date.getDate(),
			mood = moods.findIndex(val => val > 0),
			text = '{&#10;  "date": "' + inputDate + '",&#10;  "mood": ' +
				(mood + 1) + ',&#10;  "activities": [' + activities.join() + ']&#10;}]';

		if(!Date.parse(inputValue)) {
			alert("#alertdate");
		} else if((new Date()).getTime() < date.getTime()) {
			alert("#alertdateseriously");
		} else if (mood == -1) {
	  	alert("#alertmood");
		} else {
			// update the text, along with correct JSON formatting
			$('.panel-body').text(function (_,txt) {
			  return txt.slice(0, -1);
			});

			if(firstTime) {
				firstTime = 0;
			} else {
				$(".panel-body").append(", ");
			}

			$(".panel-body").append(text);
			
			// increment date
			date.setDate(date.getDate() + 1);
			inputDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
				date.getDate();
			$('.form-control').val(inputDate);

			// reset 
			moods = Array.apply(null, Array(5)).map(Number.prototype.valueOf,0);
			activities = Array.apply(null, Array(20)).map(Number.prototype.valueOf,0);
	
	    $('button', $('#moods')).each(function() {
	    	$(this).removeClass("btn-success");
	    });
	
	    $('button', $('#activities')).each(function() {
	    	$(this).removeClass("btn-primary");
	    });
		}
	});
}

$(document).ready(process);