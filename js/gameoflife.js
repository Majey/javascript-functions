function seed() {
  return Array.from(arguments)  
}

function same([x, y], [j, k]) {
  return arguments[0].length === arguments[1].length && arguments[0].every((value, index) => value === arguments[1][index]);
  // or return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  const cell_2_String = JSON.stringify(cell);
  return this.some(item => JSON.stringify(item) === cell_2_String);
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? "\u25A3": "\u25A2";
};

const corners = (state = []) => {
  let maxY,maxX,minY,minX;
  let x = []
  let y = []
  
  if(state.length > 0){
    for(let i=0; i<state.length;i++) {
      x.push(state[i][0]);
      y.push(state[i][1]);
    }
      maxX = Math.max(...x);
      maxY = Math.max(...y);
      minX = Math.min(...x);
      minY = Math.min(...y);
    return {
      topRight:[maxX,maxY],
      bottomLeft:[minX,minY]
    }
  } else {
  }return {
      topRight:[0,0],
      bottomLeft:[0,0]
    } 
};

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);
  let cornerCells = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    cornerCells += row.join(" ") + "\n";
  }
  return cornerCells;
};

const getNeighborsOf = ([x, y]) => {
  return [[x,y-1],[x,y+1],[x-1,y+1],[x-1,y-1],[x-1,y],[x+1,y+1],[x+1,y],[x+1,y-1]]
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(n => contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  const activeNeighbors = getLivingNeighbors(cell, state)
  return (
    activeNeighbors.length === 3 ||
    (contains.call(state, cell) && activeNeighbors.length === 2)
  );
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let result = [];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      result = result.concat(willBeAlive([x, y], state) ? [[x, y]] : []);
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  let states = [state]
    let counter = 0
    while(counter<iterations){
       let newState = calculateNext(states[counter])
       states.push(newState)
       counter+=1
    }
    return states
};

const main = (pattern, iterations) => {
  let result = iterate(startPatterns[pattern], iterations)
  for(let i=0;i<result.length;i++){
    console.log(printCells(result[i]))
  }
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;