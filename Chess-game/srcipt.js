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

        //startId = 7  targetId = 23
    case "rook":
      const startRow = Math.floor(startId / width); //0
      const startCol = startId % width; //7
      const targetRow = Math.floor(targetId / width); //2
      const targetCol = targetId % width; //7
      

      if (startRow === targetRow || startCol === targetCol) {
        const stepRow = startRow === targetRow ? 0 : (targetRow > startRow ? 1 : -1); //1
        const stepCol = startCol === targetCol ? 0 : (targetCol > startCol ? 1 : -1); //0

        let currentRow = startRow + stepRow; //1
        let currentCol = startCol + stepCol; //7
        let currentPosition = currentRow * width + currentCol; //15

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

      //targetId = 19 , startId = 3
    
    case "queen":

      const startRowQueen = Math.floor(startId / width); //0
      const startColQueen = startId % width; // 3
      const targetRowQueen = Math.floor(targetId / width); // 2 
      const targetColQueen = targetId % width; // 3
      const rowDiffQueen = targetRowQueen - startRowQueen; // 2
      const colDiffQueen = targetColQueen -startColQueen; // 0


      if( startRowQueen === targetRowQueen || 
          targetColQueen === startColQueen ||
          Math.abs(rowDiffQueen) === Math.abs(colDiffQueen)){
            const stepRowQueen = targetRowQueen === startRowQueen ? 0 : (targetRowQueen > startRowQueen ? 1 : -1) // 1
            const stepColQueen = targetColQueen === startColQueen ? 0 : (targetColQueen > startColQueen ? 1 : -1) // 0
            const stepRowDiogonal = rowDiffQueen > 0 ? 1 : -1 // 1
            const stepColDiogonal = colDiffQueen > 0 ? 1 : -1 // -1

            let currentRowQueen = startRowQueen + stepRowQueen //1
            let currentColQueen = startColQueen + stepColQueen //3

            let currentPositionQueen = (currentRowQueen) * width + currentColQueen // 11
            let currentPositionDiogonal = startId + stepRowDiogonal * width + stepColDiogonal // 10

            

            isValid = true // valid true döndür
            
            while(currentRowQueen !== targetRowQueen || currentColQueen !== targetColQueen){
              const currentPieceQueen = document.querySelector(`[square-id="${currentPositionQueen}"]`)?.firstChild;
              const currentPieceDiogonal = document.querySelector(`[square-id="${currentPositionDiogonal}"]`)?.firstChild;

              if(currentPieceQueen){
                isValid = false
                break;
              } 

              currentRowQueen += stepRowQueen; //2
              currentColQueen += stepColQueen; //3
              currentPositionQueen = (currentRowQueen) * width + currentColQueen; //19
              currentPositionDiogonal += stepRowDiogonal * width + stepColDiogonal;

            }
          }
          if (isValid) {
            const targetPiece = document.querySelector(`[square-id="${targetId}"]`)?.firstChild;
            if (targetPiece && targetPiece.classList.contains(opponentGo)) {
              isValid = true; // valid'i true olarak güncelle
            }
          }
      break;
    

    //startId = 4 targetId = 12
    case "king":
        isValid = false; // Başlangıçta true olarak ayarlayın.

        if (
          // Hareket kurallarını kontrol edin ve geçersiz durumda isValid değerini false olarak ayarlayın.
          (startId + width === targetId &&
            (!document.querySelector(`[square-id="${startId + width}"]`)?.firstChild ||
              document.querySelector(`[square-id="${startId + width}"]`)?.firstChild?.classList.contains(opponentGo))) ||
          (startId - width === targetId &&
            (!document.querySelector(`[square-id="${startId - width}"]`)?.firstChild ||
              document.querySelector(`[square-id="${startId - width}"]`)?.firstChild?.classList.contains(opponentGo))) ||
          (startId - 1 === targetId &&
            (!document.querySelector(`[square-id="${startId - 1}"]`)?.firstChild ||
              document.querySelector(`[square-id="${startId - 1}"]`)?.firstChild?.classList.contains(opponentGo))) ||
          (startId + 1 === targetId &&
            (!document.querySelector(`[square-id="${startId + 1}"]`)?.firstChild ||
              document.querySelector(`[square-id="${startId + 1}"]`)?.firstChild?.classList.contains(opponentGo))) ||
          (startId + width - 1 === targetId &&
            (!document.querySelector(`[square-id="${startId + width - 1}"]`)?.firstChild ||
              document.querySelector(`[square-id="${startId + width - 1}"]`)?.firstChild?.classList.contains(opponentGo))) ||
          (startId + width + 1 === targetId &&
            (!document.querySelector(`[square-id="${startId + width + 1}"]`)?.firstChild ||
              document.querySelector(`[square-id="${startId + width + 1}"]`)?.firstChild?.classList.contains(opponentGo)))
        ) {
          const playerKingPosition = document.querySelector(`[square]`)
          isValid = true; // Geçersiz durumda isValid değerini false olarak ayarlayın.
        }
        // Diğer kontrol durumları burada devam eder...

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
