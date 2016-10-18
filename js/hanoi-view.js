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
