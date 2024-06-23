let board;
let score = 0;
let rows = 4;
let columns = 4;

// These variables will be used to monitor if the user already won in the value of 2048, 4096, or 8192.
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Declaring variable used for touch input
let startX= 0;
let startY= 0;

// Create a function to set the game board
function setGame() {

board = [
	    [0, 0, 0, 0],
	    [0, 0, 0, 0],
	    [0, 0, 0, 0],
	    [0, 0, 0, 0]
	];


	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {

			// this is to create a toile through creating div elements
			let tile = document.createElement("div");

			// Each tile will have an id based on its row position and column position
			// Imagine students in a room seated in row and column position.
			tile.id = r.toString() + "-" + c.toString(); 
			// console.log(tile)
			// console.log(tile.id)

			// Get the number of a tile from a backend board
			let num = board[r][c];

			console.log(num)
			// Use the number to update the tile's appearance through updateTile() function
			updateTile(tile, num);

			// Add the created tile with id to the frontend game board container.
			document.getElementById("board").append(tile); 
		}
	}

	setTwo();
	setTwo();
};

// This function is to update the appearance of the tile based on its number
function updateTile(tile, num) {
	tile.innerText="";
	tile.classList.value="";

	tile.classList.add("tile");

	if(num > 0) {
	   // This will display the number of the tile 
	   tile.innerText = num.toString();
	      
	   if (num <= 4096){
	       tile.classList.add("x"+num.toString());
	   } else {
	       // Then if the num value is greater than 4096, it will use class x8192 to color the tile
	       tile.classList.add("x8192");
	   }
	}
}

// event that triggers when the web page finishes loading. It's like saying "wait until everything on the page is ready."
window.onload = function() {
	// `setGame()` is called to be executed
	setGame();
}

function handleSlide(e) {
	console.log(e.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
		if(e.code == "ArrowLeft") {
			slideLeft();
			setTwo();
		} else if (e.code == "ArrowRight") {
			slideRight();
			setTwo();
		} else if (e.code == "ArrowUp") {
			slideUp();
			setTwo();
		} else if (e.code == "ArrowDown") {
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(() => {
		checkWin();
	}, 1000);

	if(hasLost() == true) {
		// setTimeOut is used to delay the execution of the code inside the arrow function.
		setTimeout(() => {
			alert("Game Over! You have lost the game. Game will restart.")
			restartGame();
			alert("Click any arrow key to restart.");
		}, 100)
	}

};

document.addEventListener("keydown", handleSlide);

function filterZero(row) {
	return row.filter(num => num != 0);
};

function slide(row){
	row = filterZero(row);

	for(let i=0; i<row.length - 1; i++) {
		if(row[i] == row[i+1]){
			row[i] *=2;
			row[i+1] = 0;
			// Logic for scoring
			score += row[i]
		}
	}

	row = filterZero(row);
	// Add zeroes on the back after merging

	while(row.length < columns) {
		row.push(0);
	}

	return row;
};



function slideLeft() {
    // iterate through each row
     for(let r = 0; r < rows; r++){
         // The current row is stored in the variable row
         let row = board[r] // sample: 0, 2, 2, 2

         // Line for animation
         let originalRow = row.slice();

         row = slide(row); // call slide function
         // note: slide function will return a new value for a specific row.
         board[r] = row;  // update the value in the array

         // Update the id of the tile
         // For each tile in the row, the code finds the corresponding HTML element by its ID. It then gets the number from the board array at that row and column, and uses the updateTile function to update the content and appearance of the tile.
         for(let c = 0; c < columns; c++){
             let tile = document.getElementById(r.toString() + "-" + c.toString());
             let num = board[r][c];
             // updateTile(tile, num)

             // Line for animation
             if(originalRow[c] !== num && num !== 0) {
                 tile.style.animation = "slide-from-right 0.3s"
                 setTimeout(() => {
                     tile.style.animation = ""
                 }, 300)
             }
             updateTile(tile, num)
         }
     }
};


function slideRight() {
    // iterate through each row
     for(let r = 0; r < rows; r++){
         // The current row is stored in the variable row
         let row = board[r] // sample: 0, 2, 2, 2

         // line for animation
         let originalRow = row.slice();

         row.reverse();
         row = slide(row); // call slide function
         // note: slide function will return a new value for a specific row.
         row.reverse();

         board[r] = row;  // update the value in the array

         // Update the id of the tile
         // For each tile in the row, the code finds the corresponding HTML element by its ID. It then gets the number from the board array at that row and column, and uses the updateTile function to update the content and appearance of the tile.
         for(let c = 0; c < columns; c++){
             let tile = document.getElementById(r.toString() + "-" + c.toString());
             let num = board[r][c];

             // Line for animation
             if(originalRow[c] !== num && num !== 0) {
                 tile.style.animation = "slide-from-left 0.3s"
                 setTimeout(() => {
                     tile.style.animation = ""
                 }, 300)
             }

             updateTile(tile, num)
         }
     }
};


function slideUp() {
    for(let c=0; c <columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // Line for animation
        let originalCol = col.slice();

        col = slide(col);

        // Documents the changes in position of tiles
        let changedIndeces = []
        for(let c = 0; c < columns; c++){
            if(originalCol[c] !== columns[c]) {
                changedIndeces.push(c)
            }
        }


    for(let r = 0; r < rows; r++){
        board[r][c] = col[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];

        // Line for animation
        if(changedIndeces.includes(r) && num !==0) {
            tile.style.animation = "slide-from-bottom 0.3s"
            setTimeout(() => {
                tile.style.animation = ""
            }, 300)
        }
        updateTile(tile, num)
    }

    }
};


function slideDown() {
    for(let c=0; c <columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // Line for animation
        let originalCol = col.slice();

        col.reverse();
        col = slide(col);
        col.reverse();

        // Documents the changes in position of tiles
        let changedIndeces = []
        for(let c = 0; c < columns; c++){
            if(originalCol[c] !== columns[c]) {
                changedIndeces.push(c)
            }
        }

    for(let r = 0; r < rows; r++){
        board[r][c] = col[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];

        // Line for animation
        if(changedIndeces.includes(r) && num !==0) {
            tile.style.animation = "slide-from-top 0.3s"
            setTimeout(() => {
                tile.style.animation = ""
            }, 300)
        }

        updateTile(tile, num)
    }

    }
};

function hasEmptyTile(){
	for(let r = 0; r<rows; r++){
		for(let c = 0; c<columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}

function setTwo() {
	if(hasEmptyTile() == false) {
		return
	}

	let found = false;

	while(found == false) {
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0) {
			// Generate new tile
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
};


function checkWin() {
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false) {
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false) {
				alert("You are unstoppabl at 4096!");
				is4096Exist = true;
			}
			else if(board[r][c] == 8192 && is8192Exist == false) {
				alert("Victory! You have reached 8192! You are incredibly awesome x 8192!");
				is8192Exist = true;
			}
		}
	}
}


function hasLost() {

	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c] === 0) {
				return false;
			}
			const currentTile = board[r][c];

			if (
				r > 0 && board[r-1][c] === currentTile ||
				r < rows -1 && board[r + 1][c] === currentTile ||
				c > 0 && board[r][c-1] === currentTile ||
				c < columns -1 && board[r][c + 1] === currentTile
			){
				// if we found an adjacent tile with the same value as the current tile, false, the user has not lost.
				return false;
			}
		}
	}
	// No empty tile and no possible moves left (you already lost)
	return true;
};


function restartGame() {
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			board[r][c] = 0;
		}
	}

	score = 0;
	setTwo();
}


//This code will listen when we touch the screen and coordinates of that touch/event
//input the x coordinate value to the startX and Y coordinate value to startY 
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
	if (!e.target.className.includes("tile")) {
		return
	}

	// to disable scrolling feature
	e.preventDefault();
}, {passive:false});
// use passive property to make sure that the preventDefault() will work.

document.addEventListener('touchend', (e) => {
	if (!e.target.className.includes("tile")) {
		return
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// Check if the horizontal swipe is greater in magnitude than the vertical swipe
	if (Math.abs(diffX) > Math.abs(diffY)) {
	    // Horizontal swipe
	    if (diffX > 0) {
	        slideLeft(); // Call a function for sliding left
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideRight(); // Call a function for sliding right
	        setTwo(); // Call a function named "setTwo"
	    }
	} else {
	    // Vertical swipe
	    if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}

	document.getElementById("score").innerText = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in millis
    }

})
