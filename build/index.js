var http = require('http');
var cheerio = require('cheerio');
var moment = require('moment');
var request = require('request');

var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = function (event, context) {
    const strSplitChar = "~";
    let headers = {
        'Referer': "http://hsmoa.com/?date=20171227",
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
        'Content-Type': 'text/html; charset=utf-8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    };
    let moa, messageBody, message_param, target_date, crawl_turn, expire_option ;
    // messageBody = {
    //     init_date -> 시작날짜
    //     execute_date -> 현재 크롤링 될 날짜
    //     offset -> 시작날짜로 부터 경과 일 수 (offset 6 이하면 메세지 전송)
    // }

    if(event.date == undefined && event.Records == undefined){ // cloudWatch Trigger

        moa = 'http://hsmoa.com/';
        message_param = {
            init_date : moment().add(9, 'hours').format("YYYYMMDD"),
            execute_date : moment().add(9, 'hours').add(1, 'days').format("YYYYMMDD"),
            crawl_turn : moment().add(9, 'hours').format('HH'),
            offset : 1
        }

        target_date = moment().add(9, 'hours').format('YYYYMMDD');
        crawl_turn = message_param.crawl_turn;
        expire_option = false;

    }else if(event.Records){ // receive Queue Message

        messageBody = JSON.parse(event.Records[0].body);
        moa = `http://hsmoa.com/?site=&cate=&date=${messageBody.execute_date}`;
        message_param = {
            init_date : messageBody.init_date,
            execute_date : moment(messageBody.init_date, 'YYYYMMDD')
                            .add(parseInt(messageBody.offset)+1, 'days').format("YYYYMMDD"),
            crawl_turn : messageBody.crawl_turn,
            offset : messageBody.offset + 1
        }

        target_date = messageBody.execute_date;
        crawl_turn = messageBody.crawl_turn;
        expire_option = true;

    }else{ //테스트 코드 실행

        moa = `http://hsmoa.com/?site=&cate=&date=${event.date}`;
        
        message_param = {
            init_date : moment().add(9, 'hours').format('YYYYMMDD'),
            execute_date : moment().add(9, 'hours').format('YYYYMMDD'),
            crawl_turn : moment().add(9, 'hours'),
            offset : 100
        }

        target_date = event.date;
        // crawl_turn = moment().add(9, 'hours');
        crawl_turn = "23";
        expire_option = false;
    }

    console.log(`${target_date} ---- 크롤링 시작`);
    console.log(moa);

    request({
        url: moa,
        headers: headers,
        method: "GET",
        json: true

    }, function (error, response, data) {
        parseHtml(data, function(){
            if(message_param.offset < 7 ){
                let queueUrl = 'https://sqs.ap-northeast-2.amazonaws.com/592500281728/hsmoaDailyCrawlQueue';
                let params = {
                    MessageBody : JSON.stringify(message_param),
                    QueueUrl : queueUrl
                }

                setTimeout(function(){
                    console.log('메세지 전송');
                    console.log(`message :  ${JSON.stringify(message_param)}`);
                    sendToQueue(params);
                },10000);

            }else{
                console.log('배치 종료');
            }
        });
    });

    


    function sendToQueue(params){
        sqs.sendMessage(params, function(err, data) {
            if (err) {
                console.log('error:', "failed to send message" + err);
                var responseCode = 500;
            } else {
                console.log('send message...!!');
            }
        });
    }


    function getTime(time) {
        return time.replace(/\n/gi, '').replace(/\t/gi, '').replace(/ /gi, '');
    }

    function currentDate() {
        return moment().add(9, 'hours').format("YYYY-MM-DD");
    }

    function dateFormatter(date) {
        if (date !== undefined) {
            return date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
        } else {
            return date;
        }

    }

    function currentTime() {
        now = new Date();

        hour = "" + (now.getHours() + 9 > 24 ? (now.getHours() + 9) - 24 : (now.getHours() + 9));

        if (hour.length == 1) { hour = "0" + hour; }

        minute = "" + now.getMinutes();

        if (minute.length == 1) { minute = "0" + minute; }

        return hour + ":" + minute;

    }

    var time = currentTime();

    function getStartEndTime(timestr, item) {
        return new Promise(async (resolve, reject) => {
            let time_set = {};
            if (timestr.indexOf('현재방송중') > -1) {
                let date = moment().format('YYYY-MM-DD');
                let turn = moment().add(8, 'hours').format('HH');
                if (turn == "23") {
                    date = moment().add(-1, 'days').format('YYYY-MM-DD');
                }
                time_set = await getPrevTurnTime(date, item, turn);
            } else {
                timestr = timestr.replace(/시/g, ':').replace(/분/g, '').split('~');
                time_set = {
                    start: timestr[0],
                    end: timestr[1]
                }
            }
            resolve(time_set);
        })
    }

    function getStartTime(timestr, item) {

        if (timestr.indexOf('현재방송중') > -1) {
            let date = moment().format('YYYY-MM-DD');
            let turn = moment().add(8, 'hours').format('HH');

            getPrevDataTime(date, item, turn);
            // return time;
        };
        var index = timestr.indexOf(strSplitChar);
        var startTime = timestr.substr(0, index).replace('시', ':').replace('분', '');

        return startTime.indexOf(':') == 1 ? ("0" + startTime) : startTime;
    }

    function getEndTime(timestr) {
        if (timestr.indexOf('현재방송중') > -1) return time;

        var index = timestr.indexOf(strSplitChar) + 1;
        var endTime = timestr.substr(index, timestr.length).replace('시', ':').replace('분', '');

        return endTime.indexOf(':') == 1 ? ("0" + endTime) : endTime;
    }


    function getPrevTurnTime(date, item, turn) {
        return new Promise(async (resolve, reject) => {
            let params = {
                TableName : "CrawlHsmoaSchedule",
                IndexName: "date-crawl_turn-index",
                KeyConditionExpression : "#d = :d and crawl_turn = :t",
                FilterExpression: "#i = :i",
                ExpressionAttributeNames : {
                    "#d" : "date",
                    "#i" : "item"
                },
                ExpressionAttributeValues: {
                    ":d" : date,
                    ":i" : item,
                    ":t" : turn
                }
              }

            let param = {};
            
            dynamo.query(params, function(err, data){
                if(err){
                  console.log('에러',err);
                  reject();
                }else{

                    if(data.Count <= 0){
                        param = {
                            start : moment().add(9, 'hours').add(-30, 'minutes').format('HH:mm'),
                            end : moment().add(9, 'hours').add(30, 'minutes').format('HH:mm'),
                            flag : '이전 스냅샷에 없음!'
                        }
                    }else{
                        param = { 
                            start : data.Items[0].start_time,
                            end : data.Items[0].end_time,
                            flag : '검색성공!'
                        }
                    }
                    resolve(param);
                }
            });
        })
    };

    async function putItemToDynamo(item_arr, callback) {
        // const DB = "CrawlHsmoaSchedule";
        // let count = item_arr.length - item_arr.length % 20;
        let count = Math.ceil(item_arr.length/20);
        for (let i = 0; i < count; i++) {
            let batch = {
                "RequestItems": {
                    "CrawlHsmoaSchedule": []
                }
            }

            if (item_arr.length > 0) {
                batch.RequestItems["CrawlHsmoaSchedule"] = item_arr.splice(0, 20);
                try {
                    var data = await dynamo.batchWriteItem(batch).promise();
                    // console.log(batch.RequestItems.CrawlHsmoaSchedule[0]);
                } catch (e) {
                    console.log('DB 적재 에러 발생');
                    let list = '';

                    for(let i = 0; i < batch.RequestItems.CrawlHsmoaSchedule.length; i ++ ){
                        list += JSON.stringify(batch.RequestItems.CrawlHsmoaSchedule[i]);
                        console.log(JSON.stringify(batch.RequestItems.CrawlHsmoaSchedule[i]));
                    }
                    console.log(e);

                    let message = 
                        `# **DB 적재 에러 발생**
                         ${list}

                         **Error Log**
                         > ${e}
                        `
                    makeErrorReportWorkplace(message);

                    if(e.code=="ValidationException" && e.message.indexOf('duplicates') > -1){
                        let keys = batch.RequestItems.CrawlHsmoaSchedule.map((item) => {
                            return item.PutRequest.Item['turn-start-shop'];
                        })
                        
                        let duplicates = getDuplicates(keys);
                        let number = Object.keys(duplicates).length;
            
                        for(let j = 0; j < number; j++){
                            let k = batch.RequestItems.CrawlHsmoaSchedule.map((item) => {
                                return item.PutRequest.Item['turn-start-shop'];
                            })
                        
                            let d = getDuplicates(k);
                            seekDup(batch.RequestItems.CrawlHsmoaSchedule, d[Object.keys(d)[0]])
                        }

                        try{
                            await dynamo.batchWriteItem(batch).promise();
                            let message = `******Dupliate 디버깅 성공*****`;
                            console.log('duplicate 처리 완료');
                            makeErrorReportWorkplace(message);
                        }catch(e){
                            console.log('Duplicate 디버깅 오류');
                            console.log(e);
                            let message = `Dupliate 디버깅 에러`;
                            makeErrorReportWorkplace(message);

                            for(let i = 0; i < batch.RequestItems.CrawlHsmoaSchedule.length; i ++ ){
                                console.log(JSON.stringify(batch.RequestItems.CrawlHsmoaSchedule[i]));
                            }
                            return;
                        }
                    }
                }
                // console.log(i + " : " + batch.RequestItems["CrawlHsmoaSchedule"].length);
            }
        }
        console.log(`${target_date} --- 크롤링 & DB 적재 완료`);
        callback();
        // console.log("길이:::::::::::", item_arr.length);
    }

    function seekDup(arr, t){
        console.log(t);
        for(let i = t.length - 1; i >= 0; i--){
            console.log(arr[t[i]].PutRequest.Item['link']);
            if(arr[t[i]].PutRequest.Item['link'].indexOf('video') > -1){
                console.log(`삭제 대상 : ${arr[t[i]].PutRequest.Item['link']}`);
                arr.splice(t[i],1);
            }
        }
    }
    
    function getDuplicates(arr) {
        var duplicates = {};
        for (var i = 0; i < arr.length; i++) {
            if(duplicates.hasOwnProperty(arr[i])) {
                duplicates[arr[i]].push(i);
            } else if (arr.lastIndexOf(arr[i]) !== i) {
                duplicates[arr[i]] = [i];
            }
        }
    
        return duplicates;
    };

    async function parseHtml(body, callback) {
        var $ = cheerio.load(body);
        // return body;
        var timeline = $('div.timeline-group').find('.timeline-item');
        console.log('??');
        let arr = await (function(){
            return new Promise( async (resolve, reject) => {
                let item_arr = [];
                // timeline.each(async function (inx, div) {
                for(let i = 0; i < timeline.length; i ++){
                    var div = timeline[i];
                    let lower = $(div).find('.sametime-block');
        
                    var category = $(div).attr('class').split(" ")[2];
                    var link = $(div).find('a.disblock').attr('href');
                    var thumbnail = $(div).find('div.display-table').find('div.table-cell').eq(0).find('>img').data("src");
                    var tc = $(div).find('div.display-table').find('div.table-cell').eq(2);
                    var shop = $(tc).children('img').attr('src').replace('http://cache.m.ui.hsmoa.com/media/hsmoa/logo/logo_', '').replace('.png', '');
                    var spans = $(tc).find('span');
                    div = $(tc).find('div[class^="font-"]');
                    var timestr = getTime($(spans).eq(1).text());
        
                    let item_name = div.text().trim();
                    let time_set = await getStartEndTime(timestr, item_name);
                    var start_time = time_set.start;
                    var end_time = time_set.end;
        
                    let arr = [];
                    let create_time = moment().unix();

                    if ($(lower).length > 0) {
                        let items = $(lower).find('.sametime-item');
                        items.each((idx, item) => {
                            let name = $(item).find('.font-13').text();
                            let img = $($(item).find('.table-cell')[0]).find('img').data('src');
                            let price = $(item).find('.font-14').text();
                            let link = $(item).attr('href');
                            let obj = {
                                name: name,
                                img: img,
                                price: price,
                                link: link
                            }
                            arr.push(JSON.stringify(obj));
                        })
                    }
        
                    var param = {
                        "PutRequest": {
                            "Item": {
                                "date": dateFormatter(target_date) || currentDate(),
                                // "start_shop" : `${start_time}-${shop}`,
                                "turn-start-shop": `${crawl_turn}-${start_time}-${shop}`,
                                "shop": shop,
                                "link": "http://hsmoa.com/" + link,
                                "thumbnail": thumbnail,
                                "item": div.text().trim() || " ",
                                "start_time": start_time,
                                "end_time": end_time,
                                "price": $(spans).eq(2).text() == "" ? "0원" : $(spans).eq(2).text(),
                                "category": category || " ",
                                "lower": arr,
                                "crawl_turn": crawl_turn,
                                "create_time": create_time
                            }
                        }
                    };
        
                    if (crawl_turn != "23" || expire_option == true) {
                        let expiration_time = moment().add(15, 'hours').unix();
                        param.PutRequest.Item.expiration_time = expiration_time;
                    }
                    item_arr.push(param);
                };
                resolve(item_arr);
            });
        })();
        
        if (context.env === "dev") {
            context.res.render('./test.ejs', { items: item_arr });
        } else {
            console.log('길이 ::::::::::', arr.length);
            // arr[0].PutRequest.Item['turn-start-shop'] = 'duplicate0';
            // arr[0].PutRequest.Item['link'] = 'video link !!!';
            // arr[1].PutRequest.Item['turn-start-shop'] = 'duplicate0';

            // arr[4].PutRequest.Item['turn-start-shop'] = 'duplicate4';
            // arr[4].PutRequest.Item['link'] = 'video link !!!';
            // arr[5].PutRequest.Item['turn-start-shop'] = 'duplicate4';

            // arr[9].PutRequest.Item['turn-start-shop'] = 'duplicate9';
            // arr[9].PutRequest.Item['link'] = 'video link !!!';
            // arr[10].PutRequest.Item['turn-start-shop'] = 'duplicate9';
            putItemToDynamo(arr, callback);
        }
    }

    function makeErrorReportWorkplace(message){
        let access_token = "DQVJ2NnRMOGFsN2JzeFdjdXVFZA09SZA01OV2JFdDRWNHcwOWxPZAlNydEhza1JqRTgyVXNHVDNUNG9QRVk0OE9YaFVYejlPODZAPQ3doR0dQUU1PRlNfd1p2ODQ5cERTZAzJTZAEtRUzk2bThtSFhjUHZAXMnhxc1c3VVl6LXFvSENubFJXOWJxQ0xxVUxXM3RmSENlVVd4NzVkbWVCbzhzS1hoeFhuOXpqZAENQU0FRY3RXTEtZAbVdvM0VxMmtwanNUMng5YzhaMUVaUUR6RnlCNGt6QgZDZD";
        let group_id = "672166493293048";

        let option = {
            url : `https://graph.facebook.com/${group_id}/feed`,
            formData : {
                access_token : access_token,
                message : message,
                formatting : "MARKDOWN"
            }
        }

        request.post(option, function(error, response, data){
            if(error){
                console.log(error)
            }else if(response.statusCode == 200){
                console.log(data);
            }
        })
    }
};
