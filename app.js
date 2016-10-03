(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'narrowDownMenu',
      bindToController: true
    };

    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var controller = this;

    controller.found = [];
    controller.searchTerm = "";

    controller.getMatchedMenuItems = function (searchTerm) {
      var promise = MenuSearchService.getMenuItems(searchTerm);

      promise.then(function (response) {

        var foundItems = response.data.menu_items;

        if(searchTerm == ""){
          controller.found = [];
        }
        else{
          foundItems = foundItems.filter( function (item) {
            return item.description.indexOf(searchTerm) !== -1;
          });

          controller.found = foundItems;
        }
      })
      .catch(function (error) {
        console.log("Something went terribly wrong");
      });

    };

    controller.removeItem = function (index) {
      controller.found.splice(index,1);
    }
  }

  MenuSearchService.$inject = ['$http','ApiBasePath'];
  function MenuSearchService($http,ApiBasePath) {
    var service = this;

    service.getMenuItems = function (searchTerm){

      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });
      return response;

    };

  }


})();
