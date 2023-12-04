console.log("tutorials.js loaded");

// It begins at 0.
var chaos = 0;

/*

  TUTORIAL TYPES
  s = suggestion
  t = tip

*/


// helper for probability
function chance(prob) {
  return !!prob && Math.random() <= prob;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

//function tip(title, text, type, duration, pos, option_one, option_two) {
function tip(title, text, type, pos, option_one, option_two) {

  var _type;
  //  if(duration){
  //    
  //  }

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
  }, function(){
    setTimeout(function(){ $(t).css("animation", "none") }, 1500)
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
  msg: ["Your game seems to be lacking frogs. Have you tried to add more frogs in it?", "The game is feeling okay, but it could be better. I guess that applies to everything, though.", "Are you telling the story you want to tell?", "Things are looking kinda shitty...", "My feelings don't really matter anyway. Why are you asking me?", "It's OK.", "It's fine, I guess.", "It's as interesting as it is ignorable?", "Are you using all the unique affordances of the browser?", "Are you actually enjoying this?", "Well, there's nothing better to do...", "Actually, I think you're doing quite well.", "Do you write before you think, or do you think before you write? There's no right way, I'm just curious...", "Is this really the story that you want to tell, or the story you think others want to hear?", "What matters is that you make something you enjoy...", "I think everything you make is nice because I get to learn a bit more about you...", "I am only facilitating your story.", "With every click, we get a little closer... I get to learn more about you.", "The first responsibility of love is to listen.", "What are you bringing into this world?", "What are you forming?", "Is this something from a story you've told somebody before?", "Aside from this, I kind of just want to know how your day is.", "When you create, you remember and piece together... that's love...", "Does what you make set you free?", "Whatever story you tell, I will listen.", "Whatever story you tell, I will love you anyway.", "Whatever story you tell, I'm all ears.", "Whatever story you tell, I'll keep it.", "Even if we lose it all, we can always create something new.", "Even if this isn't anything 'new', you're building on something and learning—and that is the most interesting way of thinking about creation, no?", "The looking is becoming more important than the making..."],
  mood: ["ehhh", "finicky", "eager", "wistful...", "why are you touching me", "do you like that?", "*yawn*", "i'm thinking about a bird", "would you love me even if I were a little blade of grass"],


  checkmood: function (interval) {

    let img = pick(gamestatus.img);
    let msg = pick(gamestatus.msg);
    let mood = pick(gamestatus.mood);

    $("#gamestatus img")
      .attr("src", `./assets/status-${img}.gif`)
      .attr("title", mood);

      $("#gamestatus ._gamestatus_text").text(msg);

    setTimeout(gamestatus.checkmood, 40000);
  },

  init: function () {
    gamestatus.checkmood(40000);
  }
}

gamestatus.init();


// play

// ultimate dump


  setTimeout(function () {
    tip("Welcome to Engine", "Engine games are arranged in grids. When playing a game, you navigate to scenes in adjacent tiles. (Click me to get rid of me!)", "tip");
  }, 5000);


  setTimeout(function () {
    tip("Space is cool", "Because the 'space' of Engine games matter, think about how you can communicate time or what techniques you can use to make stories branch out...", "tip");
  }, 15000);


  setTimeout(function () {
    tip("Making and playing", "The way we make is the way we play... isn't that amazing?", "tip");
  }, 45000);



//
//
//tip("New Tip", "Double-click to add an object to the screen, doofus.", "tip");
//
//tip("New Tip", "Double-click to add an object to the screen, doofus.", "suggestion", 0, "I'm sorry", "OK");
//
//tip("LOL", "Double-click to add an object to the screen, doofus.", "warning");
