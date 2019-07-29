var request = require('request');

var dates = ['20160402'
,'20160403'
,'20160404'
,'20160405'
,'20160406'
,'20160407'
,'20160408'
,'20160409'
,'20160410'
,'20160411'
,'20160412'
,'20160413'
,'20160414'
,'20160415'
,'20160416'
,'20160417'
,'20160418'
,'20160419'
,'20160420'
,'20160421'
,'20160422'
,'20160423'
,'20160424'
,'20160425'
,'20160426'
,'20160427'
,'20160428'
,'20160429'
,'20160430'
,'20160501'
,'20160502'
,'20160503'
,'20160504'
,'20160505'
,'20160506'
,'20160507'
,'20160508'
,'20160509'
,'20160510'
,'20160511'
,'20160512'
,'20160513'
,'20160514'
,'20160515'
,'20160516'
,'20160517'
,'20160518'
,'20160519'
,'20160520'
,'20160521'
,'20160522'
,'20160523'
,'20160524'
,'20160525']

var api = "https://hco58vx3v7.execute-api.us-west-2.amazonaws.com/prod"
dates = ['20160416'
        ,'20160415']
dates.forEach(function(date){
	console.log(date);
	
	request({
	    url: api,
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: {date:date}
	}, function (error, response, body){
		console.log("ok");
	});	
})






// http.post(api, JSON.stringify({date:date}), function(res) {
//     console.log("Got response: " + res.statusCode);

//     res.on("data", function(chunk) {
        
//         body += chunk;
//     });

//     res.on('end', function(res) {
//         console.log('end')
//         //putObject(context, bucket, key ,body);
//         parseHtml(context,body);
//     });
// }).on('error', function(e) {
//     context.done('error', e);
// });
