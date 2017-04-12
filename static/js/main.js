import oboe from 'oboe';

require('./highlight.js');
var main = document.querySelector('main');
var elDocs = document.querySelector('.docs');
var sidebarLinks = Array.prototype.slice.call(document.querySelectorAll('li[data-doc]'));
var searchBox = document.querySelector('.search');
var transitionTimeout;

var docs = {};

function pushPage(key) {
  if (history.state) {
    var scroll = elDocs.scrollTop;
    var url = prefix + '/docs';
    url += (history.state.key.length > 0 ? ('/' + history.state.key) : '');
    history.replaceState({ key: history.state.key, scroll: scroll }, '', url);
  }

  var url = prefix + '/docs';
  url += key.length > 0 ? ('/' + key) : '';
  history.pushState({ key: key, scroll: 0 }, '', url);
}

function showPage(key, scroll) {
  highlightLink(key);

  // Initiate outro animation for any existing content elements
  var contents = Array.prototype.slice.call(main.querySelectorAll('.content'));
  var isDirty = contents.length > 0;
  contents.forEach(function(content) {
    content.classList.add('outro');
    content.addEventListener('animationend', function() {
      content.remove();
    })
  });

  if (!key) {
    return;
  }

  // Create element for new content
  var newContent = document.createElement('div');
  newContent.classList.add('content');
  newContent.innerHTML = docs[key];
  newContent.dataset.key = key;
  enhance(newContent);

  // Add the new content to the DOM (animation plays automatically)
  if (transitionTimeout) { clearTimeout(transitionTimeout); }
  transitionTimeout = setTimeout(function() {
    main.appendChild(newContent);

    // Scroll to the right place if the back button was used
    if (scroll !== elDocs.scrollTop) {

      // Makes transition less jarring
      contents.forEach(function(content) {
        content.remove();
      });

      elDocs.scrollTop = scroll;
    }
  }, isDirty ? 140 : 0);

  // Set window title
  document.title = (key === 'index' ? '' : (key.replace(/_/g, ' ') + ' - ')) + 'LOVR';
}

function highlightLink(key) {
  var links = Array.prototype.slice.call(document.querySelectorAll('li[data-doc].active'));
  links.forEach(function(link) {
    link.classList.remove('active');
  });

  var activeLink = document.querySelector('li[data-doc="' + key + '"]');
  activeLink && activeLink.classList.add('active');
}

// Syntax highlighting and autolinking
function enhance(node) {
  var pres = Array.prototype.slice.call(node.querySelectorAll('pre code'));
  pres.forEach(function(pre) {
    pre.classList.add('lua');
    hljs.highlightBlock(pre);
  });

  var linkables = Array.prototype.slice.call(node.querySelectorAll('code, td'));
  linkables.forEach(function(linkable) {
    linkable.innerHTML = linkable.innerHTML.replace(/[a-zA-Z\.:]+/gm, function(token) {
      if (token !== node.dataset.key && document.querySelector('[data-doc="' + token + '"]')) {
        return '<a data-doc="' + token + '">' + token + '</a>';
      }

      return token;
    });
  });

  var links = Array.prototype.slice.call(node.querySelectorAll('a[data-doc]'));
  links.forEach(function(link) {
    link.style.cursor = 'pointer';
    link.onclick = function(event) {
      var key = link.dataset.doc;
      pushPage(key);
      showPage(key, 0);
    };
  });
}

oboe(prefix + '/api/docs')
  .node('!.*', function(node, path, ancestors) {
    var key = path[0];
    docs[key] = node;

    var li = document.querySelector('li[data-doc="' + key + '"]');
    if (li) {
      var onclick = function(event) {
        var content = document.querySelector('.content');
        if (content && content.dataset.key == key) { return; }
        pushPage(key);
        showPage(key, 0);
      };

      li.classList.remove('disabled');
      li.addEventListener('click', onclick);
      li.addEventListener('keypress', function(event) {
        if (event.keyCode == 13 || event.keyCode == 32) {
          event.preventDefault();
          onclick(event);
        }
      });
    }
  });

// Render pages when history is updated
window.addEventListener('popstate', function(event) {
  var page = (event.state && event.state.key) || 'Introduction';
  showPage(page, event.state && event.state.scroll);
});

// Add syntax highlighting and autolinking to any initial content
var initialContent = document.querySelector('.content');
if (initialContent) {
  enhance(initialContent);
  var wrapper = document.querySelector('.wrapper');
  var link = wrapper.querySelector('[data-doc="' + initialContent.dataset.key + '"]');
  var linkGeometry = link.getBoundingClientRect();
  wrapper.scrollTop = linkGeometry.top - linkGeometry.height / 2 -  wrapper.offsetHeight / 2;
}

document.onkeydown = function(event) {
  var visibleLinks = sidebarLinks.filter(function(link) { return link.style.display === ''; });
  var firstVisibleLink = visibleLinks[0];

  if (event.keyCode === 27) {
    searchBox.value = '';
    searchBox.style.display = 'none';
    searchBox.blur();
    updateResults();
  } else if (event.keyCode === 8) {
    searchBox.focus();
  } else if (event.keyCode === 13) {
    firstVisibleLink && firstVisibleLink.click();
  } else if (event.keyCode === 40) {
    if (document.activeElement === searchBox) {
      firstVisibleLink && firstVisibleLink.focus();
      event.preventDefault();
    } else if (document.activeElement && document.activeElement.dataset.doc) {
      var idx = visibleLinks.indexOf(document.activeElement);
      var next = idx >= 0 && visibleLinks[idx + 1];
      if (next) {
        next.focus();
        event.preventDefault();
      }
    }
  } else if (event.keyCode === 38) {
    if (document.activeElement && document.activeElement.dataset.doc) {
      var idx = visibleLinks.indexOf(document.activeElement);
      var prev = idx >= 0 && visibleLinks[idx - 1];
      if (prev) {
        prev.focus();
        event.preventDefault();
      } else if (idx === 0) {
        searchBox.focus();
        event.preventDefault();
      }
    }
  }
};

document.onkeypress = function(event) {
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  if (document.activeElement !== searchBox && event.key.length === 1 && /[a-zA-Z\.:]/.test(event.key)) {
    event.preventDefault();
    searchBox.style.display = 'block';
    searchBox.focus();
    searchBox.value += event.key;
    updateResults();
  }
};

searchBox.onkeyup = function() {
  setTimeout(function() {
    if (searchBox.value === '') {
      searchBox.style.display = '';
      searchBox.blur();
    } else {
      searchBox.style.display = 'block';
    }

    updateResults();
  }, 0);
};

function updateResults() {
  sidebarLinks.forEach(function(link) {
    var visible = link.dataset.doc.toLowerCase().indexOf(searchBox.value.toLowerCase()) >= 0;
    link.style.display = visible ? '' : 'none';
  });
}
