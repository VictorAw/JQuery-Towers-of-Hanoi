/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const HanoiGame = __webpack_require__(1);
	const HanoiView = __webpack_require__(2);

	$( () => {
	  const $rootEl = $('.hanoi');
	  const game = new HanoiGame();
	  new HanoiView(game, $rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Game {
	  constructor() {
	    this.towers = [[3, 2, 1], [], []];
	  }

	  isValidMove(startTowerIdx, endTowerIdx) {
	      const startTower = this.towers[startTowerIdx];
	      const endTower = this.towers[endTowerIdx];

	      if (startTower.length === 0) {
	        return false;
	      } else if (endTower.length == 0) {
	        return true;
	      } else {
	        const topStartDisc = startTower[startTower.length - 1];
	        const topEndDisc = endTower[endTower.length - 1];
	        return topStartDisc < topEndDisc;
	      }
	  }

	  isWon() {
	    let result = (this.towers[2].length === 3) || (this.towers[1].length === 3);
	    console.log(result);
	    return result
	  }
	  move(startTowerIdx, endTowerIdx) {
	    if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	      this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());

	      this.print();
	      return true;
	    } else {
	      return false;
	    }
	  }

	  print() {
	      console.log(JSON.stringify(this.towers));
	  }

	  promptMove(reader, callback) {
	      this.print();
	      reader.question("Enter a starting tower: ", start => {
	        const startTowerIdx = parseInt(start);
	        reader.question("Enter an ending tower: ", end => {
	          const endTowerIdx = parseInt(end);
	          callback(startTowerIdx, endTowerIdx)
	        });
	      });
	  }

	  run(reader, gameCompletionCallback) {
	      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	        if (!this.move(startTowerIdx, endTowerIdx)) {
	          console.log("Invalid move!");
	        }

	        if (!this.isWon()) {
	          // Continue to play!
	          this.run(reader, gameCompletionCallback);
	        } else {
	          this.print();
	          console.log("You win!");
	          gameCompletionCallback();
	        }
	      });
	  }
	}

	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// Note: A few excessive comments added in for
	// reviewing/learning JQuery syntax. Ignore them
	// if already familiar with JQuery.

	class View {
	  constructor(game, rootEl) {
	    this.game = game;
	    this.rootEl = rootEl;
	    this.selected = null;

	    this.setupTowers();
	    this.clickTower();
	  }

	  setupTowers() {
	    // Create three rods
	    for (let i=0; i<3; i++) {
	      let $ul = $("<ul></ul>");
	      $ul.addClass("rod"); // Rod css formatting
	      $ul.attr("number", `${i+1}`); // Store data to map rod to an index

	      // Create three discs on each rod
	      for (let j=0; j<3; j++) {
	        let $li = $("<li></li>");
	        // Create discs only on the first rod
	        if (i === 0) {
	          $li.addClass("disk"); // Disc css formatting
	          // Variable sized discs for visual effect
	          $li.width(`${((j+1) * 80) + 100}`);
	        }

	        $ul.append($li);
	      }
	      this.rootEl.append($ul);
	    }
	  }

	  render($startRod, $endRod) {
	    // Move the disc in the view
	    $startRod.children().first().remove().prependTo($endRod);
	  }

	  clickTower() {
	    let $rods = this.rootEl.children();

	    // Add click callbacks to rods
	    $rods.on("click", (event) => {
	      let currentTarget = event.currentTarget;
	      let $currentTarget = $(currentTarget);

	      // Cache selected rod if there is not one already cached
	      if (!this.selected) {
	        this.selected = $currentTarget;
	        this.selected.addClass('selected'); // Highlight selected rod
	      }
	      else {
	        // Get indices from rods for back-end
	        let startIdx = parseInt(this.selected.attr("number"))-1;
	        let endIdx = parseInt($currentTarget.attr('number'))-1;

	        // Try to make move
	        if (this.game.move(startIdx, endIdx)) {
	          this.render(this.selected, $currentTarget);
	          this.won();
	        }
	        // Invalid move console logs error.
	        // Logic for invalid move in game class
	        else {
	          console.log("ERROR");
	        }
	        // Deselect cached rod.
	        // Deselect on invalid move to allow the user to
	        // reselect a starting rod
	        this.selected.removeClass('selected');
	        this.selected = null;
	      }
	    });
	  }

	  won(){
	    // Alert winner when winning move is made
	    if(this.game.isWon()){
	      alert("You won!");
	    };
	  }
	}

	module.exports = View;


/***/ }
/******/ ]);