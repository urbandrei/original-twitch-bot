# original-twitch-bot
This is the first twitch bot I made  <br>

To use the bot, first install TMI.js, sqlite3, node-fetch, fs using npm install  <br>
Update global USR const with the lowercase username of the target streamer  <br>
Add a config.txt file to same directory with Oauth token from twitch (https://dev.twitch.tv/docs/irc/authenticate-bot/)  <br>
Uncomment DB setup commands (noted in code) for first time running (recomment thereafter)  <br>

(Suggestion: update static and other commands with proper flavor text review and prune commands not needed for your stream)  <br>

Feature descriptions:  <br>
  Dictionary: list of words that when used by viewers will result in accusation by bot  <br>
  Queue: line of viewers wanting to join stream events  <br>
  Quote: recorded quotes saved by viewers and recoverable by number  <br>
  Beans: keeps track of the times 'bean' is used on stream and also keeps track of firebeans needed  <br>
  Static: basic commands providing info for viewers  <br>
  Counters: basic commands keeping trrack of certain metrics on stream  <br>
  Giveaway: randomly during 3 hour period, showss message, first user to use '!win' wins giveaway  <br>
  
Current commands

  Streamer only:  <br>
    - '!queue' removes first person from queue and returns name  <br>
    - '!queue 1' shows if there is someone in line, and displays name if so  <br>
    - '!queue 2' shows if there are 2 people in line, and displays name if so  <br>
    - '!dictionary add [word]' adds word to the forbidden dictionary  <br>
    - '!dictionary remove [word]' removes word from forbidden dictionary  <br>
    - '!cup' removes all beans from counter  <br>
    - '!refresh' allows all users to use bean again  <br>
    - '!new giveaway' resets giveaway counter  <br>
   Viewer/streamer:  <br>
    - '!allmessages' shows how many messages have been used in chat  <br>
    - '!messages' shows how many messages the particular user used  <br>
    - 'nt' shows how many times 'nt' was used  <br>
    - 'f' shows how many times 'f' was used  <br>
    - 'sorry' shows how many times 'sorry' was used  <br>
    - '!discord' displays link to official discord  <br>
    - '!instagram' displays link to official instagram  <br>
    - '!twitter' displays link to official twitter  <br>
    - '!socials' displays link to official socials page  <br>
    - '!minecraft' displays server code for official minecraft  <br>
    - '!valorant' displays username for valorant  <br>
    - '!giveaway' displays rules for giveaway  <br>
    - 'ping' returns pong, and streak if used multiple times  <br>
    - '!queue' adds user to line  <br>
    -  '!leaderboard' shows viewer with most messages and that number  <br>
    - '!quote add [quote]' adds [quote] to quotes  <br>
    - '!quote [#]' returns quote with given [#], error otherwise  <br>
    - 'bean' returns counters for beans and firebean  <br>
    - '!win' if giveaway active, declares winner, otherwise returns notice  <br>
