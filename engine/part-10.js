window.__infectedInstall = function (G) {
  const T=G.THREE, old=G.enemies;
  old.clear();
  const flow=G.game.flow;
  flow.patrol={gull:0,hound:3};
  flow.waves=[{gull:0,hound:5},{gull:0,hound:7},{gull:0,hound:9}];
  flow.maxAlive=14; flow.spawnStagger=.65; flow.pursuitEvery=9; flow.pursuitMinAlive=4; flow.pursuitExtra=4;
  const group=new T.Group();group.name='infected';G.scene.add(group);
  const list=[], fallen=[];
  let modelFactory=null;
  if(window.__zombieReady)window.__zombieReady.then(factory=>{modelFactory=factory;for(const e of list)attachModel(e);}).catch(error=>console.warn('感染者模型加载失败，使用备用模型',error));
  function attachModel(e){
    if(!modelFactory||!e.alive||e.model)return;
    try{const model=modelFactory.make();for(const child of e.group.children)child.visible=false;e.group.add(model.root);e.model=model;}
    catch(error){console.warn('感染者模型创建失败',error);}
  }
  // Shared low-poly rounded parts: no per-enemy geometry or texture allocations.
  const geo={
    unit:new T.SphereGeometry(1,10,8),
    head:new T.SphereGeometry(.19,14,10),
    upperArm:new T.CylinderGeometry(.085,.065,.31,9),
    forearm:new T.CylinderGeometry(.067,.048,.28,9),
    thigh:new T.CylinderGeometry(.115,.085,.37,10),
    calf:new T.CylinderGeometry(.087,.055,.35,9),
    hair:new T.SphereGeometry(.194,14,8,0,Math.PI*2,0,Math.PI*.46),
    eye:new T.SphereGeometry(.023,7,5)
  };
  function noiseTexture(seed, skinLike=false){
    if(typeof document==='undefined')return null;
    const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
    const pixels=x.createImageData(128,128);let n=seed;
    for(let y=0;y<128;y++)for(let i=0;i<128;i++){
      n=(n*1664525+1013904223)>>>0;
      const speck=(n>>>24), weave=skinLike?0:((i%4===0?9:0)+(y%6===0?7:0));
      const shade=Math.max(0,Math.min(255,(skinLike?213:210)+(speck-128)*(skinLike?.18:.28)-weave));
      const at=(y*128+i)*4;pixels.data[at]=shade;pixels.data[at+1]=shade*(skinLike?.97:1);pixels.data[at+2]=shade*(skinLike?.94:1);pixels.data[at+3]=255;
    }
    x.putImageData(pixels,0,0);x.globalAlpha=.12;
    for(let i=0;i<24;i++){n=(n*1664525+1013904223)>>>0;const px=n%128;n=(n*1664525+1013904223)>>>0;const py=n%128;x.fillStyle=i%3?'#292921':'#82574d';x.fillRect(px,py,2+(n%9),skinLike?2:4+(n%15));}
    const texture=new T.CanvasTexture(c);texture.wrapS=texture.wrapT=T.RepeatWrapping;return texture;
  }
  const fabric=noiseTexture(971), skinMap=noiseTexture(323,true);
  const fabricOpts={roughness:1,...(fabric?{map:fabric,bumpMap:fabric,bumpScale:.008}:{})};
  const skinOpts={roughness:1,...(skinMap?{map:skinMap,bumpMap:skinMap,bumpScale:.004}:{})};
  const clothes=[0x566053,0x766b5b,0x4c6060,0x706a59,0x514d4a].map(color=>new T.MeshStandardMaterial({color,...fabricOpts}));
  const skins=[0x999c7f,0xa59c89,0x899681].map(color=>new T.MeshStandardMaterial({color,...skinOpts}));
  const trousers=[0x303a39,0x434741,0x353b42].map(color=>new T.MeshStandardMaterial({color,...fabricOpts}));
  const hair=new T.MeshStandardMaterial({color:0x30322b,...fabricOpts});
  const boots=new T.MeshStandardMaterial({color:0x252a27,roughness:1});
  const dark=new T.MeshStandardMaterial({color:0x302e29,roughness:1});
  const red=new T.MeshStandardMaterial({color:0x653c32,roughness:1});
  const ray=new T.Ray(),sphere=new T.Sphere(),hit=new T.Vector3(), velocity=new T.Vector3(), target=new T.Vector3();
  const makeMesh=(geometry,material,x,y,z,parent)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
  let serial=0;
  const api={
    list,
    spawn(type,position,options={}) {
      if(list.filter(e=>e.alive).length>=flow.maxAlive) return null;
      const g=new T.Group(), shirt=clothes[serial%clothes.length], skin=skins[serial%skins.length], pants=trousers[serial%trousers.length];
      const scale=(mesh,x,y,z)=>{mesh.scale.set(x,y,z);return mesh};
      const oval=(material,x,y,z,sx,sy,sz,parent=g)=>scale(makeMesh(geo.unit,material,x,y,z,parent),sx,sy,sz);
      // Layered shoulders, chest, waist and collar follow human proportions.
      const torso=oval(shirt,0,1.20,0,.29,.38,.16);
      oval(shirt,0,1.35,0,.32,.23,.17);oval(shirt,0,.96,0,.24,.20,.15);
      oval(pants,0,.83,0,.25,.15,.15);
      oval(skin,0,1.52,0,.085,.10,.075);
      const head=makeMesh(geo.head,skin,0,1.70,.005,g);head.scale.set(.88,1.13,.9);
      const scalp=makeMesh(geo.hair,hair,0,1.72,.005,g);scalp.scale.set(.9,1.05,.9);
      // Brows, recessed eyes, nose, mouth and ears face +Z; restrained red wound accents.
      for(const side of [-1,1]){
        oval(skin,side*.172,1.69,.008,.035,.058,.025);
        oval(dark,side*.060,1.716,.159,.025,.009,.004);
        oval(dark,side*.060,1.742,.153,.031,.007,.004);
      }
      oval(skin,0,1.68,.171,.022,.036,.016);oval(dark,0,1.625,.155,.041,.006,.003);
      oval(red,serial%2?.082:-.082,1.66,.156,.012,.044,.003);
      // Jacket edge and uneven wounds supply material and silhouette detail.
      oval(dark,0,1.20,.161,.014,.23,.008);
      oval(red,serial%2?.14:-.12,1.27,.151,.055,.035,.004);
      oval(red,serial%2?.09:-.15,1.08,.145,.017,.049,.004);
      const leftArm=new T.Group(),rightArm=new T.Group(),leftElbow=new T.Group(),rightElbow=new T.Group();
      const leftLeg=new T.Group(),rightLeg=new T.Group(),leftKnee=new T.Group(),rightKnee=new T.Group();
      leftArm.position.set(-.29,1.41,0);rightArm.position.set(.29,1.41,0);
      leftElbow.position.set(0,-.30,0);rightElbow.position.set(0,-.30,0);
      leftArm.add(leftElbow);rightArm.add(rightElbow);
      leftLeg.position.set(-.135,.84,0);rightLeg.position.set(.135,.84,0);
      leftKnee.position.set(0,-.35,0);rightKnee.position.set(0,-.35,0);
      leftLeg.add(leftKnee);rightLeg.add(rightKnee);g.add(leftArm,rightArm,leftLeg,rightLeg);
      for(const arm of [leftArm,rightArm]){oval(shirt,0,-.02,0,.10,.11,.10,arm);makeMesh(geo.upperArm,shirt,0,-.16,0,arm);}
      for(const elbow of [leftElbow,rightElbow]){oval(skin,0,0,0,.068,.067,.065,elbow);makeMesh(geo.forearm,shirt,0,-.14,0,elbow);oval(skin,0,-.31,0,.055,.085,.035,elbow);}
      for(const leg of [leftLeg,rightLeg]){makeMesh(geo.thigh,pants,0,-.18,0,leg);}
      for(const knee of [leftKnee,rightKnee]){oval(pants,0,0,0,.087,.078,.075,knee);makeMesh(geo.calf,pants,0,-.17,0,knee);oval(boots,0,-.36,.055,.076,.055,.15,knee);}
      // Subtle build and clothing differences keep a crowd from looking cloned.
      const build=[.94,1.04,1.12,.98,1.08][serial%5];
      torso.scale.x*=build;g.rotation.x=.065;
      const pos=position.clone();pos.y=G.physics.groundHeight(pos.x,pos.z,Math.max(3,pos.y+2));
      g.position.copy(pos);group.add(g);
      const e={id:++serial,type:'hound',pos,alive:true,hp:85,active:true,group:g,torso,head,leftArm,rightArm,leftElbow,rightElbow,leftLeg,rightLeg,leftKnee,rightKnee,
        speed:1.55+Math.random()*.75, attack:1+Math.random(), t:Math.random()*5, path:[], pathTimer:0, alerted:false,
        damage(amount,point,direction,part){
          if(!this.alive)return false; this.hp-=amount;
          G.events.emit('enemy:hit',{enemy:this,point,part});
          if(this.hp<=0){this.alive=false;this.active=false;fallen.push({group:this.group,model:this.model,t:0});G.events.emit('enemy:killed',{enemy:this,pos:this.pos,type:'hound'});return true;}
          return false;
        }};
      list.push(e);attachModel(e); G.events.emit('enemy:spawn',{enemy:e});return e;
    },
    raycast(origin,direction,maxDistance=300){
      ray.set(origin,direction);let best=null;
      for(const e of list){if(!e.alive)continue;
        for(const [height,radius,part] of [[1.08,.36,'body'],[1.66,.21,'weak']]){
          const size=e.group.scale.x||1;sphere.center.set(e.pos.x,e.pos.y+height*size,e.pos.z);sphere.radius=radius*size;
          if(ray.intersectSphere(sphere,hit)){const d=hit.distanceTo(origin);if(d<=maxDistance&&(!best||d<best.dist)){const point=hit.clone();best={dist:d,point,normal:point.clone().sub(sphere.center).normalize(),enemy:e,part};}}
        }
      }return best;
    },
    aliveCount(){return list.reduce((n,e)=>n+(e.alive?1:0),0);},
    clear(){for(const e of list){e.alive=false;e.active=false;group.remove(e.group);}for(const f of fallen)group.remove(f.group);fallen.length=0;list.length=0;},
    alert(){},
    update(dt){
      for(let j=fallen.length-1;j>=0;j--){const f=fallen[j];f.t+=dt;f.model?f.model.update(dt,'death'):f.group.rotation.z=Math.min(1.45,f.t*3);if(f.t>3){group.remove(f.group);fallen.splice(j,1);}}
      const player=G.player;if(!player||!player.alive)return;
      for(const e of list){
        if(!e.alive)continue;e.t+=dt;e.attack-=dt;e.pathTimer-=dt;
        let dx=player.pos.x-e.pos.x,dz=player.pos.z-e.pos.z,d=Math.hypot(dx,dz);
        if(!e.alerted&&d<24){e.alerted=true;G.events.emit('enemy:alert',{enemy:e});}
        if(d<1.3){
          if(e.attack<=0 && Math.abs(player.pos.y-e.pos.y)<1.5 && G.physics.lineOfSight(new T.Vector3(e.pos.x,e.pos.y+1,e.pos.z),new T.Vector3(player.pos.x,player.pos.y+1,player.pos.z))){e.attack=1.25;player.damage(e.attackDamage||9,e.pos);G.events.emit('enemy:melee',{enemy:e,pos:e.pos});}
        } else if(d<55) {
          if(e.pathTimer<=0){e.pathTimer=1.3+Math.random()*.7;try{e.path=G.physics.nav.findPath(e.pos,player.pos)||[];}catch{e.path=[];}}
          let waypoint=e.path&&e.path[0];
          if(waypoint&&Math.hypot(waypoint.x-e.pos.x,waypoint.z-e.pos.z)<.7){e.path.shift();waypoint=e.path[0];}
          target.copy(waypoint||player.pos);dx=target.x-e.pos.x;dz=target.z-e.pos.z;const len=Math.hypot(dx,dz)||1;
          velocity.set(dx/len*e.speed,0,dz/len*e.speed);G.physics.moveCapsule(e.pos,velocity,dt,.27,1.75,true);
          e.group.rotation.y=Math.atan2(player.pos.x-e.pos.x,player.pos.z-e.pos.z);
        }
        e.group.position.copy(e.pos);
        e.group.rotation.y=Math.atan2(player.pos.x-e.pos.x,player.pos.z-e.pos.z);
        if(e.model)e.model.update(dt,d<1.5&&e.attack<.75?'attack':d>1.3&&d<55?'walk':'idle');
        const moving=d>1.3 && d<55, stride=moving?Math.sin(e.t*7)*.50:0;
        e.leftLeg.rotation.x=stride;e.rightLeg.rotation.x=-stride;
        e.leftKnee.rotation.x=Math.max(0,-stride)*.7;e.rightKnee.rotation.x=Math.max(0,stride)*.7;
        const reaching=d<2.5?1.05:.30;
        e.leftArm.rotation.x=-reaching-stride*.30;e.rightArm.rotation.x=-reaching+.12+stride*.30;
        e.leftElbow.rotation.x=-.18;e.rightElbow.rotation.x=-.32;
        e.head.rotation.z=Math.sin(e.t*1.4)*.035+.025;
        e.group.rotation.z=Math.sin(e.t*3)*.035;e.group.rotation.x=.06+Math.sin(e.t*4)*.025;
      }
      // Retire dead records so sound and combat iteration remain bounded.
      for(let j=list.length-1;j>=0;j--)if(!list[j].alive)list.splice(j,1);
    }
  };
  G.enemies=api;
};

