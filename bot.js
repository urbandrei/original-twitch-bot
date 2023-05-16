const tmi = require('tmi.js');
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');
const fs = require('fs');

const SEC = 1000;
const MIN = 60000;
const USR = "urbandrei";

var ping = 0;
var beans = 0;
var firebeans = 5;
var hasbeans = [];
var giveaway = false;
var queue = [];

// -> Reads username and password from config.txt
// -> Connects to Twitch client

var client;
fs.readFile(__dirname+'/config.txt', 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	const opts = {
		identity: {
			username: USR,
			password: data.trim()
		},
		channels: [ USR ]
	};
	
	client = new tmi.client(opts);

	client.on('message', onMessageHandler);
	client.on('connected', onConnectedHandler);

	client.connect();
});

// -> Connects to SQlite3 DB

let db = new sqlite3.Database(__dirname + "/db", (err) => {
        if (err) { return console.error(err.message); }
        console.log('Connected to the in-memory SQlite database.');
});

// -> Database setup code
// -> (uncomment when first setting up bot)

/*
db.run("CREATE TABLE viewers (Name varchar(255), ID varchar(255), Messages int, ViewTime int, Lurk boolean);");
db.run("CREATE TABLE quotes (Number int, Text varchar(255), Name varchar(255), Date varchar(255));");
db.run("CREATE TABLE dictionary (Word varchar(255));");
db.all("CREATE TABLE stream (Stat varchar(255), Amount int);", [], (err, row) => {
	db.run("INSERT INTO stream VALUES (\"messages\", 0), (\"nt\", 0), (\"f\",0), (\"sorry\",0);");
});
*/

// -> Called every time a message comes in

function onMessageHandler (target, context, msg, self) { if (!self) {

// -> Updates stream-wide variables in database
// -> Prints relevant messages

db.all("SELECT * FROM stream;", [], (err, rows) => {
	if (err) { throw err; }
	else {
		db.run("UPDATE stream SET Amount = " + (rows[0].Amount+1) + " WHERE Stat = \"messages\";");
		rows.forEach(stat => {
			if(stat.Stat === 'messages' && msg.includes('!allmessages')) {
				client.say(target, (stat.Amount+1) + " messages have been sent so far!");
			}
			else if(stat.Stat === 'nt' && msg.toLowerCase() === 'nt') {
				client.say(target, USR + ' has tried ' + (stat.Amount + 1) + ' times!');
				db.run("UPDATE stream SET Amount = " + (stat.Amount+1) + " WHERE Stat = \"nt\";");
			}
			else if(stat.Stat === 'f' && msg.toLowerCase() === 'f') {
                                client.say(target, 'Respects have been paid ' + (stat.Amount + 1) + ' times!');
                                db.run("UPDATE stream SET Amount = " + (stat.Amount+1) + " WHERE Stat = \"f\";");
                        }
			else if(stat.Stat === 'sorry' && msg.toLowerCase().includes('sorry')) {
                                client.say(target, 'Chat has apologized unnescessarily ' + (stat.Amount + 1) + ' times!');
                                db.run("UPDATE stream SET Amount = " + (stat.Amount+1) + " WHERE Stat = \"sorry\";");
                        }	
		});
	}
});

// -> Updates user-wide variables in database
// -> Prints relevant messages

db.all("SELECT Messages FROM viewers WHERE ID = "+context["user-id"]+";", [], (err, row) => {
	if (err) { throw err; }
	else if(row.length == 0) {
		db.run("INSERT INTO viewers (Name, ID, Messages, ViewTime, Lurk) VALUES (\""+context['display-name']+"\", "+context["user-id"]+", 1, 0, false);");
		if (msg.includes("!messages")) {
			client.say(target, "That was your first message!");
		}
	}
	else {
		db.run("UPDATE viewers SET Messages = " + (row[0].Messages+1) + " WHERE ID = "+context["user-id"]+";");
		if (msg.includes("!messages")){
			client.say(target, "You have sent " + (row[0].Messages+1) + " messages!");
		}
	}
});

// -> Static input/output commands

if (msg.includes('!discord')) {
	client.say(target, 'https://discord.gg/t3qFQSXncP');
}

if (msg.toLowerCase() === '!instagram') {
	client.say(target, 'https://www.instagram.com/urbandrei/');
}

if (msg.toLowerCase() === '!twitter') {
        client.say(target, 'https://twitter.com/urbandrei');
}

if (msg.toLowerCase() === '!socials') {
        client.say(target, 'https://bio.site/urbandrei');
}
if (msg.toLowerCase() === '!minecraft') {
        client.say(target, '3.138.240.27');
}
if (msg.toLowerCase() === '!valorant') {
        client.say(target, 'urbandrei#000');
}
if (msg.toLowerCase() === '!giveaway' && context['display-name'] != 'urbandrei') {
        client.say(target, "At some points randomly on stream, a prompt will come up saying to type in \"!win\" to win the giveaway, first person to type it immediately after wins!");
}

// -> Every time ping is used, sends back pong with streak numbers

if (msg.toLowerCase() === 'ping') {
        if(ping == 0) {
		client.say(target, 'pong');
	} else {
		client.say(target, 'pong streak: ' + ping);
	}
	ping++;
}

// -> If user uses '!queue', adds them to a line
// -> If streamer uses '!queue', removes first person from line and displays name

if (msg.toLowerCase() === '!queue') {
	if(queue.includes(context['display-name'])){
		client.say(target, "You are already in queue");
	}
	else if(context['display-name'] !== USR) {
		queue.push(context['display-name']);
		if(queue.length == 1) {
			client.say(target, context['display-name'] + ', you are 1st in line');
		}
		else if(queue.length == 2) {
                        client.say(target, context['display-name'] + ', you are 2nd in line');
                }
		else if(queue.length == 3) {
                        client.say(target, context['display-name'] + ', you are 3rd in line');
                }
		else {
                        client.say(target, context['display-name'] + ', you are ' + queue.length + 'th in line');
                }
	}
	else {
		if(queue.length > 0) {
			client.say(target, queue.pop());
		} else {
			client.say(target, "No one in queue");
		}
	}
}

// -> '!queue 1/2' is streamer command that tells streamer if 1/2 people
// -> are in line and their names if so

if (msg.toLowerCase() === '!queue 1' && context['display-name'] == USR) {
	if(queue.length > 0) {
		client.say(target, queue[0]);
	} else {
                client.say(target, "No one in queue");
        }
}

if (msg.toLowerCase() === '!queue 2' && context['display-name'] == USR) {
	if(queue.length > 1) {
		client.say(target, queue[0] + ", " + queue[1]);
        } else {
                client.say(target, "Not enought people in queue");
        }
}

// -> '!leaderboard' displays user with highest amoung of messages and that number

if (msg.toLowerCase() === '!leaderboard') {
	db.all("SELECT Name, Messages FROM viewers WHERE Messages in (SELECT MAX(Messages) Name FROM viewers WHERE Name != \"urbandrei\");", [], (err, row) => {
        	if (err) { throw err; }
		client.say(target, row[0].Name + " has sent the most messages (" + row[0].Messages +")");
	});
}

// -> The Dictionary is a list of words that when used by viewers result in a accusation
// -> '!dictionary' displays active words
// -> '!dictionary add [word]' adds [word] to the dictionary
// -> '!dictionary remove [word]' removes [word] from the dictionary

if (msg.toLowerCase() === '!dictionary') {
	db.all("SELECT Word FROM dictionary;", [], (err, row) => {
                if (err) { throw err; }
                if (row.length == 0) {
			client.say(target, "Dictionary is empty");
		}
		else {
			var word_list = "";
			for (var i=0; i < row.length;i++) {
				word_list += row[i].Word + ', ';
			}
			word_list = word_list.slice(0,-2);
			client.say(target, word_list);

		}
        });
}

if (msg.toLowerCase().slice(0,16) === '!dictionary add ' && context['display-name'] == USR) {
        db.all("INSERT INTO dictionary (Word) VALUES (\""+ msg.toLowerCase().slice(16)+"\");", [], (err, row) => {
                if (err) { throw err; }
                client.say(target, msg.toLowerCase().slice(16) + " added to the dictionary");
        });
}

if (msg.toLowerCase().slice(0,19) === '!dictionary remove ' && context['display-name'] == USR) {
        db.all("DELETE FROM dictionary WHERE Word = \""+ msg.toLowerCase().slice(19)+"\";", [], (err, row) => {
                if (err) { throw err; }
                client.say(target, msg.toLowerCase().slice(19) + " removed from the dictionary");
        });
}

if (context['display-name'] != USR) {
	db.all("SELECT Word FROM dictionary WHERE Word IN (\""+removeQuotes(msg.toLowerCase()).replace(/ /g, "\",\"") + "\");", [], (err, row) => {
		if (err) { throw err; }
		if (row.length != 0) {
			client.say(target, context['display-name'] + ", you are accused of using the forbidden word "+row[0].Word);
		}
	});
}

// -> '!quote add [quote]' adds [quote] to quote database and returns it's position
// -> '!quote [#]' returns the quote at [#], and error otherwise  

if (msg.toLowerCase().slice(0,11) === '!quote add ') {
        db.all("SELECT COUNT(Number) AS result FROM quotes;", [], (err, row) => {
		if (err) { throw err; }
		num = (row[0].result+1);
		db.all("INSERT INTO quotes (Number, Text, Name) VALUES ("+(row[0].result+1)+",\""+ removeQuotes(msg.slice(11))+"\",\""+removeQuotes(context["display-name"])+"\");", [], (err, row) => {
                	if (err) { throw err; }
                	client.say(target, "\"" + msg.toLowerCase().slice(11) + "\" added to the quotes (#" + num + ")");
        });});
}

if (msg.toLowerCase().slice(0,11) != '!quote add ' && msg.toLowerCase().slice(0,7) == '!quote ') {
	db.all("SELECT * FROM quotes WHERE Number = "+ removeQuotes(msg.toLowerCase().slice(7))+";", [], (err, row) => {
                if (err) { throw err; }
		if (row.length == 0) {
			client.say(target, "No quote found");
		}
		else {
			client.say(target, "Quote #" + msg.toLowerCase().slice(7) + ": " + row[0].Name+" said \"" + row[0].Text + "\"");
		}
	});
}

// -> unique users saying bean in chat will result in message stating
// -> how many beans streamer owes (updates beans/hasbeans/firebeans)

if (msg.toLowerCase().includes('bean')&& context['display-name'] != USR) {
        if(hasbeans.includes(context['display-name'])) {
		client.say(target, "You've already used bean today!");
	}
	else {
		beans+=1;
		firebeans -=1;
		client.say(target, USR+ " has to eat " + beans + " more beans! ("+firebeans+" more beans till fire bean!)");
		if(firebeans <= 0) {
			client.say(target, "FIRE BEAN!");
			firebeans = 10;
		}
		hasbeans.push(context['display-name']);
	}
}

// -> '!cup' (streamer command) will remove current beans streamer owes

if (msg.toLowerCase() === '!cup' && context['display-name'] == USR) {
	beans = 0;
	client.say(target, "All beans are now in cup, type bean to add in more");
}

// -> '!refresh' (streamer command) clears hasbean and allows all users to use bean again

if (msg.toLowerCase() === '!refresh' && context['display-name'] == USR) {
        hasbeans = [];
	client.say(target, "You all can use the bean again! ("+firebeans +"beans left until fire bean)!");
}

// -> When giveaway triggers, user saying '!win' wins giveaway and untriggers giveaway

if (msg.toLowerCase() === '!win' && context['display-name'] != USR) {
	if(giveaway == true) {
        	client.say(target, context['display-name'] + " has won the giveaway!");
		giveaway = false;
	}
	else {
		client.say(target, "Giveaway is not active yet :P");
	}
}

// -> '!new giveaway' (streamer command) resets giveaway with random countdown

if (msg.toLowerCase() === '!new giveaway' && context['display-name'] == USR) {
	client.say("#urbandrei", "Next giveaway within 3 hours");
	setTimeout(() => {
                client.say("#urbandrei", "The first one to use the \"!win\" command wins the giveaway!");
                giveaway = true;
        }, Math.floor(Math.random() * 180 * MIN));
}

}}

// -> Helper function that removes dangerous elements for DB from quotes

function removeQuotes(str) {
	let newStr = "";
	for (let i = 0; i < str.length; i++) {
		if (str[i] !== "'" && str[i] !== '"') {
			newStr += str[i];
		}
	}
	return newStr;
}

function onConnectedHandler (addr, port) { console.log(`* Connected to ${addr}:${port}`); }
