# github-widget
Display repos and gists on your website

![screenshot](https://raw.githubusercontent.com/sebjwallace/github-widget/master/screenshot.png)

Forgive the example screenshot showing 0 stars, watches and forks. Hopefully you'll have more attractive stats for your wigit.

The project was built in JSBin, so here's a [link](https://jsbin.com/degeruw/edit?js,output) if you want to see how it all works.

[npm github-widget-js](https://www.npmjs.com/package/github-widget-js)

If this module is being included as a script tag, required or imported, the object to instantiate is called GithubWigit. The constructor takes upto five arguments:
- *the element to append the wigit
- *github username
- *the type of feed: repos or gists
- object of styles to inject
- limit of repos/gists to render

```javascript
// values reference class names
var styles = {
  feed: 'feed', stats: 'stats',
  description: 'description',
  header: 'header', footer: 'footer',
  wigit: 'wigit'
};

var reposEl = document.getElementById('repos');
var repos = new GithubWigit(reposEl,'sebjwallace','repos',styles,4);

var gistsEl = document.getElementById('gists');
var gists = new GithubWigit(gistsEl,'sebjwallace','gists',styles,4);
```
The only dependency is font-awesome, if fonts are desired for your theming.
