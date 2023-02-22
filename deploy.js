const ghpages = require("gh-pages");

ghpages.publish('build', {
  branch: "gh-pages",
  repo: "git@github.com:glebgorokhov/skewed-borders-react.git",
  message: "Deploy: build to gh-pages"
}, () => {
  console.log("Success!")
});
