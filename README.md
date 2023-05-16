# original-twitch-bot
This is the first twitch bot I made

To use the bot, update global USR const with the lowercase username of the target streamer
Add a config.txt file to same directory with Oauth token from twitch (https://dev.twitch.tv/docs/irc/authenticate-bot/)
Uncomment DB setup commands (noted in code) for first time running (recomment thereafter)

(Suggestion: update static and other commands with proper flavor text
review and prune commands not needed for your stream)

Feature descriptions:
  Dictionary: list of words that when used by viewers will result in accusation by bot
  Queue: line of viewers wanting to join stream events
  Quote: recorded quotes saved by viewers and recoverable by number
  Beans: keeps track of the times 'bean' is used on stream and also keeps track of firebeans needed
  Static: basic commands providing info for viewers
  Counters: basic commands keeping trrack of certain metrics on stream
  Giveaway: randomly during 3 hour period, showss message, first user to use '!win' wins giveaway
  
Current commands

  Streamer only:
    - '!queue' removes first person from queue and returns name
    - '!queue 1' shows if there is someone in line, and displays name if so
    - '!queue 2' shows if there are 2 people in line, and displays name if so
    - '!dictionary add [word]' adds word to the forbidden dictionary
    - '!dictionary remove [word]' removes word from forbidden dictionary
    - '!cup' removes all beans from counter
    - '!refresh' allows all users to use bean again
    - '!new giveaway' resets giveaway counter
   Viewer/streamer:
    - '!allmessages' shows how many messages have been used in chat
    - '!messages' shows how many messages the particular user used
    - 'nt' shows how many times 'nt' was used
    - 'f' shows how many times 'f' was used
    - 'sorry' shows how many times 'sorry' was used
    - '!discord' displays link to official discord
    - '!instagram' displays link to official instagram
    - '!twitter' displays link to official twitter
    - '!socials' displays link to official socials page
    - '!minecraft' displays server code for official minecraft
    - '!valorant' displays username for valorant
    - '!giveaway' displays rules for giveaway
    - 'ping' returns pong, and streak if used multiple times
    - '!queue' adds user to line
    -  '!leaderboard' shows viewer with most messages and that number
    - '!quote add [quote]' adds [quote] to quotes
    - '!quote [#]' returns quote with given [#], error otherwise
    - 'bean' returns counters for beans and firebean
    - '!win' if giveaway active, declares winner, otherwise returns notice
