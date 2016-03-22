'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Styles = function () {
  function Styles() {
    _classCallCheck(this, Styles);

    this.styles = '.ghw-feed{padding: 10px;background-color: white;border-bottom: 1px solid #e1e1e1;}.ghw-stats{float: right;}.ghw-desc{padding-top:10px}.ghw-header, .ghw-footer{padding: 10px;}.ghw-footer{text-align: right;}.ghw-wigit, .ghw-wigit img{background-color: #eee;border: 1px solid #e1e1e1;-moz-border-radius: 4px;-webkit-border-radius: 4px;border-radius: 4px;height:100%}.ghw-wigit .fa{padding: 0px 5px}.ghw-wigit img{width:100%}';
  }

  _createClass(Styles, [{
    key: 'mount',
    value: function mount() {
      var tag = document.createElement('style');
      tag.innerHTML = this.styles;
      document.body.appendChild(tag);
    }
  }]);

  return Styles;
}();

var GithubConnection = function () {
  function GithubConnection(username, option) {
    _classCallCheck(this, GithubConnection);

    this.username = username;
    this.option = option;
    this.callback = null;
    this.then = this.then;
  }

  _createClass(GithubConnection, [{
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
          _this.callback(JSON.parse(req.responseText));
        }
      };

      var url = "https://api.github.com/users/";
      url += this.username;
      if (this.option) url += "/" + this.option + "?sort=pushed";

      req.open("GET", url, true);
      req.send();
    }
  }, {
    key: 'then',
    value: function then(callback) {
      this.callback = callback;
    }
  }]);

  return GithubConnection;
}();

;

var GithubProjects = function () {
  function GithubProjects(limit) {
    _classCallCheck(this, GithubProjects);

    this.asElement = this.asElement.bind(this);
    this.asHTML = this.asHTML.bind(this);
    this.target = this.target.bind(this);
    this.setStyles = this.setStyles.bind(this);
    this.limit = limit;
    this.styles = {
      feed: 'ghw-feed',
      stats: 'ghw-stats',
      desc: 'ghw-desc',
      header: 'ghw-header',
      footer: 'ghw-footer',
      wigit: 'ghw-wigit'
    };
  }

  _createClass(GithubProjects, [{
    key: 'target',
    value: function target(el) {
      this.element = el;
    }
  }, {
    key: 'buildElement',
    value: function buildElement(type, klass, cont, attr) {
      if (Array.isArray(cont)) cont = cont.join('');
      if (attr) attr = attr[0] + "='" + attr[1] + "'";else attr = "";
      return "<" + type + " class='" + klass + "' " + attr + ">" + cont + "</" + type + ">";
    }
  }, {
    key: 'asHTML',
    value: function asHTML(json) {}
  }, {
    key: 'asElement',
    value: function asElement(json) {
      this.element.innerHTML = this.asHTML(json);
      return this.element;
    }
  }, {
    key: 'setStyles',
    value: function setStyles(styles) {
      for (var style in styles) {
        this.styles[style] = styles[style];
      }
    }
  }]);

  return GithubProjects;
}();

var Repo = function (_GithubProjects) {
  _inherits(Repo, _GithubProjects);

  function Repo(limit) {
    _classCallCheck(this, Repo);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Repo).call(this, limit));
  }

  _createClass(Repo, [{
    key: 'asHTML',
    value: function asHTML(json) {
      var _this3 = this;

      var el = this.buildElement;
      var html = ["<div class='" + this.styles.wigit + "'>"];
      html.push(el('div', this.styles.header, el('i', 'fa fa-book', '') + 'My Github repos'));
      json.map(function (item, i) {
        if (i >= _this3.limit) return;
        html.push([el('div', _this3.styles.feed, [el('a', _this3.styles.title, item.full_name, ['href', item.url]), el('span', _this3.styles.stats, [el('i', 'fa fa-eye', ''), el('span', '', item.watchers_count), el('i', 'fa fa-star', ''), el('span', '', item.stargazers_count), el('i', 'fa fa-code-fork', ''), el('span', '', item.forks)]), el('div', _this3.styles.desc, item.description)])].join(''));
      });
      html.push(el('div', this.styles.footer, el('a', 'fa fa-github', json[0].owner.login, ['href', json[0].owner.url])));
      html.push('</div>');
      return html.join('');
    }
  }]);

  return Repo;
}(GithubProjects);

var Gist = function (_GithubProjects2) {
  _inherits(Gist, _GithubProjects2);

  function Gist(limit) {
    _classCallCheck(this, Gist);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Gist).call(this, limit));
  }

  _createClass(Gist, [{
    key: 'asHTML',
    value: function asHTML(json) {
      var _this5 = this;

      var el = this.buildElement;
      var html = ["<div class='" + this.styles.wigit + "'>"];
      html.push(el('div', this.styles.header, el('i', 'fa fa-bookmark-o', '') + 'My Github gists'));
      json.map(function (item, i) {
        if (i >= _this5.limit) return;
        html.push([el('div', _this5.styles.feed, [el('a', _this5.styles.title, Object.keys(item.files)[0], ['href', item.url]), el('div', _this5.styles.desc, item.description)])].join(''));
      });
      html.push(el('div', this.styles.footer, el('a', 'fa fa-github', json[0].owner.login, ['href', json[0].owner.url])));
      html.push('</div>');
      return html.join('');
    }
  }]);

  return Gist;
}(GithubProjects);

var Profile = function (_GithubProjects3) {
  _inherits(Profile, _GithubProjects3);

  function Profile() {
    _classCallCheck(this, Profile);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Profile).call(this));
  }

  _createClass(Profile, [{
    key: 'asHTML',
    value: function asHTML(json) {
      var el = this.buildElement;
      var html = ["<div class='" + this.styles.wigit + "'>", el('div', this.styles.header, [el('i', 'fa fa-github', ''), el('span', '', json.login)]), el('div', this.styles.feed, ["<img src='" + json.avatar_url + "'>"]), el('div', this.styles.feed, [el('a', '', json.name, ['href', json.html_url]), el('div', '', json.location, '')]), el('div', this.styles.feed, [el('div', '', [el('i', 'fa fa-book', ' Repositories: '), json.public_repos]), el('div', '', [el('i', 'fa fa-users', ' Followers: '), json.followers])]), "</div>"];
      return html.join('');
    }
  }]);

  return Profile;
}(GithubProjects);

var GithubWidget = function () {
  function GithubWidget(username, type, limit) {
    _classCallCheck(this, GithubWidget);

    switch (type) {
      case "repos":
        this.feed = new Repo(limit);break;
      case "gists":
        this.feed = new Gist(limit);break;
      default:
        this.feed = new Profile();
    }
    this.connection = new GithubConnection(username, type);
    this.styles = new Styles().mount();
  }

  _createClass(GithubWidget, [{
    key: 'mount',
    value: function mount(el) {
      this.feed.target(el);
      this.connection.then(this.feed.asElement);
      this.connection.fetch();
    }
  }, {
    key: 'setStyles',
    value: function setStyles(styles) {
      this.feed.setStyles(styles);
    }
  }]);

  return GithubWidget;
}();

exports.default = GithubWidget;
;