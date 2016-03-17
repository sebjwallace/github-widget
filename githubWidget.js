
var Github = function(username,option,callback){
  var self = this;
  self.username = username;
  self.option = option;
  self.then = callback;
    
  self.fetch = function(){
      var req = new XMLHttpRequest();
      req.onreadystatechange = function(){
        if (req.readyState == 4 && req.status == 200)
        { self.then(JSON.parse(req.responseText)); }
      };
      
      var url = "https://api.github.com/users/";
      url += self.username + "/";
      url += self.option + "?sort=pushed";
      
      req.open("GET",url,true);
      req.send();
  };
};

var Build = function(element){
  var self = this;
  self.element = element;
    
  self.asHTML = function(json){
    var html = "";
    for(var item in json){
      html += "<div>";
      html += "<a href='" + json[item].url + "'>";
      html += json[item].full_name + "</a>";
      html += "<span>" + json[item].watchers_count + "</span>";
      html += "<span>" + json[item].forks + "</span>";
      html += "<span>" + json[item].stargazers_count + "</span>";
      html += "<span>" + json[item].description + "</span>";
      html += "</div>";
    }
    return html;
  };
    
  self.asElement = function(json){
    self.element.innerHTML = self.asHTML(json);
    return self.element;
  };
};

var el = document.getElementById('root');
var build = new Build(el);

var github = new Github('sebjwallace','repos');
github.then = build.asElement;
github.fetch();
