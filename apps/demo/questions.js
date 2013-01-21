
Demo.Questions = {

    data: [''],

    checkAnswers: function(from, to) {
        var errorCount = 0, total = to - from + 1;
        for (var i = from; i <= to; i++) {
            if (Demo.Questions.data[i] === undefined)
                continue;
            var qd = document.getElementById('demo-questions-qd' + i);
            if (!document.getElementById('demo-questions-q' + i + Demo.Questions.data[i]).checked) {
                var allButtons = document.getElementsByName('demo-questions-q' + i);
                errorCount++;
                qd.className = 'demo-tip demo-tip-warning';
                for(var j = 0; allButtons[j]; j++) {
                    if(allButtons[j].checked) {
                        qd.className = 'demo-tip demo-tip-error';
                        break;
                    }
                }
            } else {
                qd.className = 'demo-tip';
            }
        }

        var r = (total - errorCount) * 100 / total, className;

        if(r == 100) {
            innerHTML = '全对了!';
            className = 'demo-tip demo-tip-success';
        } else if(r > 60) {
            innerHTML = '';
            className = 'demo-tip demo-tip-warning';
        } else {
            innerHTML = r == 0 ? '没有一题是正确的...你在干吗?' : '不及格哦亲';
            className = 'demo-tip demo-tip-error';
        }

        var t = document.getElementById('demo-questions-info' + from);

        t.innerHTML = '答对' + (total - errorCount) + '/' + total + '题(' + r + '%) ' + innerHTML;
        t.className = className;

    }

};

Demo.writeQuestions = function (questions) {

    var from = Demo.Questions.data.length, i = from, c = 1;
	document.write('<section class="demo demo-questions">');
	for(var question in questions) {
		var answers = questions[question];
		document.write('<div class="demo-tip" id="demo-questions-qd' + i + '">\r\n<h4 class="demo">\r\n' + c + '. ' + Demo.Text.encodeHTML(question) + '\r\n</h4>\r\n<menu>\r\n');

		for(var j = 0; j < answers.length; j++) {
			if(answers[j].charAt(0) === '@') {
				Demo.Questions.data[i] = j;
				answers[j] = answers[j].substr(1);
			}

			document.write('<li><input type="radio" name="demo-questions-q' + i + '" id="demo-questions-q' + i + j + '"><label for="demo-questions-q' + i + j + '">' + Demo.Text.encodeHTML(answers[j]) + '</label></li>\r\n');
		}
		document.write('\r\n</menu>\r\n</div>\r\n');
		i++;
		c++;

	}

	document.write('<input type="button" onclick="Demo.Questions.checkAnswers(' + from + ',' + --i + ')" value="提交答案" class="demo"><div id="demo-questions-info' + from + '"></div></section>');
};