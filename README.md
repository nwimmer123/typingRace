# Type to the Stars

[heroku link](https://mysterious-basin-2931.herokuapp.com/)

[github link](https://github.com/nwimmer123/project-01)

I wrote this game to get me back in touch with jQuery and some front end logic I was feeling a little rusty with. Most of the apps I've made recenly have been CRUD web apps that haven't really used much logic, beyond the routing, so I wanted to write something with some simple problems to solve.

## Technologies Used

-languages: JavaScript, HTML, CSS
-framework: Bootstrap
-library: jQuery
-other: Git

## Existing Features

I tried to keep my functions really modular, like the win conditions, so I kept hte functions short and refered to them in other functions. I also worked on putting more comments in my HTML, as I have a tendency not to, but I'm training to train myself to comment more.

Here's a sample of the modular code.

```
function endRace() {
  $(".wordDisplay").hide();
  $("#word").hide();
  alert("Times Up!");
  generateScore();
  generateWinMessage();
  winDisplay();
  $("#endGame").show();
  $("#gameReset").show();
}

function generateScore() {
  var tempScore = $(".player").css("left");
  tempScore = tempScore.slice(0, -2);
  tempScore = parseInt(tempScore) * 10;
  playerInfo[0].score.unshift(tempScore);
}

var winMessage = "";
function generateWinMessage() {
  currentScore = playerInfo[0].score[0];
  console.log(currentScore);
  if (currentScore > 3000 ){
    winMessage = "Holy nebula, " + playerInfo[0].name + "!!!! You're amazing!!!"
  }else if(currentScore > 1000){
    winMessage = "You're pretty good, " + playerInfo[0].name + "!"
  }else{
    winMessage = "Hmmm, you definetley need to keep playing this game. Keep at it " + playerInfo[0].name + "!"
  }
}

function winDisplay() {
  $("#winMessage").text(winMessage);
  var scoreMessage = currentScore + " Miles Traveled"
  $("#finalScore").text(scoreMessage);
}
```

## Planned Features

I'm going to keep adding to this game. 
-I want to add the possibility of having up to 4 players, so individuals can play each other locally, and keep high scores up on screen for others to see. 
-I also then want to add a database and a server and let people play online and have their scores and avatars saved.
-I will also increase the size of the wordbank.
-I will make an easy, medium, or hard category for the game.
-I will allow players to select different languages.
-A really intersting challenge would be to allow alternate alphabets, such as Cyrillic.


