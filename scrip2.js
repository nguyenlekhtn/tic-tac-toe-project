const gameBoard = (() => {
    let gameboard = [["", "", ""], ["", "", ""], ["", "", ""]]
    const gridContainer = document.querySelector(".grid-container")
    
    // display gameboard function
    const display = () => {
        if(gridContainer.hasChildNodes()) {
            gridContainer.textContent = ''
        }
        gameboard.forEach((arr, x) => {
            arr.forEach((item, y) => {
                const gridItem = document.createElement("div")
                gridItem.textContent = item;
                gridItem.classList.add("grid-item")
                gridItem.setAttribute("data-x", x)
                gridItem.setAttribute("data-y", y)
                gridContainer.appendChild(gridItem)

            })
        })
    };

    const reset = () => {
        gameboard = [["", "", ""], ["", "", ""], ["", "", ""]]
        gameBoard.display()
    }

    const updateSpot = (gridItem, value) => {
        gridItem.textContent = value
        gameboard[gridItem.dataset.x][gridItem.dataset.y] = value
    };
    
    const isFull = function (){
        let count = 0;
        gameboard.forEach(arr => {
            arr.forEach(item => {
                if(item != "") count++
            })
        })
        return (count == 9)
    };

    const getNotSymbolCell = (symbol) => {
        // return array of grid-item whose textcontext not symbol
        const gridCells = [...gridContainer.querySelectorAll(".grid-item")]
        gridCells.filter(gridCell => {
            return gridCell.textContent != symbol
        })

    }

    return {display, updateSpot, reset, isFull, getNotSymbolCell}     
})();


const Player = (symbol, id) => {
    let selfGrid = Array(3).fill(false).map(x => Array(3).fill(false));
    const gridLength = 3;
    const getId = () => {

        return id;
    }

    const isWon = (x, y) => {
        let result = false;
        let resultOnce = false;
        let colCheck = true,
            rowCheck= true,
            cross1Check = true,
            cross2Check = true;
        for (let i = 0; i < gridLength; i++) {
            colCheck = colCheck && selfGrid[i][y];
        }
        if(colCheck) return true;

        
        for (let j = 0; j < gridLength; j++) {
            rowCheck = rowCheck && selfGrid[x][j];
            
        }
        if(rowCheck) return true;   

        if (x == y || Math.abs(x - y) == gridLength - 1) {
            for (let i = 0, j = 0; i < gridLength; i++, j++) {
                cross1Check = cross1Check && selfGrid[i][j];
            }
            if(cross1Check) return true;

            for (let i = 0, j = gridLength - 1; i < gridLength; i++, j--) {
                cross2Check = cross2Check && selfGrid[i][j];
            }
            if(cross2Check) return true;
        }

    };
    const playerFlag = document.querySelector(`div[data-player="${id}"]`);

    const active = () => {
        playerFlag.classList.add("active")
    };

    const disactive = () => {
        playerFlag.classList.remove("active")
    }

    const mark = (gridItem) => {
        gameBoard.updateSpot(gridItem, symbol);
        selfGrid[gridItem.dataset.x][gridItem.dataset.y] = true;
    }
    
    const reset = () => {
        selfGrid = Array(3).fill(false).map(x => Array(3).fill(false))
    }
    
    return {isWon, mark, active, disactive, getId, reset}
}

const gamePlay = (function () {
    let activePlayer;
    const human = Player('x', 1);
    const computer = Player('o', 2);
    const start = () => {
        gameBoard.display();
        // activePlayer = player; // whose turn
        // activePlayer.active(); // change indicator
        
        const gridItems = document.querySelectorAll(".grid-container > div")
        gridItems.forEach(item => {
            item.addEventListener('click', e => {
                inTurn(human, e.target)

                computerPlay()
                
            }, { once: true })
        })
    }

    function computerPlay() {
        let cellNotMine = gameBoard.getNotSymbolCell('o') // array of grid-item not marked by computer
        let randomCell = randomCell(cellNotMine)
        inTurn(randomCell)
        return
    }

    function randomCell(arr) { // return random item from an array
        const len = arr.length
        const index =  getRandomIntInclusive(0, len)
        return arr[index]
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    function inTurn(player, target) {
        player.mark();
        if(player.isWon(e.target.dataset.x, e.target.dataset.y)) {
            celebrate(player.getId())
            return;
        }

        if(gameBoard.isFull())
        {
            popup.querySelector(".popup-container p").textContent = `2 players tied!!!`
            popup.style.display = "block"
            return
        }
    }


    // function switchPlayer() {
    //     activePlayer.disactive()
    //     if (activePlayer.getId() == 1) {
    //         activePlayer = player2;
    //     }
    //     else {
    //         activePlayer = player1;
    //     }
    //     activePlayer.active()
    // };
    const popup = document.querySelector(".popup-container")

    function celebrate(id){
        popup.querySelector(".popup-container p").textContent = `Player ${id} won. Congratulation!!!`
        popup.style.display = "block"

    }

    document.querySelector(".reset").addEventListener('click', reset);

    function reset(e) {
        popup.style.display = "none"
        document.querySelector(".container").style.opacity  = 1
        gameBoard.reset()
        player1.reset()
        player2.reset()
        start()
        
    }



    return {start, reset}


})();

document.querySelector(".reset").addEventListener('click', gamePlay.reset)
document.querySelector(".start").addEventListener('click', gamePlay.start)
