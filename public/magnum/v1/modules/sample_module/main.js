document.addEventListener("keydown", function(event) {

  if (event.keyCode === 39) { //right
    if($('._module-buttons').find('._module-btn').eq(0).hasClass('active')) {
      $('._module-buttons').find('._module-btn').eq(0).removeClass('active');
      $('._module-buttons').find('._module-btn').eq(1).addClass('active');
    }
  }

  if (event.keyCode === 37) { //left
    if($('._module-buttons').find('._module-btn').eq(1).hasClass('active')) {
      $('._module-buttons').find('._module-btn').eq(1).removeClass('active');
      $('._module-buttons').find('._module-btn').eq(0).addClass('active');
    }
  }

  if (event.keyCode === 13) { //enter
    if($('._module-buttons').find('._module-btn').eq(1).hasClass('active')) {
      exitModule();
    } else {
      $("._module-main-div").css("background-color", _module_getRandomColor());
    }
  }

  if (event.keyCode === 27) { //esc
    exitModule();
  }

});

function _module_getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
