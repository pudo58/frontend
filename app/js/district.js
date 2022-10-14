class District {
	constructor(id, province, name) {
		this.id = id;
		this.province = province;
		this.name = name;
	}
}
var app = angular.module('myApp', []);
var loadData ;
app.controller('myCtrl', function($scope, $http) {
	$scope.isShow = false;
	const url = "http://localhost:8080/api/districts/all-data/";
	 loadData = function(){
		$http.get(url).then(function (response) {
			$scope.districts = response.data;
			$scope.data = [];
			for(var x in $scope.districts) {
				var arrayToString = JSON.stringify(Object.assign({}, $scope.districts[x]));
				var stringToJsonObject = JSON.parse(arrayToString); 
				$scope.data.push(new District(stringToJsonObject[0], stringToJsonObject[1], stringToJsonObject[2]));
			}
		});
	}
	loadData();
	$http.get("http://localhost:8080/api/provinces/all")
	.then(function (response) {
		$scope.provinces = response.data;	
		$(document).ready(function(){
			$("#district-value").tokenInput($scope.provinces,{
			noResultsText: "No results",
			searchingText: "Searching",
			preventDuplicates: true,
			resultsLimit: 10,
			theme: "facebook",
			});
		});
	});

	$(document).ready(function(){
	$(document).on("click",".remove", function(event){
		$scope.isShow = true;
		event.preventDefault();
		var id = $(this).closest("tr").find(".id").text();
		$http.delete("http://localhost:8080/api/districts/delete/" + id,).then(function(response) {
			setTimeout(function(){
				$scope.isShow = false;
			}, 2000);
			loadData();
		}).catch(function(response) {
			$scope.isShow = false;
		});
		return false ;
	});
	$(document).on("click","#search",function(){
		var url = "";
		if($("#district-value").val() == null || $("#district-value").val().length == 0)
			url = "http://localhost:8080/api/districts/all-data/";
		else 
			url = "http://localhost:8080/api/districts/a/?province_id="+$("#district-value").val();
		$http.get(url).then(function (response) {
			$scope.districts = response.data;
			$scope.data = [];
			for(var x in $scope.districts) {
				var arrayToString = JSON.stringify(Object.assign({}, $scope.districts[x]));
				var stringToJsonObject = JSON.parse(arrayToString); 
				$scope.data.push(new District(stringToJsonObject[0], stringToJsonObject[1], stringToJsonObject[2]));
			}
		});
	});
});
});
app.controller("create",function($scope,$http){
$http.get("http://localhost:8080/api/provinces/all").
then(function(response){
	$scope.provinces = response.data;
});
$scope.error = false ;
$scope.data = {
	province: 
	{
		id: ""
	},
	name: ""
};
$("#create").click(function(){
	$scope.isShow = true;
	var url = "http://localhost:8080/api/districts/add";
	$("#loading").show();
	$.ajax({
		url: url,
		type: "POST",
		data: JSON.stringify($scope.data),
		contentType: "application/json",
		dataType: "text",
		success: function (data) {
			$scope.success = true;
			$scope.error = false;
			setTimeout(function(){
				$scope.success = false;
				$scope.isShow = false;
				$scope.$apply();
			}, 1000);
			loadData();   
		},
		error: function (e) {
			$scope.isShow = false;
			$scope.error = true;
			$scope.success = false;
		}
	});
	return false ;
})
});

	app.controller("update",function($scope,$http){
		$http.get("http://localhost:8080/api/provinces/all").then(function(response){
				$scope.provinces = response.data;
		});
		$scope.data = {
			id: "",
			province:
			{
				id: ""
			},
			name: ""
		};
		$scope.update = function(event){
			event.preventDefault();
			$scope.isShow = true;
			$http.put("http://localhost:8080/api/districts/update/" + $scope.data.id, $scope.data).then(function(response){
				$scope.success = true;
				$scope.error = false;
				setTimeout(function(){
					$scope.success = false;
					$scope.isShow = false;
					$scope.$apply();
				}, 1000);
				loadData();
				$("#update").modal("hide");
			},function(response){
				$scope.isShow = false;
				$scope.error = true;
				$scope.success = false;
			});

		}
		$(document).on("click",".update",function(){
			var name = $(this).closest("tr").find(".name").text();
			var id = $(this).closest("tr").find(".id").text();
			$(document).find("form").find("#name").val(name);
			$scope.data = {
				id: id,
				province:
				{
					id: " "
				},
				name: $(this).closest("tr").find(".name").text()
			}
			$("#update").modal("show");
		});
	});
// End of file district.js
