/* Landscape and touch controls for the standalone campaign. */
(() => {
  'use strict';

  const root = document.documentElement;
  const coarse = window.matchMedia('(pointer: coarse)');
  const anyCoarse = window.matchMedia('(any-pointer: coarse)');
  const portrait = window.matchMedia('(orientation: portrait)');
  const mobileAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  let mobile = mobileAgent || coarse.matches || (
    navigator.maxTouchPoints > 0 && anyCoarse.matches && window.innerWidth <= 1100
  );

  if (mobile) root.classList.add('is-touch');

  const installMobileShare = window.__installMobileShare;
  window.__installMobileShare = function installMobileControls(game) {
    installMobileShare.call(this, game);
    const app = document.getElementById('app');
    const canvas = document.getElementById('view');
    const input = game.input;
    if (!app || !canvas || !input || app.querySelector('#mobile-drive')) return;

    const style = document.createElement('style');
    style.textContent = `
      #mobile-drive, #mobile-rotate { display: none; }
      .is-touch #mobile-move-hint, .is-touch .touch .t-stick { display: none !important; }
      .mobile-controls-live #mobile-drive {
        display: grid; place-items: center; position: absolute; z-index: 30;
        bottom: calc(27px + var(--sab)); left: calc(18px + var(--sal));
        width: 104px; width: clamp(94px, 28dvh, 120px); aspect-ratio: 1; border-radius: 50%;
        border: 1px solid #e8e4da78; background: #0b11199c;
        touch-action: none; user-select: none; -webkit-user-select: none;
      }
      #mobile-drive-thumb {
        width: 43%; aspect-ratio: 1; border-radius: 50%;
        background: #e8e4da43; border: 1px solid #e8e4dad1; pointer-events: none;
      }
      #mobile-drive-label {
        position: absolute; bottom: -19px; color: #e8e4da; pointer-events: none;
        font: 600 12px/1 system-ui, sans-serif; text-shadow: 0 1px 3px #000;
      }
      .mobile-controls-portrait #app > :not(#mobile-rotate) { visibility: hidden; }
      .mobile-controls-portrait #mobile-rotate {
        position: absolute; inset: 0; z-index: 125; display: grid; place-items: center;
        overflow: auto; color: #eeeae2; background: #10171d; text-align: center;
        padding: calc(16px + var(--sat)) calc(18px + var(--sar))
          calc(16px + var(--sab)) calc(18px + var(--sal));
        touch-action: manipulation;
      }
      #mobile-rotate > div { max-width: 22rem; }
      #mobile-rotate-icon {
        display: grid; place-items: center; width: 74px; height: 42px; margin: 0 auto 23px;
        border: 3px solid #ffc977; border-radius: 9px; color: #ffc977; font: 700 23px/1 sans-serif;
      }
      #mobile-rotate h2 { margin: 0 0 12px; font-size: 25px; line-height: 1.25; }
      #mobile-rotate p { margin: 0; font-size: 15px; line-height: 1.55; color: #c9c2b5; }
      #mobile-rotate button { margin-top: 18px; }
      #mobile-rotate button[hidden] { display: none; }
    `;
    document.head.appendChild(style);

    const drive = document.createElement('div');
    drive.id = 'mobile-drive';
    drive.setAttribute('role', 'group');
    drive.setAttribute('aria-label', '角色移动摇杆');
    drive.innerHTML = '<i id="mobile-drive-thumb" aria-hidden="true"></i><span id="mobile-drive-label">移动</span>';
    const thumb = drive.querySelector('#mobile-drive-thumb');

    const gate = document.createElement('section');
    gate.id = 'mobile-rotate';
    gate.setAttribute('role', 'status');
    gate.innerHTML = '<div><span id="mobile-rotate-icon" aria-hidden="true">↻</span>' +
      '<h2>请横过手机游玩</h2><p>把手机横过来，游戏画面会自动调整。' +
      '如果没有旋转，请关闭系统的竖屏锁定。</p>' +
      '<button type="button" class="btn" hidden>尝试切换横屏</button></div>';
    const rotateButton = gate.querySelector('button');
    const enterFullscreen = app.requestFullscreen || app.webkitRequestFullscreen;
    const orientation = window.screen.orientation;
    rotateButton.hidden = !(enterFullscreen && typeof orientation?.lock === 'function');
    rotateButton.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          await enterFullscreen.call(app);
        }
        await orientation.lock('landscape');
      } catch {
        if (portrait.matches && document.fullscreenElement) {
          try { await document.exitFullscreen(); } catch {}
        }
      }
    });
    app.append(drive, gate);
    const hint = app.querySelector('.mobile-share-intro');
    if (hint) hint.textContent = '请横屏游玩。左下摇杆移动，右侧拖动转视角。';

    let enabled = game.game.state === 'playing';
    let move = null;
    let look = null;
    let pendingX = 0;
    let pendingY = 0;
    let pausedByRotation = false;

    function clearInput() {
      move = look = null;
      pendingX = pendingY = 0;
      thumb.style.transform = '';
    }

    function activateTouch() {
      mobile = true;
      root.classList.add('is-touch');
      if (!input.touch) {
        // The engine's touchstart hook creates its existing touch action buttons.
        window.dispatchEvent(new Event('touchstart'));
      }
    }

    function isLive() {
      return mobile && !portrait.matches && enabled && game.game.state === 'playing';
    }

    function refreshLayout() {
      const blocked = mobile && portrait.matches;
      root.classList.toggle('mobile-controls-portrait', blocked);
      root.classList.toggle('mobile-controls-live', isLive());
      if (!isLive()) clearInput();
      if (blocked && game.game.state === 'playing') {
        pausedByRotation = true;
        game.game.pause();
      } else if (!blocked && pausedByRotation) {
        pausedByRotation = false;
        if (game.game.state === 'paused') game.game.resume();
      }
    }

    const setGameplay = input.setGameplay;
    input.setGameplay = function (next) {
      const result = setGameplay.call(this, next);
      enabled = !!next;
      if (!enabled) clearInput();
      root.classList.toggle('mobile-controls-live', isLive());
      return result;
    };
    const update = input.update;
    input.update = function (dt) {
      const result = update.call(this, dt);
      if (isLive()) {
        if (move) {
          input.move.x = move.x;
          input.move.y = move.y;
          if (move.y > 0.82 && Math.hypot(move.x, move.y) > 0.93) input.sprint = true;
        }
        const scale = 0.0052 * (Number(input.sensitivity) || 1);
        input.look.dx += pendingX * scale;
        input.look.dy += pendingY * scale * (input.invertY ? -1 : 1);
        pendingX = pendingY = 0;
      }
      return result;
    };

    function isSurface(target) {
      return target === canvas || (target instanceof Node && drive.contains(target));
    }

    function updateMove(x, y) {
      const dx = x - move.originX;
      const dy = y - move.originY;
      const distance = Math.hypot(dx, dy);
      const radius = Math.max(31, drive.offsetWidth * 0.32);
      const magnitude = Math.max(0, Math.min(1, (distance - 5) / (radius - 5)));
      move.x = distance ? dx / distance * magnitude : 0;
      move.y = distance ? -dy / distance * magnitude : 0;
      thumb.style.transform = `translate(${move.x * radius}px, ${-move.y * radius}px)`;
    }

    function contactStart(key, x, y, target) {
      const box = canvas.getBoundingClientRect();
      const onDrive = drive.contains(target);
      if (onDrive || x < box.left + box.width * 0.47) {
        if (move) return false;
        const joystick = drive.getBoundingClientRect();
        move = {
          key, x: 0, y: 0,
          originX: onDrive ? joystick.left + joystick.width / 2 : x,
          originY: onDrive ? joystick.top + joystick.height / 2 : y,
        };
        updateMove(x, y);
      } else {
        if (look) return false;
        look = { key, x, y };
      }
      return true;
    }

    function contactMove(key, x, y) {
      if (move?.key === key) {
        updateMove(x, y);
      } else if (look?.key === key) {
        pendingX += x - look.x;
        pendingY += y - look.y;
        look.x = x;
        look.y = y;
      } else return false;
      return true;
    }

    function contactEnd(key) {
      if (move?.key === key) {
        move = null;
        thumb.style.transform = '';
      } else if (look?.key === key) {
        look = null;
      } else return false;
      return true;
    }

    function consumes(event) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    }

    // Pointer events keep both thumbs tracked independently when a drag leaves the initial element.
    app.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch') return;
      if (!mobile || !input.touch) { activateTouch(); refreshLayout(); }
      if (!isLive() || !isSurface(event.target)) return;
      const key = `pointer:${event.pointerId}`;
      if (!move?.key.startsWith('touch:') && !look?.key.startsWith('touch:') &&
          contactStart(key, event.clientX, event.clientY, event.target)) {
        try { event.target.setPointerCapture(event.pointerId); } catch {}
      }
      consumes(event);
    }, { capture: true, passive: false });
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' && isLive() &&
          contactMove(`pointer:${event.pointerId}`, event.clientX, event.clientY)) consumes(event);
    }, { capture: true, passive: false });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      window.addEventListener(type, event => contactEnd(`pointer:${event.pointerId}`), true);
    }

    // Older touch browsers use TouchEvent. Stop the canvas's legacy drag handler so movement is applied only once.
    for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) {
      app.addEventListener(type, event => {
        if (!mobile || !input.touch) { activateTouch(); refreshLayout(); }
        if (!isSurface(event.target) || !isLive()) return;
        if (!move?.key.startsWith('pointer:') && !look?.key.startsWith('pointer:')) {
          for (const touch of event.changedTouches) {
            const key = `touch:${touch.identifier}`;
            if (type === 'touchstart') contactStart(key, touch.clientX, touch.clientY, event.target);
            else if (type === 'touchmove') contactMove(key, touch.clientX, touch.clientY);
            else contactEnd(key);
          }
        }
        consumes(event);
      }, { capture: true, passive: false });
    }

    game.events.on('game:state', refreshLayout);
    portrait.addEventListener?.('change', refreshLayout);
    window.addEventListener('resize', refreshLayout, { passive: true });
    window.addEventListener('blur', clearInput);
    window.addEventListener('pagehide', clearInput);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInput();
    });
    if (mobile) activateTouch();
    refreshLayout();
  };
})();
