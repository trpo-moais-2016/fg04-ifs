'use strict';

var app = angular.module('app', []);

app.directive("drawing", function(){
  return {
    restrict: "A",
    link: function(scope, element, attr){
        var ctx = element[0].getContext('2d');

        ctx.width = attr.width;
        ctx.height = attr.height;

        ctx.transform(1, 0, 0, -1, ctx.width / 2, ctx.height / 2);
        scope.draw(ctx);
    }
  };
});

app.controller("mainController", ["$scope", function($scope){
    var ctx;

    $scope.n = 100000;
    $scope.background = '#ffffff';
    $scope.firstColor = '#ff0000';
    $scope.secondColor = '#0000ff';

    $scope.draw = function(context){
        var points = dragonCurve($scope.n, $scope.firstColor, $scope.secondColor);
        ctx = ctx || context;
     
        ctx.fillStyle = $scope.background;
        ctx.fillRect(-ctx.width/2, -ctx.height/2, ctx.width, ctx.height);
        ctx.save();
        scale(points);
        draw(points);
        ctx.restore();


        function scale(points){
            var left = 0, bottom = 0,
                right = 0, top = 0;
            for(var i = 0; i < points.length; i++){
                var p = points[i];
                if(p.x < left)  left = p.x;
                if(p.x > right) right = p.x;
                if(p.y < bottom) bottom = p.y;
                if(p.y > top) top = p.y;
            }

            var dx = 800.0 / (right - left);
            var dy = 600.0 / (top - bottom);

            var scale = dx < dy ? dx : dy;
            var shiftX = -((right - left) / 2 + left) * scale;
            var shiftY = -((top - bottom) / 2 + bottom) * scale;

            ctx.lineWidth = 1.0 / scale;
            ctx.transform(scale, 0, 0, scale, shiftX , shiftY);
        }

        function draw(points){
            for(var i = 0; i < points.length; i++){
                var p = points[i];
          
                // Сложности рисования точек на канвасе =(
                ctx.beginPath();    
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + 0.001, p.y + 0.001);                 
                ctx.stroke();
            }
        }
    };
}]);

function dragonCurve(n, firstColor, secondColor){
    var points = [],
        current = {x:0, y:0},
        next = null;

    for (var i = 0; i < n; i++) {
        if (Math.round(Math.random() * 100) > 50) 
            next = {
                x: (current.x + current.y) / 2,
                y: (-current.x + current.y) / 2,
                color: firstColor
            };
        else
            next = {
                x: (-current.x + current.y) / 2 - 1,
                y: (-current.x - current.y) / 2,
                color: secondColor
            };    

        points.push(next);
        current = next;
    }
    return points;
}