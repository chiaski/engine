console.log("tutorials.js loaded");

// It begins at 0.
var chaos = 0;

/*

  TUTORIAL TYPES
  s = suggestion
  t = tip

*/

function tip(title, text, type, pos, option_one, option_two) {

  var _type;

  switch (type) {
    case "suggestion":
      _type = "__suggestion";
      break;
    case "warning":
      _type = "__warning";
      break;
    case "tip":
      _type = "__tip";
      break;
  }

  let t = `
    <div class="_modal ` + _type + `" data-type="` + type + `">
      <h3>` + title + `</h3>
      <p>` + text + `</p>`;

  if (option_one !== undefined && option_two !== undefined) {
    t += `
      <div class="_options">
        <button data-type="deprecate" data-times="0">` + option_one + ` </button>
        <button data-type="accept" data-times="0">` + option_two + `</button>
      </div>`
  }


  t += "</div>"

  // bind dismissable event
  switch (type) {
    case "suggestion":
      t = $(t).bind("click", tutorialControls.dismissable_deprecate);
      break;
    case "warning":
      t = $(t).bind("click", tutorialControls.dismissable_warning);
      break;
    case "tip":
      t = $(t).bind("click", tutorialControls.dismissable);
      break;
  }

  $(t).hide().prependTo("#outer-modals").fadeIn({
    queue: true,
    duration: 'slow'
  });

}


const tutorialControls = {

  sorry: ["Okay", "OK, OK", "I got it", "I'm sorry"],

  dismissable: function () {
    // dismiss 
    $(this)
      .css("transform", "scale(0.98)")
      .fadeOut(500);
  },

  dismissable_warning: function () {
    // dismiss 
    $(this)
      .css("transform", "scale(1.1)")
      .fadeOut(1000);
  },

  dismissable_deprecate: function () {

    var cnt = $(this).find("button[data-type='deprecate']").attr("data-times");
    cnt = parseInt(cnt);

    if (cnt == (tutorialControls.sorry).length) {
      // dismiss 
      $(this)
        .css("transform", "scale(0.98)")
        .fadeOut(500);
    } else {
      $(this).find("button[data-type='deprecate']").text(tutorialControls.sorry[cnt]);
      $(this).find("button[data-type='deprecate']").attr("data-times", cnt + 1);
    }
  }
}

const gamestatus = {

  img: ["bleh", "boring", "cool", "eh", "nice", "ok"],
  msg: ["Your game seems to be lacking frogs. Have you tried to add more frogs in it?", "The game is feeling okay, but it could be better. I guess that applies to everything, though.", "Are you telling the story you want to tell?", "Things are looking kinda shitty...", "My feelings don't really matter anyway. Why are you asking me?", "It's OK.", "It's fine, I guess.", "It's as interesting as it is ignorable?", "Are you using all the unique affordances of the browser?", "Are you actually enjoying this?", "Well, there's nothing better to do..."],
  mood: ["ehhh", "finicky", "eager", "wistful...", "why are you touching me", "do you like that?", "*yawn*", "i'm thinking about a bird", "would you love me even if I were a little blade of grass"],

  checkmood: function (interval) {

    let img_random = gamestatus.img[Math.floor(Math.random() * (gamestatus.img).length)];
    let msg_random = gamestatus.msg[Math.floor(Math.random() * (gamestatus.msg).length)];
    let mood_random = gamestatus.mood[Math.floor(Math.random() * (gamestatus.mood).length)];

    $("#gamestatus img").attr("src", "./assets/status-" + img_random + ".gif");
    $("#gamestatus img").attr("title", mood_random);

    $("#gamestatus ._gamestatus_text").text(msg_random);

    setTimeout(gamestatus.checkmood, 30000);
  },

  init: function () {
    gamestatus.checkmood(30000);
  }
}

gamestatus.init();
//
//
//tip("New Tip", "Double-click to add an object to the screen, doofus.", "tip");
//
//tip("New Tip", "Double-click to add an object to the screen, doofus.", "suggestion", 0, "I'm sorry", "OK");
//
//tip("LOL", "Double-click to add an object to the screen, doofus.", "warning");



//
//$('#outer-modals ._modal').on('click', function () {
//
//
//});
