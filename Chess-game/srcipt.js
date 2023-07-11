const gameBoard = document.querySelector('#gameboard');

const playerDisplay = document.querySelector('#player');

const infoDisplay = document.querySelector('#info-display');

const width = 8;

let playerGo = 'black';
playerDisplay.textContent = 'black';

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function createBoard(){
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.setAttribute('square-id',i);
        const row = Math.floor((63 - i) / 8) + 1;
        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
        } else{
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
        }
        if(i <= 15){
            square.firstChild.classList.add('black');
        } else if(i <= 63 && i > 47){
            square.firstChild.classList.add('white');
        }

        
        square.firstChild?.setAttribute('draggable', true)

        gameBoard.append(square);

        

    })
    
}

createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

let startPositionId;
let draggedElement;

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

let lastPosition;

function dragOver(e){
   e.preventDefault();
}

function dragDrop(e) {
    e.stopPropagation();
    console.log(draggedElement)
    const correctGo = draggedElement.classList.contains(playerGo)

    const taken = e.target.classList.contains('piece');

    const opponentGo = playerGo === 'white' ? 'black' : 'white'

    const takenByOpponent = e.target?.classList.contains(opponentGo)

    const valid = checkIfValid(e.target)

    console.log('correct go', correctGo)
    console.log('taken', taken)
    console.log('opponent go', opponentGo)
    console.log('taken by opponent', takenByOpponent)
    console.log('valid', valid)

    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            // Önceki konumdan taşı kaldır
            e.target.remove()
            changePlayer();
            return;
        }
        // Daha sonra bu kontrolü yap
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = "You cannot go here!";
            setTimeout(() => {
                infoDisplay.textContent = "";
            }, 2000);
            return;
        }
        if (valid) {
            e.target.append(draggedElement);
            // Önceki konumdan taşı kaldır
            changePlayer();
            return;
        }
    }
}







 function checkIfValid(target){
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))

    const startId = Number(startPositionId)

    const piece = draggedElement.id

    switch(piece){
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]

            if(
                (starterRow.includes(startId) && (startId + (width * 2)) === targetId) ||
                (startId + width === targetId) || 
                (startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild) ||
                (startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild)

            ){
                return true;
            }
            break;
        
        case 'knight':
            if(
                startId + width + 2 === targetId || 
                startId + width - 2 === targetId ||
                startId - width + 2 === targetId || 
                startId - width - 2 === targetId ||
                startId + width*2 + 1 === targetId ||
                startId + width*2 - 1 === targetId ||
                startId - width*2 + 1 === targetId ||
                startId - width*2 - 1 === targetId 
             ){
                return true;
            }
            break;
        
        case 'bishop':
            if(
                startId + width + 1 === targetId ||

                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||

                startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild || 

                startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild  ||

                startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild  ||

                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild  ||

                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6 + 6}"]`).firstChild  ||

                startId + width * 8 + 8 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild &&
                !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6 + 6}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*7 + 7}"]`).firstChild

            ){
                return true;
            }
            break;
        
        case 'rook':
    }
 }

 function changePlayer(){
    if(playerGo === "black"){
        reverseIds();
        playerGo = "white";
        playerDisplay.textContent = "white"
    } else {
        revertIds();
        playerGo = "black"
        playerDisplay.textContent = "black"
    }
 }

 function reverseIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => {square.setAttribute('square-id', (width * width - 1) - i)})
 }
 function revertIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute("square-id", i));
  }
  