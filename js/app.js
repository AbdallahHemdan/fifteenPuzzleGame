(function() {
  let state = 1;
  let game = document.querySelector("#game");
  //   let noOfMoves = document.querySelector("#counter").innerText;
  //   noOfMoves = isNaN(noOfMoves) ? 0 : noOfMoves;

  // Creates game then shuffle it..
  createAndSolve(), shuffle();

  // Listens for click on game cells
  game.addEventListener("click", function(e) {
    if (state == 1) {
      // Enables sliding animation
      game.className = "animate";
      moveNumberCellToEmpty(e.target, 1);
    }
  });

  // Listens for click on control buttons
  document.getElementById("solve").addEventListener("click", createAndSolve);
  document.getElementById("shuffle").addEventListener("click", shuffle);

  // Create Solved Puzzle..
  function createAndSolve() {
    if (state == 0) {
      return;
    }
    game.innerHTML = ""; // Clear the game area
    let n = 1;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let cell = document.createElement("span"); // create one cell
        cell.id = `cell-${i}-${j}`; //                 'cell-' + i + '-' + j; give id to the cell
        cell.style.left = j * 80 + 1 * j + 1 + "px"; // position of the cell from left
        cell.style.top = i * 80 + 1 * i + 1 + "px"; // position of the cell from the top
        if (n <= 15) {
          // numberCell
          cell.classList.add("number");
          cell.classList.add(
            (i % 2 === 0 && j % 2 > 0) || (i % 2 > 0 && j % 2 === 0)
              ? "dark"
              : "light"
          ); // alternate between the cells (dark-light)
          cell.innerHTML = (n++).toString();
        } else {
          // emptyCell
          cell.className = "empty";
        }
        game.appendChild(cell);
      }
    }
    // resetNoOfMoves();
  }

  // shuffle the game
  function shuffle() {
    if (state == 0) {
      return;
    }
    game.removeAttribute("class"); // remove animation..
    state = 0;
    let previousCell;
    let i = 1;
    let interval = setInterval(function() {
      if (i <= 150) {
        let adjacent = getAdjacentCells(getEmptyCell());
        if (previousCell) {
          for (let j = adjacent.length - 1; j >= 0; j--) {
            if (adjacent[j].innerHTML == previousCell.innerHTML) {
              adjacent.splice(j, 1);
            }
          }
        }
        // Gets random adjacent cell and memorizes it for the next iteration
        previousCell = adjacent[getRandomNumberBetween(0, adjacent.length - 1)];
        moveNumberCellToEmpty(previousCell, 0);
        i++;
      } else {
        clearInterval(interval);
        state = 1;
      }
    }, 5);
    // resetNoOfMoves();
  }

  function resetNoOfMoves() {
    noOfMoves = 0;
    document.getElementById("counter").innerText = noOfMoves;
  }

  // Shifts number cell to the empty cell
  function moveNumberCellToEmpty(cell, playingOrShuffling) {
    // Checks if selected cell has number
    if (cell.className != "empty") {
      // Tries to get empty adjacent cell
      let emptyCell = getEmptyAdjacentCellIfExists(cell);

      if (emptyCell) {
        if (playingOrShuffling === 1) {
          //   noOfMoves++;
          //   document.getElementById("counter").innerText = noOfMoves;
          //   new Audio("../sound/fire_bow_sound-mike-koenig.mp3").play();
        }
        // There is empty adjacent cell..
        // styling and id of the number cell
        let tempCell = { style: cell.style.cssText, id: cell.id };

        // Exchanges id and style values
        cell.style.cssText = emptyCell.style.cssText;
        cell.id = emptyCell.id;
        emptyCell.style.cssText = tempCell.style;
        emptyCell.id = tempCell.id;

        if (state == 1) {
          // Checks the order of numbers
          checkSolvedState();
        }
      }
    }
  }

  // Gets specific cell by row and column.
  function getCell(row, col) {
    return document.getElementById(`cell-${row}-${col}`);
  }

  // get the empty cell.
  function getEmptyCell() {
    return game.querySelector(".empty");
  }

  // Gets empty adjacent cell if it exists.
  function getEmptyAdjacentCellIfExists(cell) {
    // Gets all adjacent cells
    let adjacent = getAdjacentCells(cell);

    // Searches for empty cell
    for (let i = 0; i < adjacent.length; i++) {
      if (adjacent[i].className == "empty") {
        return adjacent[i];
      }
    }

    // Empty adjacent cell was not found..
    return false;
  }

  // Gets all adjacent cells
  function getAdjacentCells(cell) {
    let id = cell.id.split("-");

    // Gets cell position indexes
    console.log(`id[0] = ${id[0]}`);
    let row = parseInt(id[1]);
    let col = parseInt(id[2]);

    let adjacent = [];

    // Gets all possible adjacent cells
    if (row < 3) {
      adjacent.push(getCell(row + 1, col)); // right
    }
    if (row > 0) {
      adjacent.push(getCell(row - 1, col)); // left
    }
    if (col < 3) {
      adjacent.push(getCell(row, col + 1)); // top
    }
    if (col > 0) {
      adjacent.push(getCell(row, col - 1)); // bottom
    }
    return adjacent;
  }

  // Checks if the order of numbers is correct and we get solved-state..
  function checkSolvedState() {
    // Checks if the empty cell is in correct position
    if (getCell(3, 3).className != "empty") {
      return;
    }

    let n = 1;
    // Goes through all cells and checks numbers
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (n <= 15 && getCell(i, j).innerHTML != n.toString()) {
          // Order is not correct
          return;
        }
        n++;
      }
    }
    // Puzzle is solved, offers to shuffle it
    startCongratsOverLay(), shuffle();
  }

  // Generates random number
  function getRandomNumberBetween(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }
})();

// overLay effect..
function startReadyOverLay() {
  document.getElementById("overlay-1").style.display = "block";
}
function endReadyOverLay() {
  document.getElementById("overlay-1").style.display = "none";
}
function startCongratsOverLay() {
  document.getElementById("overlay-2").style.display = "block";
}
function endCongratsOverLay() {
  document.getElementById("overlay-2").style.display = "none";
}
// Play sound library..
function Sound(source, volume, loop) {
  this.source = source;
  this.volume = volume;
  this.loop = loop;
  var son;
  this.son = son;
  this.finish = false;
  this.stop = function() {
    document.body.removeChild(this.son);
  };
  this.start = function() {
    if (this.finish) return false;
    this.son = document.createElement("embed");
    this.son.setAttribute("src", this.source);
    this.son.setAttribute("hidden", "true");
    this.son.setAttribute("volume", this.volume);
    this.son.setAttribute("autostart", "true");
    this.son.setAttribute("loop", this.loop);
    document.body.appendChild(this.son);
  };
  this.remove = function() {
    document.body.removeChild(this.son);
    this.finish = true;
  };
  this.init = function(volume, loop) {
    this.finish = false;
    this.volume = volume;
    this.loop = loop;
  };
}
