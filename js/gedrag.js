jQuery(function($){





var $cell = $('td');
var $form = $('#do');
var census = [];
var nextGen = [];
var minefield = [];

var twoDarrayGen = function(array, isBolean){
  for(i=0;i<16;i++){
    array[i] = [];
    for(j=0;j<16;j++){
      array[i][j] = (isBolean ? false : 0);
    };
  };
}

twoDarrayGen(census, true);
twoDarrayGen(nextGen, true);
twoDarrayGen(minefield, false);

for(i=0;i<16;i++){
  census[i] = [];
  nextGen[i] = [];
  minefield[i] = [];
  for(j=0;j<16;j++){
    census[i][j] = false;
    nextGen[i][j] = false;
    minefield[i][j] = 0;
  };
};

$cell.on('click', function(i){
  var I = $(this);
  var xPos = i.currentTarget.cellIndex;
  var yPos = i.currentTarget.parentElement.rowIndex;
  var live = census[yPos][xPos];
  console.info('yPos = ' + yPos)
  console.info('xPos = ' + xPos)
  if(!live){
    I.addClass('live');
    census[yPos][xPos] = true;
  } else {
    I.removeClass('live');
    census[yPos][xPos] = false;
  }
})

$form.on('submit', function(i){
  i.preventDefault();
  console.log(census)
  nextGeneration(census);
  console.log('nextGen = ' + nextGen)
})

var nextGeneration = function(array){
  var prevStep = array;

  twoDarrayGen(minefield, false);

  for(i in prevStep){
    for(j in prevStep[i]){
      if(prevStep[i][j]){
        for(var n = i-1; n <= Math.floor(i)+1; n++){
          for(var m = j-1; m <= Math.floor(j)+1; m++){
            console.log(n +', ' + m)
            var na = (((n%16)+16)%16)
            var ma = (((m%16)+16)%16)
            console.log(na +',, ' + ma)
            minefield[na][ma] += 1;
          }
        }
        minefield[i][j] -= 1;
      }
    }
  }
  console.info(minefield);

  for(i in minefield){
    for(j in minefield[i]){
      if(minefield[i][j] <= 1){
        nextGen[i][j] = false;
        console.info('minefield[i][j] <= 1');
      }
      if(minefield[i][j] === 2){
        if(prevStep[i][j]){
          nextGen[i][j] = true;
          console.log('nextgen['+i+']['+j+'] = '+nextGen[i][j])
        } else {
          nextGen[i][j] = false;
        }
        console.info('minefield[i][j] === 2)');
      }
      if(minefield[i][j] === 3){
        nextGen[i][j] = true;
        console.log('nextgen['+i+']['+j+'] = '+nextGen[i][j])
        console.info('minefield[i][j] === 3');
      }
      if(minefield[i][j] >= 4){
        nextGen[i][j] = false;
        console.info('minefield[i][j] >= 4');
      }
    }
    console.log('nextGen = ' + nextGen)
  }

  console.log('nextGen = ' + nextGen)

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

  $('#pool').empty().append(newPool);

  census = nextGen;
}





});
