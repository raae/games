var myApp = angular.module("myApp", ['ngResource']);

myApp.factory('instagram', function($resource){

  return {
    fetchPopular: function(count, callback){

      // The ngResource module gives us the $resource service. It makes working with
      // AJAX easy. Here I am using the client_id of a test app. Replace it with yours.

      var api = $resource('https://api.instagram.com/v1/media/popular?client_id=:client_id&count=:count&callback=JSON_CALLBACK',{
        client_id: '3c52889feb714456b62ba61fe7add54b',
        count: count
      },{
        fetch:{method:'JSONP'}
      });

      api.fetch(function(response){

        // Call the supplied callback function
        callback(response.data);

      });
    }
  }

});

function GameBoardController($scope, $timeout, instagram){

  $scope.fetchCards = function(){

    instagram.fetchPopular(10, function(data){

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
            $scope.flippedCards[0].paired = true;
            $scope.flippedCards[1].paired = true;
            $scope.flippedCards = [];
          }, 400);

        }

        $timeout(function(){
          $scope.flippedCards = [];
        }, 600);

      }
  };

  $scope.faceUp = function(card){
    return $scope.flippedCards.indexOf(card) !== -1;
  }

  $scope.cards = [];
  $scope.flippedCards = [];
  $scope.fetchCards();

}
