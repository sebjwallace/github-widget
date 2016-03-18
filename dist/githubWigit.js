(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GithubWigit = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GithubConnection = (function () {
  function GithubConnection(username, option, callback) {
    _classCallCheck(this, GithubConnection);

    this.username = username;
    this.option = option;
    this.callback = callback;
    this.then = this.then;
  }

  _createClass(GithubConnection, [{
    key: "fetch",
    value: function fetch() {
      var _this = this;

      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
          _this.callback(JSON.parse(req.responseText));
        }
      };

      var url = "https://api.github.com/users/";
      url += this.username + "/";
      url += this.option + "?sort=pushed";

      req.open("GET", url, true);
      req.send();
    }
  }, {
    key: "then",
    value: function then(callback) {
      this.callback = callback;
    }
  }]);

  return GithubConnection;
})();

;

var GithubFeed = (function () {
  function GithubFeed(element, styles, limit) {
    _classCallCheck(this, GithubFeed);

    this.element = element;
    this.asElement = this.asElement.bind(this);
    this.asHTML = this.asHTML.bind(this);
    this.styles = {
      feed: styles.feed, stats: styles.stats,
      description: styles.description,
      header: styles.header, footer: styles.footer,
      wigit: styles.wigit
    };
    this.limit = limit;
  }

  _createClass(GithubFeed, [{
    key: "buildElement",
    value: function buildElement(type, klass, cont, attr) {
      if (Array.isArray(cont)) cont = cont.join('');
      if (attr) attr = attr[0] + "='" + attr[1] + "'";else attr = "";
      return "<" + type + " class='" + klass + "' " + attr + ">" + cont + "</" + type + ">";
    }
  }, {
    key: "asHTML",
    value: function asHTML(json) {}
  }, {
    key: "asElement",
    value: function asElement(json) {
      this.element.innerHTML = this.asHTML(json);
      return this.element;
    }
  }]);

  return GithubFeed;
})();

var Repo = (function (_GithubFeed) {
  _inherits(Repo, _GithubFeed);

  function Repo(element, styles, limit) {
    _classCallCheck(this, Repo);

    _get(Object.getPrototypeOf(Repo.prototype), "constructor", this).call(this, element, styles, limit);
  }

  _createClass(Repo, [{
    key: "asHTML",
    value: function asHTML(json) {
      var _this2 = this;

      var el = this.buildElement;
      var html = ["<div class='" + this.styles.wigit + "'>"];
      html.push(el('div', this.styles.header, el('i', 'fa fa-book', '') + 'My Github repos'));
      json.map(function (item, i) {
        if (i >= _this2.limit) return;
        html.push([el('div', _this2.styles.feed, [el('a', _this2.styles.title, item.full_name, ['href', item.url]), el('span', _this2.styles.stats, [el('i', 'fa fa-eye', ''), el('span', '', item.watchers_count), el('i', 'fa fa-star', ''), el('span', '', item.stargazers_count), el('i', 'fa fa-code-fork', ''), el('span', '', item.forks)]), el('div', _this2.styles.description, item.description)])].join(''));
      });
      html.push(el('div', this.styles.footer, el('a', 'fa fa-github', json[0].owner.login, ['href', json[0].owner.url])));
      html.push('</div>');
      return html.join('');
    }
  }]);

  return Repo;
})(GithubFeed);

var Gist = (function (_GithubFeed2) {
  _inherits(Gist, _GithubFeed2);

  function Gist(element, styles, limit) {
    _classCallCheck(this, Gist);

    _get(Object.getPrototypeOf(Gist.prototype), "constructor", this).call(this, element, styles, limit);
  }

  _createClass(Gist, [{
    key: "asHTML",
    value: function asHTML(json) {
      var _this3 = this;

      var el = this.buildElement;
      var html = ["<div class='" + this.styles.wigit + "'>"];
      html.push(el('div', this.styles.header, el('i', 'fa fa-bookmark-o', '') + 'My Github gists'));
      json.map(function (item, i) {
        if (i >= _this3.limit) return;
        html.push([el('div', _this3.styles.feed, [el('a', _this3.styles.title, Object.keys(item.files)[0], ['href', item.url]), el('div', _this3.styles.description, item.description)])].join(''));
      });
      html.push(el('div', this.styles.footer, el('a', 'fa fa-github', json[0].owner.login, ['href', json[0].owner.url])));
      html.push('</div>');
      return html.join('');
    }
  }]);

  return Gist;
})(GithubFeed);

var GithubWigit = function GithubWigit(el, username, type, styles, limit) {
  _classCallCheck(this, GithubWigit);

  this.el = el;
  if (type == "repos") this.feed = new Repo(el, styles, limit);else this.feed = new Gist(el, styles, limit);
  this.connection = new GithubConnection(username, type);
  this.connection.then(this.feed.asElement);
  this.connection.fetch();
};

exports["default"] = GithubWigit;
;
module.exports = exports["default"];

},{}]},{},[1])(1)
});