document.addEventListener('DOMContentLoaded', function () {
  var card = document.getElementById('discord-card');
  var container = document.getElementById('discord-members');

  if (!card || !container) {
    return;
  }

  var widgetUrl = card.dataset.widgetUrl;
  if (!widgetUrl) {
    return;
  }

  function renderFallback() {
    container.replaceChildren();

    var fallback = document.createElement('span');
    fallback.style.fontSize = '12px';
    fallback.style.color = '#949ba4';
    fallback.textContent = 'Members online';
    container.appendChild(fallback);
  }

  fetch(widgetUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to fetch Discord widget data');
      }
      return response.json();
    })
    .then(function (data) {
      var members = Array.isArray(data.members) ? data.members : [];
      var presenceCount = typeof data.presence_count === 'number' ? data.presence_count : null;

      container.replaceChildren();

      if (members.length > 0) {
        var avatars = document.createElement('div');
        avatars.style.display = 'flex';
        avatars.style.gap = '4px';
        avatars.style.alignItems = 'center';

        members.forEach(function (member) {
          if (!member.avatar_url) {
            return;
          }

          var avatar = document.createElement('img');
          avatar.src = member.avatar_url;
          avatar.alt = member.username ? member.username + ' avatar' : 'Discord member avatar';
          avatar.title = member.username || '';
          avatar.loading = 'lazy';
          avatar.style.width = '32px';
          avatar.style.height = '32px';
          avatar.style.borderRadius = '50%';
          avatar.style.border = '2px solid #3b3d44';
          avatars.appendChild(avatar);
        });

        if (avatars.childElementCount > 0) {
          container.appendChild(avatars);
        }
      }

      if (presenceCount !== null) {
        var count = document.createElement('span');
        count.style.fontSize = '12px';
        count.style.color = '#23a55a';
        count.style.fontWeight = '600';
        count.textContent = '\u25CF ' + presenceCount + ' online';
        container.appendChild(count);
      } else if (container.childElementCount === 0) {
        renderFallback();
      }
    })
    .catch(function () {
      renderFallback();
    });
});
