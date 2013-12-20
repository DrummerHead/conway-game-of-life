jQuery(function($){




// helper functions
//
var twoDArrayGenerate = function(width, height, isBolean){
  var result = [];
  for(var i = 0; i < height; i++){
    result[i] = [];
    for(var j = 0; j < width ; j++){
      result[i][j] = (isBolean ? false : 0);
    };
  };
  return result;
}
var modulus = function(i, j){
  return (((i%j)+j)%j);
}
var f = Math.floor;


// initial vars
//
var $pool = $('#pool');
var $play = $('#play');
var $next = $('#next');

var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;
var unitSide = 30; // same as (#pool td{width} + #pool td{border-width}) on stijl.css
var panelHeight = 70; // same as #panel{height} on stijl.css
var poolCols = f(viewportWidth / unitSide);
var poolRows = f((viewportHeight - panelHeight) / unitSide);
var isClicking = false;
var flow;

var trStart = '<tr>';
var trEnd = '</tr>';
var td = '<td></td>';
var tdLife = '<td class="life"></td>';

var currentGen = twoDArrayGenerate(poolCols, poolRows, true);
var nextGen = twoDArrayGenerate(nextGen, poolCols, poolRows, true);


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
  for(var i = 0; i <  minefield.length; i++){
    for(var j = 0; j < minefield[i].length; j++){
      if(minefield[i][j] <= 1){
        nextGen[i][j] = false;
      }
      if(minefield[i][j] === 2){
        if(prevGen[i][j]){
          nextGen[i][j] = true;
        } else {
          nextGen[i][j] = false;
        }
      }
      if(minefield[i][j] === 3){
        nextGen[i][j] = true;
      }
      if(minefield[i][j] >= 4){
        nextGen[i][j] = false;
      }
    }
  }

  return nextGen;
}


// rendering html of a generation and injecting
//
var render = function(gen){
  var newPool = '';

  for(var i = 0; i < gen.length; i++){
    newPool += trStart;
    for(var j = 0; j < gen[i].length; j++){
      if(gen[i][j]){
        newPool += tdLife;
      } else {
        newPool += td;
      }
    }
    newPool += trEnd;
  }

  $('#pool').empty().append(newPool);
}


// execution and rendering of a step
//
var advanceGen = function(){
  var nextGen = nextGenCalc(currentGen);
  render(nextGen);
  currentGen = nextGen;
}


// first rendering of empty board
//
render(currentGen);


// user drawing and recording states
//
var lifeOrDeath = function(elementum, eventum){
  var xPos = eventum.currentTarget.cellIndex;
  var yPos = eventum.currentTarget.parentElement.rowIndex;
  var life = currentGen[yPos][xPos];

  if(!life){
    elementum.addClass('life');
    currentGen[yPos][xPos] = true;
  } else {
    elementum.removeClass('life');
    currentGen[yPos][xPos] = false;
  }
}

$pool.on('mousedown', 'td', function(i){
  isClicking = true;
  var I = $(this);
  lifeOrDeath(I, i);
});

$pool.on('mouseup', 'td', function(i){
  isClicking = false;
});

$pool.on('mouseenter', 'td', function(i){
  var I = $(this);
  if(isClicking){
    lifeOrDeath(I, i);
  }
});



// triggering calculation
//
$next.on('click', function(i){
  i.preventDefault();
  advanceGen();
})

$play.toggle(
  function(i){
    i.preventDefault();
    $play.text('pause');
    $next.attr('disabled', 'disabled')
    flow = setInterval(advanceGen, 50)
  },
  function(i){
    i.preventDefault();
    $play.text('play');
    $next.removeAttr('disabled')
    clearInterval(flow)
  }
)




});
