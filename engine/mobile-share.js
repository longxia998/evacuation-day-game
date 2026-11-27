/* Touch UI and share actions for the standalone campaign. Install after the V5 modules. */
(function () {
  'use strict';

  // Set the layout before the first tap so the button does not move mid-gesture.
  if (matchMedia('(pointer: coarse)').matches) {
    document.documentElement.classList.add('is-touch');
  }

  window.__installMobileShare = function (game) {
    const app = document.getElementById('app');
    const title = app?.querySelector('.m-title-main');
    const actions = title?.querySelector('.m-actions');
    const storyCard = document.getElementById('story-v4-card');
    if (!app || !title || !actions || !game.arsenal || game.mobileShare) return;

    const style = document.createElement('style');
    style.textContent = `
      .mobile-share-intro { display: none; }
      #mobile-armory, #mobile-armory-panel, #mobile-move-hint { display: none; }
      #share-game-status:empty { display: none; }
      #share-game-status { margin: 8px 0 0; font-size: 14px; color: var(--bone); }
      #share-game-status input { display: block; width: min(100%, 27rem); margin-top: 8px; padding: 8px; font-size: 16px; color: var(--bone); background: #161c20; border: 1px solid #a79574; }
      @media (pointer: coarse), (hover: none) and (max-width: 1100px) {
        .mobile-share-intro { display: block; margin: 9px 0 0; color: var(--bone-dim); font-size: 13px; line-height: 1.45; }
      }
      .is-touch { overscroll-behavior: none; }
      .is-touch #app { inset: 0; }
      .is-touch .m-title { overflow: auto; padding-top: calc(56px + var(--sat)); padding-bottom: calc(16px + var(--sab)); }
      .is-touch .m-title-main .m-actions .btn { min-height: 46px; }
      .is-touch .m-title-main .m-actions { gap: 6px; }
      .is-touch #story-v4-open { top: calc(8px + var(--sat)) !important; right: calc(8px + var(--sar)) !important; min-height: 44px; }
      .is-touch #story-v4-panel { box-sizing: border-box; padding: max(8px, var(--sat)) max(8px, var(--sar)) max(8px, var(--sab)) max(8px, var(--sal)); overflow: auto; }
      .is-touch #story-v4-panel > div { box-sizing: border-box; width: min(100%, 32rem); max-height: 100%; overflow: auto; padding: 12px 14px; }
      .is-touch #story-v4-panel select, .is-touch #story-v4-panel button { min-height: 44px; font-size: 16px; max-width: 95%; }
      .is-touch #story-v4-panel label { margin: 3px 0; }
      .is-touch .touch.on .t-reload { display: none; }
      .is-touch .touch.on .t-interact { display: block; }
      .is-touch .t-btn { background: #131a20a1; border-color: #e8e4da96; font-size: 13px; }
      .is-touch .t-btn.active { background: #ffb34744; border-color: #ffb347; }
      .is-touch .t-fire { width: 72px; height: 72px; right: calc(10px + var(--sar)); bottom: calc(18px + var(--sab)); font-size: 15px; }
      .is-touch .t-jump { width: 48px; height: 48px; right: calc(14px + var(--sar)); bottom: calc(102px + var(--sab)); }
      .is-touch .t-ads { width: 50px; height: 50px; right: calc(94px + var(--sar)); bottom: calc(17px + var(--sab)); }
      .is-touch .t-interact { width: 52px; height: 52px; right: calc(88px + var(--sar)); bottom: calc(81px + var(--sab)); color: var(--signal-hot); border-color: var(--signal); }
      .is-touch .t-pause { width: 44px; height: 44px; right: calc(8px + var(--sar)); top: calc(7px + var(--sat)); border-radius: 6px; }
      .is-touch.playing-mobile #mobile-armory { display: block; position: absolute; z-index: 44; right: calc(58px + var(--sar)); top: calc(7px + var(--sat)); min-width: 56px; min-height: 44px; background: #131a20dd; color: #ffd38b; border: 1px solid #d6a65f; border-radius: 6px; font: 700 13px/1 system-ui; }
      .is-touch #arsenal-bar { display: none !important; }
      .is-touch #mobile-armory-panel:not([hidden]) { display: flex; position: absolute; z-index: 86; inset: calc(8px + var(--sat)) calc(8px + var(--sar)) calc(8px + var(--sab)) calc(8px + var(--sal)); align-items: flex-start; justify-content: center; padding: 0; background: #0c1015ed; border: 1px solid #9c8154; border-radius: 10px; }
      .mobile-armory-content { box-sizing: border-box; padding: 8px 12px 12px; width: min(100%, 52rem); height: 100%; overflow: auto; overscroll-behavior: contain; touch-action: pan-y; }
      .mobile-armory-heading { display: flex; gap: 10px; justify-content: space-between; align-items: center; padding-bottom: 8px; font-size: 16px; color: #ffe0a8; }
      .mobile-armory-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 6px; }
      #mobile-armory-panel button { box-sizing: border-box; min-height: 44px; padding: 7px 9px; border: 1px solid #666155; border-radius: 5px; color: #eee6d7; background: #202832; font: 600 14px/1.15 system-ui; text-align: left; }
      #mobile-armory-panel button[aria-pressed=true] { border-color: #ffbf65; background: #594224; color: #fff0d5; }
      #mobile-armory-panel .mobile-armory-grid small { display: block; font: 400 11px/1.35 system-ui; margin-top: 4px; color: #ccd0ce; }
      .is-touch.playing-mobile #mobile-move-hint { display: grid; position: absolute; z-index: 24; pointer-events: none; left: calc(19px + var(--sal)); bottom: calc(27px + var(--sab)); width: 88px; height: 88px; border: 1px dashed #e8e4da66; border-radius: 50%; place-items: center; color: #e8e4da9c; background: #11161c3e; font: 600 12px system-ui; }
      .is-touch #app:has(.t-stick.on) #mobile-move-hint { visibility: hidden; }
      .is-touch .h-compass { top: calc(7px + var(--sat)); left: calc((100% - 110px)/2); width: min(235px, calc(100% - 142px)); }
      .is-touch .h-heading { display: none; }
      .is-touch .h-ammo { top: calc(57px + var(--sat)) !important; right: calc(10px + var(--sar)); max-width: min(112px, 27vw); }
      .is-touch .h-ammo-n { font-size: 33px; }
      .is-touch .h-ammo-r, .is-touch .h-pips, .is-touch .h-ammo .h-cue { display: none; }
      .is-touch .h-wname { display: block; margin: 4px 0 0; line-height: 1.15; font-size: 11px; }
      .is-touch .h-health { top: auto !important; bottom: calc(6px + var(--sab)); left: calc(12px + var(--sal)); }
      .is-touch .h-health .h-k { display: none; }
      .is-touch .h-health .h-hp-row { margin-top: 0; gap: 5px; }
      .is-touch .h-hp-n { font-size: 21px; }
      .is-touch .h-hp-bar { gap: 2px; }
      .is-touch .h-hp-bar i { width: 5px; height: 4px; }
      .is-touch .h-feed { display: none; }
      .is-touch .h-msg { bottom: calc(26% + var(--sab)); max-width: min(46vw, 28rem); font-size: 12px; }
      .is-touch .comms { top: auto; bottom: calc(12px + var(--sab)); width: min(calc(100% - 280px), 30rem); }
      .is-touch .comms-who { margin-bottom: 3px; }
      .is-touch .comms-t { font-size: 13px; line-height: 1.35; padding: 2px 4px; }
      .is-touch .h-warn { font-size: min(14px, 3.7vw); max-width: min(56vw, 27rem); text-align: center; }
      .is-touch #story-v4-card { top: calc(var(--sat) + 48px) !important; left: calc(var(--sal) + 7px) !important; width: min(260px, 49vw) !important; max-width: 49vw !important; padding: 7px 8px !important; box-sizing: border-box; font-size: 11px !important; line-height: 1.3 !important; }
      .is-touch #story-v4-card strong { font-size: 12px !important; }
      .is-touch #story-v4-card small { display: none !important; }
      .is-touch #story-v4-card em { margin-top: 3px; }
      .is-touch #pickup-v5-status { top: calc(var(--sat) + 105px) !important; bottom: auto !important; right: calc(var(--sar) + 6px) !important; left: auto !important; max-width: none !important; padding: 3px 4px !important; font-size: 10px !important; width: 119px; text-align: right; }
      .is-touch #pickup-v5-status button { min-height: 44px; min-width: 53px; margin: 2px 0 0 3px; padding: 4px 3px; font-size: 12px !important; }
      .is-touch #pickup-v5-status button:disabled { opacity: .48; }
      .is-touch #pickup-v5-status small:empty { display: none; }
      @media (orientation: portrait) {
        .is-touch .comms { bottom: calc(156px + var(--sab)); width: min(calc(100% - 30px), 30rem); }
        .is-touch .h-msg { bottom: calc(220px + var(--sab)); }
      }
      @media (orientation: landscape) and (max-height: 490px) {
        .is-touch .m-title { align-items: flex-end; }
        .is-touch .m-word { font-size: clamp(39px, 13vh, 63px) !important; }
        .is-touch .m-note { margin-top: 7px !important; }
        .is-touch .m-actions { margin-top: 8px !important; }
        .is-touch #story-v4-card { width: min(260px, 33vw) !important; }
        .is-touch #pickup-v5-status { top: calc(var(--sat) + 56px) !important; right: calc(var(--sar) + 104px) !important; }
        .is-touch .m-legend { display: none; }
      }
      @media (orientation: landscape) and (max-height: 320px) {
        .is-touch .t-fire { width: 60px; height: 60px; }
        .is-touch .t-jump { bottom: calc(88px + var(--sab)); }
        .is-touch .t-interact { bottom: calc(70px + var(--sab)); }
        .is-touch .m-title-main .m-note { display: none; }
      }
    `;
    document.head.appendChild(style);

    const hint = document.createElement('p');
    hint.className = 'mobile-share-intro';
    hint.textContent = '手机横屏更宽。左侧拖动移动，右侧拖动转视角，点屏幕上的按钮操作。';
    title.querySelector('.m-premise')?.after(hint);
    const touchLegend = app.querySelector('.lg-touch span:last-child');
    if (touchLegend) touchLegend.textContent = '屏幕按钮：开火 · 瞄准 · 跳跃 · 交互 · 武器';
    const share = document.createElement('button');
    const shareStatus = document.createElement('p');
    share.type = 'button';
    share.className = 'btn';
    share.textContent = '分享游戏';
    shareStatus.id = 'share-game-status';
    shareStatus.setAttribute('role', 'status');
    if (location.protocol === 'https:' || location.protocol === 'http:') {
      actions.appendChild(share);
      actions.after(shareStatus);
    }
    share.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.search = '';
      url.hash = '';
      if (navigator.share) {
        try { await navigator.share({ title: '撤离日：扩展战役版', url: url.href }); return; }
        catch (error) { if (error?.name === 'AbortError') return; }
      }
      try {
        await navigator.clipboard.writeText(url.href);
        shareStatus.textContent = '链接已复制，可转发给朋友。';
      } catch {
        shareStatus.textContent = '复制下面的网址，再转发给朋友。';
        const link = document.createElement('input');
        link.readOnly = true;
        link.setAttribute('aria-label', '游戏链接');
        link.value = url.href;
        shareStatus.appendChild(link);
        link.focus();
        link.select();
      }
    });

    const moveHint = document.createElement('div');
    moveHint.id = 'mobile-move-hint';
    moveHint.setAttribute('aria-hidden', 'true');
    moveHint.textContent = '拖动移动';
    const armory = document.createElement('button');
    armory.type = 'button';
    armory.id = 'mobile-armory';
    armory.textContent = '武器';
    armory.setAttribute('aria-controls', 'mobile-armory-panel');
    armory.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('div');
    panel.id = 'mobile-armory-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', '选择武器');
    panel.innerHTML = '<div class="mobile-armory-content"><div class="mobile-armory-heading"><strong>选择武器 · 无限弹药</strong><button type="button" data-close>返回战斗</button></div><div class="mobile-armory-grid"></div></div>';
    app.append(moveHint, armory, panel);

    const choices = game.arsenal.weapons.map((weapon, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = weapon.name;
      if (weapon.description) {
        const description = document.createElement('small');
        description.textContent = weapon.description;
        button.appendChild(description);
      }
      button.addEventListener('click', () => {
        game.arsenal.choose(index);
        closePanel(true);
      });
      panel.querySelector('.mobile-armory-grid').appendChild(button);
      return button;
    });
    let gameplaySuspended = false;
    function closePanel(resume) {
      panel.hidden = true;
      armory.setAttribute('aria-expanded', 'false');
      if (gameplaySuspended && resume && game.game.state === 'playing') {
        game.input.setGameplay(true);
      }
      gameplaySuspended = false;
    }
    armory.addEventListener('click', () => {
      if (game.game.state !== 'playing' || !game.input.touch) return;
      // Pause the game clock and damage while inspecting the arsenal without raising the pause menu.
      game.input.setGameplay(false);
      gameplaySuspended = true;
      choices.forEach((button, index) => button.setAttribute('aria-pressed', String(index === game.arsenal.index)));
      panel.hidden = false;
      armory.setAttribute('aria-expanded', 'true');
      panel.querySelector('button').focus({ preventScroll: true });
    });
    panel.querySelector('[data-close]').addEventListener('click', () => closePanel(true));
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); closePanel(true); }
    });
    game.events.on('game:state', ({ state }) => {
      document.documentElement.classList.toggle('playing-mobile', state === 'playing');
      if (state !== 'playing') closePanel(false);
    });
    document.documentElement.classList.toggle('playing-mobile', game.game.state === 'playing');

    const supplies = game.pickupsV5;
    const med = app.querySelector('#pickup-v5-status [data-use="med"]');
    const smoke = app.querySelector('#pickup-v5-status [data-use="smoke"]');
    let prior = '';
    const update = game.game.update.bind(game.game);
    game.game.update = function (dt) {
      if (gameplaySuspended && game.game.state === 'playing') return false;
      const result = update(dt);
      if (game.input.touch && supplies?.inventory && med && smoke) {
        const inventory = supplies.inventory;
        const counts = `${inventory.med}|${inventory.smoke}`;
        if (counts !== prior) {
          prior = counts;
          med.textContent = `急救 ${inventory.med}`;
          smoke.textContent = `烟雾 ${inventory.smoke}`;
          med.disabled = inventory.med < 1;
          smoke.disabled = inventory.smoke < 1;
        }
      }
      return result;
    };
    if (storyCard && typeof MutationObserver !== 'undefined') {
      new MutationObserver(() => {
        if (!game.input.touch) return;
        const objective = storyCard.querySelector('em');
        if (objective && /\bE\b/.test(objective.textContent)) {
          objective.textContent = objective.textContent.replace(/\bE\b/g, '「交互」');
        }
      }).observe(storyCard, { subtree: true, childList: true });
    }
    game.mobileShare = { panel };
  };
})();
