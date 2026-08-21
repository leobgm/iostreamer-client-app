var _am_msgInterval = null;
var _am_currentContainer = 'activation';
var _am_imdb_movie_results = [];
var _am_imdb_series_results = [];

document.addEventListener("keydown", function(event) {

  if(_am_currentContainer === 'activation') {

    if (event.keyCode === 38) { //up
      var activeIndex = $('._am-page.activation ._am-sub-item').index($('._am-page.activation ._am-sub-item.active'));
      if(activeIndex === 1) {
        $('._am-page.activation ._am-sub-item').removeClass('active');
        $('._am-page.activation ._am-sub-item').eq(0).addClass('active').focus();
      }
    }

    if (event.keyCode === 40) { //down
      var activeIndex = $('._am-page.activation ._am-sub-item').index($('._am-page.activation ._am-sub-item.active'));
      if(activeIndex === 0) {
        $('._am-page.activation ._am-sub-item').eq(0).removeClass('active').blur();
        $('._am-page.activation ._am-sub-item').eq(1).addClass('active');
      }
    }

    if (event.keyCode === 39) { //right
      var activeIndex = $('._am-page.activation ._am-sub-item').index($('._am-page.activation ._am-sub-item.active'));
      if(activeIndex === 1) {
        $('._am-page.activation ._am-sub-item').eq(1).removeClass('active');
        $('._am-page.activation ._am-sub-item').eq(2).addClass('active');
      }
    }

    if (event.keyCode === 37) { //left
      var activeIndex = $('._am-page.activation ._am-sub-item').index($('._am-page.activation ._am-sub-item.active'));
      if(activeIndex === 2) {
        $('._am-page.activation ._am-sub-item').eq(2).removeClass('active');
        $('._am-page.activation ._am-sub-item').eq(1).addClass('active');
      }
    }

    if (event.keyCode === 13) { //enter
      var activeIndex = $('._am-page.activation ._am-sub-item').index($('._am-page.activation ._am-sub-item.active'));
      if(activeIndex === 1) { //confirm
        _am_activateAccount();
      }
      if(activeIndex === 2) { //back
        exitModule();
      }
    }

    if (event.keyCode === 27) { //esc
      exitModule();
    }
  }

  if(_am_currentContainer === 'success') {
    if (event.keyCode === 13) { //enter
      $('._am-movie-name, ._am-movie-year, ._am-series-name, ._am-series-year').val('');
      $('._am-movie-imdb-list, ._am-movie-api-list, ._am-series-imdb-list, ._am-series-api-list').addClass('_am-hidden');
      $('._am-page.activation, ._am-series-main').removeClass('_am-hidden');
      stb.Stop();
      stb.LoadURL("file:///home/web/index.html");
      stbWebWindow.close();
    }

    if (event.keyCode === 27) { //esc
      $('._am-movie-name, ._am-movie-year, ._am-series-name, ._am-series-year').val('');
      $('._am-movie-imdb-list, ._am-movie-api-list, ._am-series-imdb-list, ._am-series-api-list').addClass('_am-hidden');
      $('._am-page.activation, ._am-series-main').removeClass('_am-hidden');
      _am_exitToHome();
    }
  }

  if(_am_currentContainer === 'error') {
    if (event.keyCode === 13) { //enter
      $('._am-movie-name, ._am-movie-year, ._am-series-name, ._am-series-year').val('');
      $('._am-movie-imdb-list, ._am-movie-api-list, ._am-series-imdb-list, ._am-series-api-list').addClass('_am-hidden');
      $('._am-page.activation, ._am-series-main').removeClass('_am-hidden');
      _am_exitToHome();
    }

    if (event.keyCode === 27) { //esc
      $('._am-movie-name, ._am-movie-year, ._am-series-name, ._am-series-year').val('');
      $('._am-movie-imdb-list, ._am-movie-api-list, ._am-series-imdb-list, ._am-series-api-list').addClass('_am-hidden');
      $('._am-page.activation, ._am-series-main').removeClass('_am-hidden');
      _am_exitToHome();
    }
  }

});

function _am_exitToHome() {
  $('._am-page').addClass('_am-hidden');
  $('._am-page.activation').removeClass('_am-hidden');
  _am_currentContainer = "activation";
}

function _am_activateAccount() {

  try {

    var activationCode = $('._am-activation-code').val();

    if(activationCode.length === 0) {
      return false;
    }

    if(activationCode.length !== 10) {
      $('._am-page.activation ._am-error').text('Code must be 10 characters long.');
      $('._am-page.activation ._am-error').css({ opacity: 1 });
      setTimeout(function(){ $('._am-page.activation ._am-error').css({ opacity: 0 }) }, 3000);
      return false;
    }

    $('._am-page').addClass('_am-hidden');
    $('._am-page.loading').removeClass('_am-hidden');

    var data = {
      activationCode: activationCode,
      mac: stb.GetDeviceMacAddress()
    };

    if(userInfo !== undefined) {
      data.userId = userInfo.id;
    }

    var request = new XMLHttpRequest();
    request.open('POST', mainServerURL + '/api/account/activate')
    request.setRequestHeader("Content-Type", "Application/json");
    request.onreadystatechange = function() {

      try {

        if(this.readyState === 4) {

          if(this.status !== 200) {
            throw false;
          }

          var response = JSON.parse(this.responseText);

          if(!response) throw 'An error occurred.';
          if(response.success === false) throw response.error.message;

          $('._am-page').addClass('_am-hidden');
          $('._am-page.success').removeClass('_am-hidden');
          _am_currentContainer = 'success';

        }

      } catch (e) {
        var msg = (typeof(e) === 'string')?e:'An error occurred. Please try again.';
        setTimeout(function(){
          $('._am-page.error ._am-global-error-msg').html(msg);
          $('._am-page').addClass('_am-hidden');
          $('._am-page.error').removeClass('_am-hidden');
          _am_currentContainer = 'error';
        }, 0);
      }

    };
    request.send(JSON.stringify(data));

  } catch (e) {
    setTimeout(function(){
      var msg = (typeof(e) === 'string')?e:'An error occurred. Please try again.';
      $('._am-page.error ._am-global-error-msg').html(msg);
      $('._am-page').addClass('_am-hidden');
      $('._am-page.error').removeClass('_am-hidden');
      _am_currentContainer = 'error';
    }, 0);
  }

}

document.addEventListener("activation opened", function(event) {
  setTimeout(function(){

  }, 0);
  $('._am-activation-code').focus();
  if(userInfo !== undefined) {
    $('._am-display-username').text(userInfo.username);
    $('._am-display-password').text(userInfo.password);
    var expirationDate = new Date(userInfo.expirationDate * 1000);
    expirationDate = expirationDate.toDateString();
    $('._am-display-exp').text((userInfo.isUnlimited)?'Unlimited':expirationDate);
  }
});
