const initializeGrid = (size) => {
    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    let target = getRandomPosition(size);
    let player = getRandomPosition(size);

    // Ensure player and target are not the same
    while (player.row === target.row && player.col === target.col) {
        player = getRandomPosition(size);
    }

    grid[target.row][target.col] = 2; // Mark target position with 2
    grid[player.row][player.col] = 1; // Mark player position with 1

    generateBlocks(grid, size, player, target);

    return { grid, player, target };
};

const getRandomPosition = (size) => {
    return {
        row: Math.floor(Math.random() * size),
        col: Math.floor(Math.random() * size),
    };
};

const generateBlocks = (grid, size, player, target) => {
    const blocks = [];
    const addBlock = (row, col) => {
        if (grid[row][col] === 0) {
            grid[row][col] = -1; // Mark block position with -1
            blocks.push({ row, col });
        }
    };

    // Add blocks around target
    const targetPosition = [
        { row: target.row - 1, col: target.col },
        { row: target.row + 1, col: target.col },
        { row: target.row, col: target.col - 1 },
        { row: target.row, col: target.col + 1 },
    ];

    // Filter valid positions
    const validPositions = targetPosition.filter(pos => pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size);

    // Ensure one random adjacent cell is free
    const freePositionIndex = Math.floor(Math.random() * validPositions.length);
    const freePosition = validPositions[freePositionIndex];

    validPositions.forEach((pos, index) => {
        if (index !== freePositionIndex) {
            addBlock(pos.row, pos.col);
        }
    });

    // Ensure there is always a path between player and target
    ensurePathExists(grid, player, target);

    return blocks;
};

const ensurePathExists = (grid, player, target) => {
    const size = grid.length;

    const clearPath = (start, end, fixed, isRowFixed) => {
        for (let i = start; i <= end; i++) {
            if (isRowFixed) {
                if (grid[fixed][i] === -1) {
                    grid[fixed][i] = 0;
                }
            } else {
                if (grid[i][fixed] === -1) {
                    grid[i][fixed] = 0;
                }
            }
        }
    };

    if (player.row === target.row) {
        clearPath(Math.min(player.col, target.col), Math.max(player.col, target.col), player.row, true);
    } else if (player.col === target.col) {
        clearPath(Math.min(player.row, target.row), Math.max(player.row, target.row), player.col, false);
    } else {
        clearPath(Math.min(player.col, target.col), Math.max(player.col, target.col), player.row, true);
        clearPath(Math.min(player.row, target.row), Math.max(player.row, target.row), target.col, false);
    }
};

const movePlayer = (grid, player, direction) => {
    const size = grid.length;
    let { row, col } = player;
    let newRow = row;
    let newCol = col;

    switch (direction) {
        case 'up':
            while (newRow > 0 && grid[newRow - 1][col] !== -1) newRow--;
            break;
        case 'down':
            while (newRow < size - 1 && grid[newRow + 1][col] !== -1) newRow++;
            break;
        case 'left':
            while (newCol > 0 && grid[row][newCol - 1] !== -1) newCol--;
            break;
        case 'right':
            while (newCol < size - 1 && grid[row][newCol + 1] !== -1) newCol++;
            break;
    }

    // Check if player reached the target
    const targetReached = grid[newRow][newCol] === 2;

    // Clear old player position
    grid[row][col] = 0;
    // Update player position
    grid[newRow][newCol] = 1;

    player.row = newRow;
    player.col = newCol;

    return { grid, player, targetReached };
};

const checkTargetReached = (player, target) => {
    if (!player || !target) return false;
    return player.row === target.row && player.col === target.col;
};

export { initializeGrid, movePlayer, checkTargetReached, getRandomPosition };
