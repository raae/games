var myApp = angular.module("myApp", ['ngResource']);

myApp.factory('InstagramUser', function($resource){
  return {
      accessToken: "412669471.c7333f1.e0b75f7652474bec8487d57fcc835635",
  }
});

myApp.factory('Instagram', function($resource){

  return {

    authenticateUser: function(){

      var client_id = "c7333f11111045efaedab47680c60437";

      var authenticationUrl = 'https://instagram.com/oauth/authorize/?client_id='
        +client_id+'&redirect_uri='
        +window.location.href+'&response_type=token';

      window.location.href = authenticationUrl;

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

function UserController($scope, Instagram, InstagramUser){

  $scope.authenticateUser = function(){
    Instagram.authenticateUser();
  }

  if(window.location.hash.indexOf('#access_token=') > -1) {
    InstagramUser.accessToken = window.location.hash.replace('#access_token=', '');
  }

  $scope.user = InstagramUser;
}

function GameBoardController($scope, $timeout, Instagram, InstagramUser){

  $scope.deal = function(){
    $scope.cards = [];
    $scope.flippedCards = [];
    $scope.pairedCards = [];

    $scope.fetchCards();
  };

  $scope.fetchCards = function(){

    Instagram.fetchPhotos(10, InstagramUser, function(data){

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
