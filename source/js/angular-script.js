var app = angular.module('todo',[]);

// Alert Message

	app.directive('alertMsg',function($parse,$rootScope) {
		return {
			restrict: 'A',
			controller: "dialog as dialog",
			bindToController: true,
			scope: {
				'message': "@alertMsg",
				'callback': "@ngCallback"
			}
		}
	});


// Dialog

	app.controller("dialog",function($scope,$element,$document,$templateRequest,$compile){

		var _self = this;

		this.message = "";
		this.callback = "";
		
		$templateRequest("dialog.html").then(function(template) {
		    _self.dialog = angular.element(template);
		    _self.dialog.css('display', 'none');
		    $compile(_self.dialog)($scope);
		    $document.find('body').append(_self.dialog);
	        _self.putDialog($element);
	    });

		this.open = function(){
			angular.element(document.getElementsByClassName("dialog")).css({display:"none"});
			_self.putDialog($element);
			_self.dialog.css({display: 'block'});

		}

		this.putDialog = function(el){
			posTop = el[0].offsetTop - el[0].scrollTop;
			posLeft = el[0].offsetLeft - el[0].scrollLeft;
			_self.dialog.css({
				"top": (posTop-25)+"px",
				"left":  (posLeft - 120)+"px"
			});
		}

		this.continue = function(){
			$scope.$parent.$eval(_self.callback);
			_self.close();

		}

		this.close = function(){
			_self.dialog.css({display: 'none'});
		}

		$element.bind('click', function() {
			_self.open();
		});


	});


// Controller

	app.controller('todoController',['$scope','$document', function($scope,$document){

		$scope.todos = [
			{'title':'Test 1', 'done':false, 'editMode': false},
			{'title':'Test 2', 'done':false, 'editMode': false},
			{'title':'Test 3', 'done':false, 'editMode': false},
			{'title':'Test 4', 'done':false, 'editMode': false}
		];

		$scope.create = function(){
			$scope.todos.push({'title':$scope.newTodo,'done':false});
			$scope.newTodo = '';
		}

		$scope.delete = function(item){
			var index = $scope.todos.indexOf(item);
			$scope.todos.splice(index,1);   
		}

		$scope.save = function(item){
			item.editMode=0;
			item.title = item.tmp;
		}

		$scope.cancel = function(item){
			item.editMode=0;
		}

		$scope.edit = function(item){
			var index = $scope.todos.indexOf(item);
			
			item.editMode = 1;
			item.tmp = item.title;
			window.setTimeout(function(){
				document.getElementById("edit-todo-"+index).focus();
			},100);
		}

	}]);


// Esc

	app.directive('onEsc', function() {
		return function(scope, elm, attr) {
			elm.bind('keydown', function(e) {
				if (e.keyCode === 27) {
					scope.$apply(attr.onEsc);
				}
			});
		};
	});


// Enter

	app.directive('onEnter', function() {
		return function(scope, elm, attr) {
			elm.bind('keypress', function(e) {
				if (e.keyCode === 13) {
					scope.$apply(attr.onEnter);
				}
			});
		};
	});

