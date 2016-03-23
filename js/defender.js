;(function(){
  var defender = {};


  window.defender = defender;

  /*
    The 'space' is a region of 100x100 characters

    (0,0)------------------+
    |                      |
    |                      |
    |                      |
    +-------------------(79,9)


    'rocks' appear along the y=0 axis, and move to the right (from x=0 to x=79)
  */

  var iW = 80, iH = 10, bQuickSimulation = false;

  function log(sMsg){
    window.console && console.log(sMsg);
  }

  function assert(b, sMsg){
    if( !b )
      log(sMsg);
  }

  defender.rock = (function(){
    var rock = {};
    rock.create = function(iY){
      var oRock = {
        iX: 0,
        //Math.floor(Math.random() * iH)
        iY: iY
      };
      return oRock;
    }
    return rock;
  })();




  defender.start = function(notify_player){
    if( typeof(notify_player) !== "function" ){
      alert("Error: defender.init(notify_player) requires a function as its first parameter.");
    }
    // initialize the board
    var asHTML = ['<table style="border-collapse:collapse;border-width:0px">'];
    for( var i = 0; i < iH; i++ ){
      var asRow = ['<tr>'];
      for( var j = 0; j < iW+1; j++ ){
        asRow.push('<td id="td-'+j+'-'+i+'"></td>');
      }
      asRow.push('</tr>');
      asHTML.push(asRow.join(""));
    }


    asHTML.push('</table>')
    asHTML.push('<div style="font-size:12px;width:550px" id="game-message"></div>');

    asHTML.push('<div style="font-size:12px;width:570px" id="game-instructions">');
    asHTML.push('<h1>Defender</h1>');
    asHTML.push('<br/>Nasty Aliens are hurling red rocks at the planet <b>Earth</b>. Our last line of defence- <b>The Paddle</b>. Write the AI for The Paddle to defend the Earth from certain destruction.</br><br/>');
    asHTML.push('Download the instructions manual: <a target="_blank" href="http://download.basecase.com/programming-test/defender-test.pdf">defender-test.pdf</a>.</br><br/>');

    asHTML.push('<div style="border: 1px solid grey;padding:5px;background-color:#fee">');
      asHTML.push('<b>This is not specifically a "front-end" test</b><br/><br/>');
      asHTML.push('This test requires only writing the logic for the movement of the paddle and not the UI.<br/></br/>');
      asHTML.push('You must write a solution to this test using Javascript, but note that you do not need to interact with the "document object model" (DOM), and so');
      asHTML.push('this test is not specifically a "front-end" test.  Even if you have limited understanding of Javascript, you should be able to tackle this test.');
      asHTML.push('For those of you new to Javascript, I would suggest review the math and array functions available in Javascript:');
      asHTML.push('<ul>');
        asHTML.push('<li><a href="http://www.w3schools.com/jsref/jsref_obj_math.asp">http://www.w3schools.com/jsref/jsref_obj_math.asp</a></li>');
        asHTML.push('<li><a href="http://www.w3schools.com/js/js_arrays.asp">http://www.w3schools.com/js/js_arrays.asp</a></li>');
      asHTML.push('</ul>');
    asHTML.push('</div>');
    asHTML.push('</div>');
    $("body").css({"font-family": "courier", "font-size": "8px"});
    $("body").html(asHTML.join(""));

    defender.notify_player = notify_player;

    $("body").dblclick(function(){bQuickSimulation=true;})
    defender.game_loop();
  }

  defender.notify_player = function(aoRockNotifiction, iPaddleY){
    function log(sMsg){
      window.console && console.log(sMsg);
    }
    var asMsg = ["defender.notify_player: "];
    for( var i = 0; i < aoRockNotifiction.length; i++ ){
      var oRockNotification = aoRockNotifiction[i];
      asMsg.push("{distance: " + oRockNotification.distance + ", radians: " + oRockNotification.radians + "},");
    }


    // random plan
    var aiMove = [];
    for( var i = 0; i < 22; i++ )
      // -1, 0, 1
      aiMove.push( Math.floor(Math.random()*3) - 1 );

    log(asMsg.join(""));
    log("Plan: " + aiMove)
    return aiMove ;
  }

  var oPos = {
    iX: iW, iY: Math.floor(iH/2),
    // sequence values in [-1, 0, +1], indiciating the current defensive plan for the paddle
    aiMove: []
  };
  defender.notify_rock_change = function(aoRock){
    var aoRockNotifiction = [];
    for( var i = 0; i < aoRock.length; i++ ){
      var oRock = aoRock[i];
      var oRockNotification = {
        distance: (
          Math.pow( Math.pow(oPos.iX - oRock.iX, 2) + Math.pow(oPos.iY - oRock.iY, 2), 0.5)
        ),
        radians: Math.atan2(oPos.iY - oRock.iY, oPos.iX - oRock.iX)
      }

      // randomize order
      if( Math.random() < 0.5 )
        aoRockNotifiction.push(oRockNotification);
      else
        aoRockNotifiction = [oRockNotification].concat(aoRockNotifiction);
    }

    oPos.aiMove = defender.notify_player(aoRockNotifiction, oPos.iY);
    if( !oPos.aiMove || !oPos.aiMove.length ){
      oPos.aiMove = [];
    }
  }

  // when iRockWait is zero, it's time for a new rock!
  // 600 ticks = 2min
  var iTickCount = 0, iTickMax = 600;
  var aoRock = [];


  var iRockWait = 1;
  defender.game_loop = function(){
    iRockWait--;
    iTickCount++;
    var bRockBlocked = false;
    // update any rocks
    var aoNewRock = [];
    for( var i = 0; i < aoRock.length; i++ ){
      var oRock = aoRock[i];
      oRock.iX++;
      if( oRock.iX === iW ){
        if( oPos.iY === oRock.iY ){
          log("Blocked attack!");
          bRockBlocked = true;
        }else{
          $("#game-message").html("<h1>Game over!</h1><div>The Earth is now a smouldering ruin.</div>")
          return;
        }
      } else {
        aoNewRock.push(oRock);
      }
    }
    aoRock = aoNewRock;

    if( iTickCount === iTickMax ){
      $("#game-message").html("<h1>Congratulations!</h1><div>Your planetary defences seem to be working.</div>")
      return;
    }
    // create new rocks
    if( iRockWait === 0 ){
      aoRock.push(defender.rock.create(Math.floor(Math.random() * iH)));
      defender.notify_rock_change(aoRock);
      // iH = 9, => 21 dots sepearate rocks
      iRockWait = iH * 2 + 2;
    } else if(bRockBlocked){
      defender.notify_rock_change(aoRock);
    }

    // move paddle
    var iMove = oPos.aiMove.shift();

    if( iMove === 1 || iMove === -1 || iMove === 0){
      var iNewY = oPos.iY + iMove;
      if( iNewY < 0 ){
        log("Invalid move: you can't move the paddle to (y=-1).");
      }else if( iNewY >= iH ){
        log("Invalid move: you can't move the paddle to (y=" + iH + ").");
      }else{
        oPos.iY += iMove;
      }
    } else if( iMove !== undefined ){
      log("Invalid move: " + iMove + ". A valid move msut be one of: [-1, 0, +1].");
    }

    // render game board
    if( !bQuickSimulation ){
      $("table td").text(".").css("color", "#aaa");
      for( var i = 0; i < aoRock.length; i++ ){
        var oRock = aoRock[i];
        $("#td-"+oRock.iX+"-"+oRock.iY).text("O").css("color", "red");
      }
      for( var j = 0; j < iH; j++ )
        $("#td-" + iW + "-" + j).text(" ");
      $("#td-" + iW + "-" + oPos.iY).text("|").css("color", "black")
    }

    window.setTimeout(
      defender.game_loop,
      bQuickSimulation ? 1 : 100
    );
  }

})();
