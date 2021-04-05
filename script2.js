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
        gridItem.style.backgroundColor = '#999'
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
        const modified = gridCells.filter(gridCell => {
            return gridCell.textContent == ""
        })

        return modified

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
                if (!inTurn(human, e.target)) { // end if won
                    return
                } // end if player won
                computerPlay()
                
            }, { once: true })
        })
    }

    function computerPlay() {
        let cellNotMine = gameBoard.getNotSymbolCell('o') // array of grid-item not marked by computer
        let cell = randomCell(cellNotMine) 
        inTurn(computer, cell)
        return
    }

    function randomCell(arr) { // return random item from an array
        const len = arr.length
        const index =  getRandomInt(0, len)
        return arr[index]
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    function inTurn(player, target) { // gameplay of each player, return false if won
        player.mark(target);
        if(player.isWon(target.dataset.x, target.dataset.y)) {
            celebrate(player.getId())
            return false;
        }

        if(gameBoard.isFull())
        {
            popup.querySelector(".popup-container p").textContent = `2 players tied!!!`
            popup.style.display = "block"
            return false;
        }
        return true;
    }

    const popup = document.querySelector(".popup-container")

    function celebrate(id){
        if(id == 1) popup.querySelector(".popup-container p").textContent = `You won. Congratulation!!!`
        else popup.querySelector(".popup-container p").textContent = `Computer won!!!`
        popup.style.display = "block"

    }

    document.querySelector(".reset").addEventListener('click', reset);

    function reset(e) {
        popup.style.display = "none"
        gameBoard.reset()
        human.reset()
        computer.reset()
        start()
        
    }



    return {start, reset}


})();

document.querySelector(".reset").addEventListener('click', gamePlay.reset)
document.querySelector(".start").addEventListener('click', gamePlay.reset)
