"use strict";angular.module("stockWatcher.Controllers",[]),angular.module("stockWatcher.Directives",[]),angular.module("stockWatcher.Filters",[]),angular.module("stockWatcher.Services",[]),angular.module("stockWatcher",["ngRoute","ngAnimate","stockWatcher.Controllers","stockWatcher.Directives","stockWatcher.Services","stockWatcher.Filters"]).config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/home-page.html",controller:"HomePageController"}).when("/about",{templateUrl:"views/about-page.html",controller:"AboutPageController"}).when("/quote/:stockSymbol",{templateUrl:"views/quoteDetails-page.html",controller:"QuoteDetailsPageController"}).when("/currency",{templateUrl:"views/currency-page.html",controller:"CurrencyPageController"}).otherwise({redirectTo:"/"})}]).run(["$window","$rootScope",function(e,t){var r=!0;navigator&&navigator.onLine&&(r=navigator.onLine),t.$apply(function(){t.applicationIsOnline=r}),e.addEventListener?(e.addEventListener("online",function(){t.$apply(function(){t.applicationIsOnline=!0})},!1),e.addEventListener("offline",function(){t.$apply(function(){t.applicationIsOnline=!1})},!1)):(document.body.ononline=function(){t.$apply(function(){t.applicationIsOnline=!0})},document.body.onoffline=function(){t.$apply(function(){t.applicationIsOnline=!1})})}]).run(["$window","$rootScope",function(){"undefined"!=typeof Highcharts&&Highcharts.setOptions({global:{useUTC:!1}})}]),angular.module("stockWatcher.Controllers").controller("AboutPageController",["$scope",function(e){e.controllerVersion="0.0.1"}]),angular.module("stockWatcher.Controllers").controller("CurrencyChartController",["$scope","$interval","$timeout","currencyService",function(e,t,r,o){e.refreshInterval=60;var a="container"+e.fromCurrency+e.toCurrency;e.containerID=a;var n=void 0,s=void 0;e.fetchPreviousDayClosePrice=function(){var t=[e.symbol],r=stockService.getCurrentDataWithDetails(t);r.then(function(e){e.query.count>0&&(n=e.query.results.row.PreviousClose,"undefined"!=typeof n&&y())})};var i=function(t){s=new Highcharts.StockChart({chart:{renderTo:a},title:{text:e.fromCurrency+" to "+e.toCurrency},credits:{enabled:!1},rangeSelector:{buttons:[{type:"day",count:1,text:"1d"},{type:"day",count:2,text:"2d"},{type:"day",count:7,text:"5d"},{type:"all",text:"All"}],selected:0,allButtonsEnabled:!0},series:[{name:e.fromCurrency+" to "+e.toCurrency,type:"area",data:t,gapSize:5,tooltip:{valueDecimals:4},fillColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,Highcharts.getOptions().colors[0]],[1,Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]]},threshold:null}]}),"undefined"!=typeof n&&y()},l=function(){v(),i([null]),s.showLoading()};r(l,0);var c=e.fromCurrency,d=e.toCurrency,h=180,u="10d",v=function(){var e=o.getCurrencyExchangeRateHistory(c,d,h,u);e.then(function(e){e&&e.length>0?(s.hideLoading(),i(e)):(console.warn('"'+c+"-"+d+'" init did not receive data, refreshing it.'),v())})},g=function(){var e=o.getCurrencyExchangeRateHistory(c,d,h,u);e.then(function(e){e&&e.length>0?p(e):(console.warn('"'+c+"-"+d+'" update did not receive data, refreshing it.'),g())})},p=function(e){var t=s.series[0];t.setData(e),"undefined"!=typeof n&&y(),s.redraw()},y=function(){var t=e.fromCurrency+e.toCurrency,r=n;if(s){var o=t+"-open",a=s.yAxis[0];a.removePlotLine(o),a.addPlotLine({color:"red",dashStyle:"LongDash",id:o,label:{text:"Prev Close ($"+r+")"},width:1,zIndex:3,value:r})}};e.createRefresher=function(){return t(function(){g()},1e3*e.refreshInterval)},e.destroyRefresher=function(){"undefined"!=typeof e.refresher&&(t.cancel(e.refresher),e.refresher=void 0)},e.refreshIntervalChanged=function(){e.destroyRefresher(),e.createRefresher()},e.refresher=e.createRefresher(),e.$on("$destroy",function(){e.destroyRefresher(),"undefined"!=typeof s&&s.destroy()})}]),angular.module("stockWatcher.Controllers").controller("CurrencyPageController",["$scope",function(e){e.controllerVersion="0.0.1"}]),angular.module("stockWatcher.Controllers").controller("HomePageController",["$scope",function(e){e.controllerVersion="0.0.1"}]),angular.module("stockWatcher.Controllers").controller("MarketChartController",["$scope","$interval","stockService",function(e,t,r){e.refreshInterval=60,e.chartIsInitialized=!1;var o="containerMarkets";e.containerID=o;var a=void 0,n=void 0,s=[{symbol:".INX",name:"S&P 500",data:[]},{symbol:".DJI",name:"Dow Jones",data:[]},{symbol:"OSPTX",name:"S&P/TSX",data:[]}],i={title:"TSX, Dow Jones & S&P500 Indices"},l=function(){n=new Highcharts.StockChart({chart:{renderTo:o},title:{text:i.title},credits:{enabled:!1},xAxis:{events:{setExtremes:function(){}}},rangeSelector:{buttons:[{type:"day",count:1,text:"1d"},{type:"day",count:2,text:"2d"},{type:"day",count:7,text:"5d"},{type:"all",text:"All"}],selected:0,allButtonsEnabled:!0},series:s,plotOptions:{series:{compare:"percent"}},yAxis:{labels:{formatter:function(){return(this.value>0?" + ":"")+this.value+"%"}},plotLines:[{value:0,width:2,color:"silver"}]},tooltip:{pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',valueDecimals:2}}),"undefined"!=typeof a&&p(),e.chartIsInitialized=!0},c=60,d="10d",h=0,u=function(){for(var e=0,t=s.length;t>e;e++){var o=s[e].symbol;console.log("MarketChartController::initGraph() sent data request for index #"+e+': "'+s[e].name+'"');var a=r.getLiveMarketData(o,c,d);a.then(function(e){return function(r){h++,console.log("for #"+e+", got",r.length),r&&r.length>0&&(console.log("MarketChartController::initGraph() received data for index #"+e+': "'+s[e].name+'"'),s[e].data=r,h===t&&(console.log("MarketChartController::initGraph() received all expected data. Creating graph..."),l()))}}(e),function(e){return function(r){h++,console.error("Error while receiving data for serie #"+e,r),r&&r.error&&"no data"===r.error&&h===t&&l()}}(e))}};u();var v=function(){if("undefined"!=typeof n)for(var e=0,t=s.length;t>e;e++){var o=s[e].symbol;console.log("MarketChartController::updateGraph() sent data request for index #"+e+': "'+s[e].name+'"');var a=r.getLiveMarketData(o,c,d);a.then(function(e){return function(t){t&&t.length>0?(console.log("MarketChartController::updateGraph() received data for index #"+e+': "'+s[e].name+'"'),g(e,t)):(console.warn('"'+s[e].name+'" update did not receive data, refreshing it.'),v())}}(e),function(e){console.error(e)})}},g=function(e,t){var r=n.series[e];r.setData(t),"undefined"!=typeof a&&p()},p=function(){var t=e.fromCurrency+e.toCurrency,r=a;if(n){var o=t+"-open",s=n.yAxis[0];s.removePlotLine(o),s.addPlotLine({color:"red",dashStyle:"LongDash",id:o,label:{text:"Prev Close ($"+r+")"},width:1,zIndex:3,value:r})}};e.createRefresher=function(){return t(function(){v()},1e3*e.refreshInterval)},e.destroyRefresher=function(){angular.isDefined(y)&&(t.cancel(y),y=void 0)},e.refreshIntervalChanged=function(){e.destroyRefresher(),e.createRefresher()};var y=e.createRefresher();e.$on("$destroy",function(){e.destroyRefresher(),"undefined"!=typeof n&&n.destroy()}),e.$parent.$watch("showTitle",function(e){"undefined"!=typeof n&&(n.setTitle(e?{text:i.title}:{text:null}),n.reflow(),n.redraw())}),e.$parent.$watch("showZoom",function(e){"undefined"!=typeof n&&(n.rangeSelector.enabled=e,n.reflow(),n.redraw())}),e.$parent.$watch("showDatePicker",function(){}),e.$parent.$watch("showNavigator",function(e){if("undefined"!=typeof n){var t=n.scroller;e?(t.xAxis.labelGroup.show(),t.xAxis.gridGroup.show(),t.series.show(),t.navigatorGroup.show(),t.scrollbar.show(),t.scrollbarRifles.show(),t.scrollbarGroup.show(),$.each(t.elementsToDestroy,function(e,t){t.hide()})):(t.xAxis.labelGroup.hide(),t.xAxis.gridGroup.hide(),t.series.hide(),t.scrollbar.hide(),t.scrollbarGroup.hide(),t.scrollbarRifles.hide(),t.navigatorGroup.hide(),$.each(t.elementsToDestroy,function(e,t){t.hide()})),n.reflow(),n.redraw()}})}]),angular.module("stockWatcher.Controllers").controller("MarketChartWidgetController",["$scope",function(e){e.showTitle=!0,e.showZoom=!0,e.showDatePicker=!0,e.showNavigator=!0,e.toggleTitle=function(){e.showTitle=!e.showTitle},e.toggleZoom=function(){e.showZoom=!e.showZoom},e.toggleDatePicker=function(){e.showDatePicker=!e.showDatePicker},e.toggleNavigator=function(){e.showNavigator=!e.showNavigator}}]),angular.module("stockWatcher.Controllers").controller("QuoteDetailsPageController",["$scope","$interval","$routeParams","$location","stockService",function(e,t,r,o,a){e.controllerVersion="0.0.1",e.$location=o,e.stockSymbol=r.stockSymbol,e.refreshInterval=30;var n=function(){var t=[e.stockSymbol],r=a.getCurrentDataWithDetails(t);r.then(function(t){e.stockData=t.query.results.row})};n(),e.createRefresher=function(){return t(function(){n()},1e3*e.refreshInterval)},e.destroyRefresher=function(){angular.isDefined(s)&&(t.cancel(s),s=void 0)},e.refreshIntervalChanged=function(){e.destroyRefresher(),e.createRefresher()};var s=e.createRefresher();e.$on("$destroy",function(){e.destroyRefresher()})}]),angular.module("stockWatcher.Controllers").controller("RouteController",["$scope","$route","$location",function(e,t){e.$on("$routeChangeSuccess",function(){e.controller=t.current.controller})}]),angular.module("stockWatcher.Controllers").controller("StockChartController",["$scope","$interval","$timeout","stockService",function(e,t,r,o){e.refreshInterval=60;var a="container"+e.symbol.replace(".","");e.containerID=a,e.yesterdayClosePrice=void 0,e.chart=void 0,e.initGraphPromise=void 0,e.updateGraphPromise=void 0;var n=function(){var t=[e.symbol],r=o.getCurrentDataWithDetails(t);r.then(function(t){if(t.query.count>0){var r=t.query.results.row.PreviousClose;r!==e.yesterdayClosePrice&&(e.yesterdayClosePrice=r,g())}})};n();var s=function(t){e.chart=new Highcharts.StockChart({chart:{renderTo:a},title:{text:e.symbol+" Stock Price"},credits:{enabled:!1},rangeSelector:{buttons:[{type:"day",count:1,text:"1d"},{type:"day",count:2,text:"2d"},{type:"day",count:7,text:"5d"},{type:"all",text:"All"}],selected:0,allButtonsEnabled:!0},series:[{name:e.symbol,type:"area",data:t,gapSize:5,tooltip:{valueDecimals:2},fillColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,Highcharts.getOptions().colors[0]],[1,Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]]},threshold:null}]}),"undefined"!=typeof e.yesterdayClosePrice&&g()},i=function(){u(),s([null]),e.chart.showLoading()};r(i,0);var l=e.symbol.replace(".TO",""),c=e.symbol.indexOf("TO")>-1?"TSE":"NYSE",d=60,h="10d",u=function(){var t=o.getLiveData(l,c,d,h);t.then(function(t){t&&t.length>0?(e.chart.hideLoading(),s(t)):(console.warn('"'+l+'" init did not receive data, refreshing it.'),e.initGraphPromise=r(u,1e3))})};e.updateGraph=function(){var t=o.getLiveData(l,c,d,h);t.then(function(t){t&&t.length>0?v(t):(console.warn('"'+l+'" update did not receive data, refreshing it.'),e.updateGraphPromise=r(e.updateGraph,1e3))})};var v=function(t){var r=e.chart.series[0];r.setData(t)},g=function(){if("undefined"!=typeof e.chart){var t=e.yesterdayClosePrice,r=e.symbol+"-previousClose",o=e.chart.yAxis[0];o.removePlotLine(r),o.addPlotLine({color:"red",dashStyle:"LongDash",id:r,label:{text:"Prev Close ($"+t+")"},width:1,zIndex:3,value:t})}};e.createRefresher=function(){return t(function(){e.updateGraph()},1e3*e.refreshInterval)},e.createPreviousCloseRefresher=function(){return t(function(){n()},1e3*e.refreshInterval)},e.destroyRefresher=function(){"undefined"!=typeof e.refresher&&(t.cancel(e.refresher),e.refresher=void 0),"undefined"!=typeof e.previousCloseRefresher&&(t.cancel(e.previousCloseRefresher),e.previousCloseRefresher=void 0)},e.refreshIntervalChanged=function(){e.destroyRefresher(),e.createRefresher()},e.refresher=e.createRefresher(),e.previousCloseRefresher=e.createPreviousCloseRefresher(),e.$on("$destroy",function(){e.destroyRefresher(),"undefined"!=typeof e.initGraphPromise&&(r.cancel(e.initGraphPromise),e.initGraphPromise=void 0),"undefined"!=typeof e.updateGraphPromise&&(r.cancel(e.updateGraphPromise),e.updateGraphPromise=void 0),"undefined"!=typeof e.chart&&e.chart.destroy()})}]),angular.module("stockWatcher.Controllers").controller("StockListController",["$scope","$interval","stockService",function(e,t,r){e.refreshInterval=30,e.sortOrder="index",e.sortReversed=!1,e.stockQuotes=[{symbol:"PG",yahooSymbol:"PG",liveData:{},index:0},{symbol:"T",yahooSymbol:"T.TO",liveData:{},index:1},{symbol:"BNS",yahooSymbol:"BNS.TO",liveData:{},index:2},{symbol:"TD",yahooSymbol:"TD.TO",liveData:{},index:3},{symbol:"PWF",yahooSymbol:"PWF.TO",liveData:{},index:4},{symbol:"FTS",yahooSymbol:"FTS.TO",liveData:{},index:5},{symbol:"BEP",yahooSymbol:"BEP-UN.TO",liveData:{},index:6},{symbol:"EMA",yahooSymbol:"EMA.TO",liveData:{},index:7},{symbol:"XIC",yahooSymbol:"XIC.TO",liveData:{},index:8},{symbol:"XSP",yahooSymbol:"XSP.TO",liveData:{},index:9}];for(var o=[],a=0,n=e.stockQuotes.length;n>a;a++)o.push(e.stockQuotes[a].yahooSymbol);var s=function(){var t=r.getCurrentDataWithDetails(o);t.then(function(t){for(var r=0,o=t.query.count;o>r;r++)e.stockQuotes[r].liveData=t.query.results.row[r]})};s(),e.createRefresher=function(){return t(function(){s()},1e3*e.refreshInterval)},e.destroyRefresher=function(){"undefined"!=typeof i&&(t.cancel(i),i=void 0)},e.refreshIntervalChanged=function(){e.destroyRefresher(),e.createRefresher()};var i=e.createRefresher();e.$on("$destroy",function(){e.destroyRefresher()})}]),angular.module("stockWatcher.Controllers").controller("StockListItemController",["$scope","stockService",function(e,t){var r=function(){var r=t.getLiveData(e.quote.symbol,e.quote.exchange,e.quote.interval,e.quote.period);r.then(function(t){e.liveQuotes=t})};r(),e.isGain=function(){if("undefined"!=typeof e.quote.liveData.Change){var t="+"===e.quote.liveData.Change[0];return t}return!1},e.isLoss=function(){if("undefined"!=typeof e.quote.liveData.Change){var t="-"===e.quote.liveData.Change[0];return t}return!1}}]),angular.module("stockWatcher.Directives").directive("currencyChart",function(){return{restrict:"E",scope:{fromCurrency:"@",toCurrency:"@"},templateUrl:"views/currencyChart-partial.html",controller:"CurrencyChartController"}}),angular.module("stockWatcher.Directives").directive("marketChart",function(){return{restrict:"E",scope:{fetchTSX:"@",fetchDJ:"@"},templateUrl:"views/marketChart-partial.html",controller:"MarketChartController"}}),angular.module("stockWatcher.Directives").directive("marketChartWidget",function(){return{restrict:"E",scope:{fetchTSX:"@",fetchDJ:"@"},templateUrl:"views/marketChartWidget-partial.html",controller:"MarketChartWidgetController"}}),angular.module("stockWatcher.Directives").directive("navigationBar",function(){return{restrict:"E",templateUrl:"views/navigationBar-partial.html",controller:"RouteController"}}),angular.module("stockWatcher.Directives").directive("stockChart",function(){return{restrict:"E",scope:{symbol:"@"},templateUrl:"views/stockChart-partial.html",controller:"StockChartController"}}),angular.module("stockWatcher.Directives").directive("stockList",function(){return{restrict:"E",templateUrl:"views/stockList-partial.html",controller:"StockListController"}}),angular.module("stockWatcher.Directives").directive("stockListItem",function(){return{restrict:"A",scope:{quote:"="},templateUrl:"views/stockListItem-partial.html",controller:"StockListItemController"}}),angular.module("stockWatcher.Services").factory("currencyService",["$q","$http",function(e,t){var r=function(r,o){var a=e.defer(),n='select * from yahoo.finance.xchange where pair in ("'+r+o+'")',s="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK",i="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(n)+s;return t.jsonp(i).success(function(e){var t={};e.query.count>0&&(t=e.query.results.rate,t.Ask=parseFloat(t.Ask,10),t.Bid=parseFloat(t.Bid,10),t.Rate=parseFloat(t.Rate,10)),a.resolve(t)}),a.promise},o=function(r,o,a,n){var s=e.defer(),i=0,l="http://www.google.com/finance/getprices?q="+r+o+"&i="+a+"&p="+n+"&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg",c='SELECT * FROM csv WHERE url="'+l+'"',d="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(c)+"&format=json&callback=JSON_CALLBACK";return t.jsonp(d).success(function(e){var t=[],r=new Date,o=null!==e.query.results&&e.query.results.row.length>=7;if(e.query&&e.query.count>0&&o){var n=0;e.query.results.row[6]&&(n=parseInt(e.query.results.row[6].col0.replace("TIMEZONE_OFFSET=",""),10));for(var l=parseInt(e.query.results.row[7].col0.replace("a",""),10)+60*n,c=0,d=7;d<e.query.count;d++){"a"===e.query.results.row[d].col0[0]?(l=parseInt(e.query.results.row[d].col0.replace("a",""),10)+60*n,c=0):c=parseInt(e.query.results.row[d].col0,10);var h=new Date(1e3*(l+c*a+60*r.getTimezoneOffset()));if(h>i){var u=parseFloat(e.query.results.row[d].col1,10),v=[h,u];i=h,t.push(v)}}}s.resolve(t)}),s.promise};return{getCurrencyExchangeRate:r,getCurrencyExchangeRateHistory:o}}]),angular.module("stockWatcher.Services").factory("stockService",["$q","$http","$timeout",function(e,t,r){var o=1e4,a=[["a0","Ask"],["a2","AverageDailyVolume"],["a5","AskSize"],["b0","Bid"],["b2","AskRealTime"],["b3","BidRealTime"],["b4","BookValue"],["b6","BidSize"],["c0","ChangeAndPercentChange"],["c1","Change"],["c3","Commission"],["c4","Currency"],["c6","ChangeRealTime"],["c8","AfterHoursChangeRealTime"],["d0","DividendPerShare"],["d1","LastTradeDate"],["d2","TradeDate"],["e0","EarningsPerShare"],["e1","ErrorIndication"],["e7","EPSEstimateCurrentYear"],["e8","EPSEstimateNextYear"],["e9","EPSEstimateNextQuarter"],["h0","DaysHigh"],["j0","_52WeekLow"],["k0","_52WeekHigh"],["g0","DaysLow"],["g1","HoldingsGainPercent"],["g3","AnnualizedGain"],["g4","HoldingsGain"],["g5","HoldingsGainPercentRealTime"],["g6","HoldingsGainRealTime"],["i0","MoreInfo"],["i5","OrderBookRealTime"],["j0","YearLow"],["j1","MarketCapitalization"],["j3","MarketCapRealTime"],["j4","EBITDA"],["j5","ChangeFrom52WeekLow"],["j6","PercentChangeFrom52WeekLow"],["k0","YearHigh"],["k1","LastTradeRealTimeWithTime"],["k2","ChangePercentRealTime"],["k4","ChangeFrom52WeekHigh"],["k5","PercentChangeFrom52WeekHigh"],["l0","LastTradeWithTime"],["l1","LastTradePriceOnly"],["l2","HighLimit"],["l3","LowLimit"],["m0","DaysRange"],["m2","DaysRangeRealTime"],["m3","_50DayMovingAverage"],["m4","_200DayMovingAverage"],["m5","ChangeFrom200DayMovingAverage"],["m6","PercentChangeFrom200DayMovingAverage"],["m7","ChangeFrom50DayMovingAverage"],["m8","PercentChangeFrom50DayMovingAverage"],["n0","Name"],["n4","Notes"],["o0","Open"],["p0","PreviousClose"],["p1","PricePaid"],["p2","ChangeInPercent"],["p5","PricePerSales"],["p6","PricePerBook"],["q0","ExDividendDate"],["r0","PERatio"],["r1","DividendPayDate"],["r2","PERatioRealTime"],["r5","PEGRatio"],["r6","PricePerEPSEstimateCurrentYear"],["r7","PricePerEPSEstimateNextYear"],["s0","Symbol"],["s1","SharesOwned"],["s6","Revenue"],["s7","ShortRatio"],["t1","LastTradeTime"],["t7","TickerTrend"],["t8","_1YearTargetPrice"],["v0","Volume"],["v1","HoldingsValue"],["v7","HoldingsValueRealTime"],["w0","_52WeekRange"],["w1","DaysValueChange"],["w4","DaysValueChangeRealTime"],["x0","StockExchange"],["y0","DividendYield"]],n=function(a,n,s){var i=e.defer(),l=e.defer(),c=!1,d=void 0,h='select * from yahoo.finance.historicaldata where symbol = "'+a+'" and startDate = "'+n+'" and endDate = "'+s+'"',u="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK",v="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(h)+u;return t.jsonp(v,{timeout:l.promise}).success(function(e){var t=[];e.query.count>0&&(t=e.query.results.quote),0===e.query.count&&i.reject({error:"no data",message:"Did not receive data"}),r.cancel(d),l.reject(),i.resolve(t)}).error(function(e){i.reject(c?{error:"timeout",message:"Request took longer than "+o+"ms",data:e}:e)}),d=r(function(){c=!0,l.resolve()},o),i.promise},s=function(a){for(var n=e.defer(),s=e.defer(),i=!1,l=void 0,c=[],d=0,h=a.length;h>d;d++)c.push('"'+a[d]+'"');var u="select * from yahoo.finance.quote where symbol in ("+c.join(",")+")",v="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK",g="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(u)+v;return t.jsonp(g,{timeout:s.promise}).success(function(e){var t=[];e.query.count>0&&(t=e.query.results.quote),0===e.query.count&&n.reject({error:"no data",message:"Did not receive data"}),r.cancel(l),s.reject(),n.resolve(t)}).error(function(e){n.reject(i?{error:"timeout",message:"Request took longer than "+o+"ms",data:e}:e)}),l=r(function(){i=!0,s.resolve()},o),n.promise},i=function(n){for(var s=e.defer(),i=e.defer(),l=!1,c=void 0,d=n.join(","),h=[],u=[],v=0,g=a.length;g>v;v++){var p=a[v];h.push(p[0]),u.push(p[1])}h=h.join(""),u=u.join(",");var y="http://download.finance.yahoo.com/d/quotes.csv?s="+d+"&f="+h+"&e=.csv",f="select * from csv where url='"+y+"' and columns='"+u+"'",m="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK",C="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(f)+m;return t.jsonp(C,{timeout:i.promise}).success(function(e){0===e.query.count&&s.reject({error:"no data",message:"Did not receive data"}),r.cancel(c),i.reject(),s.resolve(e)}).error(function(e){s.reject(l?{error:"timeout",message:"Request took longer than "+o+"ms",data:e}:e)}),c=r(function(){l=!0,i.resolve()},o),s.promise},l=function(a,n,s,i){var l=e.defer(),c=e.defer(),d=!1,h=void 0,u=0,v="http://www.google.com/finance/getprices?q="+a+(null===n?"":"&x="+n)+"&i="+s+"&p="+i+"&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg",g='SELECT * FROM csv WHERE url="'+v+'"',p="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(g)+"&format=json&callback=JSON_CALLBACK";return t.jsonp(p,{timeout:c.promise}).success(function(e){var t=[],o=new Date,a=null!==e.query.results&&e.query.results.row.length>=7;if(e.query&&e.query.count>0&&a){var n=0;e.query.results.row[6]&&(n=parseInt(e.query.results.row[6].col0.replace("TIMEZONE_OFFSET=",""),10));for(var i=parseInt(e.query.results.row[7].col0.replace("a",""),10)+60*n,d=0,v=7;v<e.query.count;v++){"a"===e.query.results.row[v].col0[0]?(i=parseInt(e.query.results.row[v].col0.replace("a",""),10)+60*n,d=0):d=parseInt(e.query.results.row[v].col0,10);var g=new Date(1e3*(i+d*s+60*o.getTimezoneOffset()));if(g>u){var p=parseFloat(e.query.results.row[v].col1,10),y=[g,p];u=g,t.push(y)}}}0===t.length&&l.reject({error:"no data",message:"Did not receive data"}),r.cancel(h),c.reject(),l.resolve(t)}).error(function(e){l.reject(d?{error:"timeout",message:"Request took longer than "+o+"ms",data:e}:e)}),h=r(function(){d=!0,c.resolve()},o),l.promise},c=function(e,t,r){return l(e,null,t,r)};return{getHistoricalData:n,getLiveData:l,getLiveMarketData:c,getCurrentData:s,getCurrentDataWithDetails:i}}]),angular.module("stockWatcher.Filters").filter("percentage",["$filter",function(e){return function(t,r){function o(e){return!isNaN(e)&&isFinite(e)}var a=parseFloat(t,10);if(o(a)){var n=e("number")(a,r),s=n+"%";return s}return t}}]),angular.module("stockWatcher").run(["$templateCache",function(e){e.put("views/about-page.html","<h1>About</h1><div>About Page for <em>Angular StockWatcher</em> (Controller v.{{ controllerVersion }})</div>"),e.put("views/currency-page.html",'<h1>Currencies</h1><div>Currency Page for <em>Angular StockWatcher</em> (Controller v.{{ controllerVersion }})</div><div class="page-header"><h2>Canadian Dollar (CAD)</h2></div><div class="row"><div class="col-sm-6"><currency-chart from-currency="CAD" to-currency="USD"></currency-chart></div><div class="col-sm-6"><currency-chart from-currency="CAD" to-currency="EUR"></currency-chart></div></div><div class="page-header"><h2>US Dollar (USD)</h2></div><div class="row"><div class="col-sm-6"><currency-chart from-currency="USD" to-currency="CAD"></currency-chart></div><div class="col-sm-6"><currency-chart from-currency="USD" to-currency="EUR"></currency-chart></div></div>'),e.put("views/currencyChart-partial.html",'<div id="{{ containerID }}"></div>'),e.put("views/home-page.html",'<h1>Home</h1><div>Home Page for <em>Angular StockWatcher</em> (Controller v.{{ controllerVersion }})</div><div><stock-list></stock-list></div><div class="page-header"><h2>Charts</h2></div><div class="row"><div class="col-sm-6"><stock-chart symbol="PG"></stock-chart></div><div class="col-sm-6"><stock-chart symbol="T.TO"></stock-chart></div><div class="col-sm-6"><stock-chart symbol="BNS.TO"></stock-chart></div><div class="col-sm-6"><stock-chart symbol="TD.TO"></stock-chart></div></div><div class="row"><div class="col-sm-6"><market-chart-widget></market-chart-widget></div><div class="col-sm-6"><div class="page-header"><h2>Currencies</h2></div><currency-chart from-currency="CAD" to-currency="USD"></currency-chart></div></div>'),e.put("views/marketChart-partial.html",'<div ng-hide="chartIsInitialized"><div class="alert alert-info" role="alert"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate text-center"></span> <strong>Loading data...</strong> Chart will display soon.</div></div><div id="{{ containerID }}"></div>'),e.put("views/marketChartWidget-partial.html",'<div class="row"><div class="col-sm-12"><div class="page-header" style="margin-top: 20px;"><div class="row"><div class="col-sm-8"><h2>Market Indices</h2></div><div class="col-sm-4" style="margin-top: 20px;"><div class="dropdown text-right"><button class="btn btn-primary dropdown-toggle btn-sm" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Config <span class="caret"></span></button><ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu1"><li role="presentation" class="small"><a role="menuitem" tabindex="-1" href="javascript:;" ng-click="toggleTitle()"><span class="glyphicon" ng-class="{\'glyphicon-ok\': showTitle, \'glyphicon-none\': !showTitle}" aria-hidden="true"></span> Show Title</a></li><li role="presentation" class="small disabled"><a role="menuitem" tabindex="-1" href="javascript:;" ng-click="toggleZoom()"><span class="glyphicon" ng-class="{\'glyphicon-ok\': showZoom, \'glyphicon-none\': !showZoom}" aria-hidden="true"></span> Show Zoom</a></li><li role="presentation" class="small disabled"><a role="menuitem" tabindex="-1" href="javascript:;" ng-click="toggleDatePicker()"><span class="glyphicon" ng-class="{\'glyphicon-ok\': showDatePicker, \'glyphicon-none\': !showDatePicker}" aria-hidden="true"></span> Show Date Picker</a></li><li role="presentation" class="small"><a role="menuitem" tabindex="-1" href="javascript:;" ng-click="toggleNavigator()"><span class="glyphicon" ng-class="{\'glyphicon-ok\': showNavigator, \'glyphicon-none\': !showNavigator}" aria-hidden="true"></span> Show Navigator</a></li><li class="divider"></li><li role="presentation" class="small disabled"><a role="menuitem" tabindex="-1" href="#">Export Config</a></li><li role="presentation" class="small disabled"><a role="menuitem" tabindex="-1" href="#">Import Config</a></li></ul></div></div></div></div><market-chart fetch-tsx="true" fetch-dj="true"></market-chart></div></div>'),e.put("views/navigationBar-partial.html",'<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="#/">Angular StockWatcher</a></div><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-class="{active: controller == \'HomePageController\'}"><a href="#/">Home</a></li><li ng-class="{active: controller == \'CurrencyPageController\'}"><a href="#/currency">Currencies</a></li><li ng-class="{active: controller == \'AboutPageController\'}"><a href="#/about">About</a></li><li class="disabled"><a href="#contact">Contact</a></li><li class="dropdown disabled"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="#">Action</a></li><li><a href="#">Another action</a></li><li><a href="#">Something else here</a></li><li class="divider"></li><li class="dropdown-header">Nav header</li><li><a href="#">Separated link</a></li><li><a href="#">One more separated link</a></li></ul></li></ul></div></div></nav>'),e.put("views/quoteDetails-page.html",'<h1>Quote Details</h1><div>Quote Details Page for <em>Angular StockWatcher</em> (Controller v.{{ controllerVersion }})</div><div class="page-header"><h2>{{ stockData.Name }} ({{ stockData.Symbol }})</h2></div><div class="row"><div class="col-sm-4"><table class="table table-striped table-condensed"><tbody><tr><td><strong>Previous Close:</strong></td><td class="text-right">{{ stockData.PreviousClose | currency }}</td></tr><tr><td><strong>Open:</strong></td><td class="text-right">{{ stockData.Open | currency }}</td></tr><tr><td><strong>Currency:</strong></td><td class="text-right">{{ stockData.Currency }}</td></tr><tr><td><strong>Bid (Real-time):</strong></td><td class="text-right">{{ stockData.BidRealTime | currency }}</td></tr><tr><td><strong>Ask (Real-time):</strong></td><td class="text-right">{{ stockData.AskRealTime | currency }}</td></tr><tr><td><strong>1-Year Target Estimate:</strong></td><td class="text-right">{{ stockData._1YearTargetPrice | currency }}</td></tr><tr><td><strong>Day\'s Range:</strong></td><td class="text-right">{{ stockData.DaysLow | currency }} - {{ stockData.DaysHigh | currency }}</td></tr><tr><td><strong>52-Week Range:</strong></td><td class="text-right">{{ stockData._52WeekLow | currency }} - {{ stockData._52WeekHigh | currency }}</td></tr><tr><td><strong>Volume:</strong></td><td class="text-right">{{ stockData.Volume | number }}</td></tr><tr><td><strong>Average Daily Volume:</strong></td><td class="text-right">{{ stockData.AverageDailyVolume | number }}</td></tr><tr><td><strong>Market Capitalization:</strong></td><td class="text-right">{{ stockData.MarketCapitalization }}</td></tr><tr><td><strong>P/E (ttm) (Real-time):</strong></td><td class="text-right">{{ stockData.PERatioRealTime }}</td></tr><tr><td><strong>EPS (ttm):</strong></td><td class="text-right">{{ stockData.EarningsPerShare }}</td></tr><tr><td><strong>Last Trade Date:</strong></td><td class="text-right">{{ stockData.LastTradeDate }}</td></tr><tr><td><strong>Ex-Dividend Date:</strong></td><td class="text-right">{{ stockData.ExDividendDate }}</td></tr><tr><td><strong>Dividend Pay Date:</strong></td><td class="text-right">{{ stockData.DividendPayDate }}</td></tr><tr><td><strong>Dividend Yield:</strong></td><td class="text-right">{{ stockData.DividendYield }}</td></tr></tbody></table></div><div class="col-sm-8"><stock-chart symbol="{{ $location.path().replace(\'/quote/\', \'\') }}"></stock-chart></div></div>'),e.put("views/stockChart-partial.html",'<div id="{{ containerID }}"></div>'),e.put("views/stockList-partial.html",'<div class="page-header"><div class="row"><div class="col-sm-8"><h2>Watchlist</h2></div><div class="col-sm-4"><form class="form-horizontal" role="form"><div class="form-group form-group-sm"><label class="col-sm-8 control-label" for="refreshInterval">Refresh interval:</label><div class="col-sm-4"><select id="refreshInterval" class="form-control" ng-model="refreshInterval" ng-change="refreshIntervalChanged()"><option value="30">30 sec</option><option value="60">60 sec</option><option value="300">5 min</option><option value="900">15 min</option></select></div></div></form></div></div></div><div class="row"><table class="table table-striped table-condensed"><thead><tr><th ng-click="sortOrder = \'index\'; sortReversed = !sortReversed;"># <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'index\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'index\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.Symbol\'; sortReversed = !sortReversed;">Symbol <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.Symbol\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.Symbol\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.Name\'; sortReversed = !sortReversed;">Name <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.Name\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.Name\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.LastTradePriceOnly\'; sortReversed = !sortReversed;">Trade Price <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.LastTradePriceOnly\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.LastTradePriceOnly\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.Change\'; sortReversed = !sortReversed;">Change <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.Change\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.Change\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.ChangeInPercent\'; sortReversed = !sortReversed;">% Change <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.ChangeInPercent\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.ChangeInPercent\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.DividendYield\'; sortReversed = !sortReversed;">Yield <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.DividendYield\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.DividendYield\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.PERatio\'; sortReversed = !sortReversed;">P/E <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.PERatio\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.PERatio\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.EarningsPerShare\'; sortReversed = !sortReversed;">EPS <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.EarningsPerShare\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.EarningsPerShare\' && sortReversed === true}" aria-hidden="true"></span></th><th colspan="2" ng-click="sortOrder = \'liveData._52WeekLow\'; sortReversed = !sortReversed;">52 week-Range <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData._52WeekLow\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData._52WeekLow\' && sortReversed === true}" aria-hidden="true"></span></th><th ng-click="sortOrder = \'liveData.StockExchange\'; sortReversed = !sortReversed;">Ex <span class="glyphicon-lighter small" ng-class="{\'glyphicon glyphicon-chevron-up\' : sortOrder === \'liveData.StockExchange\' && sortReversed === false, \'glyphicon glyphicon-chevron-down\' : sortOrder === \'liveData.StockExchange\' && sortReversed === true}" aria-hidden="true"></span></th><th>See more</th></tr></thead><tbody><tr stock-list-item ng-repeat="quote in stockQuotes | orderBy:sortOrder:sortReversed" quote="quote"></tr></tbody></table></div>'),e.put("views/stockListItem-partial.html",'<td class="text-right">{{ quote.index + 1 }}</td><td>{{ quote.liveData.Symbol }}</td><td>{{ quote.liveData.Name }}</td><td class="text-right">{{ quote.liveData.LastTradePriceOnly | currency }} {{ quote.liveData.Currency }}</td><td class="text-right" ng-class="isGain() ? \'text-success\' : (isLoss() ? \'text-danger\' : \'\')">{{ quote.liveData.Change | currency }}</td><td class="text-right" ng-class="isGain() ? \'text-success\' : (isLoss() ? \'text-danger\' : \'\')">{{ quote.liveData.ChangeInPercent | percentage:2 }}</td><td class="text-right">{{ quote.liveData.DividendYield | percentage:2 }}</td><td class="text-right">{{ quote.liveData.PERatio }}</td><td class="text-right">{{ quote.liveData.EarningsPerShare | number:2 }}</td><td class="text-right">{{ quote.liveData._52WeekLow | currency }}</td><td class="text-right">{{ quote.liveData._52WeekHigh | currency }}</td><td>{{ quote.liveData.StockExchange }}</td><td><a href="#/quote/{{ quote.yahooSymbol }}" class="btn btn-default btn-xs" role="button" title="See details about {{ quote.symbol }}"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Details</a></td>')
}]);