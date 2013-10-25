var myApp = angular.module("myApp", ['ngResource']);


myApp.factory('Utility', function($window, $resource){

  var isProd = function() {
    return $window.location.host.indexOf('github.io') > -1;
  }

  var defaultAccessToken = '412669471.c7333f1.e0b75f7652474bec8487d57fcc835635';

  var clientId = 'c7333f11111045efaedab47680c60437';
  if(isProd())
      clientId = '3c52889feb714456b62ba61fe7add54b';

  return {

    uri: $window.location.href,

    defaultAccessToken: defaultAccessToken,

    clientId: clientId,

    goToURL: function(url) {
      $window.location.href = url;
    }

  }

});

myApp.factory('Instagram', function($resource, Utility){

  return {

    user: {
      accessToken: Utility.defaultAccessToken
    },

    authenticateUser: function(){

      var authenticationUrl = 'https://instagram.com/oauth/authorize/?client_id='
        +Utility.clientId+'&redirect_uri='
        +Utility.uri+'&response_type=token';

      Utility.goToURL(authenticationUrl);

    },

    fetchPhotos: function(count, instagramUser, callback){
      // The ngResource module gives us the $resource service. It makes working with
      // AJAX easy. Here I am using the client_id of a test app. Replace it with yours.

      var api = $resource('https://api.instagram.com/v1/users/self/media/recent/?access_token=:access_token&count=:count&callback=JSON_CALLBACK',{
        access_token: instagramUser.accessToken,
        count: count
      },{
        fetch:{method:'JSONP'}
      });

      api.fetch(function(response){

        if(response.data) {
          instagramUser.username = response.data[0].user.username;
          instagramUser.profilePicture = response.data[0].user.profile_picture;

          callback(response.data);
        }

      });
    }
  }

});

function InstagramUserController($window,$scope, Instagram){

  $scope.authenticateUser = function(){
    Instagram.authenticateUser();
  }

  $scope.isDefaultUser = function(user){
    return user.accessToken == Instagram.defaultUser.accessToken;
  }

  if($window.location.hash.indexOf('#access_token=') > -1) {
    Instagram.user.accessToken = $window.location.hash.replace('#access_token=', '');
  }

  $scope.user = Instagram.user;
}

function GameBoardController($scope, $timeout, Instagram){

  $scope.deal = function(){
    $scope.cards = [];
    $scope.flippedCards = [];
    $scope.pairedCards = [];

    $scope.fetchCards();
  };

  $scope.fetchCards = function(){

    Instagram.fetchPhotos(10, Instagram.user, function(data){

      var data = data.concat(angular.copy(data));

      angular.forEach(data, function(d, counter){
          var index = (Math.random() * counter) | 0;

          data[counter] = data[index];
          data[index] = d;

      });

      $scope.cards = data;

    });
  };

  $scope.flipCard = function(card){

      if($scope.flippedCards.length > 1)
        return;

      $scope.flippedCards.push(card);

      if($scope.flippedCards.length > 1){

        if($scope.flippedCards[0].id == $scope.flippedCards[1].id) {

          $timeout(function(){
            $scope.pairedCards.push($scope.flippedCards[0]);
            $scope.pairedCards.push($scope.flippedCards[1]);
            $scope.flippedCards = [];
          }, 400);

        }

        $timeout(function(){
          $scope.flippedCards = [];
        }, 600);

      }
  };

  $scope.isPaired = function(card){
    return $scope.pairedCards.indexOf(card) !== -1;
  }

  $scope.isFaceUp = function(card){
    return $scope.flippedCards.indexOf(card) !== -1;
  }

  $scope.deal();
}
