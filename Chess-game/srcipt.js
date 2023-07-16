const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');
const width = 8;
let playerGo = 'black';
playerDisplay.textContent = 'black';
let blocked = false;

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

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.innerHTML = startPiece;
    square.setAttribute('square-id', i);
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
    } else {
      square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
    }
    if (i <= 15) {
      square.firstChild.classList.add('black');
    } else if (i <= 63 && i > 47) {
      square.firstChild.classList.add('white');
    }

    square.firstChild?.setAttribute('draggable', true);

    gameBoard.append(square);
  });
}

createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();

  const correctGo = draggedElement.classList.contains(playerGo);
  const taken = e.target?.classList.contains('piece');
  const opponentGo = playerGo === 'white' ? 'black' : 'white';
  const takenByOpponent = e.target?.classList.contains(opponentGo);
  const valid = checkIfValid(e.target, opponentGo);

  if (correctGo) {
    if (takenByOpponent && valid) {
      const targetSquare = e.target.parentNode;
      const previousPiece = targetSquare?.firstChild;
      previousPiece?.remove();

      targetSquare?.appendChild(draggedElement);
      draggedElement = null; // Taşın orijinal konumunu sıfırla
      changePlayer();
      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = "You cannot go here!";
      setTimeout(() => {
        infoDisplay.textContent = "";
      }, 2000);
      return;
    }
    if (valid) {
      const targetSquare = e.target;
      targetSquare.append(draggedElement);
      draggedElement = null; // Taşın orijinal konumunu sıfırla
      changePlayer();
      return;
    }
  }
}



// ...

// ...

function checkIfValid(target, opponentGo) {
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));

  const startId = Number(startPositionId);

  const piece = draggedElement.id;

  let isValid = false; // valid değişkeni burada tanımlanır

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];

      if (
        starterRow.includes(startId) &&
        startId + width * 2 === targetId &&
        !document.querySelector(`[square-id="${startId + width * 2}"]`)?.firstChild ||
        startId + width === targetId &&
        !document.querySelector(`[square-id="${startId + width}"]`)?.firstChild ||
        startId + width - 1 === targetId &&
        document.querySelector(`[square-id="${startId + width - 1}"]`) ||
        startId + width + 1 === targetId &&
        document.querySelector(`[square-id="${startId + width + 1}"]`)
      ) {
        isValid = true; // valid'i true olarak güncelle
      }
      break;

    case "knight":
      if (
        startId + width + 2 === targetId ||
        startId + width - 2 === targetId ||
        startId - width + 2 === targetId ||
        startId - width - 2 === targetId ||
        startId + width * 2 + 1 === targetId ||
        startId + width * 2 - 1 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId
      ) {
        isValid = true; // valid'i true olarak güncelle
      }
      break;

      case "bishop":
        const rowDiff = Math.floor(targetId / width) - Math.floor(startId / width);
        const colDiff = (targetId % width) - (startId % width);
  
        if (Math.abs(rowDiff) === Math.abs(colDiff)) {
          const stepRow = rowDiff > 0 ? 1 : -1;
          const stepCol = colDiff > 0 ? 1 : -1;
          let currentPosition = startId + stepRow * width + stepCol;
  
          isValid = true;
  
          while (currentPosition !== targetId) {
            const currentPiece = document.querySelector(`[square-id="${currentPosition}"]`)?.firstChild;
  
            if (currentPiece) {
              isValid = false;
              break;
            }
  
            currentPosition += stepRow * width + stepCol;
          }
        }
  
        if (isValid) {
          const targetPiece = document.querySelector(`[square-id="${targetId}"]`)?.firstChild;
          if (targetPiece && targetPiece?.classList.contains(opponentGo)) {
            isValid = true;
            
          }
        }
  
        break;

    case "rook":
      const startRow = Math.floor(startId / width);
      const startCol = startId % width;
      const targetRow = Math.floor(targetId / width);
      const targetCol = targetId % width;

      if (startRow === targetRow || startCol === targetCol) {
        const stepRow = startRow === targetRow ? 0 : (targetRow > startRow ? 1 : -1);
        const stepCol = startCol === targetCol ? 0 : (targetCol > startCol ? 1 : -1);

        let currentRow = startRow + stepRow;
        let currentCol = startCol + stepCol;
        let currentPosition = currentRow * width + currentCol;

        isValid = true; // valid'i true olarak başlat

        while (currentPosition !== targetId) {
          const currentPiece = document.querySelector(`[square-id="${currentPosition}"]`)?.firstChild;

          if (currentPiece) {
            isValid = false; // Geçerli değilse valid'i false olarak güncelle
            break;
          }

          currentRow += stepRow;
          currentCol += stepCol;
          currentPosition = currentRow * width + currentCol;
        }
      }

      if (isValid) {
        const targetPiece = document.querySelector(`[square-id="${targetId}"]`)?.firstChild;
        if (targetPiece && targetPiece.classList.contains(opponentGo)) {
          isValid = true; // valid'i true olarak güncelle
        }
      }

      break;
  }

  return isValid; // valid değerini döndür
}

// ...



function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    revertIds();
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}

function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", width * width - 1 - i);
  });
}

function revertIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
}
