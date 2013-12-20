document.addEventListener("DOMContentLoaded", function() {
'use strict';




// helper functions
//
var twoDArrayGenerate = function(width, height, isBolean){
  var result = [];
  for(var i = 0; i < height; i++){
    result[i] = [];
    for(var j = 0; j < width ; j++){
      result[i][j] = (isBolean ? false : 0);
    }
  }
  return result;
};
var modulus = function(i, j){
  return (((i%j)+j)%j);
};
var f = Math.floor;


// initial vars
//
var $pool = document.getElementById('pool');
var $play = document.getElementById('play');
var $next = document.getElementById('next');

var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;
var unitSide = 30; // same as (table td{width} + table td{border-width}) on stijl.css
var panelHeight = 70; // same as #panel{height} on stijl.css
var poolCols = f(viewportWidth / unitSide);
var poolRows = f((viewportHeight - panelHeight) / unitSide);
var isClicking = false;
var isPlaying = false;
var flow;

var currentGen = twoDArrayGenerate(poolCols, poolRows, true);
var nextGen = twoDArrayGenerate(poolCols, poolRows, true);


// calculating next generation
//
var nextGenCalc = function(array){

  var prevGen = array;
  var minefield = twoDArrayGenerate(poolCols, poolRows, false);

  // calculating influence of each cell towards its neighbours
  //
  for(var i = 0; i < prevGen.length; i++){
    for(var j = 0; j < prevGen[i].length; j++){
      if(prevGen[i][j]){
        for(var n = f(i)-1; n <= f(i)+1; n++){
          for(var m = f(j)-1; m <= f(j)+1; m++){
            var na = modulus(n, poolRows);
            var ma = modulus(m, poolCols);
            minefield[na][ma] += 1;
          }
        }
        minefield[i][j] -= 1;
      }
    }
  }

  // http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules
  // applying CGF rules, mapping influence to an array that holds the future generation
  //
  for(var k = 0; k < minefield.length; k++){
    for(var l = 0; l < minefield[k].length; l++){
      if(minefield[k][l] <= 1){
        nextGen[k][l] = false;
      }
      if(minefield[k][l] === 2){
        if(prevGen[k][l]){
          nextGen[k][l] = true;
        } else {
          nextGen[k][l] = false;
        }
      }
      if(minefield[k][l] === 3){
        nextGen[k][l] = true;
      }
      if(minefield[k][l] >= 4){
        nextGen[k][l] = false;
      }
    }
  }

  return nextGen;
};


// rendering html of a generation and injecting
//
var render = function(gen){
  var newPool = '<tbody>';

  for(var i = 0; i < gen.length; i++){
    newPool += '<tr>';
    for(var j = 0; j < gen[i].length; j++){
      if(gen[i][j]){
        newPool += '<td class="life"></td>';
      } else {
        newPool += '<td></td>';
      }
    }
    newPool += '</tr>';
  }
  newPool += '</tbody>';

  $pool.removeChild($pool.querySelector('tbody'));
  $pool.innerHTML = newPool;
};


// execution and rendering of a step
//
var advanceGen = function(){
  var nextGen = nextGenCalc(currentGen);
  render(nextGen);
  currentGen = nextGen;
};


// first rendering of empty board
//
render(currentGen);


// user drawing and recording states
//
var lifeOrDeath = function(el){
  var xPos = el.cellIndex;
  var yPos = el.parentElement.rowIndex;
  var life = currentGen[yPos][xPos];

  if(!life){
    el.setAttribute('class', 'life');
    currentGen[yPos][xPos] = true;
  } else {
    el.removeAttribute('class');
    currentGen[yPos][xPos] = false;
  }
};

$pool.addEventListener('mousedown', function(e){
  if(e.target && e.target.nodeName == "TD"){
    isClicking = true;
    lifeOrDeath(e.target);
  }
});

$pool.addEventListener('mouseup', function(e){
  if(e.target && e.target.nodeName == "TD"){
    isClicking = false;
  }
});

$pool.addEventListener('mouseover', function(e){
  if(e.target && e.target.nodeName == "TD"){
    if(isClicking){
      lifeOrDeath(e.target);
    }
  }
});


// triggering calculation
//
$play.addEventListener('click', function(e){
  e.preventDefault();
  if(isPlaying){
    $play.textContent = 'play';
    $next.removeAttribute('disabled');
    clearInterval(flow);
    isPlaying = false;
  }
  else{
    $play.textContent = 'pause';
    $next.setAttribute('disabled', 'disabled');
    flow = setInterval(advanceGen, 50);
    isPlaying = true;
  }
});

$next.addEventListener('click', function(e){
  e.preventDefault();
  advanceGen();
});




}, false);
