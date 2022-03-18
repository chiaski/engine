console.log("play-test.js loaded");

$("#tempplay").click(function() {
    $('html, body').animate({
        scrollTop: $("#window-map").offset().top
    }, 200);
});