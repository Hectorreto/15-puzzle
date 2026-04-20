#include <iostream>
#include <vector>
#include <list>
#include <map>

using namespace std;

int SOLVED_GRID[4][4] = {
  { 1,  2,  3,  4},
  { 5,  6,  7,  8},
  { 9, 10, 11, 12},
  {13, 14, 15,  0},
};

int TYPE_START = 0;
int TYPE_END = 1;

struct Coord {
  int x;
  int y;
};

Coord findEmpty(int grid[4][4]) {
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      if (grid[i][j] == 0) return {j, i};
    }
  }
  throw "Empty block not found";
}

bool canStep(int x, int y) {
  return x >= 0 && x < 4 && y >= 0 && y < 4;
}

void copyGrid(int grid[4][4], int newGrid[4][4]) {
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      newGrid[i][j] = grid[i][j];
    }
  }
}

void step(int grid[4][4], int newGrid[4][4], int x, int y, int newX, int newY) {
  swap(newGrid[y][x], newGrid[newY][newX]);
}

struct QueueItem {
  int (*grid)[4];
  string steps;
  int type;
  int x;
  int y;
};

string join(vector<string> array, string separator) {
  if (array.size() == 0) return "";
  string result = array[0];
  for (int i = 1; i < array.size(); i++) {
    result += separator + array[i];
  }
  return result;
}

string toString(int grid[4][4]) {
  vector<string> resultArray(16);
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      resultArray[i * 4 + j] = to_string(grid[i][j]);
    }
  }
  return join(resultArray, ",");
}

string solve(int grid[4][4]) {
  int cnt = 0;
  Coord emptyCoord = findEmpty(grid);
  int x = emptyCoord.x;
  int y = emptyCoord.y;
  list<QueueItem> queue;

  int (*gridCopy)[4] = new int[4][4];
  copyGrid(grid, gridCopy);
  queue.push_back({gridCopy, "", TYPE_START, x, y});

  int (*solvedGridCopy)[4] = new int[4][4];
  copyGrid(SOLVED_GRID, solvedGridCopy);
  queue.push_back({solvedGridCopy, "", TYPE_END, 3, 3});

  map<string, string> visitedFromStart;
  map<string, string> visitedFromEnd;

  while (!queue.empty()) {
    QueueItem queueItem = queue.front();
    queue.pop_front();
    int (*grid)[4] = queueItem.grid;
    string steps = queueItem.steps;
    int type = queueItem.type;
    int x = queueItem.x;
    int y = queueItem.y;
    string gridString = toString(grid);

    if (steps.size() > cnt) {
      cnt = steps.size();
      cout << cnt << '\n';
    }

    if (type == TYPE_START) {
      if (visitedFromStart.find(gridString) != visitedFromStart.end()) continue;
      visitedFromStart[gridString] = steps;

      if (visitedFromEnd.find(gridString) != visitedFromEnd.end()) {
        return steps + visitedFromEnd[gridString];
      }
    }

    if (type == TYPE_END) {
      if (visitedFromEnd.find(gridString) != visitedFromEnd.end()) continue;
      visitedFromEnd[gridString] = steps;

      if (visitedFromStart.find(gridString) != visitedFromStart.end()) {
        return visitedFromStart[gridString] + steps;
      }
    }

    if (canStep(x, y - 1)) {
      string newSteps = type == TYPE_START ? steps + "U" : "D" + steps;
      int (*newGrid)[4] = new int[4][4];
      copyGrid(grid, newGrid);
      step(grid, newGrid, x, y, x, y - 1);
      queue.push_back({newGrid, newSteps, type, x, y - 1});
    }
    if (canStep(x, y + 1)) {
      string newSteps = type == TYPE_START ? steps + "D" : "U" + steps;
      int (*newGrid)[4] = new int[4][4];
      copyGrid(grid, newGrid);
      step(grid, newGrid, x, y, x, y + 1);
      queue.push_back({newGrid, newSteps, type, x, y + 1});
    }
    if (canStep(x - 1, y)) {
      string newSteps = type == TYPE_START ? steps + "L" : "R" + steps;
      int (*newGrid)[4] = new int[4][4];
      copyGrid(grid, newGrid);
      step(grid, newGrid, x, y, x - 1, y);
      queue.push_back({newGrid, newSteps, type, x - 1, y});
    }
    if (canStep(x + 1, y)) {
      string newSteps = type == TYPE_START ? steps + "R" : "L" + steps;
      int (*newGrid)[4] = new int[4][4];
      copyGrid(grid, newGrid);
      step(grid, newGrid, x, y, x + 1, y);
      queue.push_back({newGrid, newSteps, type, x + 1, y});
    }
    
    delete[] grid;
  }

  return "";
}

int main() {
  // Test 1: ok!
  int testGrid1[4][4] = {
    { 0,  2,  3,  4},
    { 1,  6,  7,  8},
    { 5, 10, 11, 12},
    { 9, 13, 14, 15},
  };
  
  // Test 2: ok!
  int testGrid2[4][4] = {
    { 0,  9,  3,  4},
    {13,  1,  6,  7},
    { 5,  2, 10, 11},
    {14, 15, 12,  8},
  };
  
  // Test 3: too slow!
  int testGrid3[4][4] = {
    {10,  3,  7,  6},
    { 2,  1, 15,  9},
    {14, 12,  0,  8},
    {13,  5, 11,  4},
  };
  
  // Test 4: too slow!
  int testGrid4[4][4] = {
    { 1,  2,  3,   4},
    {10,  7,  9,   0},
    {14, 12,  6, 15},
    {13,  5,  8, 11},
  };
  
  // Test 5: too slow!
  int testGrid5[4][4] = {
    { 1,  2,  3,  4},
    { 5,  6,  7,  8},
    { 0, 12,  9, 10},
    {14, 13, 15, 11},
  };
  
  // Test X:
  int testGridX[4][4] = {
    { 1,  2,  3,  4},
    { 5,  6,  7,  8},
    { 9, 10, 11, 12},
    {13, 15, 14,  0},
  };
  
  string solution = solve(testGridX);
  cout << solution << '\n';

  return 0;
}