/* Rocket flight and impact for the single-file game. Install after __installUpgrades(G). */
window.__installRocketV3 = function (G) {
  if (G.__rocketV3) return G.__rocketV3;
  const T=G.THREE, previousFire=window.__weaponFire, originalUpdate=G.game.update.bind(G.game);
  const missiles=[], particles=[], blasts=[];
  const unitY=new T.Vector3(0,1,0), scratch=new T.Vector3(), rayDir=new T.Vector3();
  const bodyGeometry=new T.CylinderGeometry(.055,.07,.52,12), noseGeometry=new T.ConeGeometry(.055,.15,12),
    flareGeometry=new T.ConeGeometry(.045,.36,12), fragmentGeometry=new T.TetrahedronGeometry(.045,0),
    shellGeometry=new T.SphereGeometry(1,16,12), ringGeometry=new T.RingGeometry(.83,1,32);
  const bodyMaterial=new T.MeshStandardMaterial({color:0x404735,metalness:.55,roughness:.55}),
    noseMaterial=new T.MeshStandardMaterial({color:0x22292a,metalness:.65,roughness:.45}),
    flameMaterial=new T.MeshBasicMaterial({color:0xffa025,transparent:true,opacity:.88,depthWrite:false}),
    coreMaterial=new T.MeshBasicMaterial({color:0xffe7a0,transparent:true,opacity:.95,depthWrite:false}),
    fragmentMaterial=new T.MeshBasicMaterial({color:0xffbd62});
  function radial(stops){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),grad=ctx.createRadialGradient(64,64,0,64,64,64);for(const [at,color] of stops)grad.addColorStop(at,color);ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);return new T.CanvasTexture(c)}
  const smokeTex=radial([[0,'rgba(91,86,80,.54)'],[.35,'rgba(57,55,53,.35)'],[1,'rgba(26,26,25,0)']]);
  const fireTex=radial([[0,'rgba(255,250,220,1)'],[.18,'rgba(255,204,85,.96)'],[.47,'rgba(235,90,21,.70)'],[.75,'rgba(92,32,15,.30)'],[1,'rgba(0,0,0,0)']]);
  function sprite(tex,color,size,pos,velocity,life,type){const mat=new T.SpriteMaterial({map:tex,color,transparent:true,opacity:1,depthWrite:false,blending:type==='fire'?T.AdditiveBlending:T.NormalBlending});const node=new T.Sprite(mat);node.position.copy(pos);node.scale.set(size,size,1);G.scene.add(node);particles.push({node,mat,size,vel:velocity.clone(),life,max:life,type});}
  function smokeAt(pos,velocity,size=.42){sprite(smokeTex,0xb8b2a6,size,pos,velocity,1.5+Math.random()*.6,'smoke')}
  function flashAt(pos,size){sprite(fireTex,0xffffff,size,pos,new T.Vector3(),.28,'fire')}
  function cleanMissile(m){G.scene.remove(m.group);}
  function damageAt(point,normal,direction,hit,w){
    if(hit?.enemy?.alive){G.combat.stats.hits++;const killed=hit.enemy.damage(w.damage,point,direction,hit.part)===true;G.events.emit('player:hitEnemy',{enemy:hit.enemy,part:hit.part,killed,weak:hit.part==='weak'});}
    const radius=w.radius||8;
    for(const e of [...G.enemies.list]){if(!e.alive||!e.pos)continue;const target=e.pos.clone().add(new T.Vector3(0,1,0)),distance=target.distanceTo(point);if(distance>=radius)continue;
      let clear=true;try{clear=G.physics.lineOfSight(point.clone().addScaledVector(normal,.18),target)}catch{};
      if(clear)e.damage((w.blast||350)*Math.max(.22,1-distance/radius*.75),point,direction,'body');
    }
    G.events.emit('impact',{point:point.clone(),normal:normal.clone(),surface:hit?.enemy?'enemy':(hit?.surface||'concrete'),enemy:hit?.enemy||null,dir:direction.clone(),from:'player'});
    G.player.addShake?.(.5);
  }
  function makeBlast(point,normal,radius){
    const group=new T.Group();group.position.copy(point);const mat=new T.MeshBasicMaterial({color:0xffa735,transparent:true,opacity:.65,depthWrite:false,blending:T.AdditiveBlending});const shell=new T.Mesh(shellGeometry,mat);group.add(shell);
    const ringMat=new T.MeshBasicMaterial({color:0xffdb9c,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending});const ring=new T.Mesh(ringGeometry,ringMat);ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);group.add(ring);
    const light=new T.PointLight(0xff862a,35,radius*3);group.add(light);G.scene.add(group);
    const pieces=[];for(let j=0;j<12;j++){const mesh=new T.Mesh(fragmentGeometry,fragmentMaterial);mesh.position.copy(point);const speed=3+Math.random()*7,vel=new T.Vector3((Math.random()-.5)*speed,Math.random()*speed*.8+.5,(Math.random()-.5)*speed);G.scene.add(mesh);pieces.push({mesh,vel})}
    for(let j=0;j<8;j++){const v=new T.Vector3((Math.random()-.5)*1.7,.5+Math.random()*2,(Math.random()-.5)*1.7);sprite(smokeTex,0x817b73,.7+Math.random()*.8,point,v,1.8+Math.random(),'smoke')}
    for(let j=0;j<4;j++){const p=point.clone().add(new T.Vector3((Math.random()-.5)*.6,(Math.random()-.5)*.6,(Math.random()-.5)*.6));flashAt(p,1.4+Math.random());}
    blasts.push({group,shell,ring,mat,ringMat,light,pieces,t:0,radius});
  }
  function impact(m,hit,pos){const normal=hit?.normal?.clone()||m.dir.clone().negate();damageAt(pos,normal,m.dir,hit,m.weapon);makeBlast(pos,normal,m.weapon.radius||8);cleanMissile(m);}
  function launch(origin,direction,w){const dir=direction.clone().normalize(), group=new T.Group();group.position.copy(origin).addScaledVector(dir,.3);group.quaternion.setFromUnitVectors(unitY,dir);
    const body=new T.Mesh(bodyGeometry,bodyMaterial),nose=new T.Mesh(noseGeometry,noseMaterial),flame=new T.Mesh(flareGeometry,flameMaterial),core=new T.Mesh(flareGeometry,coreMaterial);
    nose.position.y=.335;flame.position.y=-.42;flame.rotation.x=Math.PI;core.position.y=-.40;core.rotation.x=Math.PI;core.scale.set(.35,.7,.35);group.add(body,nose,flame,core);const light=new T.PointLight(0xff9c33,2,5);light.position.y=-.3;group.add(light);G.scene.add(group);
    missiles.push({group,dir,weapon:{...w},remaining:w.range||260,smoke:0,age:0});while(missiles.length>5)cleanMissile(missiles.shift());flashAt(group.position,.8);
  }
  window.__weaponFire=function(game,origin,direction){if(game!==G||game.arsenal?.index!==8)return previousFire(game,origin,direction);const w=game.arsenal.active;game.combat.stats.shots++;launch(origin,direction,w);return {point:origin.clone(),normal:direction.clone().negate(),dist:0,surface:'rocket-launch'};};
  function update(dt){
    for(let i=missiles.length-1;i>=0;i--){const m=missiles[i];m.age+=dt;const distance=Math.min(m.remaining,44*dt);rayDir.copy(m.dir);const start=m.group.position;let wall=null,enemy=null;try{wall=G.physics.raycast(start,rayDir,distance);enemy=G.enemies.raycast(start,rayDir,wall?wall.dist:distance)}catch{}const hit=enemy||wall;
      if(hit&&hit.dist<=distance){const pos=hit.point.clone();missiles.splice(i,1);impact(m,hit,pos);continue;}
      m.group.position.addScaledVector(m.dir,distance);m.remaining-=distance;m.smoke-=dt;if(m.smoke<=0){m.smoke=.07;const tail=m.group.position.clone().addScaledVector(m.dir,-.28);smokeAt(tail,m.dir.clone().multiplyScalar(-1).add(new T.Vector3(0,.4,0)),.25);}
      if(m.remaining<=0||m.age>8){missiles.splice(i,1);impact(m,null,m.group.position.clone())}
    }
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){G.scene.remove(p.node);p.mat.dispose();particles.splice(i,1);continue}const age=1-p.life/p.max;p.node.position.addScaledVector(p.vel,dt);p.node.scale.setScalar(p.size*(p.type==='smoke'?1+age*1.7:1+age*.45));p.mat.opacity=(1-age)*(p.type==='smoke'?.65:.9)}
    for(let i=blasts.length-1;i>=0;i--){const b=blasts[i];b.t+=dt;const t=Math.min(1,b.t/.85);b.shell.scale.setScalar(b.radius*(.10+.30*t));b.mat.opacity=.72*(1-t);b.ring.scale.setScalar(b.radius*(.12+.62*t));b.ringMat.opacity=.75*(1-t);b.light.intensity=35*(1-t);for(const f of b.pieces){f.vel.y-=12*dt;f.mesh.position.addScaledVector(f.vel,dt)}if(t>=1){G.scene.remove(b.group);for(const f of b.pieces)G.scene.remove(f.mesh);b.mat.dispose();b.ringMat.dispose();blasts.splice(i,1)}}
  }
  function clear(){for(const m of missiles)cleanMissile(m);missiles.length=0;for(const p of particles){G.scene.remove(p.node);p.mat.dispose()}particles.length=0;for(const b of blasts){G.scene.remove(b.group);for(const f of b.pieces)G.scene.remove(f.mesh);b.mat.dispose();b.ringMat.dispose()}blasts.length=0}
  G.events.on('game:state',({state})=>{if(state==='dead'||state==='complete'||state==='intro'||state==='title')clear()});
  G.game.update=function(dt){const out=originalUpdate(dt);if(G.game.state==='playing')update(Math.min(dt,.05));return out};
  G.__rocketV3={missiles,particles,blasts,clear};return G.__rocketV3;
};

