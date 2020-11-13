var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var util = require("util");
var rp = require('request-promise');
var moment = require('moment');
var request = require('request');
var app = express();

var futuresListEng = [["HangSeng Index Futures and Options (Including Flexible Index Options)",
						"Mini-HangSeng Index Futures and Options",
						"HangSeng China Enterprises Index Futures and Options (Including Flexible Index Options)",
						"Mini-HangSeng China Enterprises Index Futures and Options","HangSeng Index Total Return Index Futures ",
						"HangSeng China Enterprises Index Total Return Index Futures",
						"StockFutures and Options","SectorIndex Futures"
						],
						["WeeklyHang Seng Index Options",
						"WeeklyHang Seng China Enterprises Index Options"
						],
						["HSIDividend Point Index Futures",
						"HSCEIDividend Point Index Futures"
						],
						["HSIVolatility Index Futures"
						],
						["MSCIAC Asia ex Japan Net Total Return Index Futures"],
						["MSCI Australia Net Total Return (USD) Index Futures",
"MSCI China Free Net Total Return (USD) Index Futures",
"MSCI EM Asia ex China Net Total Return (USD) Index Futures",
"MSCI EM Asia ex Korea Net Total Return (USD) Index Futures",
"MSCI EM Asia Net Total Return (USD) Index Futures",
"MSCI EM EMEA Net Total Return (USD) Index Futures",
"MSCI EM ex China Net Total Return (USD) Index Futures",
"MSCI EM ex Korea Net Total Return (USD) Index Futures",
"MSCI EM LatAm Net Total Return (USD) Index Futures",
"MSCI Emerging Markets (USD) Index Futures",
"MSCI Emerging Markets Net Total Return (USD) Index Futures",
"MSCI Hong Kong Net Total Return (USD) Index Futures",
"MSCI India Net Total Return (USD) Index Futures",
"MSCI Indonesia Net Total Return (USD) Index Futures",
"MSCI Japan Net Total Return (JPY) Index Futures",
"MSCI Japan Net Total Return (USD) Index Futures",
"MSCI Malaysia Net Total Return (USD) Index Futures",
"MSCI New Zealand Net Total Return (USD) Index Futures",
"MSCI Pacific ex Japan Net Total Return (USD) Index Futures",
"MSCI Pacific Net Total Return (USD) Index Futures",
"MSCI Philippines Net Total Return (USD) Index Futures",
"MSCI Singapore Free Net Total Return (USD) Index Futures",
"MSCI Singapore Net Total Return (USD) Index Futures",
"MSCI Taiwan Net Total Return (USD) Index Futures",
"MSCI Taiwan 25/50 Net Total Return (USD) Index Futures",
"MSCI Thailand Net Total Return (USD) Index Futures",
"MSCI Vietnam Net Total Return (USD) Index Futures"],
						["MSCI China Free (USD) Index Futures"],
						["MSCI India (USD) Index Futures"],
						["MSCI Indonesia (USD) Index Futures"],
						["MSCI Japan (JPY) Index Futures"],
						["MSCI Malaysia (USD) Index Futures"],
						["MSCI Philippines (USD) Index Futures"],
						["MSCI Singapore Free (SGD) Index Futures"],
						["MSCI Taiwan (USD) Index Futures",
							"MSCI Taiwan 25/50 (USD) Index Futures"],
							["MSCI Thailand (USD) Index Futures"],
							["MSCI Vietnam (USD) Index Futures"],
						["CESChina 120 Index Futures"],
						["-IBOVESPA Futures "],["-MICEX Index Futures"],["-FTSE/JSE Top40 Futures"],["One-MonthHIBOR Futures","Three-MonthHIBOR Futures ","USD/CNHFuturesand Options"],["EUR/CNHFutures","JPY/CNHFutures","AUD/CNHFutures","CNH/USDFutures"],["USD& CNH London Aluminium/Zinc/Copper/Nickel/Tin/LeadMini Futures"],["USD& CNH Gold Futures"],["IronOreFutures"]]
var futuresListSc = [["恒生指数期货及期权(包括自订条款指数期权)","小型恒生指数期货及期权","恒生中国企业指数期货及期权(包括自订条款指数期权)","小型恒生中国企业指数期货及期权","恒生指数股息累计指数期货","恒生中国企业指数股息累计指数期货","股票期货及期权","行业指数期货"],["每周恒生指数期权","每周恒生中国企业指数期权"],["恒指股息点指数期货","恒生国企股息点指数期货"],["恒指波幅指數期货"],["MSCI亚洲除日本净总回报指数期货"],
						["MSCI 澳洲净总回报（美元）指数期货",
						"MSCI 中国自由净总回报（美元）指数期货",
						"MSCI 新兴市场亚洲除中国净总回报（美元） 指数期货",
						"MSCI 新兴市场亚洲除韩国净总回报（美元）指数期货",
						"MSCI 新兴市场亚洲净总回报（美元）指数期货",
						"MSCI 新兴市场欧非中东净总回报（美元）指数期货",
						"MSCI 新兴市场除中国净总回报（美元）指数期货",
						"MSCI 新兴市场除韩国净总回报（美元）指数期货",
						"MSCI 新兴市场拉丁美洲净总回报（美元）指数期货",
						"MSCI 新兴市场（美元）指数期货",
						"MSCI 新兴市场净总回报（美元）指数期货",
						"MSCI 香港净总回报（美元）指数期货",
						"MSCI 印度净总回报（美元）指数期货",
						"MSCI 印尼净总回报（美元）指数期货",
						"MSCI 日本净总回报（日元）指数期货",
						"MSCI 日本净总回报（美元）指数期货",
						"MSCI 马来西亚净总回报（美元）指数期货",
						"MSCI 新西兰净总回报（美元）指数期货",
						"MSCI 太平洋除日本净总回报（美元）指数期货",
						"MSCI 太平洋净总回报（美元）指数期货",
						"MSCI 菲律宾净总回报（美元）指数期货",
						"MSCI 新加坡自由净总回报（美元）指数期货",
						"MSCI 新加坡净总回报（美元）指数期货",
						"MSCI 台湾净总回报（美元）指数期货",
						"MSCI 台湾25/50净总回报（美元）指数期货",
						"MSCI 泰国净总回报（美元）指数期货",
						"MSCI 越南净总回报（美元）指数期货"],
						["MSCI 中国自由（美元）指数期货"],
						["MSCI 印度（美元）指数期货"],
						["MSCI 印尼（美元）指数期货"],
						["MSCI 日本（日元）指数期货"],
						["MSCI 马来西亚（美元）指数期货"],
						["MSCI 菲律宾（美元）指数期货"],
						["MSCI 新加坡自由（新加坡元）指数期货"],
						["MSCI 台灣（美元）指數期貨",
							"MSCI 台灣 25/50（美元）指數期貨"],
						["MSCI 泰國（美元）指數期貨"],
						["MSCI 越南（美元）指數期貨"],
						["中华交易服务中国120 指数期货"],["-IBOVESPA期货"],["-MICEX指数期货"],["-FTSE/JSE Top40期货"],["一个月港元利率期货","三个月港元利率期货","美元兑人民币(香港)期货及期权"],["欧元兑人民币(香港)期货","日圆兑人民币(香港)期货","澳元兑人民币(香港)期货","人民币(香港)兑美元期货"],["美元及人民币(香港)伦敦铝/锌/铜/镍/锡/铅期货小型合约"],["美元及人民币(香港)黄金期货合约"],["铁矿石期货"]]

app.get('/calendar/:type', function(req, res){
	console.log(futuresListEng[0][0]);
	url = 'https://www.hkex.com.hk/Services/Trading/Derivatives/Overview/Trading-Calendar-and-Holiday-Schedule?sc_lang=zh-HK';
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

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
				
				if(array.length > 0){
					futuresList.push(array);
				}
				delete futuresList[13];
				delete futuresList[14];
				delete futuresList[16];
				delete futuresList[17];
				var filterList = futuresList.filter(n => n);
			}

			const result = []; // Create Object
			const table_migrate = $(".table.migrate");

			var index = 0;
			for (var i = 0; i < filterList.length; i++) {
				for (var j = 0; j < filterList[i].length; j++){
					var descTc = filterList[i][j];
					// console.log("[" + i + "][" + j + "]" + descTc);
					var descEn = futuresListEng[i][j];
					// console.log("descEn: " + descEn);
					var descSc = futuresListSc[i][j];
					// console.log("descSc: " + descSc);
					 // console.log("[" + i + "][" + j + "]" + descTc);
					var trLength = table_migrate.eq(index).find('tr').length;
					if(trLength == '0'){
						while (trLength <= 0) {
							index++;
							trLength = table_migrate.eq(index).find('tr').length;
						}
					}
					if ("LTDay" == [req.params.type]){
						for (let z = 1; z < trLength; z++) {
							var date = table_migrate.eq(index).find('tr').eq(z).find('td').eq(1).text();
							var lastTradingDate =  moment(date, 'YYYY年M月D日', 'en', true).format('YYYYMMDD');
							result.push(Object.assign({ descTc, descEn, descSc, lastTradingDate }));
						}
					} else if("FSDay" == [req.params.type]){
						for (let z = 1; z < trLength; z++) {
							var date = table_migrate.eq(index).find('tr').eq(z).find('td').eq(2).text();
							var finalSettlementDate =  moment(date, 'YYYY年M月D日', 'en', true).format('YYYYMMDD');
							result.push(Object.assign({ descTc, descEn, descSc, finalSettlementDate }));
						}
					}

				}
				index++;
			}

			function SortByDate(a, b) {
				var a1 = moment("LTDay" == [req.params.type] ? a.lastTradingDate : a.finalSettlementDate, 'YYYYMMDD', 'en', true).format('YYYY-MM-DD');
				var b1 = moment("LTDay" == [req.params.type] ? b.lastTradingDate : b.finalSettlementDate, 'YYYYMMDD', 'en', true).format('YYYY-MM-DD');
			   	
				// var a1 = moment(a.lastTradingDate, 'YYYYMMDD', 'en', true).format('YYYY-MM-DD');
				// var b1 = moment(b.lastTradingDate, 'YYYYMMDD', 'en', true).format('YYYY-MM-DD');
			   	return new Date(a1).getTime() - new Date(b1).getTime();

			}

			result.sort(SortByDate);

			res.json(result);
		}
	})
})

app.get('/calendar_en', function(req, res){

	url = 'https://www.hkex.com.hk/Services/Trading/Derivatives/Overview/Trading-Calendar-and-Holiday-Schedule?sc_lang=en';
	request(url, function(error, response, html){
		if(!error){
			// console.log(html);
			var $ = cheerio.load(html);
			// console.log(array);

			const futuresList = [];
			const eng = [];
			for (let i = 1; i < 50; i++) {
				const name = $(".common_panel_content p").eq(i).text();
				var array = name.split('\n').map(function(item){
					return item
							.replace('Last Trading Day / Expiry Day and Final Settlement Day', '')
							.replace('Last Trading Day and Final Settlement Day', '')
							.replace(' ', '')
							.replace('  ', '')
							.replace(' ', '')
							.replace('*Note: There would be no Weekly Index Options contracts with Expiry Date in this week.', '')
							.replace('*Note:There would be no Weekly Index Options contracts with Expiry Date in this week.', '')
							.replace('Note:Subject to the official announcement of Mainland China public holiday, the might be revised accordingly.', '')
							.replace('Note:Subject to the official announcement of Last Trading Days schedule by BRICS Exchanges, themight be revised accordingly.', '')
							.replace('Note:If London Metal Exchange revises its schedule for Last Trading Days, theat HKFE might be revised accordingly.', '')
							.replace('HolidaySchedule', '')
							.replace('Futures&Index Options', '')
							.replace('Notes:', '')
							.replace('Therewill be no afternoon trading session and after-hours trading session on the following business day:', '')
							.replace('4February2019 (Monday) – Eve of Lunar New Year', '')
							.replace('24December 2019 (Tuesday) – Eve of Christmas Day ', '')
							.replace('31December 2019 (Tuesday) – Eve of New Year', '')
							.replace('BRICSFutures', '');
				});


				array = array.filter(n => n);
				if(array.length > 0){
					futuresList.push(array);
					// futuresList.push(Object.assign({ descEn }));
				}
			}
			for (let i = 0; i < futuresList.length; i++) {
					var descEn = futuresList[i];
					eng.push(descEn);
			}
			res.send(eng);
		}
	})
})

app.get('/calendar_cn', function(req, res){

	url = 'https://sc.hkex.com.hk/TuniS/www.hkex.com.hk/services/trading/derivatives/overview/trading-calendar-and-holiday-schedule?sc_lang=zh-cn';
	request(url, function(error, response, html){
		if(!error){
			// console.log(html);
			var $ = cheerio.load(html);
			// console.log(array);

			const futuresList = [];
			const sc = [];
			for (let i = 1; i < 50; i++) {
				const name = $(".common_panel_content p").eq(i).text();
				var array = name.split('\n').map(function(item){
					return item
							.replace('最后交易日/到期日及最后结算日', '')
							.replace('*注:该周的到期日没有推出每周指数期权合约。', '')
							.replace(' ', '')
							.replace('  ', '')
							.replace(' ', '')
							.replace('最后交易日及最后结算日', '')
							.replace('注:如伦敦金属交易所更改其最后交易日，期交所将因应其更改而修订最后交易日及结算日。', '')
							.replace('备注：', '')
							.replace('假期表', '')
							.replace('期货及指数期权', '')
							.replace('金砖市场期货', '')
							.replace('注:可能因应中国内地公众假期之正式公布而作出修订。', '')
							.replace('*注:该周的到期日没有推出每周指数期权合约。', '')
							.replace('以下交易日将会没有午市交易时段及没有收市后交易时段：', '')
							.replace('注:可能因应金砖市场交易所的最后交易日之正式公布而作出修订。', '')
							.replace('2020年1月', '');
				});


				array = array.filter(n => n);
				if(array.length > 0){
					futuresList.push(array);
					// futuresList.push(Object.assign({ descEn }));
				}
			}
			for (let i = 0; i < futuresList.length; i++) {
					var descEn = futuresList[i];
					sc.push(descEn);
			}
			res.send(sc);
		}
	})
})

app.listen(3000)

console.log('app is listening at localhost:3000...');

exports = module.exports = app;
