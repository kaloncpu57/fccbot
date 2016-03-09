## FCCBOT

#### Contributors

 - @thejonathangraham
 - @DemiPixel
 - @Septimus
 - @jackel27
 - @dwd2010
 - @SimulatedGREG

#### Getting Started

1. `git clone https://github.com/thejonathangraham/fccbot.git`.
2. `cd fccbot && npm install`
3. `npm install -g gulp supervisor`
4. Replace `config/template.json` with `config/default.json` and add the appropriate details. We have added this into the .gitignore file.
5. Run `gulp`.

#### Project Structure

| Name                               | Description                                                 |
| ---------------------------------- | ------------------------------------------------------------ |
| **config**/template.js             | Template for twitch username, password etc.  |
| **src**/app.js                 | Main application file.                          |
| **src**/**bot**/index.js   | Controller for the chat bot.                 |
| **src**/**dashboard**/server.js          | Controller for the dashboard.                      |
| **src**/**dashboard**/**views**/index.html       | Home page template.                                |

#### Coming soon...


----------
