/* Floi cookie-consent banner + conditional PostHog loader.
   Stores choice in localStorage. PostHog only loads on 'accepted'. */
(function () {
  var KEY = 'floi_consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadPostHog() {
    if (window.__floi_posthog_loaded) return;
    window.__floi_posthog_loaded = true;
    /* === PASTE YOUR POSTHOG SNIPPET BELOW THIS LINE === */
    /* Example — replace with the real snippet from posthog.com:
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init me ws ge fs capture De Ai $s register register_once register_for_session unregister unregister_for_session Is getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Ts $s createPersonProfile Es opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_YOUR_PROJECT_KEY', { api_host: 'https://eu.i.posthog.com', person_profiles: 'identified_only' });
    */
    /* === END PASTE === */
  }

  function buildBanner() {
    var b = document.createElement('div');
    b.id = 'consent-banner';
    b.innerHTML =
      '<div class="consent-text">' +
        'This site uses analytics and session-replay to understand how visitors interact with the site. ' +
        'Read our <a href="privacy.html">Privacy Policy</a>.' +
      '</div>' +
      '<div class="consent-buttons">' +
        '<button id="consent-decline" class="consent-btn consent-btn-secondary">Decline</button>' +
        '<button id="consent-accept" class="consent-btn consent-btn-primary">Accept</button>' +
      '</div>';
    document.body.appendChild(b);
    document.getElementById('consent-accept').addEventListener('click', function () {
      setChoice('accepted');
      b.remove();
      loadPostHog();
    });
    document.getElementById('consent-decline').addEventListener('click', function () {
      setChoice('declined');
      b.remove();
    });
  }

  function updatePrivacyPageStatus() {
    var status = document.getElementById('consent-status');
    var reset = document.getElementById('consent-reset');
    if (!status || !reset) return;
    var c = getChoice();
    var label = c === 'accepted' ? 'Analytics: ACCEPTED'
              : c === 'declined' ? 'Analytics: DECLINED'
              : 'Analytics: not chosen yet';
    status.textContent = label;
    reset.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    });
  }

  function init() {
    var c = getChoice();
    if (c === 'accepted') loadPostHog();
    else if (!c) buildBanner();
    updatePrivacyPageStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
