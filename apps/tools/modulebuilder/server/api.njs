
switch(request.queryString.action){
	case 'getrecentlist':
		response.end();
		break;
	case 'getrecentlist':
		response.end();
		break;
}
		response.end();


		

function writeJsonp(context, data) {

    data = JSON.stringify(data);

    if (context.request.queryString.callback) {
        context.response.write(context.request.queryString.callback + '(' + data + ')');
    } else {
        context.response.write(data);
    }

}