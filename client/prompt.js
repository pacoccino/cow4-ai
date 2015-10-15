"use strict";
var inquirer = require("inquirer");

inquirer.prompt([
  {
    type: "list",
    name: "ia",
    message: "Choose IA to launch",
    choices: [
      {
          name: "Basic",
          value: 0
      }
      //new inquirer.Separator()
    ]
  }
], function( answers ) {
    console.log( JSON.stringify(answers, null, "  ") );
});
