$(document).ready(function(){
  
  //set default name for Create Player div 
  $("#numPlayers").text(tempPlayer);

  //hide elements
  $(".wordDisplay").hide();
  $("#instructions").hide();
  $("#word").hide();
  $(".player").hide();
  $("#gameReset").hide();
  $("#avatar").hide();
  
  //START RACE button
  $("#start").on("click", function() {
    getAttributes();
    getTxt();
  })

  //RESET button
	$("#reset").on("click", function() {
		$(".player").css({left: 0,});
    $("#endGame").hide();
    $("#gameReset").hide();
    gameWords = [];
    currentPlayer = 0;
    var currentScore = 0;
    var singleWinMessage = "";
    generateWords();
    allCreated();
	});

  //player selector
  $("#playerCountBtn").on("click", playerSelector);

  //select avatar
  $(".avatars").on("click", createAvatarId);

  //Player creation
  $("#submitPlayer").on("click", multiPlayerCreation);

});

//sets number of players for the game and error check bad input
var numPlayers = 0;
function playerSelector() {
  if ($("#playerCount").val() > 4) {
    $(lowerIntro).text("Please enter a number less then 5");
  } else if ($("#playerCount").val() < 1) {
    $(lowerIntro).text("Please enter a number greater then 0");
  } else {
    numPlayers = $("#playerCount").val();
    $("#intro").hide();
    $("#avatar").show();
  }
};

// ** PLAYER CREATION FUNCTIONS ** \\
var playerCounter = 1;
var tempPlayer = "Player 1";
function multiPlayerCreation() { 
  if (playerCounter < numPlayers) {
    createPlayer();
    playerCounter += 1;
    resetPlayerChoice();
  } else {
    createPlayer();
    allCreated();
  }
};

//sets players avatar
var id = "spaceship1";
function createAvatarId() {
  $(".avatars").css('background-color', 'white');
  id = $(this).attr("id");
  $(this).css('background-color', 'yellow');
};

//creates individual player object
var playerInfo = [];
function createPlayer () {
  playerInfo.push({
    player_id: tempPlayer, 
    name: $("#playerName").val(),
    avatar: id,
    score:[],
  });
};

//clears player creation div
var currentPlayerNum = 1;
function resetPlayerChoice() {
  $("#playerName").val("");
  $(".avatars").css('background-color', 'white');
  currentPlayerNum += 1;
  tempPlayer = "Player " + currentPlayerNum;
  $("#numPlayers").text(tempPlayer);
};

//hides selection div and reveals instruvtion div
var currentPlayer = 0
function allCreated() {
  $("#avatar").hide();
  $("#instructions").show();
  $("#start").show();
  $("#instructionsName").text(playerInfo[currentPlayer].name);
};

// ** WORD ARRAY CREATOR FUNCTIONS ** \\

//randomize word array order
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//store word array attributes
var arrayAttributes = [];
var minNum = 0;
var maxNum = 0;
function getAttributes() {
  difficulty = $("#difficulty").val();
  switch (difficulty) {
    case "baby":
      minNum = 1;
      maxNum = 3;
      break;
    case "easy":
      minNum = 3;
      maxNum = 5;
      break;
    case "medium":
      minNum = 5;
      maxNum = 8;
      break;
    case "hard":
      minNum = 9;
      maxNum = 12;
      break;
    case "insane":
      minNum = 13;
      maxNum = 16;
      break;
  }
  arrayAttributes.push({
    minLetters: minNum,
    maxLetters: maxNum,
    language: $("#language").val(),
  })
  console.log(arrayAttributes);
};

//gets the root word list
function getTxt(){
  var language = arrayAttributes[0].language;
  $.ajax({
    url: "languages/" + language + ".txt",
    success: function (data){
      data = data.split(/\r?\n/); 
      generateArray(data);
      setupRace();
    }
  })
};

//creating the new array
var gameWords = [];
function generateArray(data){
  var finalArray = data.filter(filterByLength);
  finalArray = shuffle(finalArray);
  for(var i = 0; i < 50; i ++) {
    gameWords.push(finalArray[i]);
   }
  return gameWords;
};

//filters array by desired word length
function filterByLength(obj) {
  if ((obj.length >= arrayAttributes[0].minLetters) && (obj.length <= arrayAttributes[0].maxLetters)) {
    return true
  } else {
    return false
  }
};

    // ** RUNNING GAME FUNCTIONS ** \\

//hides instructions and reveals game
function setupRace() {
  $("#word").show();
  document.getElementById("word").focus();
  $(".toType").text(gameWords[0]);
  console.log(gameWords);
  $("#instructions").hide();
  $(".wordDisplay").show();
  $(".player").show();
  $(".player").css({left: 0,});
  $("#word").val("");
  var playerAvatar = 'url("images/' + playerInfo[currentPlayer].avatar + '.png")'
  $(".player").css({background: playerAvatar});
  runRace();
}

//game timer
var timeoutID;
function timer() {
  timeoutID = window.setTimeout(endRace, 45000)
}

var j=1; 
$(function wordChecker(){
  $(document).keyup(function(e){
    var targetWord = $(".toType").text();
    var typedWord = $("#word").val();
    console.log("j = " + j);
    if(typedWord === targetWord){
      $(".player").css({left: "+=15px",});
      targetWord = $(".toType").text(gameWords[j]);
      $("#word").val("");
      j++;
    }else {
      return
    };
  });
});

//advances ship on correct typing
function runRace() {
  j = 1;
  timer();  
}

// ** END GAME FUNCTIONS ** \\

//hides race div and generates score
//this could be refactred, as many parts of it don't need 
//to run in a multiplayer game, but it runs every time anyways
function endRace() {
  $(".wordDisplay").hide(); //not needed in multiplayer
  $("#word").hide(); //not needed in multiplayer
  alert("Times Up!");
  generateScore();
  checkMorePlayer();
}

var currentPlayer = 0
function checkMorePlayer() {
  currentPlayer += 1;
  if (currentPlayer < currentPlayerNum) {
    allCreated();
  }else {
    currentPlayer -= 1;
    checkMultiPlayer();
  }
}

function checkMultiPlayer() {
  if (numPlayers == 1) {
    generateWinMessage();
    winDisplay();
  } else {
    winConditions();
  }
}

function generateScore() {
  var tempScore = $(".player").css("left");
  tempScore = tempScore.slice(0, -2);
  tempScore = parseInt(tempScore) * 10;
  playerInfo[currentPlayer].score.unshift(tempScore);
}

var currentScore;
var singleWinMessage;
function generateWinMessage() {
  currentScore = playerInfo[currentPlayer].score[0];
  if (currentScore > 6000 ){
    singleWinMessage = "Holy nebula, " + playerInfo[currentPlayer].name + "!!!! You're amazing!!!"
  }else if(currentScore > 4000){
    singleWinMessage = "You're pretty good, " + playerInfo[currentPlayer].name + "!"
  }else{
    singleWinMessage = "Hmmm, you definetley need to keep playing this game. Keep at it " + playerInfo[currentPlayer].name + "!"
  }
}

function winDisplay() {
  $("#endGame").show();
  $("#gameReset").show();
  $("#winMessage").text(singleWinMessage);
  var scoreMessage = currentScore + " Miles Traveled"
  $("#finalScore").text(scoreMessage);
}

//check to see who has the highest score
function winConditions() {
  console.log("I'm in winConditions");
  var winner;
  var bestScore;
  for (var i = 0; i < playerInfo.length - 1; i++) {
    if (playerInfo[i].score[0] > playerInfo[i + 1].score[0]) {
      winner = playerInfo[i].name;
      bestScore = playerInfo[i].score[0];
    } else {
      winner = playerInfo[i + 1].name;
      bestScore = playerInfo[i + 1].score[0];
    }
  };
  multiWinDisplay(winner, bestScore);
}

function multiWinDisplay(winner, bestScore) {
  $("#endGame").show();
  $("#gameReset").show();
  var winMessage = "Good job " + winner + "! You outflew your competition and went " + bestScore + " miles!";
  $("#winMessage").text(winMessage);
}
