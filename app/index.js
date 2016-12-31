var app = angular.module("Law", ["ngFileUpload"]);
$.fn.serializeObject = function(){
	var o = {};
	var a = this.serializeArray();
	$.each(a, function(){
		if(o[this.name] !== undefined){
			if(!o[this.name].push){
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};
app.filter("range", function(){
	return function(input, total){
		total = parseInt(total);
		for(var i=0; i<total; i++){
			input.push(i);
		}
		return input;
	};
});