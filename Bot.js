const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const channel = require('./Channel.json');
var rp = require('request-promise');

client.on('message', msg => {
    if (msg.content === '開台') {

        var myRequests = [];
        let peopleNumber = 0;
        for (name in channel) {
            console.log("查看: " + name + " ID: " + channel[name]);
            myRequests.push(rp(CheckOnlineStatus(channel[name])));
        }
        Promise.all(myRequests)
            .then((arrayOfResult) => {
                arrayOfResult.forEach(function (result) {
                    console.log("arrayOfResult: ", result);
                    let resposeBody = "";
                    resposeBody = JSON.parse(result);
                    if (resposeBody.data.length != 0 && resposeBody.data[0].type == "live") {
                        console.log("有開: " + resposeBody.data[0].user_name + " ID: " + channel[resposeBody.data[0].user_name]);
                        msg.channel.send(resposeBody.data[0].user_name + "目前有開 快去看 --> " + "https://www.twitch.tv/" + channel[resposeBody.data[0].user_name]);
                        peopleNumber++;
                    }
                });

                if (peopleNumber == 0) {
                    msg.channel.send("目前沒人開台唷~~~~");
                }
            })
            .catch(/* handle error */);
    }
});

function CheckOnlineStatus(user_login) {
    var options = {
        url: 'https://api.twitch.tv/helix/streams?user_login=' + user_login,
        headers: {
            'Client-ID': auth.twitch_clientID,
            'Authorization': auth.OAuth_token,
        }
    };
    return options;
}

client.login(auth.token);