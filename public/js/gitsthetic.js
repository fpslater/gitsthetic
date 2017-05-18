(function(){
  const loginPage = $('#login-page'),
        loginLabel = $('#login-page div'),
        loginButton = $('#login-page button'),
        loginInput = $('#login-page input'),
        reposPage = $('#repos-page');
        reposList = $('.repos-list');

  const accountName = 'fpslater';

  function deconstructForm(callback) {
    let className = 'complete';
    loginLabel.addClass(className);
    loginButton.addClass(className);
    loginInput.addClass(className);
    setTimeout(function() {
      loginPage.removeClass('active')
      callback();
    }, 1100)
  }

  function transitionToGraph(data) {
    deconstructForm(function() {
      renderRepos(data)
    });
  }

  function submit(accountName) {
    $.ajax({
        url: '/login', 
        type: 'POST', 
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({ user: accountName })}
    ).done(function(data) {
      if (data.length) {
        transitionToGraph(data);
      } else {
        alert('No repos available for that user.')
      }
    }).fail(function() {
      alert('API error');
    });
  }

  function renderRepos(repos) {
    reposPage.addClass('active');
    setTimeout(function() {
      $('#repos-page .label').addClass('active');
    }, 100);
    for(var i = 0; i < repos.length; i++) {
      let repo = repos[i];
      (function( repo, index ) {
        setTimeout(function () {
          let rightAlign = index % 2,
              newRepo = new Repo(repo.name, repo.html_url, repo.description, rightAlign);
          reposList.append(newRepo.render());
          setTimeout(function() {
            $('.repo').addClass('active');
            if (index === repos.length-1) {
              reposPage.addClass('ready');
            }
          }, 10)
        }, 200 * (i+2));
      })(repo, i);
    }
  }

  // this would be a good place for a React component
  function Repo(repoName, url, description, rightAlign) {
      this.repoName = repoName;
      this.url = url;
      this.description = description;
      this.klass = rightAlign ? 'right-align' : '';

      this.render = function() {
        return '<article class="repo '+this.klass+'" ><a href="'+this.url+'" target=_blank><div class="repo-name">'+this.repoName+'</div><div class="repo-description">'+this.description+'</div></a></article>';
      }
  }

  loginInput.on('change paste keyup', function() {
    if ($(this).val()) {
      loginButton.attr('disabled', true);
      loginButton.addClass('disabled');
    } else {
      loginButton.removeAttr('disabled');
      loginButton.removeClass('disabled');
    }
  });

  loginInput.keypress(function (e) {
    if (e.which == 13) {
      submit($(this).val());
    }
  });

  loginButton.click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    submit(accountName);
  });
})();