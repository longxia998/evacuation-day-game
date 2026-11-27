/* Extra arsenal and special-infected behaviors; install after V4 weapon, monster and rocket systems. */
window.__installCombatV5=function(G){
 if(G.combatV5)return G.combatV5;
 const T=G.THREE,bar=document.getElementById('arsenal-bar'),list=G.arsenal.weapons;
 const extra=[
  {name:'精确射手步枪',rpm:220,damage:140,range:420,spread:.25,zoom:32,base:5,description:'中远距精准射击'},
  {name:'短管突击卡宾枪',rpm:860,damage:46,range:200,spread:.85,base:2,description:'近中距快速火力'},
  {name:'战术冲锋枪',rpm:1120,damage:33,range:145,spread:1.3,base:2,description:'高速压制'},
  {name:'自动霰弹枪',rpm:300,damage:25,range:70,pellets:8,spread:3.1,base:3,description:'连续近距散射'},
  {name:'反器材狙击枪',rpm:50,damage:430,range:620,spread:.10,zoom:15,base:5,description:'高倍瞄准与重型火力'},
  {name:'大口径战斗步枪',rpm:420,damage:105,range:330,spread:.60,base:4,description:'重弹高伤害'},
  {name:'双管霰弹枪',rpm:100,damage:33,range:55,pellets:12,spread:4,base:3,description:'极近距爆发'},
  {name:'消音战术手枪',rpm:300,damage:90,range:180,spread:.45,base:1,description:'安静精准'},
  {name:'自动榴弹炮',rpm:110,damage:80,range:220,radius:4.8,blast:190,spread:.55,projectile:'grenade',speed:38,gravity:2.5,base:7,description:'曲线弹体与范围伤害'},
  {name:'高速爆破机炮',rpm:300,damage:40,range:240,radius:2.5,blast:85,spread:1.15,projectile:'cannon',speed:70,gravity:0,base:4,description:'连续爆破火力'}
 ];
 list.push(...extra);
 let page=0,selected=-1,setPage=()=>{};
 if(bar){
  bar.insertAdjacentHTML('beforeend',extra.map((w,i)=>`<button type="button" data-gun="${i+9}" title="${w.description}"><b>${i+10}</b> ${w.name}</button>`).join(''));
  const flip=document.createElement('button');flip.type='button';flip.className='arsenal-page';bar.appendChild(flip);
  setPage=function(p){page=p?1:0;bar.querySelectorAll('[data-gun]').forEach(b=>{let i=+b.dataset.gun;b.style.display=(page?(i>=9):(i<9))?'':'none'});flip.textContent=page?'◀ 轻重武器 1–9':'更多武器 10–19 ▶';flip.title=page?'切回第一页':'打开第二页'};
  flip.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();setPage(1-page)});G.events.on('game:state',({state})=>{if(state==='playing')setPage(G.arsenal.index>=9?1:0)});setPage(0);
  window.addEventListener('keydown',e=>{if(G.game.state!=='playing'||e.repeat)return;if(e.code==='BracketLeft'||e.code==='BracketRight'){e.preventDefault();e.stopImmediatePropagation();let n=list.length;G.arsenal.choose((G.arsenal.index+(e.code==='BracketRight'?1:n-1))%n);setPage(G.arsenal.index>=9?1:0)}else if(page&&/^Digit[0-9]$/.test(e.code)){e.preventDefault();e.stopImmediatePropagation();const d=+e.code.slice(-1);G.arsenal.choose(d===0?18:d+8)}},true);
 }
 // Reuse preloaded, textured weapon bodies while adding distinguishing attachments.
 const view=new T.Group();G.weapon.root.add(view);
 const metal=new T.MeshStandardMaterial({color:0x222c2a,roughness:.55,metalness:.65}),polymer=new T.MeshStandardMaterial({color:0x34372c,roughness:.8,metalness:.2});
 const accessories=extra.map((w,i)=>{const g=new T.Group();view.add(g);g.visible=false;function tube(r,len,x,y,z){let m=new T.Mesh(new T.CylinderGeometry(r,r,len,12),metal);m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.layers.set(1);g.add(m);return m}function box(w,h,d,x,y,z){let m=new T.Mesh(new T.BoxGeometry(w,h,d),polymer);m.position.set(x,y,z);m.layers.set(1);g.add(m);return m}
  if([0,4,5].includes(i)){tube(.018,.17,0,.105,-.14);tube(.024,.025,0,.105,-.23)}
  if([1,2,7].includes(i))tube(.016,.12,0,.012,-.50);
  if(i===6){tube(.016,.22,-.018,.014,-.41);tube(.016,.22,.018,.014,-.41)}
  if(i===8){tube(.042,.22,0,-.01,-.32);box(.09,.08,.13,0,-.04,-.18)}
  if(i===9){tube(.032,.27,0,.014,-.38);box(.07,.12,.06,.05,-.04,-.08)}
  return g;});
 function updateView(){const i=G.arsenal.index;if(i===selected)return;selected=i;setPage(i>=9?1:0);accessories.forEach((g,j)=>g.visible=i===j+9);if(i>=9){const w=list[i];if(G.arsenal.modelGroups){G.arsenal.modelGroups.forEach((m,j)=>m.visible=j===w.base)}G.arsenal.baseParts?.forEach(o=>o.visible=false);G.hud.message?.(`${w.name} · ${w.description} · 无限弹药`,2.8)} }
 const rounds=[],effects=[];const trailGeo=new T.SphereGeometry(.04,7,5),trailMat=new T.MeshBasicMaterial({color:0xffa644});
 const oldFire=window.__weaponFire;
 window.__weaponFire=function(game,origin,dir){const w=game.arsenal?.active;if(game!==G||!w?.projectile)return oldFire(game,origin,dir);game.combat.stats.shots++;const g=new T.Group(),shell=new T.Mesh(new T.CylinderGeometry(.028,.04,.20,10),metal);shell.rotation.x=Math.PI/2;g.add(shell);g.position.copy(origin).addScaledVector(dir,.35);g.quaternion.setFromUnitVectors(new T.Vector3(0,0,-1),dir.clone().normalize());G.scene.add(g);rounds.push({node:g,pos:g.position,vel:dir.clone().normalize().multiplyScalar(w.speed),left:w.range,age:0,weapon:{...w},trail:0});while(rounds.length>20){let x=rounds.shift();G.scene.remove(x.node)}return {point:origin.clone(),normal:dir.clone().negate(),dist:0,surface:'launcher'};};
 function explosion(pos,normal,r,damage,dir,hit){if(hit?.enemy?.alive){G.combat.stats.hits++;const killed=hit.enemy.damage(damage*.35,pos,dir,hit.part)===true;G.events.emit('player:hitEnemy',{enemy:hit.enemy,part:hit.part,killed,weak:hit.part==='weak'})}for(const e of [...G.enemies.list]){if(!e.alive)continue;const p=e.pos.clone().add(new T.Vector3(0,1,0)),d=p.distanceTo(pos);if(d>r)continue;let ok=true;try{ok=G.physics.lineOfSight(pos.clone().addScaledVector(normal,.2),p)}catch{}if(ok)e.damage(damage*Math.max(.25,1-d/r*.75),pos,dir,'body')}
  const g=new T.Group(),orbMat=new T.MeshBasicMaterial({color:0xff9a30,transparent:true,opacity:.8,depthWrite:false,blending:T.AdditiveBlending}),orb=new T.Mesh(new T.SphereGeometry(1,12,8),orbMat),ringMat=new T.MeshBasicMaterial({color:0xffd57c,transparent:true,opacity:.8,side:T.DoubleSide,depthWrite:false}),ring=new T.Mesh(new T.RingGeometry(.8,1,24),ringMat),light=new T.PointLight(0xff8030,18,r*3);g.position.copy(pos);ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);g.add(orb,ring,light);G.scene.add(g);effects.push({g,orb,ring,orbMat,ringMat,light,t:0,r});try{G.fx.smoke?.(pos,{size:.5,life:1.8,rise:.7,count:6,alpha:.48})}catch{}G.player.addShake?.(.22);G.events.emit('impact',{point:pos.clone(),normal:normal.clone(),surface:hit?.enemy?'enemy':hit?.surface||'concrete',enemy:hit?.enemy||null,dir:dir.clone(),from:'player'});}
 function updateProjectiles(dt){for(let i=rounds.length-1;i>=0;i--){const b=rounds[i],start=b.pos.clone(),delta=b.vel.clone().multiplyScalar(dt),distance=delta.length(),dir=delta.clone().normalize();let wall=null,hit=null;try{wall=G.physics.raycast(start,dir,distance);hit=G.enemies.raycast(start,dir,wall?wall.dist:distance)||wall}catch{}if(hit&&hit.dist<=distance){rounds.splice(i,1);G.scene.remove(b.node);explosion(hit.point,hit.normal||dir.clone().negate(),b.weapon.radius,b.weapon.blast,dir,hit);continue}b.pos.add(delta);b.vel.y-=(b.weapon.gravity||0)*dt;b.left-=distance;b.age+=dt;b.trail-=dt;if(b.trail<=0){b.trail=.08;try{G.fx.smoke?.(b.pos,{size:.12,life:.6,rise:.1,count:1,alpha:.22})}catch{}}if(b.left<=0||b.age>8){rounds.splice(i,1);G.scene.remove(b.node);explosion(b.pos.clone(),dir.clone().negate(),b.weapon.radius,b.weapon.blast,dir,null)}}for(let i=effects.length-1;i>=0;i--){const b=effects[i];b.t+=dt;const t=Math.min(1,b.t/.7);b.orb.scale.setScalar(b.r*(.08+t*.3));b.ring.scale.setScalar(b.r*(.08+t*.7));b.orbMat.opacity=.7*(1-t);b.ringMat.opacity=.8*(1-t);b.light.intensity=18*(1-t);if(t>=1){G.scene.remove(b.g);b.orb.geometry.dispose();b.ring.geometry.dispose();b.orbMat.dispose();b.ringMat.dispose();effects.splice(i,1)}}}
 // Higher threat and readable attacks: brute armor, hunter charge, boss reinforcement.
 const oldSpawn=G.enemies.spawnVariant.bind(G.enemies),oldEnemyUpdate=G.enemies.update.bind(G.enemies),specials=new Set();
 G.enemies.spawnVariant=function(type,pos,opts){const e=oldSpawn(type,pos,opts);if(!e)return e;e.hp*=type==='boss'?1.35:1.16;e.attackDamage=(e.attackDamage||9)*1.18;e._v5={charge:5+Math.random()*3,wind:0,burst:0,call:10+Math.random()*4,callWind:0};if(type==='brute'){const receive=e.damage.bind(e);e.damage=(amount,point,direction,part)=>receive(part==='weak'?amount:amount*.68,point,direction,part)}specials.add(e);return e};
 function updateSpecials(dt){for(const e of specials){if(!e.alive){specials.delete(e);continue}const v=e._v5,d=e.pos.distanceTo(G.player.pos);if(e.variantType==='hunter'){v.charge-=dt;if(v.charge<=0&&d>4&&d<15){v.charge=7;v.wind=.9;if(e.warningRing)e.warningRing.visible=true;G.hud.warn?.('猎杀者准备突进！',1.2)}if(v.wind>0){v.wind-=dt;if(v.wind<=0){v.burst=.65;if(e.warningRing)e.warningRing.visible=false}}if(v.burst>0){v.burst-=dt;const velocity=G.player.pos.clone().sub(e.pos);velocity.y=0;if(velocity.lengthSq()>.01){velocity.normalize().multiplyScalar(7);G.physics.moveCapsule(e.pos,velocity,dt,.27,1.75,true);e.group.position.copy(e.pos)}}}if(e.variantType==='boss'){v.call-=dt;if(v.call<=0&&d<24&&G.enemies.aliveCount()<8){v.call=14;v.callWind=1.5;G.hud.warn?.('首领发出嘶吼，增援正在靠近！',2)}if(v.callWind>0){v.callWind-=dt;if(v.callWind<=0){for(let i=0;i<2;i++){let p;try{p=G.physics.nav.randomPoint(e.pos,5)}catch{p=e.pos.clone().add(new T.Vector3(2+i,0,1))}G.enemies.spawnVariant('runner',p,{state:'alert'})}}}}}}
 let buffUntil=0;const smokeZones=[];const api={weapons:extra,projectiles:rounds,effects,smokeZones,grantDamageBoost(seconds=15){buffUntil=performance.now()+seconds*1000;G.hud.message?.('火力强化 '+seconds+' 秒',2)},smokeAt(pos,seconds=12){smokeZones.push({pos:pos.clone(),left:seconds,next:0});G.hud.message?.('烟雾正在扩散',2)},get damageBoostActive(){return performance.now()<buffUntil}};
 const boostedFire=window.__weaponFire;window.__weaponFire=function(game,origin,dir){const w=game.arsenal?.active;if(game!==G||!w||!api.damageBoostActive)return boostedFire(game,origin,dir);const damage=w.damage,blast=w.blast;try{w.damage*=1.35;if(blast)w.blast*=1.35;return boostedFire(game,origin,dir)}finally{w.damage=damage;if(blast)w.blast=blast}};
 function cleanup(){for(const r of rounds)G.scene.remove(r.node);rounds.length=0;for(const b of effects){G.scene.remove(b.g);b.orb.geometry.dispose();b.ring.geometry.dispose();b.orbMat.dispose();b.ringMat.dispose()}effects.length=0;specials.clear();smokeZones.length=0;buffUntil=0;}
 G.events.on('game:state',({state})=>{if(['intro','dead','complete','title'].includes(state))cleanup()});
 const oldUpdate=G.game.update.bind(G.game);G.game.update=function(dt){const result=oldUpdate(dt);if(G.game.state==='playing'){updateView();updateProjectiles(Math.min(dt,.05));updateSpecials(Math.min(dt,.05));for(let i=smokeZones.length-1;i>=0;i--){const z=smokeZones[i];z.left-=dt;z.next-=dt;if(z.next<=0){z.next=.28;try{G.fx.smoke?.(z.pos,{size:.65,life:2.6,rise:.35,count:3,alpha:.4})}catch{}}if(z.left<=0)smokeZones.splice(i,1)}}return result};
 G.combatV5=api;return api;
};

