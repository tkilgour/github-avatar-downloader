var request = require('request');
var fs = require('fs');
var GITHUB_USER = 'tkilgour';
var GITHUB_TOKEN = 'f9e6087b99016c107ce10b650785d6c884038460';

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {'user-agent': 'GitHub Avatar Downloader - Student Project'}
  };

  request(options, function (error, response, body) {
    cb(error, JSON.parse(body));
  })
};

function downloadImageByURL (url, filePath) {
  request.get(url)
         .on('error', function (err) {
           throw err;
         })
         .pipe(fs.createWriteStream(filePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  result.forEach(function (user) {
    var login = user.login;
    var avatarURL = user.avatar_url;

    downloadImageByURL(avatarURL, './avatars/' + login + '.jpg');
  })
});