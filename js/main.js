/*
  This AI simply generates a random 'plan'.

  Update the 'notify_player()' function to implement your own AI.
*/

var notifyCount = 0;
// var angle = Math.atan((p1y - p2y) / (p2x - p1x)) * (180 / Math.PI);
// var angle = Math.atan((3) / (80))
// == p1 = P , P2 = rock

function getYPoint(rock, paddle_y) {
    console.log("+++ getYPoint: " + rock.distance + ", " + rock.radians);
    var result = -1;
    var minDiff = 9999;
    for (var i = 0; i < 10; i++) {
        var diffY = i - paddle_y;
        var t = Math.atan(diffY / (rock.distance))

        if (t < 0) {
            console.log("..T");
            t = Math.abs(t);
        }

        if (rock.radians < 0) {
            console.log("..R");
            rock.radians = Math.abs(rock.radians);
        }

        console.log(i + "Check: " + rock.radians + " - t: " + t + ", " + rock.distance + ", diffY: " + diffY + ", paddle_y: " + paddle_y + ", diffT: " + (rock.radians - t));

        var trydiff = rock.radians - t;
        console.log("diff: " + trydiff);
        if (trydiff < 0) {
            trydiff = Math.abs(trydiff);
            console.log("diff: " + trydiff);
        }

        console.log("compare: " + trydiff + ", " + minDiff)
        if (trydiff <= minDiff) {
            minDiff = trydiff;
            console.log("indexing: " + i + " == " + minDiff);
            result = i;
        }
    }

    console.log("### Get Y Point: " + result);
    return result;
}

var MOVE_UP = -1;
var MOVE_DOWN = 1;
var MOVE_STAY = 0;

defender.start(
    function notify_player(rocks, paddle_y) {
        console.log(notifyCount + "+++++++++++++ notify_player: " + rocks.length + "; paddle_y = " + paddle_y + ", size" + rocks.length);

        // get Rock Y Point.
        var minDistance = 80;
        var nearRockIndex = 0;
        for (var i = 0; i < rocks.length; i++) {
            console.log("rocks[" + i + "]: " + rocks[i].distance + ", " + rocks[i].radians);
            if (rocks[i].distance < minDistance) {
                minDistance = rocks[i].distance;
                nearRockIndex = i;
            }
        }

        var rockY = getYPoint(rocks[nearRockIndex], paddle_y);
        rocks[nearRockIndex].y = rockY;

        var moves = [];

        // Calculate Movement
        var currentY = paddle_y;
        if (rocks.length > 0) {
            var rock = rocks[nearRockIndex];
            console.log(nearRockIndex + "Caculate movement: " + rock.y + ", Now: " + currentY);
            var diffY = rock.y - currentY;
            if (diffY < 0) {
                diffY = Math.abs(diffY);
                for (var j = 0; j < diffY; j++) {
                    moves.push(MOVE_UP);
                    console.log("@@@@@@@@@@@@@@@@ MOVE_UP");
                }

            } else if (diffY > 0) {
                for (var j = 0; j < diffY; j++) {
                    moves.push(MOVE_DOWN);
                    console.log("@@@@@@@@@@@@@@@@ MOVE_DOWN");
                }
            } else if (diffY == 0) {
                moves.push(MOVE_STAY);
                console.log("@@@@@@@@@@@@@@@@ MOVE_STAY");
            }
        } else {
            // random plan
            for (var i = 0; i < 22; i++) {
                // -1, 0, 1
                moves.push(Math.floor(Math.random() * 3) - 1);
            }
        }

        console.log(notifyCount + "---------------- notify_player: " + rocks.length + "; paddle_y = " + paddle_y);
        notifyCount += 1;
        return moves;
    }
);
