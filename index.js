/**
 * JS Package for Botmock
 * Author: Botmock Team
 * ISC Licensed
 */

'use strict';

var fetch = require('node-fetch');

module.exports = Botmock;

/**
 * Constructor for Botmock Client
 * @param {obj} config 
 */
function Botmock(config) {
    // Ensure that the config has the api_token
    if (!config.api_token) {
        throw "api_token not provided in config!"
    }

    this.api_token = config.api_token;
    this.debug = config.debug;
    this.url = `${config.url ? `http://${config.url}` : 'https://app'}.botmock.com/api`
}

Botmock.prototype.fetch = function(endpoint) {
    const headers = {
        "Authorization": `Bearer ${this.api_token}`
    };

    const promise = new Promise((resolve, reject) => {
        fetch(`${this.url}/${endpoint}`, {headers: headers})
            .then(res => res.json())
            .then((data) => {
                this.logger(data);
                resolve(data);
            })
            .catch(err => reject(err));
    });

    return promise;
}

Botmock.prototype.logger = function(msg) {
    if (this.debug) {
        console.log(msg);
    }
}

Botmock.prototype.teams = function(team_id) {
    if (team_id) {
        return this.fetch(`teams/${team_id}`);
    }

    return this.fetch("teams");
}

Botmock.prototype.projects = function(team_id, project_id) {
    if (!team_id) {
        throw new Error("You must specify a team_id");
    }

    if (project_id) {
        return this.fetch(`teams/${team_id}/projects/${project_id}`);
    }

    return this.fetch(`teams/${team_id}/projects`);
}

Botmock.prototype.boards = function(team_id, project_id, board_id) {
    if (!team_id) {
        throw new Error("You must specify a team_id");
    }
    if (!project_id) {
        throw new Error("You must specify a project_id");
    }

    if (board_id) {
        return this.fetch(`teams/${team_id}/projects/${project_id}/boards/${board_id}`);
    }

    return this.fetch(`teams/${team_id}/projects/${project_id}/boards`);
}

Botmock.prototype.intent = function(team_id, project_id, intent_id) {
    return this.fetch(`teams/${team_id}/projects/${project_id}/intents/${intent_id}`);
}

Botmock.prototype.intents = function(team_id, project_id) {
    return this.fetch(`teams/${team_id}/projects/${project_id}/intents`);
}

Botmock.prototype.variables = function(team_id, project_id) {
    return this.fetch(`teams/${team_id}/projects/${project_id}/variables`);
}

Botmock.prototype.entities = function(team_id, project_id) {
    return this.fetch(`teams/${team_id}/projects/${project_id}/entities`);
}