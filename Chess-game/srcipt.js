const gameBoard = document.querySelector('#gameboard');

const playerDisplay = document.querySelector('#player');

const infoDisplay = document.querySelector('#info-display');

const width = 8;

const tempArr = [];

const startPieces = [
    rook, knight, bishop, queen, knight, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, knight, bishop, knight, rook
];

function createBoard(){
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.setAttribute('square-id',i);
        //square.classList.add('beige');
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

        square.firstChild && square.firstChild.setAttribute('draggable', true);

        gameBoard.append(square);

        

    });
}

createBoard();

const allSquares = document.querySelectorAll("#gameboard .square");

allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

let startPosition;
let draggedElement;

function dragStart(e){
    startPosition = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;
}

let lastPosition;

function dragOver(e){
   e.preventDefault();
}
function dragDrop(e){
    e.stopPropagation();

    e.target.parentNode.append(draggedElement);

    e.target.remove();
 }
