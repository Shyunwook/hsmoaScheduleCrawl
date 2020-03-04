const express = require('express');
const handler = require('./index');
const engine = require('ejs-locals');
const path = require('path');
const request = require('request');

const app = express();
const port = 3000;

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async(req, res) => {
    // res.send(test());
    // handler.handler("",{env : "dev", res : res});
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
})

function test(){
    let arr = [       
    {
        "PutRequest": {
            "Item": {
                "date": "2019-08-11",
                "turn-start-shop": "22-20:40-hmallplus",
                "shop": "hmallplus",
                "link": "http://hsmoa.com//i?id=9081216&from=web_timeline",
                "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/12/KjZT1AKoiI.JPEG",
                "item": "LG 디오스 노크온 매직스페이스[S831SN75] (사은품 : 에어프라이어 등 총 3종)",
                "start_time": "20:40",
                "end_time": "21:39",
                "price": "1,899,000원",
                "category": "가전·디지털",
                "lower": [
                    "{\"name\":\"LG 디오스 매직스페이스 양문형냉장고 821L 실버 [S831S32] (사은품: 캐리어)\",\"img\":\"http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/12/dibiQ6toMP.JPEG\",\"price\":\"1,349,000원\",\"link\":\"/i?id=9081217&from=web_timeline\"}",
                    "{\"name\":\"LG 디오스 매직스페이스 양문형냉장고 821L 화이트 [S831W32] (사은품: 캐리어)\",\"img\":\"http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/12/d6GIsaUcR7.JPEG\",\"price\":\"1,349,000원\",\"link\":\"/i?id=9081218&from=web_timeline\"}"
                ],
                "crawl_turn": "22",
                "create_time": 1565528488,
                "expiration_time": 1565582488
            }
        }
    },{
        "PutRequest": {
            "Item": {
                "date": "2019-08-11",
                "turn-start-shop": "22-20:45-cjmallplus",
                "shop": "cjmallplus",
                "link": "http://hsmoa.com//i?id=9076988&from=web_timeline",
                "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/04/HabwIcXkp7.jpg",
                "item": "노루 하우홈 음식물처리기 싱크리더",
                "start_time": "20:45",
                "end_time": "21:45",
                "price": "0원",
                "category": "가전·디지털",
                "lower": [],
                "crawl_turn": "22",
                "create_time": 1565528488,
                "expiration_time": 1565582488
            }
        }
    },
    {
        "PutRequest": {
            "Item": {
                "date": "2019-08-11",
                "turn-start-shop": "22-20:55-immall",
                "shop": "immall",
                "link": "http://hsmoa.com//i?id=9070797&from=web_timeline",
                "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/06/03/klFrxm1BKw.jpg",
                "item": "[프리미엄 특대사이즈]제주 은갈치",
                "start_time": "20:55",
                "end_time": "22:00",
                "price": "68,900원",
                "category": "식품·건강",
                "lower": [],
                "crawl_turn": "22",
                "create_time": 1565528488,
                "expiration_time": 1565582488
            }
        }
    },

{
    "PutRequest": {
        "Item": {
            "date": "2019-08-11",
            "turn-start-shop": "22-20:55-immall",
            "shop": "immall",
            "link": "http://hsmoa.com//i?id=9070797&from=web_timeline&video=http%3A//shoppingflv.x-cdn.com/mshoplive/_definst_/live1.stream/playlist.m3u8",
            "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/06/03/klFrxm1BKw.jpg",
            "item": "[프리미엄 특대사이즈]제주 은갈치",
            "start_time": "20:55",
            "end_time": "22:00",
            "price": "68,900원",
            "category": "식품·건강",
            "lower": [],
            "crawl_turn": "22",
            "create_time": 1565528489,
            "expiration_time": 1565582489
        }
    }
},
{
    "PutRequest": {
        "Item": {
            "date": "2019-08-11",
            "turn-start-shop": "22-20:40-hmallplus",
            "shop": "hmallplus",
            "link": "http://hsmoa.com//i?id=9081216&from=web_timeline",
            "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/12/KjZT1AKoiI.JPEG",
            "item": "LG 디오스 노크온 매직스페이스[S831SN75] (사은품 : 에어프라이어 등 총 3종)",
            "start_time": "20:40",
            "end_time": "21:39",
            "price": "1,899,000원",
            "category": "가전·디지털",
            "lower": [
                "{\"name\":\"LG 디오스 매직스페이스 양문형냉장고 821L 실버 [S831S32] (사은품: 캐리어)\",\"img\":\"http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/12/dibiQ6toMP.JPEG\",\"price\":\"1,349,000원\",\"link\":\"/i?id=9081217&from=web_timeline\"}",
                "{\"name\":\"LG 디오스 매직스페이스 양문형냉장고 821L 화이트 [S831W32] (사은품: 캐리어)\",\"img\":\"http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/12/d6GIsaUcR7.JPEG\",\"price\":\"1,349,000원\",\"link\":\"/i?id=9081218&from=web_timeline\"}"
            ],
            "crawl_turn": "22",
            "create_time": 1565528488,
            "expiration_time": 1565582488
        }
    }
},{
    "PutRequest": {
        "Item": {
            "date": "2019-08-11",
            "turn-start-shop": "22-20:45-cjmallplus",
            "shop": "cjmallplus",
            "link": "http://hsmoa.com//i?id=9076988&from=web_timeline",
            "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/07/04/HabwIcXkp7.jpg",
            "item": "노루 하우홈 음식물처리기 싱크리더",
            "start_time": "20:45",
            "end_time": "21:45",
            "price": "0원",
            "category": "가전·디지털",
            "lower": [],
            "crawl_turn": "22",
            "create_time": 1565528488,
            "expiration_time": 1565582488
        }
    }
},
{
    "PutRequest": {
        "Item": {
            "date": "2019-08-11",
            "turn-start-shop": "22-20:55-immall",
            "shop": "immall",
            "link": "http://hsmoa.com//i?id=9070797&from=web_timeline",
            "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/06/03/klFrxm1BKw.jpg",
            "item": "[프리미엄 특대사이즈]제주 은갈치",
            "start_time": "20:55",
            "end_time": "22:00",
            "price": "68,900원",
            "category": "식품·건강",
            "lower": [],
            "crawl_turn": "22",
            "create_time": 1565528488,
            "expiration_time": 1565582488
        }
    }
},

{
"PutRequest": {
    "Item": {
        "date": "2019-08-11",
        "turn-start-shop": "22-20:55-immall",
        "shop": "immall",
        "link": "http://hsmoa.com//i?id=9070797&from=web_timeline&video=http%3A//shoppingflv.x-cdn.com/mshoplive/_definst_/live1.stream/playlist.m3u8",
        "thumbnail": "http://thum.buzzni.com/unsafe/320x320/center/smart/http://cdn.image.buzzni.com/2019/06/03/klFrxm1BKw.jpg",
        "item": "[프리미엄 특대사이즈]제주 은갈치",
        "start_time": "20:55",
        "end_time": "22:00",
        "price": "68,900원",
        "category": "식품·건강",
        "lower": [],
        "crawl_turn": "22",
        "create_time": 1565528489,
        "expiration_time": 1565582489
    }
}
}
]
    // console.log(arr.length);
    let keys = arr.map((a) => {
        return a.PutRequest.Item['turn-start-shop'];
    })
    let dup = keys.getDuplicates();
    for(var v in dup){
        seekDup(arr, dup[v])
    }

    return arr;
}

function seekDup(arr, t){
    for(let i = t.length - 1; i > 0; i--){
        if(arr[t[i]].PutRequest.Item['link'].indexOf('video') > -1){
            console.log(t[i]);
            arr.splice(t[i],1);
        }
    }
    return arr;
}

Array.prototype.getDuplicates = function () {
    var duplicates = {};
    for (var i = 0; i < this.length; i++) {
        if(duplicates.hasOwnProperty(this[i])) {
            duplicates[this[i]].push(i);
        } else if (this.lastIndexOf(this[i]) !== i) {
            duplicates[this[i]] = [i];
        }
    }

    return duplicates;
};
