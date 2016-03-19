class Styles{
  constructor(){
    this.styles = '.ghw-feed{padding: 10px;background-color: white;border-bottom: 1px solid #e1e1e1;}.ghw-stats{float: right;}.ghw-description{width: 100%}.ghw-header, .ghw-footer{padding: 10px;}.ghw-footer{text-align: right;}.ghw-wigit{background-color: #eee;border: 1px solid #e1e1e1;-moz-border-radius: 4px;-webkit-border-radius: 4px;border-radius: 4px;}.ghw-wigit .fa{padding: 0px 5px}';
  }
  mount(){
    const tag = document.createElement('style');
    tag.innerHTML = this.styles;
    document.body.appendChild(tag);
  }
}

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

  constructor(limit){
      this.asElement = this.asElement.bind(this);
      this.asHTML = this.asHTML.bind(this);
      this.target = this.target.bind(this);
      this.setStyles = this.setStyles.bind(this);
      this.limit = limit;
      this.styles = {
          feed : 'ghw-feed',
          stats : 'ghw-stats',
          desc : 'ghw-desc',
          header : 'ghw-header',
          footer : 'ghw-footer',
          wigit : 'ghw-wigit'
      };
  }

  target(el){
    this.element = el;
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

  setStyles(styles){
    for(let style in styles){
      this.styles[style] = styles[style];
    }
  }
}

class Repo extends GithubFeed{

  constructor(limit){
    super(limit);
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
          el('div',this.styles.desc,item.description)
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

  constructor(limit){
    super(limit);
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

export default class GithubWidget{
    constructor(username,type,limit){
      if(type == "repos") this.feed = new Repo(limit);
      else this.feed = new Gist(limit);
      this.connection = new GithubConnection(username,type);
      this.styles = new Styles().mount();
    }
    mount(el){
      this.feed.target(el);
      this.connection.then(this.feed.asElement);
      this.connection.fetch();
    }
    setStyles(styles){
      this.feed.setStyles(styles);
    }
};
