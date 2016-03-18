
class GithubConnection{

  constructor(username,option,callback){
    this.username = username;
    this.option = option;
    this.callback = callback;
    this.then = this.then;
  }
  fetch(){
      const req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200)
        { this.callback(JSON.parse(req.responseText)); }
      };

      let url = "https://api.github.com/users/";
      url += this.username + "/";
      url += this.option + "?sort=pushed";

      req.open("GET",url,true);
      req.send();
  }
  then(callback){
      this.callback = callback;
  }
};

class GithubFeed{

  constructor(element,styles,limit){
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

  buildElement(type,klass,cont,attr){
      if(Array.isArray(cont)) cont = cont.join('');
      if(attr) attr = attr[0] + "='" + attr[1] + "'";
      else attr = "";
      return "<"+type+" class='"+klass+"' "+attr+">"+cont+"</"+type+">";
  }

  asHTML(json){}

  asElement(json){
    this.element.innerHTML = this.asHTML(json);
    return this.element;
  }
}

class Repo extends GithubFeed{

  constructor(element,styles,limit){
    super(element,styles,limit);
  }

  asHTML(json){
    const el = this.buildElement;
    let html = ["<div class='"+this.styles.wigit+"'>"];
    html.push(el('div',this.styles.header,
      el('i','fa fa-book','') + 'My Github repos'
    ));
    json.map((item,i) => {
      if(i >= this.limit) return;
      html.push([
        el('div',this.styles.feed,[
          el('a',this.styles.title,item.full_name,['href',item.url]),
          el('span',this.styles.stats,[
            el('i','fa fa-eye',''),
            el('span','',item.watchers_count),
            el('i','fa fa-star',''),
            el('span','',item.stargazers_count),
            el('i','fa fa-code-fork',''),
            el('span','',item.forks)
          ]),
          el('div',this.styles.description,item.description)
        ])
      ].join(''));
    });
    html.push(el('div',this.styles.footer,
      el('a','fa fa-github',json[0].owner.login,['href',json[0].owner.url])
    ));
    html.push('</div>');
    return html.join('');
  }
}

class Gist extends GithubFeed{

  constructor(element,styles,limit){
    super(element,styles,limit);
  }

  asHTML(json){
    const el = this.buildElement;
    let html = ["<div class='"+this.styles.wigit+"'>"];
    html.push(el('div',this.styles.header,
       el('i','fa fa-bookmark-o','') + 'My Github gists'
     ));
    json.map((item,i) => {
      if(i >= this.limit) return;
      html.push([
        el('div',this.styles.feed,[
          el('a',this.styles.title,Object.keys(item.files)[0],['href',item.url]),
          el('div',this.styles.description,item.description)
        ])
      ].join(''));
    });
    html.push(el('div',this.styles.footer,
      el('a','fa fa-github',json[0].owner.login,['href',json[0].owner.url])
    ));
    html.push('</div>');
    return html.join('');
  }
}

export default class GithubWigit{
    constructor(el,username,type,styles,limit){
      this.el = el;
      if(type == "repos") this.feed = new Repo(el,styles,limit);
      else this.feed = new Gist(el,styles,limit);
      this.connection = new GithubConnection(username,type);
      this.connection.then(this.feed.asElement);
      this.connection.fetch();
    }
};
