
document.ready(function() {
    var input = document.querySelector('#searchform input');
    input.onfocus = function() {
        input.select();
        //input.animate({ width: '400px' });
        //document.getElementById('navbar').hide();
    };
    //input.onblur = function () {
    //    input.animate({ width: '' }, function() {
    //        document.getElementById('navbar').show();
    //    });
    //};
});
