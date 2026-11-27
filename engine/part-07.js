// Variant layer for the existing animated infected; installed once after __infectedInstall.
window.__installMonstersV3 = function(G) {
  const T=G.THREE, enemies=G.enemies, baseSpawn=enemies.spawn.bind(enemies), baseUpdate=enemies.update.bind(enemies), baseClear=enemies.clear.bind(enemies);
  const kinds={
    normal:{name:'感染者',hp:85,speed:1.9,damage:9,size:1,color:0xc6c3ae},
    runner:{name:'疾行者',hp:70,speed:3.7,damage:12,size:.92,color:0xd79382},
    brute:{name:'重装感染者',hp:240,speed:1.18,damage:21,size:1.3,color:0x737c70},
    spitter:{name:'酸液喷吐者',hp:125,speed:1.32,damage:9,size:1.04,color:0x94c97f},
    exploder:{name:'爆裂感染者',hp:140,speed:1.75,damage:10,size:1.14,color:0xcb8d63},
    hunter:{name:'猎杀者',hp:155,speed:2.8,damage:18,size:1.04,color:0x8fa4b5},
    boss:{name:'巨型感染首领',hp:900,speed:1.22,damage:30,size:1.65,color:0xb56e60}
  };
  const bullets=[], variants=new Set(), geometries=new Map();
  const geometry=(key,create)=>{if(!geometries.has(key))geometries.set(key,create());return geometries.get(key)};
  const acidGeo=new T.SphereGeometry(.12,9,7), acidMat=new T.MeshBasicMaterial({color:0xa9fa48});
  const ringGeo=new T.RingGeometry(.8,1,28), ringMat=new T.MeshBasicMaterial({color:0xff4936,transparent:true,opacity:.65,side:T.DoubleSide,depthWrite:false});
  const markerMats={runner:new T.MeshStandardMaterial({color:0xa6422d,roughness:1}),brute:new T.MeshStandardMaterial({color:0x343a39,roughness:.8,metalness:.35}),spitter:new T.MeshBasicMaterial({color:0x9be342}),exploder:new T.MeshBasicMaterial({color:0xff7131}),hunter:new T.MeshStandardMaterial({color:0x29333c,roughness:.8}),boss:new T.MeshStandardMaterial({color:0x81392d,roughness:.8})};
  function box(g,mat,w,h,d,x,y,z){const m=new T.Mesh(geometry(`box:${w},${h},${d}`,()=>new T.BoxGeometry(w,h,d)),mat);m.position.set(x,y,z);g.add(m);return m}
  function sphere(g,mat,r,x,y,z){const m=new T.Mesh(geometry(`sphere:${r}`,()=>new T.SphereGeometry(r,9,7)),mat);m.position.set(x,y,z);g.add(m);return m}
  function decorate(e,kind){
    const g=new T.Group();g.name='variant-mark';e.group.add(g);const m=markerMats[kind];
    if(kind==='runner'){for(const x of [-.27,.27])box(g,m,.09,.3,.1,x,1.26,.04);}
    if(kind==='brute'){box(g,m,.56,.38,.12,0,1.19,.16);for(const x of [-.3,.3])sphere(g,m,.13,x,1.4,0);}
    if(kind==='spitter'){for(let i=0;i<5;i++)sphere(g,m,.065,(i-2)*.10,1.2+(i%2)*.16,.18);}
    if(kind==='exploder'){sphere(g,m,.24,0,1.12,.16);for(let i=0;i<4;i++)sphere(g,m,.08,(i-1.5)*.12,1.32,.17);}
    if(kind==='hunter'){for(const x of [-.25,.25]){let spike=new T.Mesh(geometry("cone:hunter",()=>new T.ConeGeometry(.055,.25,6)),m);spike.position.set(x,1.46,.02);spike.rotation.z=x>0?-.6:.6;g.add(spike)}}
    if(kind==='boss'){box(g,m,.6,.43,.12,0,1.2,.17);for(const x of [-.3,.3]){let spike=new T.Mesh(geometry("cone:boss",()=>new T.ConeGeometry(.08,.26,6)),m);spike.position.set(x,1.48,0);g.add(spike)}}
    const ring=new T.Mesh(ringGeo,ringMat.clone());ring.rotation.x=-Math.PI/2;ring.position.y=.04;ring.scale.setScalar(kind==='boss'?3.8:2.7);ring.visible=false;e.group.add(ring);
    e.variantVisual=g;e.warningRing=ring;
  }
  function apply(e,kind){kind=kinds[kind]?kind:'normal';const k=kinds[kind];e.variantType=kind;e.variant=k.name;e.hp=k.hp;e.speed=k.speed*(.94+Math.random()*.12);e.attackDamage=k.damage;e.group.scale.setScalar(k.size);e._variantBaseSpeed=e.speed;e._variantTimer=kind==='spitter'?3+Math.random()*2:4+Math.random()*3;e._variantWarning=0;if(kind!=='normal')decorate(e,kind);variants.add(e);return e}
  enemies.spawnVariant=function(kind,pos,opts={}){const e=baseSpawn('hound',pos,opts);return e?apply(e,kind):null};
  function clearBullets(){for(const p of bullets)G.scene.remove(p.mesh);bullets.length=0}
  enemies.clear=function(){clearBullets();for(const e of variants)e.warningRing?.material?.dispose();variants.clear();baseClear()};
  function los(a,b){try{return G.physics.lineOfSight(a,b)}catch{return true}}
  function emitAcid(e){const origin=e.pos.clone().add(new T.Vector3(0,1.4,0)),target=G.player.pos.clone().add(new T.Vector3(0,1,0)),dir=target.clone().sub(origin).normalize();if(!los(origin,target))return;const mesh=new T.Mesh(acidGeo,acidMat);mesh.position.copy(origin);G.scene.add(mesh);bullets.push({mesh,velocity:dir.multiplyScalar(8),age:0});G.hud.warn?.('酸液来袭 · 注意躲避',1.3)}
  function burst(e,radius,amount){const from=e.pos.clone().add(new T.Vector3(0,1,0)),to=G.player.pos.clone().add(new T.Vector3(0,1,0)),d=from.distanceTo(to);if(d<radius&&los(from,to))G.player.damage(amount*(1-d/(radius*2)),e.pos);try{G.fx.smoke?.(from,{size:.5,life:1.4,rise:.8,count:5,alpha:.5})}catch{}G.player.addShake?.(.3)}
  enemies.update=function(dt){
    baseUpdate(dt);for(const e of variants)if(!e.alive){e.warningRing?.material?.dispose();variants.delete(e)}const player=G.player;if(!player?.alive)return;
    for(const e of enemies.list){if(!e.alive||!e.variantType)continue;let d=e.pos.distanceTo(player.pos),kind=e.variantType;
      if(e.variantVisual)e.variantVisual.visible=true; // model can arrive asynchronously
      if(kind==='runner'||kind==='hunter'){e._variantTimer-=dt;if(e._variantTimer<=0){e._variantTimer=kind==='hunter'?4:5;e._variantWarning=kind==='hunter'?.7:.35}if(e._variantWarning>0){e._variantWarning-=dt;e.speed=e._variantBaseSpeed*(kind==='hunter'?1.8:1.25)}else e.speed=e._variantBaseSpeed;}
      if(kind==='spitter'){e._variantTimer-=dt;if(e._variantTimer<=0&&d<25&&d>3){e._variantTimer=4.5;emitAcid(e)}}
      if(kind==='exploder'&&d<3.2&&e._variantWarning<=0&&e._variantTimer>0){e._variantWarning=1.4;e._variantTimer=-1;G.hud.warn?.('爆裂感染者即将爆炸！',1.5)}
      if(kind==='boss'){e._variantTimer-=dt;if(e._variantTimer<=0&&d<7){e._variantTimer=7;e._variantWarning=1.5;G.hud.warn?.('首领蓄力 · 立即远离！',1.5)}}
      if((kind==='exploder'||kind==='boss')&&e._variantWarning>0){e._variantWarning-=dt;if(e.warningRing){e.warningRing.visible=true;e.warningRing.material.opacity=.3+.3*Math.abs(Math.sin(e._variantWarning*12))}if(e._variantWarning<=0){if(e.warningRing)e.warningRing.visible=false;burst(e,kind==='boss'?6:4,kind==='boss'?36:32);if(kind==='exploder')e.damage(99999,e.pos,new T.Vector3(0,0,1),'body')}}
    }
    for(let j=bullets.length-1;j>=0;j--){const b=bullets[j],start=b.mesh.position.clone(),move=b.velocity.clone().multiplyScalar(dt),length=move.length();let wall=null;try{wall=G.physics.raycast(start,move.clone().normalize(),length)}catch{}b.mesh.position.add(move);b.age+=dt;const target=player.pos.clone().add(new T.Vector3(0,1,0)),line=b.mesh.position.clone().sub(start),den=line.lengthSq(),t=den?Math.max(0,Math.min(1,target.clone().sub(start).dot(line)/den)):0,closest=start.addScaledVector(line,t),hit=closest.distanceTo(target)<.6;if(hit&&!wall)player.damage(13,b.mesh.position);if(hit||wall||b.age>4){G.scene.remove(b.mesh);bullets.splice(j,1)}}
  };
  G.monsters={kinds,spawn:enemies.spawnVariant};
};

