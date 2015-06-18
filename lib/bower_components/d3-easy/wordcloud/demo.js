// Don't forget to load dom. Otherwise, maketextCloud function might fails to work.
$().ready(function(){

    // Make sure the format => [ {"text": String, "value": Number}, ..., ... ]
    // Value should be greater than 0
    data = [
        {"text": "田中", "value": 3}, 
        {"text": "太郎", "value": 13}, 
        {"text": "西尾", "value": 8},
        {"text": "維新", "value": 80},
        {"text": "完全", "value": 18},
        {"text": "無血", "value": 2},
        {"text": "開城", "value": 6},
        {"text": "極悪", "value": 2},
        {"text": "戦隊", "value": 1},
        {"text": "田中", "value": 3}, 
        {"text": "太郎", "value": 13}, 
        {"text": "西尾", "value": 8},
        {"text": "維新", "value": 80},
        {"text": "完全", "value": 18},
        {"text": "無血", "value": 2},
        {"text": "開城", "value": 6},
        {"text": "極悪", "value": 2},
        {"text": "戦隊", "value": 1},
        {"text": "田中", "value": 3}, 
        {"text": "太郎", "value": 13}, 
        {"text": "西尾", "value": 8},
        {"text": "維新", "value": 80},
        {"text": "完全", "value": 18},
        {"text": "無血", "value": 2},
        {"text": "開城", "value": 6},
        {"text": "極悪", "value": 2},
        {"text": "戦隊", "value": 1},
    ]
    
    // you can use own color converting function if you want
    var my_color = d3.scale.category20();
    var href_func = function(d){ return "#" + d.text }

    // maketextCloud(data, css selector that you wanna insert in, scale of svg, class name of svg, font-family, rotate or not, your color converting function)
    makeWordCloud(data, href_func, "body", 500, "my_svg", "Impact", false, my_color)

    // [ svg class, font-family, rotate texts or not, color function ] are optional.
    // the simplest way => window.makeWordCloud(data, "body", 500)

})
