// TODO: modularize
// TODO: clear formatting
// TODO: add download to .json

function alert(alertclass) {
  	$(alertclass).slideToggle();
  	window.setTimeout(function() {
	    $(alertclass).slideToggle("slow");
		}, 2000);
}

function process() {
	let moods = [0, 0, 0, 0, 0],
		activities = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	$('button', $('#moods')).each(function () {
    $(this).click(function() {
    	let elem = $(this).get(0),
    		index = Array.prototype.indexOf.call(elem.parentNode.children, elem),
    		initial = moods[index];

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

	$('button', $('#activities')).each(function () {
    $(this).click(function() {
    	$(this).toggleClass("btn-primary");
    	let elem = $(this).get(0),
    		childIndex = Array.prototype.indexOf.call(elem.parentNode.children, elem),
    		parentIndex = Array.prototype.indexOf.call(elem.parentNode.parentNode.children, elem.parentNode),
    		index = parentIndex * 5 + childIndex;

    	//console.log(index);
			activities[index] = 1 - activities[index];
		});
	});

	$('#date').click(function() {
		if (!Date.parse($('.form-control').val())) {
			alert("#alertdate");
		} else {
			alert("#alertdateset");
		}
	});

	// copy to clipboard
	$("#copy").click(function() {
  	var $temp = $("<input>");
  	$("body").append($temp);
  	$temp.val($(".panel-body").text()).select();
  	document.execCommand("copy");
  	$temp.remove();

		alert(".alert-info");
	});

	$("#submit").click(function() {
		let inputValue = $('.form-control').val(),
			date = new Date(inputValue),
			inputDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
			mood = moods.findIndex(val => val > 0),
			text = '{&#13;&#10;  "date:" ' + inputDate +
				',&#13;&#10;  "mood": ' + (mood + 1) +
				',&#13;&#10;  "activities": [' + activities.join() +
				']&#13;&#10;}, ';

		if(!Date.parse(inputValue)) {
			alert("#alertdate");
		} else if((new Date()).getTime() < date.getTime()) {
			alert("#alertdateseriously");
		} else if (mood == -1) {
	  	alert("#alertmood");
		} else {
			$(".panel-body").append(text);
			
			// increment date
			date.setDate(date.getDate() + 1);
			inputDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
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