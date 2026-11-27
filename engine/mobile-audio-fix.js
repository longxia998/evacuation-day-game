(() => {
  'use strict';

  const installShare = window.__installMobileShare;
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const playButton = [
    'deploy',
    'resume',
    'restart',
    'retry',
    'redeploy'
  ].map((action) => `button[data-act="${action}"]`).join(',');

  window.__installMobileShare = function (game) {
    const audio = game.audio;
    const context = audio?.ctx;
    const app = document.getElementById('app');
    if (!app || !context) return installShare.apply(this, arguments);

    let activated = false;
    let primed = false;
    let pendingClick = false;
    let statusTimer = 0;
    let recoverButton;

    function isTouchGame(event) {
      return isAppleMobile
        || game.input?.touch
        || event?.pointerType === 'touch'
        || event?.type === 'touchend'
        || (navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches);
    }

    function isPlaying() {
      return game.game.state === 'playing' || game.game.state === 'intro';
    }

    function configureOutput() {
      if (!isAppleMobile) return;
      try {
        // Safari defaults Web Audio to ambient; use the media volume after a play gesture.
        const session = navigator.audioSession;
        if (session && session.type !== 'playback') session.type = 'playback';
      } catch {}
    }

    function primeOutput() {
      if (primed) return;
      try {
        // Prime Safari's output with a silent single-use buffer in the same gesture.
        const source = context.createBufferSource();
        source.buffer = context.createBuffer(1, 1, context.sampleRate);
        source.connect(context.destination);
        source.onended = () => source.disconnect();
        source.start();
        primed = true;
      } catch {}
    }

    function resumeAudio(fromGesture) {
      if (context.state === 'closed') return;
      if (fromGesture) {
        configureOutput();
        primeOutput();
      }
      if (context.state !== 'running') audio.resume();
    }

    function updateStatus() {
      const running = context.state === 'running';
      if (running && pendingClick) {
        pendingClick = false;
        // The engine could not play its menu click until the audio context started.
        audio.play('ui_click');
      }
      const show = activated && isPlaying() && !document.hidden && !running;
      if (show && !recoverButton) {
        recoverButton = document.createElement('button');
        recoverButton.type = 'button';
        recoverButton.id = 'mobile-audio-recover';
        recoverButton.textContent = '开启声音';
        recoverButton.style.cssText = 'position:absolute;z-index:110;top:calc(env(safe-area-inset-top, 0px) + 8px);left:50%;transform:translateX(-50%);min-height:44px;padding:0 14px;border:1px solid #ebc989;border-radius:6px;background:#172025;color:#fff2d2;font:600 14px system-ui';
        app.append(recoverButton);
      }
      if (recoverButton) recoverButton.hidden = !show;
    }

    function scheduleStatus() {
      clearTimeout(statusTimer);
      statusTimer = window.setTimeout(updateStatus, 350);
    }

    function unlockOnGesture(event) {
      if (!event.isTrusted || document.hidden || !isTouchGame(event)) return;
      const target = event.target;
      if (!(target instanceof Element) || !app.contains(target)) return;
      const menuButton = target.closest(playButton);
      const explicitSound = target === recoverButton;
      if (!isPlaying() && !menuButton && !explicitSound) return;
      activated = true;
      // A non-mouse activation arrives on pointerup/touchend; Safari also accepts click.
      // Never defer resume to a timer or an awaited promise.
      resumeAudio(true);
      if (event.type === 'click' && (menuButton || explicitSound)) {
        pendingClick = context.state !== 'running';
        if (explicitSound && !pendingClick) audio.play('ui_click');
      }
      scheduleStatus();
    }

    for (const type of ['pointerup', 'touchend', 'click']) {
      window.addEventListener(type, unlockOnGesture, { capture: true, passive: true });
    }
    context.addEventListener?.('statechange', scheduleStatus);
    game.events.on('game:state', scheduleStatus);
    document.addEventListener('visibilitychange', () => {
      if (activated && !document.hidden) resumeAudio(false);
      scheduleStatus();
    });
    return installShare.apply(this, arguments);
  };
})();
