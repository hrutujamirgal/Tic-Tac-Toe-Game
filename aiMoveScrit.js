





document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.grid button');
    const players = document.querySelectorAll('.participants p');
    const result = document.getElementById("result");

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a]; // Return the winner (X or O)
            }
        }

        return gameBoard.includes('') ? null : 'T'; // If no winner, check for a tie
    };

    const handleCellClick = (index) => {
        if (!gameBoard[index] && gameActive) {
            gameBoard[index] = currentPlayer;
            cells[index].textContent = currentPlayer;
    
            const winner = checkWinner();
            if (winner) {
                gameActive = false;
                if (winner === 'T') {
                    result.style.visibility = "visible";
                    document.getElementById('result').innerHTML = 'It\'s a tie!';
                } else {
                    let win = winner === 'X' ? 'Player 1' : 'Player 2';
                    result.style.visibility = "visible";
                    document.getElementById('result').innerHTML = (`${win} wins!`);
                }
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurnDisplay();
                if (currentPlayer === 'O') {
                    // AI's turn
                    const bestMove = findBestMove();
                    handleCellClick(bestMove);
                }
            }
        }
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: -10, // Score for Player X
            O: 10,  // Score for Player O
            T: 0    // Score for Tie
        };
    
        const winner = checkWinner();
        if (winner !== null) {
            return scores[winner];
        }
    
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board[i] = ''; // Undo the move
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board[i] = ''; // Undo the move
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };
    
    const findBestMove = () => {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                const score = minimax(gameBoard, 0, false);
                gameBoard[i] = ''; // Undo the move
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    };

    
    const updateTurnDisplay = () => {
        // Remove the 'turn' class from all players
        players.forEach(player => player.classList.remove('turn'));
    
        // Add the 'turn' class only to the current player
        const currentPlayerElement = currentPlayer === 'X' ? players[0] : players[1];
        currentPlayerElement.classList.add('turn');
    
    };
    

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });

    updateTurnDisplay();
});