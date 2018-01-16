'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function rhsaSeveritySelectCtrl($rootScope,
                                $scope,
                                $location,
                                gettextCatalog,
                                Events,
                                RhsaSeverityFilters,
                                FilterService) {
    $scope.options = RhsaSeverityFilters;

    // default option is showing all rhsas
    // index for $scope.options
    const DEFAULT_OPTION = 0;

    /**
     * Initializes rhsa filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        let option = $location.search()[Events.filters.rhsaSeverity] ?
                     $location.search()[Events.filters.rhsaSeverity] :
                     FilterService.getRhsaSeverity();

        $scope.selected = $scope.options[option];
        $rootScope.$broadcast(Events.filters.tag,
                              $scope.selected.tag,
                              Events.filters.rhsaSeverity);
    })();

    $scope.select = function (option) {
        // don't do anything if user selects selected option
        if ($scope.selected.title === $scope.options[option].title) {
            return;
        } else {
            $scope.selected = $scope.options[option];

            // no need to set url if default filter
            if (option !== DEFAULT_OPTION) {
                FilterService.setRhsaSeverity(option);
            } else {
                FilterService.setRhsaSeverity(DEFAULT_OPTION);
                FilterService.deleteQueryParam(Events.filters.rhsaSeverity);
            }

            FilterService.doFilter();
            $rootScope.$broadcast(Events.filters.tag,
                                  $scope.selected.tag,
                                  Events.filters.rhsaSeverity);
            $rootScope.$broadcast(Events.filters.rhsaSeverity, $scope.selected);
        }
    };

    $scope.isSelected = function (option) {
        console.log(option);
        return true;
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.select(DEFAULT_OPTION);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.rhsaSeverity) {
            $scope.select(DEFAULT_OPTION);
        }
    });
}

function rhsaSeveritySelect() {
    return {
        templateUrl:
          'js/components/filterComponents/rhsaSeveritySelect/rhsaSeveritySelect.html',
        restrict: 'E',
        controller: rhsaSeveritySelectCtrl,
        scope: {}
    };
}

componentsModule.directive('rhsaSeveritySelect', rhsaSeveritySelect);
