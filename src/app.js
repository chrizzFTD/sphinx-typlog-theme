$(function() {

  // control sidebar
  $('.t-head_menu').on('click',function(){$('body').addClass('_expand')});
  $('.t-body').on('click',function(){$('body').removeClass('_expand')});
  $('.t-sidebar_close').on('click',function(){$('body').removeClass('_expand')});


  // footnote
  $('a.footnote-reference').on('click', function(e) {
    e.preventDefault();
    var id = $(this).attr('href');
    var html = $(id).find('td.label + td').html();

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var style = 'top:' + e.pageY + 'px;';
    if (w > 560) {
      style += 'width:480px;';
      if (e.pageX > 240 && e.pageX + 240 < w) {
        style += 'left:' + (e.pageX - 240) + 'px;';
      } else if (e.pageX <= 240) {
        style += 'left:20px;';
      } else {
        style += 'right:20px;';
      }
    }
    showFootnote(html, style);
  });

  function showFootnote(html, style) {
    var CONTENT_ID = 'typlog-footnote-content';
    var content = document.getElementById(CONTENT_ID);
    if (!content) {
      content = document.createElement('div');
      content.id = CONTENT_ID;
      $('.t-body').append(content);
    }
    var MASK_ID = 'typlog-footnote-mask';
    var mask = document.getElementById(MASK_ID);
    if (!mask) {
      mask = document.createElement('div');
      mask.id = MASK_ID;
      document.body.appendChild(mask);
      mask.addEventListener('click', function () {
        content.className = '';
        mask.className = '';
      });
    }

    content.innerHTML = html;
    content.setAttribute('style', style);
    content.className = '_active';
    mask.className = '_active';
  }

  // github badge
  function fetchGitHubRepo (repo) {
    var url = 'https://api.github.com/repos/' + repo;
    $.getJSON(url, function (data) {
      var counts = [+new Date(), data.stargazers_count, data.forks_count];
      localStorage.setItem('gh:' + repo, JSON.stringify(counts));
      updateGitHubStats(counts[1], counts[2]);
    });
  }

  function updateGitHubStats (stars, forks) {
    $('.github_stars strong').text(stars);
    $('.github_forks strong').text(forks);
  }

  function initGitHub (url) {
    if (!url) {
      return
    }
    var repo = url.replace('https://github.com/', '');
    var cache = localStorage.getItem('gh:' + repo);
    if (cache) {
      try {
        var counts = JSON.parse(cache);
        updateGitHubStats(counts[1], counts[2]);
        var delta = new Date() - counts[0];
        if (delta < 0 || delta > 900000) {
          fetchGitHubRepo(repo);
        }
      } catch (error) {
        fetchGitHubRepo(repo);
      }
    } else {
      fetchGitHubRepo(repo);
    }
  }

  initGitHub($('.github').attr('href'));

});
