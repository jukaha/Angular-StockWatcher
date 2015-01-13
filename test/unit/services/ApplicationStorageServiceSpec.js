'use strict';

/**
 * Unit Tests for "ApplicationStorageService".
 */
describe('ApplicationStorageService', function() {
	var applicationStorageService = undefined,
	    storageService = undefined,
	    appConfig = undefined;

	var constants = {
		stockData: [
			{
				key: 'value'
			}
		]
	};


	var mockStorageService = {
		setData: jasmine.createSpy(),
		getData: jasmine.createSpy()
	};

	beforeEach(module('stockWatcher'), function ($provide) {
		$provide.value('storageService', mockStorageService);
	});


	beforeEach(inject(function ($injector) {
		// Get objects to test:
		applicationStorageService = $injector.get('applicationStorageService');
		storageService = $injector.get('storageService');
		appConfig = $injector.get('appConfig');

		spyOn(storageService, 'setData').andCallThrough();
		spyOn(storageService, 'getData').andCallThrough();

		constants.stockData = angular.fromJson(angular.toJson(constants.stockData));
	}));


	describe('stocks storage', function() {
		it('can save and retrieve stock data', function() {
			applicationStorageService.setSavedStocks(constants.stockData);

			var storedValue = applicationStorageService.getSavedStockSymbols();

			expect(storedValue).toEqual(constants.stockData);
			expect(storageService.setData).toHaveBeenCalled();
		});

		it('should not return a string', function() {
			applicationStorageService.setSavedStocks(constants.stockData);

			var storedValue = applicationStorageService.getSavedStockSymbols();

			expect(typeof storedValue).not.toEqual('string');
			expect(typeof storedValue).toEqual('object');
		});
	});

	describe('caching behavior', function() {
		describe('storing', function() {
			it('should return the cached version of values instead of calling the storage service', function() {
				applicationStorageService.setSavedStocks(constants.stockData);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.setData).toHaveBeenCalled();
				expect(storageService.setData.callCount).toEqual(1);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.setData.callCount).toEqual(1);
			});

			it('should use the proper cache key', function() {
				applicationStorageService.setSavedStocks(constants.stockData);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.setData).toHaveBeenCalled();
				expect(storageService.setData.callCount).toEqual(1);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.setData.callCount).toEqual(1);
				expect(storageService.setData.mostRecentCall.args[0]).toEqual(appConfig.StorageKeys.StoredQuotes);
			});
		});

		describe('retrieving', function() {
			it('should not call the storage service when data is cached', function() {
				applicationStorageService.setSavedStocks(constants.stockData);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.getData).not.toHaveBeenCalled();
				expect(storageService.getData.callCount).toEqual(0);
			});

			it('should call the storage service when data is not cached', function() {
				//applicationStorageService.setSavedStocks(constants.stockData);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.getData).toHaveBeenCalled();
				expect(storageService.getData.callCount).toEqual(1);
			});

			it('should use the proper cache key', function() {
				//applicationStorageService.setSavedStocks(constants.stockData);

				var storedValue = applicationStorageService.getSavedStockSymbols();

				expect(storedValue).toEqual(constants.stockData);
				expect(storageService.getData).toHaveBeenCalled();
				expect(storageService.getData.callCount).toEqual(1);
				expect(storageService.getData.mostRecentCall.args[0]).toEqual(appConfig.StorageKeys.StoredQuotes);
			});
		});
	});
});