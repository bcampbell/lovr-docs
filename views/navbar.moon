import Widget from require 'lapis.html'

Logo = require 'views.logo'

class Navbar extends Widget
  content: =>
    nav ->
      div class: 'logo', ->
        a href: '/', ->
          widget Logo
          span 'LÖVR'

      div class: 'links', ->
        a href: '/docs', 'Documentation'
        a href: '/share', 'WebVR Export'

        a href: 'https://github.com/bjornbytes/lovr', target: '_blank', rel: 'noopener', class: 'right', 'GitHub'
        a href: 'https://join.slack.com/ifyouwannabemylovr/shared_invite/MTc5ODk2MjE0NDM3LTE0OTQxMTIyMDEtMzdhOGVlODFhYg', target: '_blank', rel: 'noopener', 'Slack'
        a href: 'https://twitter.com/bjornbytes', target: '_blank', rel: 'noopener', 'Twitter'
