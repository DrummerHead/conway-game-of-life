jQuery(function($){




// helper functions
//
var twoDArrayGenerate = function(array, width, height, isBolean){
  for(i = 0; i < height; i++){
    array[i] = [];
    for(j = 0; j < width ; j++){
      array[i][j] = (isBolean ? false : 0);
    };
  };
}
var modulus = function(i, j){
  return (((i%j)+j)%j);
}
var f = Math.floor;


// initial vars
//
var $pool = $('#pool');
var $form = $('#do');

var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;
var unitSide = 30; // same as (#pool td{width} + #pool td{border-width}) on stijl.css
var panelHeight = 70; // same as #panel{height} on stijl.css
var poolCols = f(viewportWidth / unitSide);
var poolRows = f((viewportHeight - panelHeight) / unitSide);

var poolEnd = '</tbody>';
var trStart = '<tr>';
var trEnd = '</tr>';
var td = '<td></td>';
var tdLife = '<td class="life"></td>';

var currentGen = [];
var nextGen = [];
var minefield = [];
twoDArrayGenerate(currentGen, poolCols, poolRows, true);
twoDArrayGenerate(nextGen, poolCols, poolRows, true);
twoDArrayGenerate(minefield, poolCols, poolRows, false);


// user drawing and recording states
//
$pool.on('click', 'td', function(i){
  var I = $(this);
  var xPos = i.currentTarget.cellIndex;
  var yPos = i.currentTarget.parentElement.rowIndex;
  var life = currentGen[yPos][xPos];

  if(!life){
    I.addClass('life');
    currentGen[yPos][xPos] = true;
  } else {
    I.removeClass('life');
    currentGen[yPos][xPos] = false;
  }
})


// triggering calculation
//
$form.on('submit', function(i){
  i.preventDefault();
  var nextGen = nextGenCalc(currentGen);
  render(nextGen);
  currentGen = nextGen;
})


// calculating next generation
//
var nextGenCalc = function(array){

  var prevGen = array;
  twoDArrayGenerate(minefield, poolCols, poolRows, false);

  // calculating influence of each cell towards its neighbours
  //
  for(i in prevGen){
    for(j in prevGen[i]){
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
  for(i in minefield){
    for(j in minefield[i]){
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
  var newPool = '<tbody>';

  for(i in gen){
    newPool += trStart;
    for(j in gen[i]){
      if(gen[i][j]){
        newPool += tdLife;
      } else {
        newPool += td;
      }
    }
    newPool += trEnd;
  }
  newPool += poolEnd

  $('#pool').empty().append(newPool);
}


// first rendering of empty board
//
render(currentGen);




});
