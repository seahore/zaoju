if("undefined" === typeof Zaoju)
    throw new Error("缺少zaoju.js文件");

( function () {

    $("#btn-gen").click( function () {
        $("#output-field").text(Zaoju.genSentence());
    });

    // $("#btn-copy").click(function () {});

    var disableSubmit = function (ev) {
        ev.preventDefault();
    };

    $("#form-reg-word").submit(disableSubmit);

    $("#btn-reg-word").click( function () {
        try {
            Zaoju.regWord($("#reg-word-val").val(), $("#reg-word-tags").val());
        }
        catch (e) {
            $("#reg-word-status").html(e.message).css("color","orangered").slideDown(200).delay(1200).slideUp(200);
            return;
        }
        $("#form-reg-word :text").val("");
        $("#reg-word-status").html("已添加").css("color","limegreen").slideDown(200).delay(1200).slideUp(200);
    });

    $("#form-set-pattern").submit(disableSubmit);

    $("#btn-set-pattern").click( function () {
        try {
            Zaoju.setPattern($("#pattern-src").val());
        }
        catch (e) {
            $("#set-pattern-status").html(e.message).css("color","orangered").slideDown(200).delay(1200).slideUp(200);
            return;
        }
        $("#set-pattern-status").html("设定成功").css("color","limegreen").slideDown(200).delay(1200).slideUp(200);
    });
}());