var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var util = require("util");
var rp = require('request-promise');
var moment = require('moment');
var request = require('request');
var app = express();

app.get('/calendar', function(req, res){

	url = 'https://www.hkex.com.hk/Services/Trading/Derivatives/Overview/Trading-Calendar-and-Holiday-Schedule?sc_lang=zh-HK';
	request(url, function(error, response, html){
		if(!error){
			// console.log(html);
			var $ = cheerio.load(html);
			// console.log(array);

			const futuresList = [];
			for (let i = 1; i < 50; i++) {
				const name = $(".common_panel_content p strong").eq(i).text();
				var array = name.split('\n').map(function(item){
					return item
							.replace('最後交易日/到期日及最後結算日', '')
							.replace('最後交易日及最後結算日', '')
							.replace(' ', '')
							.replace('、', '')
							.replace(' ', '')
							.replace('每周', '')
							.replace('假期表', '')
							.replace('期貨及指數期權', '');
				});
				if (name == "金磚市場期貨") {
					array = [];
					const BRICS_Futures = [];
					for (let i = 0; i < 10; i++) {
						const BRICS_Futures = $(".common_panel_content p.spanHeading span.spanHeading").eq(i).text();
						var BRICS_array = BRICS_Futures.split("-").map(function(item){
						return item
								.replace('最後交易日/到期日及最後結算日', '')
								.replace('最後交易日及最後結算日', '');
						});
						BRICS_array = BRICS_array.filter(n => n);
						if(BRICS_array.length > 0){
							futuresList.push(BRICS_array);
						}
					}
				}

				array = array.filter(n => n);
				// array.splice(2, 0, "Lene");
				// console.log(array.join());
				
				if(array.length > 0){
					futuresList.push(array);
					// console.log(array);
				}
				delete futuresList[13];
				delete futuresList[14];
				delete futuresList[16];
				delete futuresList[17];
				var filterList = futuresList.filter(n => n);
			}
			console.log(filterList);
			console.log('length: ' + filterList.length)

			const result = []; // Create Object
			const table_migrate = $(".table.migrate");

			var index = 0;
			for (var i = 0; i < filterList.length; i++) {
				console.log('index:' + index);
				for (var j = 0; j < filterList[i].length; j++){
					var descTc = filterList[i][j];
					// console.log("[" + i + "][" + j + "]" + descTc);
					var trLength = table_migrate.eq(index).find('tr').length;
					if(trLength == '0'){
						while (trLength <= 0) {
							index++;
							trLength = table_migrate.eq(index).find('tr').length;
						}
					}
					for (let z = 1; z < trLength; z++) {
						var date = table_migrate.eq(index).find('tr').eq(z).find('td').eq(1).text();
						var LastTradingDate =  moment(date, 'YYYY年M月D日', 'en', true).format('YYYYMMDD');;
						result.push(Object.assign({ descTc, LastTradingDate }));
					}
				}
				index++;
			}
			
			request('http://127.0.0.1:8081/calendar_en', function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			    	var array_en = body;
			        console.log(array_en[0][1]);
			     }
			})
			res.json(result);
		}
	})
})

app.get('/calendar_en', function(req, res){

	url = 'https://www.hkex.com.hk/Services/Trading/Derivatives/Overview/Trading-Calendar-and-Holiday-Schedule?sc_lang=zh-en';
	request(url, function(error, response, html){
		if(!error){
			// console.log(html);
			var $ = cheerio.load(html);
			// console.log(array);

			const futuresList = [];
			for (let i = 1; i < 50; i++) {
				const name = $(".common_panel_content p").eq(i).text();
				var array = name.split('\n').map(function(item){
					return item
							.replace('Last Trading Day / Expiry Day and Final Settlement Day', '')
							.replace('Last Trading Day and Final Settlement Day', '')
							.replace(' ', '')
							.replace('  ', '')
							.replace('*Note: There would be no Weekly Index Options contracts with Expiry Date in this week.', '');
				});
				if (name == "BRICS Futures") {
					array = [];
					const BRICS_Futures = [];
					for (let i = 0; i < 10; i++) {
						const BRICS_Futures = $(".common_panel_content p.spanHeading span.spanHeading").eq(i).text();
						var BRICS_array = BRICS_Futures.split("-").map(function(item){
						return item
							.replace('Last Trading Day / Expiry Day and Final Settlement Day', '')
							.replace('Last Trading Day and Final Settlement Day', '')
							.replace(' ', '')
							.replace('  ', '')
							.replace(' ', '')
							.replace('*Note: There would be no Weekly Index Options contracts with Expiry Date in this week.', '');
						});
						BRICS_array = BRICS_array.filter(n => n);
						if(BRICS_array.length > 0){
							futuresList.push(BRICS_array);
							// console.log(BRICS_array);
						}
					}
				}

				array = array.filter(n => n);
				// array.splice(2, 0, "Lene");
				// console.log(array.join());
				if(array.length > 0){
					futuresList.push(array);
					// console.log(array);
				}
			}
			console.log(futuresList);

			const result = []; // Create Object
			res.send(futuresList);
		}
	})
})

app.listen(3000)

console.log('app is listening at localhost:3000...');

exports = module.exports = app;
