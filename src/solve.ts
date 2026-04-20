const SOLVED_GRID = [
  [ 1,  2,  3,  4],
  [ 5,  6,  7,  8],
  [ 9, 10, 11, 12],
  [13, 14, 15,  0],
]

const TYPE_START = 0;
const TYPE_END = 1;

const findEmpty = (grid: number[][]) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return { x: j, y: i };
    }
  }
  throw new Error('Empty block not found');
}

const canStep = (newX: number, newY: number) => {
  if (newX < 0 || newX >= 4) return false;
  if (newY < 0 || newY >= 4) return false;
  return true;
}

const step = (grid: number[][], x: number, y: number, newX: number, newY: number) => {
  const newGrid = [...grid.map((row) => [...row])];
  [newGrid[y][x], newGrid[newY][newX]] = [newGrid[newY][newX], newGrid[y][x]];

  return newGrid;
}

export const solve = (grid: number[][]): string[] => {
  let cnt = 0;
  const { x, y } = findEmpty(grid);
  let queue: { grid: number[][], steps: string[], type: number, x: number, y: number }[] = [
    { grid, steps: [], type: TYPE_START, x, y },
    { grid: SOLVED_GRID, steps: [], type: TYPE_END, x: 3, y: 3, },
  ];
  let visitedFromStart = new Map<string, string[]>();
  let visitedFromEnd = new Map<string, string[]>();

  while (queue.length > 0) {
    const { grid, steps, type, x, y } = queue.shift();
    const gridString = grid.toString();

    if (steps.length > cnt) {
      cnt = steps.length;
      console.log(cnt);
    }

    if (type === TYPE_START) {
      if (visitedFromStart.has(gridString)) continue;
      visitedFromStart.set(gridString, steps);

      if (visitedFromEnd.has(gridString)) {
        return [...steps, ...visitedFromEnd.get(gridString)];
      };
    }

    if (type === TYPE_END) {
      if (visitedFromEnd.has(gridString)) continue;
      visitedFromEnd.set(gridString, steps);

      if (visitedFromStart.has(gridString)) {
        return [...visitedFromStart.get(gridString), ...steps];
      }
    }

    if (canStep(x, y - 1)) {
      const newSteps = type === TYPE_START ? [...steps, 'U'] : ['D', ...steps];
      queue.push({ grid: step(grid, x, y, x, y - 1), steps: newSteps, type, x: x, y: y - 1 });
    }
    if (canStep(x, y + 1)) {
      const newSteps = type === TYPE_START ? [...steps, 'D'] : ['U', ...steps];
      queue.push({ grid: step(grid, x, y, x, y + 1), steps: newSteps, type, x: x, y: y + 1 });
    }
    if (canStep(x - 1, y)) {
      const newSteps = type === TYPE_START ? [...steps, 'L'] : ['R', ...steps];
      queue.push({ grid: step(grid, x, y, x - 1, y), steps: newSteps, type, x: x - 1, y: y });
    }
    if (canStep(x + 1, y)) {
      const newSteps = type === TYPE_START ? [...steps, 'R'] : ['L', ...steps];
      queue.push({ grid: step(grid, x, y, x + 1, y), steps: newSteps, type, x: x + 1, y: y });
    }
  }

  return [];
}

// Test 1: ok!
const testGrid1 = [
  [ 0,  2,  3,  4],
  [ 1,  6,  7,  8],
  [ 5, 10, 11, 12],
  [ 9, 13, 14, 15],
]

// Test 2: ok!
const testGrid2 = [
  [ 0,  9,  3,  4],
  [13,  1,  6,  7],
  [ 5,  2, 10, 11],
  [14, 15, 12,  8],
]

// Test 3: too slow!
const testGrid3 = [
  [10,  3,  7,  6],
  [ 2,  1, 15,  9],
  [14, 12,  0,  8],
  [13,  5, 11,  4],
]

// Test 4: too slow!
const testGrid4 = [
  [ 1,  2,  3,   4],
  [10,  7,  9,   0],
  [14, 12,  6, 15],
  [13,  5,  8, 11],
]

// Test 5: too slow!
const testGrid5 = [
  [ 1,  2,  3,  4],
  [ 5,  6,  7,  8],
  [ 0, 12,  9, 10],
  [14, 13, 15, 11],
]

const testGridX = [
  [ 1,  2,  3,  4],
  [ 5,  6,  7,  8],
  [ 9, 10, 11, 12],
  [13, 15, 14,  0],
]

const solution = solve(testGrid5);
console.log(solution);
