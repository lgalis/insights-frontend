'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function totalRiskSelectCtrl($location,
                             $rootScope,
                             $scope,
                             gettextCatalog,
                             Events,
                             Severities,
                             FilterService,
                             MultiButtonService) {
    $scope.options = Severities;
    $scope.label = 'All';

    $scope.select = function (option) {
        $scope.selected = option;
        $scope.label = option.label;

        setSeverity(option.value);
        FilterService.doFilter();

        // If 'All' is selected there is no reason to store the filter
        if ($scope.selected.value === 'All') {
            delete $location.search()[Events.filters.totalRisk];
        } else {
            $location.search(Events.filters.totalRisk, $scope.selected.value);
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.totalRisk);
        $rootScope.$broadcast(Events.filters.totalRisk, $scope.selected.value);
    };

    function getTag () {
        let severity = Severities.find((severity) => {
            return severity.value ===
                $location.search()[Events.filters.totalRisk];
        });

        if ($scope.selected.value === 'All') {
            severity = null;
        }

        return severity ? severity.tag : null;
    }

    function init () {
        $scope.selected = find($scope.options, (option) => {
            return option.value === $location.search()[Events.filters.totalRisk];
        });

        $scope.selected = $scope.selected ? $scope.selected :
            find($scope.options, (option) => {
                return option.value === 'All';
            });

        $scope.label = $scope.selected.label;
        setSeverity($scope.selected.value);
        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.totalRisk);
    }

    function setSeverity(risk) {
        Severities.map(function (s) {
                return s.value;
            }).forEach(function (severity) {
                if (severity === risk) {
                    MultiButtonService.setState('severityFilters' + severity, true);
                } else {
                    MultiButtonService.setState('severityFilters' + severity, false);
                }
            });
    }

    function resetFilter () {
        let option = find($scope.options, (option) => {
            return option.value === 'All';
        });
        $scope.select(option);
    }

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.totalRisk) {
            resetFilter();
            $rootScope.$broadcast(filter, 'All');
        }
    });

    $scope.$on(Events.filters.reset, function () {
        resetFilter();
    });

    init();
}

function totalRiskSelect() {
    return {
        templateUrl:
            'js/components/filterComponents/totalRiskSelect/totalRiskSelect.html',
        restrict: 'E',
        controller: totalRiskSelectCtrl,
        scope: {},
        replace: true
    };
}

componentsModule.directive('totalRiskSelect', totalRiskSelect);
