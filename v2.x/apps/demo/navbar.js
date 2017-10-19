
Demo.writeNavbar = function (list) {


	var html = '<nav class="demo" style="width:230px;float: right;background:#FFFFFF"><div style="margin-left:10px;margin-bottom:20px;border:1px solid #DDDDDD;border-radius:4px 4px 4px 4px; padding:10px;background:#F9F9F9">', key, data, inUl = false;
    for (key in list) {

        if (list[key] === '-') {

            if (inUl) {
                html += '</ul>';
            }

            html += '<h3 class="demo" style="margin-top:0;margin-bottom:6px">' + key + '</h3>';
            html += '<ul class="demo" style="margin-bottom:10px">';

            inUl = true;

            continue;

        } else if (!inUl) {
        	html += '<ul class="demo" style="margin-bottom:10px">';
        }

        inUl = true;

        html += '<li style="list-style:none"><a class="demo" href="' + list[key].replace(/^~\//, Demo.baseUrl) + '" title="' + key + '"' + (/http\s?:\/\//i.test(list[key]) ? ' target="_blank"' : '') + '>' + key + '</a></li>';
        
    }

    html += '</ul></div></nav>';

    document.write(html);
};
