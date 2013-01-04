jQuery(function($){




// initial vars
//
var $cell = $('td');
var $form = $('#do');
var census = [];
var nextGen = [];
var minefield = [];

var twoDArrayGen = function(array, isBolean){
  for(i=0;i<16;i++){
    array[i] = [];
    for(j=0;j<16;j++){
      array[i][j] = (isBolean ? false : 0);
    };
  };
}

twoDArrayGen(census, true);
twoDArrayGen(nextGen, true);
twoDArrayGen(minefield, false);


// user drawing and recording states
//
$cell.on('click', function(i){
  var I = $(this);
  var xPos = i.currentTarget.cellIndex;
  var yPos = i.currentTarget.parentElement.rowIndex;
  var live = census[yPos][xPos];

  if(!live){
    I.addClass('live');
    census[yPos][xPos] = true;
  } else {
    I.removeClass('live');
    census[yPos][xPos] = false;
  }
})


// triggering calculation
//
$form.on('submit', function(i){
  i.preventDefault();
  nextGeneration(census);
})


// calculating next generation
//
var nextGeneration = function(array){

  // initial vars, resetting the influence data array
  //
  var prevStep = array;
  twoDArrayGen(minefield, false);


  // calculating influence of each cell towards its neighbours
  //
  for(i in prevStep){
    for(j in prevStep[i]){
      if(prevStep[i][j]){
        for(var n = i-1; n <= Math.floor(i)+1; n++){
          for(var m = j-1; m <= Math.floor(j)+1; m++){
            var na = (((n%16)+16)%16)
            var ma = (((m%16)+16)%16)
            minefield[na][ma] += 1;
          }
        }
        minefield[i][j] -= 1;
      }
    }
  }


  // applying CGF rules, mapping influence to an array that holds the future generation
  //
  for(i in minefield){
    for(j in minefield[i]){
      if(minefield[i][j] <= 1){
        nextGen[i][j] = false;
      }
      if(minefield[i][j] === 2){
        if(prevStep[i][j]){
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


  // creating the html of the new generation
  //
  var newPool = '<tbody>';
  var trStart = '<tr>';
  var trEnd = '</tr>';
  var td = '<td></td>';
  var tdLife = '<td class="live"></td>';

  for(i in nextGen){
    newPool += trStart;
    for(j in nextGen[i]){
      if(nextGen[i][j]){
        newPool += tdLife;
      } else {
        newPool += td;
      }
    }
    newPool += trEnd;
  }


  // injecting to the DOM and making the new generation the current generation
  //
  $('#pool').empty().append(newPool);
  census = nextGen;

}




});
