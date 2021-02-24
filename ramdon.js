function ramdonQuestion(min, max) {
    if (max > 0) {
        var rept = 0;
        var end = 0;
        orderQuestion = [];
        while (rept != -1) {
            for (var i = 1; i <= max; i++) {
                var numberRamdon = Math.floor(Math.random() * (max + 1));
                if (orderQuestion.indexOf(numberRamdon) < 0 && numberRamdon != 0) {
                    orderQuestion.push(numberRamdon);
                    end++;
                }
                end == max ? rept = -1 : false;
            }
        }
    }

    console.log(orderQuestion);
}


ramdonQuestion(0, 4);