$(document).ready(function () {

	$.ajax({
		method: "POST",
		url: 'https://api.apbugall.org/?token=45e20a5f584becf7a64dffb7174ddf&kp=' + $('[data-kinopoisk]').data('kinopoisk'),
		dataType: "json",

		success: function (data) {
			console.log(data.data);
			$('title').text(`${data.data.name} (${data.data.year})`);
		},
		error: function (er) {
			console.log(er);
		}
	});
});
