(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{550:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(847),s=a(838),c=a(840),u=a(880),i=a(849),l=a(715),h=a(25),m=a(420),p=function(e){var t=e.posts,a=e.showAuthor;return r.a.createElement(s.a.Group,{doubling:!0,stackable:!0,itemsPerRow:3},t.map(function(e){return r.a.createElement(s.a,{key:e.id},e.headerImage&&e.headerImage.src&&r.a.createElement(c.a,{as:o.a,to:"/@".concat(e.author.username,"/").concat(e.slug),src:e.headerImage.src}),r.a.createElement(s.a.Content,null,r.a.createElement(u.a,{size:"huge",className:"post-header web-font",as:o.a,to:"/@".concat(e.author.username,"/").concat(e.slug)},e.title,e.subtitle&&r.a.createElement(u.a.Subheader,{className:"web-font"},r.a.createElement(i.a,{hidden:!0}),e.subtitle))),(e.seriesCount>0||a)&&r.a.createElement(s.a.Content,{extra:!0},a&&e.author&&r.a.createElement(l.a,{image:!0,basic:!0,as:o.a,to:"/@".concat(e.author.username),color:"grey"},r.a.createElement("img",{src:"".concat("","/img/default-avatar.png"),alt:""}),e.author.username),e.seriesCount>0&&r.a.createElement(l.a,{basic:!0,color:"blue"},r.a.createElement(h.a,{icon:m.d})," ",e.seriesCount," ","\u7bc7\u7cfb\u5217\u6587")))}))};p.defaultProps={showAuthor:!1},t.a=p},551:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(846),s=a(880),c=a(873),u=function(e){var t=e.header,a=e.subHeader,n=e.buttonText,u=e.onInitClick;return r.a.createElement(o.a,{textAlign:"center"},t&&r.a.createElement(s.a,{as:"h2"},t,a&&r.a.createElement(s.a.Subheader,null,a)),u&&n&&r.a.createElement(c.a,{color:"yellow",onClick:u},n))};u.defaultProps={header:"No Post",subHeader:"You don't have any post now.",buttonText:"Create your first post now"},t.a=u},861:function(e,t,a){"use strict";a.r(t);var n=a(6),r=a(33),o=a(156),s=a(46),c=a(45),u=a(47),i=a(0),l=a.n(i),h=a(38),m=a(713),p=a(59),g=a(877),d=a(870),f=a(552),b=a.n(f),E=a(159),P=a(550),v=a(551),w=a(24),y=a(49),C=function(e){function t(){var e,a;Object(r.a)(this,t);for(var o=arguments.length,u=new Array(o),i=0;i<o;i++)u[i]=arguments[i];return(a=Object(s.a)(this,(e=Object(c.a)(t)).call.apply(e,[this].concat(u)))).gotoNewPost=function(){return a.props.redirectToNewPost()},a.fetchPosts=function(){var e=a.props;(0,e.postListByUsername)(e.username,e.pageId,null,function(e){alert(e.error.message)})},a.handlePageChange=function(e,t){var r=a.props,o=r.push,s=r.query;o({search:b.a.stringify(Object(n.a)({},s,{page:t.activePage}))})},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){this.fetchPosts()}},{key:"componentDidUpdate",value:function(e){var t=this.props,a=t.username,n=t.pageId;a===e.username&&n===e.pageId||this.fetchPosts()}},{key:"render",value:function(){var e=this.props,t=e.posts,a=e.isLoading,n=e.pageId,r=e.meta,o=e.username;return l.a.createElement(E.a,{placeholder:!0,loading:a,title:"@".concat(o)},l.a.createElement(P.a,{posts:t}),!a&&0===t.length&&l.a.createElement(v.a,{onInitClick:this.gotoNewPost}),r.total>r.limit&&l.a.createElement(g.a,{centered:!0},l.a.createElement(d.a,{text:!0,activePage:n,totalPages:Math.ceil(r.total/r.limit),onPageChange:this.handlePageChange})))}}]),t}(i.Component);t.default=Object(m.a)(Object(h.connect)(function(e,t){var a=e.auth,n=e.posts,r=e.users,o=t.match,s=t.location,c=o.params.username,u=b.a.parse(s.search),i=u.page||1,l=y.k.getUserPagesMeta(n,c),h=y.k.getListByUsernameContext(n,c,i);return{isAuth:w.c.getIsAuth(a),username:c,posts:y.k.getUserPostsWithAuthor(n,r.entities,c,i),isLoading:h.isPending,query:u,pageId:i,meta:l}},{postListByUsername:y.d,redirectToNewPost:y.i,push:p.push})(C))}}]);