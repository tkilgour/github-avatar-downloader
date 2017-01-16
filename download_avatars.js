require('dotenv').config();
var request = require("request");
var fs = require("fs");

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
var REPO_OWNER = process.argv[2];
var REPO = process.argv[3];

console.log("Welcome to the GitHub Avatar Downloader!");

// Gets a provided GitHub Repo's contributors and passes them to a callback
// function as an array of objects.
function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {"user-agent": "GitHub Avatar Downloader - Student Project"}
    };

    request(options, function (error, response, body) {
        cb(error, JSON.parse(body));
    });
}

// Downloads a single image from a given URL to a given file.
function downloadImageByURL(url, filePath) {
    request.get(url)
        .on("error", function (err) {
            throw err;
        })
        .pipe(fs.createWriteStream(filePath));
}

// Checks if Repo Owner and Repo Name were provided by user, initiates
// getRepoContributors function, and then iterates through each contributor
// and downloads their avatar.
if (REPO_OWNER && REPO) {
    getRepoContributors(REPO_OWNER, REPO, function (err, result) {
        result.forEach(function (user) {
            var login = user.login;
            var avatarURL = user.avatar_url;

            downloadImageByURL(avatarURL, "./avatars/" + login + ".jpg");
        });
    });
} else {
    console.log("Error: Please enter two arguments for the 'Repo Owner' and 'Repo Name'.");
}