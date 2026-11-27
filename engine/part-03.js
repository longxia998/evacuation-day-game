(function(){'use strict';
// An original ten-act rescue story. Each entry has authored context and a concrete mission.
const A=[
 {name:'封锁港区',lead:'黎明前的求救',story:'暴雨冲毁了港口的撤离记录。电台工程师陈澈在杂音里听见一个孩子唱歌。',chapters:[
 ['雨中呼号','陈澈：那不是录音，呼吸声还在。先找到岗哨电台。','interact',{object:'岗哨电台'}],
 ['一张湿透的名单','林岚：撤离名单被冲散了，收齐三页才知道谁还在港里。','collect',{object:'名单残页',count:3}],
 ['没有登船的人','警报声引来感染者；守住名单，别让它们靠近。','kill',{count:5,variant:'normal'}],
 ['电台不是坏了','陈澈发现电台被人改接。按 A→C→B 复位线路。','decode',{order:[0,2,1],object:'线路开关'}],
 ['等待回应','频道接通需要时间；站在发报台附近，撑过倒计时。','defend',{seconds:22,variant:'normal',object:'发报台'}],
 ['跑过集装箱','呼救者的位置突然移动，疾行者也追上来了。','kill',{count:6,variant:'runner'}],
 ['小乔的录音','找到小乔留下的录音和药箱；医生可以利用药品恢复体力。','collect',{object:'录音与医疗箱',count:2,heal:35}],
 ['最后的搬运工','一名重装感染者堵住吊机通道，打掉它才能继续。','kill',{count:3,variant:'brute'}],
 ['灯塔第一次亮起','巨型感染者循着信号靠近，击退它保护队伍。','boss',{variant:'boss'}],
 ['离港之前','无线电传来一句“不要去灯塔”。带着名单前往城区入口。','timed',{seconds:65,object:'城区入口'}]
 ]},
 {name:'暮色城区',lead:'空城里的脚步',story:'队长沈舟决定跟随歌声，医生林岚却发现感染者总会绕开某些建筑。',chapters:[
 ['街口的两条路','路牌倒了，先找到尚能工作的街区地图。','interact',{object:'街区地图'}],
 ['橱窗里的求救','搜寻三处店铺，找到呼救者留下的标记。','collect',{object:'求救标记',count:3}],
 ['追不上影子','猎杀者会加速突进，边移动边清除它们。','kill',{count:5,variant:'hunter'}],
 ['一盏没亮的灯','林岚：那些建筑不是安全区，是有人关闭了声源。按 B→A→C 接通楼顶中继。','decode',{order:[1,0,2],object:'楼顶开关'}],
 ['信号楼守夜','等陈澈复制广播频率，守住信号楼。','defend',{seconds:24,variant:'spitter',object:'信号楼'}],
 ['两种补给','药品能立即治疗，静音器材能减少后续敌人数量。选择一处箱子并按 E。','choice',{left:'医疗箱',right:'静音器材'}],
 ['小乔现身','小乔带着弟弟阿禾被困在街角。贴近她，护送她到临时避难点。','escort',{npc:'小乔',seconds:0,variant:'normal'}],
 ['会吐酸的病人','喷吐者能远程攻击，利用掩体清除前方的敌人。','kill',{count:5,variant:'spitter'}],
 ['谁在广播','幕后广播重复沈舟的旧行动编号；找回遗失的三段录音。','collect',{object:'广播录音',count:3}],
 ['末班地铁','隧道门即将关闭，在倒计时内抵达入口。','timed',{seconds:60,object:'地铁入口'}]
 ]},
 {name:'废弃地铁站',lead:'没有终点的列车',story:'站台曾是临时隔离点。车门上留下的涂鸦指向一位失踪的医生。',chapters:[
 ['站台上的涂鸦','找到小乔认识的涂鸦，确定列车撤离方向。','interact',{object:'站台涂鸦'}],
 ['断裂的轨道','搜集两段轨道维修记录，查明列车为什么停在这里。','collect',{object:'维修记录',count:2}],
 ['站台回声','爆裂感染者会在靠近后蓄力自爆，听到警告就后退。','kill',{count:5,variant:'exploder'}],
 ['隧道照明','按 C→B→A 连接备用电源；错误操作会招来敌人。','decode',{order:[2,1,0],object:'电源闸'}],
 ['手动开门','启动站台门后守住控制台，别离开黄色圈。','defend',{seconds:25,variant:'runner',object:'站台门控制台'}],
 ['站务员阿祁','阿祁知道后门，但受了伤。留在他身边，护送他离开站台。','escort',{npc:'阿祁',variant:'exploder'}],
 ['换乘通道','前面的通道越来越危险，收集两件医疗物资。','collect',{object:'急救物资',count:2,heal:30}],
 ['末节车厢','猎杀者在黑暗中伏击，清除车厢附近的敌人。','kill',{count:6,variant:'hunter'}],
 ['列车长的秘密','车长变异成巨怪，只有击败它才能拿到医院通行证。','boss',{variant:'boss'}],
 ['通往医院的门','阿祁：医生林岚的同事就在医院。趁隧道塌陷前抵达出口。','timed',{seconds:65,object:'医院出口'}]
 ]},
 {name:'隔离医院',lead:'被抹掉的病例',story:'林岚回到曾经工作的医院；病历显示疫情爆发前，某个频率已在病人身上试验。',chapters:[
 ['旧识','林岚在接诊处发现同事留下的纸条。','interact',{object:'接诊处纸条'}],
 ['残缺的病历','收集三份病历，拼出被涂掉的试验日期。','collect',{object:'病历',count:3}],
 ['病房深处','重装感染者穿着防护装备，正挡住药房。','kill',{count:4,variant:'brute'}],
 ['药房密码','药房的应急开关依次为 A→B→C，错误会触发警报。','decode',{order:[0,1,2],object:'药房开关'}],
 ['给阿禾的药','在药房寻找两盒药品；拿到药可以恢复生命。','collect',{object:'药品',count:2,heal:45}],
 ['隔离区守门','药剂配制期间守住实验台，远程喷吐者会逼近。','defend',{seconds:26,variant:'spitter',object:'配药台'}],
 ['林岚的同事','护送护士许宁穿过病区，她知道是谁拿走了原始样本。','escort',{npc:'许宁',variant:'hunter'}],
 ['被追踪的档案','陈澈找到的档案被拆成三段，逐一回收。','collect',{object:'档案',count:3}],
 ['隔离楼的主人','林岚认出变异首领是负责试验的主管；击败它拿回钥匙。','boss',{variant:'boss'}],
 ['雨夜出院','许宁说样本被运进林地营地；撤离到森林入口。','timed',{seconds:65,object:'林地入口'}]
 ]},
 {name:'雨林营地',lead:'树后的证人',story:'营地巡护员周野录下了灯塔信号，每次广播之后，感染者就会改变行动方向。',chapters:[
 ['脚印','调查巡护员留下的脚印和野外标记。','collect',{object:'巡护标记',count:2}],
 ['山林追兵','疾行者擅长穿林追赶，清除包抄队伍的敌人。','kill',{count:7,variant:'runner'}],
 ['消失的巡护员','找到周野的临时营帐，他留下一份录音。','interact',{object:'营帐录音'}],
 ['三座声源','按照 B→C→A 关掉营地的三只测试喇叭。','decode',{order:[1,2,0],object:'喇叭开关'}],
 ['周野的哨所','等待周野破译频率，在哨所守住一段时间。','defend',{seconds:28,variant:'hunter',object:'巡护哨所'}],
 ['陪他回营','周野受伤，贴近护送他到集合点并抵挡来袭感染者。','escort',{npc:'周野',variant:'runner'}],
 ['火还是药','选择补给：药品恢复生命，静音装备会减少后续敌人的数量。','choice',{left:'急救箱',right:'静音装备'}],
 ['火光里的影子','爆裂感染者从火堆方向逼近，先拉开距离。','kill',{count:6,variant:'exploder'}],
 ['被引来的巨兽','信号吸引了一只巨型感染体，击败它并保住录音。','boss',{variant:'boss'}],
 ['货车通往哪里','周野辨认出货车标志，前往货运仓库入口。','timed',{seconds:70,object:'货运入口'}]
 ]},
 {name:'旧货运仓库',lead:'失踪的黑匣子',story:'仓库账本揭示运输路线：样本与一台黑匣子一同送往炼化厂。',chapters:[
 ['货运账本','找到记录异常货物的账本。','interact',{object:'货运账本'}],
 ['柜号不一致','在货架间回收三张封条，确定黑匣子藏在哪个箱子里。','collect',{object:'货箱封条',count:3}],
 ['货架之间','重装感染者守在狭窄通道，别让它们包围。','kill',{count:5,variant:'brute'}],
 ['叉车的电池','按 C→A→B 接通叉车线路，错误会触发警报。','decode',{order:[2,0,1],object:'叉车电源'}],
 ['搬运倒计时','叉车搬运黑匣子时守住搬运区。','defend',{seconds:28,variant:'exploder',object:'搬运区'}],
 ['驾驶员老许','护送老许从货架区撤到检修门。','escort',{npc:'老许',variant:'hunter'}],
 ['破损的磁带','找齐黑匣子里的两盘磁带并取走医疗包。','collect',{object:'磁带与药品',count:2,heal:25}],
 ['听见了歌','音带里，小乔的歌声竟比求救发生得更早。清除冲来的猎杀者。','kill',{count:7,variant:'hunter'}],
 ['仓库守卫','击败巨型守卫，取走最后一盘磁带。','boss',{variant:'boss'}],
 ['炼化厂的方向','黑匣子显示信号塔依靠炼化厂供电，前往厂区。','timed',{seconds:65,object:'炼化厂入口'}]
 ]},
 {name:'炼化厂区',lead:'灯塔的燃料',story:'灯塔并非救援设施，而是一套会引导感染者聚集的广播系统；厂区能切断它的电源。',chapters:[
 ['能源总图','陈澈：切断一处阀门还不够，先找到供电总图。','interact',{object:'供电总图'}],
 ['泄漏的冷却液','收集三件防护材料，为修复线路做准备。','collect',{object:'防护材料',count:3}],
 ['厂区清场','爆裂感染者靠近时会发光并蓄力，保持距离。','kill',{count:6,variant:'exploder'}],
 ['三相断路','按照 A→C→B 切断三相供电，错误会引发警报。','decode',{order:[0,2,1],object:'断路开关'}],
 ['备电启动','备用系统仍在运行，在控制室守住电源倒计时。','defend',{seconds:30,variant:'spitter',object:'备电控制台'}],
 ['工程师陈澈','陈澈要带着供电图去手动阀门，贴近护送他。','escort',{npc:'陈澈',variant:'brute'}],
 ['电还是医疗','只能带走一箱物资：医疗箱可治疗，静音设备让后续敌人更少。','choice',{left:'医疗箱',right:'静音设备'}],
 ['信号反扑','广播突然增强，疾行者从厂区通道涌来。','kill',{count:8,variant:'runner'}],
 ['阀门前的巨影','巨型感染者堵在阀门前，击退它。','boss',{variant:'boss'}],
 ['灯塔仍亮着','电源断开后信号竟未停止；沈舟命令前往断桥。','timed',{seconds:70,object:'断桥方向'}]
 ]},
 {name:'断桥高速',lead:'无法撤回的命令',story:'高速桥上的车队被迫停下。沈舟承认，最初的灯塔广播是他签发的撤离指令。',chapters:[
 ['堵塞的车队','调查车队记录，寻找可通过的道路。','interact',{object:'车队记录'}],
 ['车里的留言','收集三张留言，确定仍有哪些人需要接应。','collect',{object:'车队留言',count:3}],
 ['失控的拦截','猎杀者穿过弃车追来，清理车道。','kill',{count:7,variant:'hunter'}],
 ['桥闸的钥匙','按 B→A→C 重置桥闸控制系统。','decode',{order:[1,0,2],object:'桥闸开关'}],
 ['车队过桥','守住桥头，让车队有时间通过。','defend',{seconds:30,variant:'brute',object:'桥头'}],
 ['沈舟的坦白','沈舟承认他当年没有核实灯塔信号。护送他前往桥另一侧。','escort',{npc:'沈舟',variant:'spitter'}],
 ['被遗弃的补给','搜寻两辆救护车，带走药品。','collect',{object:'救护车药箱',count:2,heal:40}],
 ['你听见的歌','小乔认出广播里的歌是母亲教她的；清除扑来的感染者。','kill',{count:8,variant:'normal'}],
 ['桥上的巨影','击退挡住车队的巨型感染体。','boss',{variant:'boss'}],
 ['前往实验室','广播的发射源并不在灯塔，穿过高速入口寻找真相。','timed',{seconds:70,object:'实验室入口'}]
 ]},
 {name:'地下实验室',lead:'歌声的真相',story:'实验室里保存着小乔母亲的研究。她曾试图用声音让感染者远离人群。',chapters:[
 ['母亲的工作台','找到小乔母亲留下的工作台与记录。','interact',{object:'研究记录'}],
 ['被拆开的实验','收集三段样本记录，还原试验经过。','collect',{object:'样本记录',count:3}],
 ['泄露的试验区','喷吐者占据通道，躲开酸液并清除感染者。','kill',{count:6,variant:'spitter'}],
 ['封存解码','按 C→A→B 打开封存柜；错误会触发增援。','decode',{order:[2,0,1],object:'封存开关'}],
 ['重建原始波形','陈澈需要时间恢复声波数据，守住终端。','defend',{seconds:32,variant:'hunter',object:'波形终端'}],
 ['许宁的证词','护送许宁去读取数据：母亲曾阻止广播被用作诱饵。','escort',{npc:'许宁',variant:'exploder'}],
 ['两份结论','一份是医疗补给，一份是静音设备；选择你更需要的一箱。','choice',{left:'医疗箱',right:'静音设备'}],
 ['谁修改了频率','数据显示沈舟的命令被人篡改；击退实验室里的重装感染者。','kill',{count:6,variant:'brute'}],
 ['最后一名研究员','变异首领仍守着原始服务器，击退它取得密钥。','boss',{variant:'boss'}],
 ['真正的信号源','密钥指向最后防线，赶在广播再次启动前抵达。','timed',{seconds:70,object:'防线入口'}]
 ]},
 {name:'最后防线',lead:'给活着的人',story:'信号中枢已被人设置成自动循环。队伍必须在救援船抵达前，选择怎样关闭它。',chapters:[
 ['防线前夜','检查中枢外围，找到关闭系统的入口。','interact',{object:'中枢入口'}],
 ['最后的证据','收集三段签名日志，证实谁改写了沈舟的命令。','collect',{object:'签名日志',count:3}],
 ['声潮','感染者随广播聚集，清除最先抵达的疾行者。','kill',{count:8,variant:'runner'}],
 ['终止协议','按 B→C→A 输入终止顺序，失误会招来增援。','decode',{order:[1,2,0],object:'终止终端'}],
 ['保住发射塔','停止循环需要时间；守住终端直到关闭。','defend',{seconds:35,variant:'exploder',object:'发射塔'}],
 ['带阿禾走','小乔去关信号，让队员护送阿禾到撤离点。','escort',{npc:'阿禾',variant:'hunter'}],
 ['最后的选择','选择医疗物资救助队伍，或取静音设备减轻最后一战。','choice',{left:'医疗箱',right:'静音设备'}],
 ['黎明前的围攻','信号关闭前的最后一波重装感染者逼近。','kill',{count:8,variant:'brute'}],
 ['灯塔熄灭','巨型感染首领循最后一次广播而来；击败它。','boss',{variant:'boss'}],
 ['把歌带回去','灯塔安静了。救援船已经靠岸，带着幸存者撤离。','timed',{seconds:75,object:'救援船'}]
 ]}
];
const EXTRA_STORY=[["沈舟听见频段里有人敲击船舷：三短一长，是旧的求救暗号。","名单上最后一艘船的记录被划掉，旁边留下一个未满十岁的名字。","人群曾在这里等待接应，地上的行李说明撤离来得太突然。","陈澈发现，线路的改动来自岸上的控制室，而非风暴损坏。","林岚握着话筒，要求对方报出人数；静电中终于传来孩子的回应。","声音从堆场另一侧传来，对方似乎正在逃离不断靠近的脚步。","录音里，小乔让弟弟不要出声，背景还有一段反复出现的旋律。","搬运工的工牌上有熟悉的船号，他曾负责最后一批撤离物资。","灯塔照亮水面的一瞬间，原本分散的感染者同时转向。","沈舟收起名单：先找孩子，再弄清是谁让灯塔继续广播。"],["城区地图的避难标记有两种笔迹，较新的标记避开了广播喇叭。","每个橱窗的箭头都指向同一条小巷，但最后一枚箭头被人擦掉。","沈舟让队伍分散行进，免得狭窄街道被一次突袭封死。","陈澈确认灯不是信号源，关闭后的喇叭才是感染者绕行的原因。","复制过程中，信号里混进一个陌生的指挥声，像在重复旧命令。","林岚清点剩余药物，陈澈则提醒队伍静音装备只能带走一箱。","小乔不肯丢下阿禾；沈舟放慢脚步，让他们始终留在视线内。","林岚辨认出患者服上的医院编号，说明感染已经从病区蔓延到街道。","录音里的行动编号确实属于沈舟，但时间晚于他离开指挥所。","站台闸门传来最后一次提示音，阿禾说母亲曾在那里等过他们。"],["小乔认出墙上的涂鸦是母亲画的，旁边还有指向末节车厢的箭头。","维修记录显示列车并非故障停车，而是收到一条强制封站指令。","站台的回声掩盖了脚步，沈舟提醒队员留意会膨胀发亮的感染者。","应急电源会依次点亮轨道，错接线路则会把警报重新打开。","陈澈手动扳下开门杆，沉重的闸门需要一段时间才能升起。","阿祁记得医生送走病人后独自返回，他答应带队伍去后门。","林岚在急救箱上发现医院封条，物资很可能来自同一批转运。","车厢内的抓痕从门外一直延伸到驾驶室，伏击者还没有离开。","通行证被压在车长制服里，背面写着医院隔离楼的楼层号。","阿祁把后门钥匙交给林岚：医院档案室也许还留着当晚的记录。"],["纸条提醒林岚不要相信病历系统，真正的日期被留在纸质备份里。","三份病历的签字来自不同医生，试验日期却被同一支笔涂改。","护具上的标识表明这群感染者原本是医院的隔离警卫。","药房的应急开关分别控制门锁、照明和报警器，顺序不能颠倒。","林岚确认药物只能缓解阿禾的症状，却能为继续寻找真相争取时间。","配药台正在运转，断电会毁掉刚刚配好的药剂。","许宁记得样本被匿名车辆取走，车门上的标志是一棵折断的树。","档案的页码被拆散，陈澈需要把记录重新拼成完整时间线。","主管身上的钥匙打开资料柜，里面还有一张前往林地营地的路线图。","许宁说搬运人员穿着巡护制服，但她从未见过他们的脸。"],["脚印在营帐前分成两组，一组朝密林走去，另一组通向广播喇叭。","周野留下的标记显示疾行者会从侧面绕过哨所，不要只盯着正前方。","录音里的周野反复播放信号，证实尸群会随着音调转向。","三只喇叭接在同一线路，关闭次序错误会短暂提高音量。","周野需要完整采样才能证明广播并非随机噪声。","周野的腿受了伤，但只有他知道穿过营地的安全路线。","林岚想保留药品，陈澈则认为静音设备能让后面的撤离更安全。","火光照出感染者腹部的鼓包，沈舟让所有人退到掩体后方。","巨兽身上缠着广播电缆，说明它曾在信号设备附近停留。","车牌上的货运标识与医院记录一致，样本很可能经过那座仓库。"],["账本有两套编号：一套记录冷藏样本，另一套记录没有申报的黑匣子。","封条上残留的温度标签指向冷链区，箱号却被反复改写。","货架遮住视线，沈舟要求队员沿通道推进，不要被两面夹击。","叉车电池仍有电，但控制器接线被刻意拆开。","搬运时叉车会发出响声，队伍必须守住货箱直到货叉落下。","老许曾负责装车，他记得黑匣子上印着灯塔的维护标志。","磁带受潮严重，陈澈只找到可以修复的两卷。","录音中的歌声比当晚的求救早了数小时，队伍开始怀疑广播来源。","守卫身后的箱子里有一盘未拆封的磁带和炼化厂供电图。","账本上的路线证明样本与黑匣子最终被送往不同的位置。"],["供电总图标出了主电源和备用回路，任何一条仍通电都会维持广播。","防护材料上有腐蚀痕迹，林岚提醒队员避开泄漏区域。","设备报警声吸引了爆裂感染者，先听清警告再开火。","陈澈逐一核对三相线路，防止误切消防系统。","备电启动后控制台会自动锁定，只有坚持到程序结束才能操作。","陈澈带走总图，沈舟负责掩护他前往手动阀门。","静音设备可以减轻后续压力，但药箱能立即救回受伤队员。","电源切换产生的尖锐声响让附近尸群突然聚集。","阀门旁的铭牌写着灯塔维护站，证实供电线路的去向。","切断主备电源后广播仍在继续，说明还有隐藏的远程信号源。"],["车队记录列出一条绕行线路，最后一辆车却没有登记驾驶员。","留言里有人提到桥闸收到命令后提前关闭，家人被留在另一侧。","弃车形成许多盲角，猎杀者借车身掩护迅速接近。","桥闸仍连接旧指挥系统，陈澈需要先解除锁定顺序。","沈舟让车队逐辆通过，队伍必须在最后一辆车离开前守住桥头。","他承认自己签过撤离令，却不记得批准过封桥。","救护车里还剩两只药箱，标签上的医院批号与林岚的记录一致。","小乔说这首歌是母亲教给她的，过去从未在公共广播里播放。","巨影挡住了桥面，所有车辆只能在它倒下后继续前进。","陈澈追踪到另一组频率，源头竟藏在地下实验室。"],["工作台上有小乔母亲的笔迹：声音原本用于让尸群远离避难区。","三段样本记录显示实验最初成功，后来有人倒转了广播频率。","试验区的警示灯仍在闪烁，酸液痕迹遍布地面。","封存柜的顺序写在母亲的笔记边缘，输错会触发增援。","恢复波形需要连续读取磁带，终端一旦中断就得重新开始。","许宁承认母亲曾向上级提出抗议，之后研究记录便被封存。","药箱能帮助受伤队伍，静音设备则能减少暴露在广播下的时间。","篡改记录的时间晚于沈舟下令，签名密钥来自另一台终端。","服务器里的密钥终于指出循环广播的控制位置。","实验室的备用发射器只是中继，真正的中枢位于最后防线。"],["中枢入口的锁仍有电，陈澈判断自动循环尚未停止。","签名日志显示有人在撤离后复制了沈舟的权限。","广播最后一次增强，疾行者从防线外侧冲来。","终止协议需要完整顺序，错输会让广播继续循环并引来增援。","发射塔正在清除缓存信号，队伍必须坚持到倒计时结束。","小乔决定留下关闭最后的开关，沈舟护送阿禾先走。","最后一箱物资只能选一份，队伍必须根据眼前伤势决定。","重装感染者逼近防线，撤离船的灯光已经出现在水面。","首领循着残余广播到来，陈澈必须等战斗结束才能彻底切断线路。","灯塔熄灭后，小乔唱起那首歌；这一次，声音只属于幸存者。"]];
window.EvacStoryV5=A;
window.__installStoryV5=function(G){
 const T=G.THREE,P=G.physics,W=G.worldV4,storeKey='evac_story_v4';if(!W)throw new Error('缺少世界地图模块');
 let index=0,mapIndex=-1,stage=null,targets=[],npc=null,started=false,locked=0,spawnTimer=0,lastHUD='',lastIndex=-1,branch='medical',finished=false;
 const V=(x,y,z)=>new T.Vector3(x,y,z), map=()=>Math.floor(index/10), part=()=>index%10, chapter=()=>A[map()].chapters[part()];
 const card=document.createElement('div');card.id='story-v4-card';card.hidden=true;document.getElementById('app').append(card);
 const open=document.createElement('button');open.id='story-v4-open';open.textContent='章节 / 继续';document.getElementById('app').append(open);
 const panel=document.createElement('div');panel.id='story-v4-panel';panel.hidden=true;panel.innerHTML='<div><h2>救援行动</h2><p>十个区域 · 百章连续故事。当前浏览器自动记录章节进度。</p><label>区域 <select id="story-map"></select></label><label>章节 <select id="story-part"></select></label><p><button id="story-go">开始所选章节</button><button id="story-continue">继续上次进度</button><button id="story-close">返回</button></p></div>';document.getElementById('app').append(panel);
 const css=document.createElement('style');css.textContent=`#story-v4-card{position:absolute;z-index:38;top:74px;left:16px;width:min(360px,44vw);padding:11px 14px;background:#111d;border-left:3px solid #eab65c;color:#f4eee1;text-shadow:0 1px 3px #000;font:13px/1.45 system-ui;pointer-events:none}#story-v4-card strong{display:block;color:#ffd083;font-size:14px}#story-v4-card small{display:block;margin:4px 0;color:#e3e2d9}#story-v4-card em{display:block;font-style:normal;color:#ffd18d}#story-v4-open{position:absolute;right:15px;top:15px;z-index:80;padding:9px 13px;background:#171d1ee8;color:#fae5bb;border:1px solid #c99d60;cursor:pointer}#story-v4-panel{position:absolute;z-index:90;inset:0;background:#000c;display:grid;place-items:center;color:#eee}#story-v4-panel[hidden]{display:none}#story-v4-panel>div{background:#172022;border:1px solid #b18b55;padding:22px;max-width:520px}#story-v4-panel label{display:block;margin:8px}#story-v4-panel select,#story-v4-panel button{background:#253033;color:#f6edda;border:1px solid #95866f;padding:8px;margin:4px;cursor:pointer}@media(max-width:700px){#story-v4-card{font-size:11px;top:60px;max-width:45vw}#story-v4-card strong{font-size:12px}#story-v4-open{top:6px;right:6px;font-size:11px}}`;
 document.head.append(css);
 const msel=panel.querySelector('#story-map'),psel=panel.querySelector('#story-part');msel.innerHTML=A.map((a,i)=>`<option value="${i}">${i+1}. ${a.name}</option>`).join('');function options(){psel.innerHTML=A[+msel.value].chapters.map((c,i)=>`<option value="${i}">${i+1}. ${c[0]}</option>`).join('')}msel.addEventListener('change',options);options();
 function saved(){try{const raw=JSON.parse(localStorage.getItem(storeKey)||'null');branch=raw?.branch==='stealth'?'stealth':'medical';return Math.max(0,Math.min(99,Number(raw?.index)||0))}catch{return 0}}
 function save(){try{localStorage.setItem(storeKey,JSON.stringify({index,branch}))}catch{}}
 open.addEventListener('click',()=>{msel.value=String(map());options();psel.value=String(part());panel.hidden=false});panel.querySelector('#story-close').onclick=()=>panel.hidden=true;
 function startAt(n){panel.hidden=true;if(['title','dead','complete'].includes(G.game.state))G.game.start({skipIntro:true});else if(G.game.state==='paused')G.game.resume();load(n,true)}
 panel.querySelector('#story-go').onclick=()=>startAt(+msel.value*10+(+psel.value));panel.querySelector('#story-continue').onclick=()=>startAt(saved());
 function clearMarkers(){for(const g of targets){G.scene.remove(g.group);g.group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map?.dispose();m.dispose()})}})}targets=[];try{G.hud.setMarkers?.([])}catch{}}
 function clearNPC(){if(!npc)return;G.scene.remove(npc.group);if(npc.model){npc.group.remove(npc.model.root);npc.model.root.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())})}npc.group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){o.material.map?.dispose();o.material.dispose()}});npc=null}
 function point(seed,from,min=8){try{return W.safePoint(seed,from||G.player.pos,min).clone()}catch{return (from||G.player.pos).clone().add(new T.Vector3(3,0,0))}}
 function addMarker(seed,label,color,from){let pos;for(let attempt=0;attempt<35;attempt++){pos=point(seed+attempt*67,from,8);if(targets.every(t=>t.pos.distanceTo(pos)>4))break}const group=new T.Group();group.position.copy(pos);const box=new T.Mesh(new T.BoxGeometry(.75,.56,.62),new T.MeshStandardMaterial({color,metalness:.15,roughness:.7,emissive:0x15120b}));box.position.y=.28;group.add(box);const pole=new T.Mesh(new T.CylinderGeometry(.025,.025,4,8),new T.MeshBasicMaterial({color,transparent:true,opacity:.65}));pole.position.y=2;group.add(pole);const ring=new T.Mesh(new T.RingGeometry(.65,.82,22),new T.MeshBasicMaterial({color,transparent:true,opacity:.7,side:T.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;group.add(ring);
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=72;let ctx=canvas.getContext('2d');ctx.fillStyle='rgba(12,19,19,.85)';ctx.fillRect(0,0,256,72);ctx.fillStyle='#ffe0a0';ctx.font='bold 30px sans-serif';ctx.textAlign='center';ctx.fillText(label,128,45);const texture=new T.CanvasTexture(canvas),sp=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));sp.position.y=2.15;sp.scale.set(2,.56,1);group.add(sp);G.scene.add(group);const target={pos,group,ring,label};targets.push(target);return target}
 function radar(){try{G.hud.setMarkers?.(targets.map((t,i)=>({id:'s'+i,short:t.label,label:t.label,pos:t.pos,kind:'extract'})))}catch{}}
 function spawn(kind,seed){if(G.enemies.aliveCount()>=9)return null;let pos;try{pos=W.spawnPoint(seed,G.player.pos,10)}catch{pos=point(seed,G.player.pos,10)}try{return G.enemies.spawnVariant?G.enemies.spawnVariant(kind||'normal',pos,{state:'alert'}):G.enemies.spawn('hound',pos,{state:'alert'})}catch(e){console.warn('[story spawn]',e);return null}}
 function addNPC(name){const g=new T.Group(),mat=new T.MeshStandardMaterial({color:0xc4a779,roughness:.85}),skin=new T.MeshStandardMaterial({color:0xc09b81,roughness:.8}),pants=new T.MeshStandardMaterial({color:0x3c5050,roughness:.8});function part(geo,m,x,y,z){let o=new T.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o}part(new T.CapsuleGeometry(.24,.45,4,8),mat,0,1.15,0);part(new T.SphereGeometry(.19,12,8),skin,0,1.7,0);for(let x of [-.14,.14])part(new T.CapsuleGeometry(.08,.5,4,8),pants,x,.45,0);for(let x of [-.28,.28])part(new T.CapsuleGeometry(.075,.42,4,8),mat,x,1.12,0);g.position.copy(point(index*131+47,G.player.pos,3));const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=64;const labelCtx=labelCanvas.getContext('2d');labelCtx.fillStyle='rgba(15,52,53,.85)';labelCtx.fillRect(0,0,256,64);labelCtx.fillStyle='#b5fff2';labelCtx.font='bold 28px sans-serif';labelCtx.textAlign='center';labelCtx.fillText('护送 · '+name,128,42);const labelTex=new T.CanvasTexture(labelCanvas),label=new T.Sprite(new T.SpriteMaterial({map:labelTex,transparent:true,depthWrite:false}));label.position.y=2.3;label.scale.set(2,.5,1);g.add(label);G.scene.add(g);const person={name,group:g,pos:g.position,hp:100,path:[],pathTimer:0,attackTimer:0,model:null};npc=person;if(window.__zombieReady)window.__zombieReady.then(factory=>{if(npc!==person)return;const model=factory.make();model.root.traverse(o=>{if(o.isMesh&&o.material){const clone=m=>{const c=m.clone();c.color?.setHex(0xb5d0c2);return c};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material)}});for(const child of g.children)if(child!==label)child.visible=false;g.add(model.root);person.model=model}).catch(()=>{});}
 function objectiveText(){if(!stage)return '';const [title,story,kind,opt]=chapter();if(kind==='interact')return `前往${opt.object}并按 E`;if(kind==='collect')return `找到${opt.object} ${stage.count}/${opt.count} · 靠近按 E`;if(kind==='decode')return `顺序 ${opt.order.map(i=>'ABC'[i]).join(' → ')} · 已完成 ${stage.count}/3`;if(kind==='kill')return `清除感染者 ${stage.count}/${stage.need}`;if(kind==='boss')return stage.count?'首领已击退':'击败变异首领';if(kind==='defend')return targets[0]&&G.player.pos.distanceTo(targets[0].pos)<7?`坚守 ${Math.ceil(stage.remaining)} 秒`:'前往目标区域开始防守';if(kind==='escort')return `${opt.npc}生命 ${Math.max(0,Math.round(npc?.hp||0))} · 靠近护送至标记`;if(kind==='timed')return `倒计时 ${Math.ceil(stage.remaining)} 秒 · 前往${opt.object}按 E`;if(kind==='choice')return `左侧：${opt.left}治疗 · 右侧：${opt.right}减少后续敌人`;return ''}
 function renderHUD(){if(G.game.state!=='playing'||!stage)return;const [title,story]=chapter(),target=targets[stage.active||0]||targets[0],distance=target?` · ${Math.round(G.player.pos.distanceTo(target.pos))} 米`:'';const intro=part()===0?`<small>${A[map()].story}</small>`:'';const html=`<strong>第 ${map()+1} 大章 · ${A[map()].lead}</strong><b>第 ${index+1}/100 节 · ${title}</b>${intro}<small>${story}</small><small>${EXTRA_STORY[map()][part()]}</small><em>${objectiveText()}${distance}</em>`;if(html!==lastHUD){lastHUD=html;card.innerHTML=html}}
 function resetStage(){finished=false;clearMarkers();clearNPC();G.enemies.clear();if(G.game.run?.queue)G.game.run.queue.length=0;const [title,story,kind,opt]=chapter();stage={kind,opt,count:0,active:0,remaining:opt.seconds||0,need:Math.max(1,(opt.count||1)-(branch==='stealth'&&kind==='kill'?1:0)),seed:4001+index*127};spawnTimer=kind==='boss'?.5:1.8;locked=1;lastHUD='';
  if(['interact','collect','timed','defend'].includes(kind))addMarker(stage.seed,opt.object||'目标',kind==='collect'?0x8ed997:0xffb04c);
  if(kind==='decode'){for(let i=0;i<3;i++)addMarker(stage.seed+i*39,'开关 '+('ABC'[i]),0xffb04c, i?targets[i-1].pos:G.player.pos);}
  if(kind==='choice'){addMarker(stage.seed,opt.left,0x8ed997);addMarker(stage.seed+39,opt.right,0x76bdde,targets[0].pos);}
  if(kind==='escort'){addNPC(opt.npc);addMarker(stage.seed,'撤离点',0xffb04c,npc.pos);}
  radar();G.hud.radio?.(`${A[map()].name} · ${title}。${part()===0?A[map()].story+' ':''}${story} ${EXTRA_STORY[map()][part()]}`,part()===0?12:9);G.hud.message?.(`第 ${index+1} 章 · ${title}`,3);save();card.hidden=false;renderHUD();
 }
 function buildMap(n){const result=W.build(n);mapIndex=n;G.level.enemySpawns=[];G.level.objectives=[];G.level.extraction=null;G.level.interiorBoxes=[];G.player.pos.copy(result?.spawn||V(-30,0,0));G.player.vel.set(0,0,0);G.player.yaw=result?.yaw??-Math.PI/2;G.player.pitch=0;}
 function load(n,force){index=Math.max(0,Math.min(99,Math.floor(+n||0)));if(map()!==mapIndex||force)buildMap(map());resetStage();open.style.display='none'}
 function finish(){finished=true;clearMarkers();clearNPC();G.enemies.clear();card.hidden=true;G.player.enabled=false;G.player.invulnerable=true;G.input.setGameplay?.(false);G.input.exitLock?.();G.hud.show?.(false);const stats=G.combat.stats,accuracy=stats.shots?Math.min(1,stats.hits/stats.shots):null;G.game.menus.setDebrief({time:G.game.run.time,accuracy,kills:stats.kills,retries:G.game.run.retries,rating:'救援完成'});G.game.state='complete';G.game.menus.show('complete');G.events.emit('game:state',{state:'complete',prev:'playing'});setTimeout(()=>{const h=document.querySelector('.m-screen[data-s="complete"] h2');if(h)h.textContent='灯塔熄灭 · 救援完成';},100);try{localStorage.removeItem(storeKey)}catch{}}
 function advance(){clearMarkers();clearNPC();if(index===99){finish();return}const old=map();index++;if(map()!==old){buildMap(map());G.player.heal(35)}resetStage()}
 G.events.on('enemy:killed',(event)=>{if(!stage||G.game.state!=='playing'||!['kill','boss'].includes(stage.kind))return;if(stage.kind==='boss'&&event?.enemy?.variantType!=='boss')return;stage.count++;if(stage.count>=stage.need)advance()});
 G.events.on('game:state',e=>{if(e.state==='intro'&&['title','dead','complete'].includes(e.prev)){started=true;load(e.prev==='title'?saved():e.prev==='complete'?0:index,true)}else if(e.state==='playing'&&e.prev==='title'&&!started){started=true;load(saved(),true)}open.style.display=['title','paused','dead','complete'].includes(e.state)?'block':'none';if(e.state==='dead'||e.state==='complete')card.hidden=true;else if(e.state==='playing')card.hidden=false});
 function interact(){if(!targets.length||locked>0||!G.input.down('interact'))return;let hit=-1,dist=2.5;targets.forEach((t,i)=>{const d=G.player.pos.distanceTo(t.pos);if(d<dist){dist=d;hit=i}});if(hit<0)return;locked=1;const kind=stage.kind,opt=stage.opt;
  if(kind==='decode'){const required=opt.order[stage.count];if(hit!==required){stage.count=0;G.hud.warn?.('顺序错误！线路复位，感染者被惊动。',3);spawn('runner',stage.seed+Date.now()%1000);spawn('normal',stage.seed+6);return}stage.count++;G.hud.message?.('开关 '+('ABC'[hit])+' 已启动',2);if(stage.count>=3)advance();return}
  if(kind==='choice'){branch=hit===0?'medical':'stealth';if(hit===0)G.player.heal(55);G.hud.message?.(hit===0?'已使用医疗箱，恢复生命。':'已取得静音设备，后续清剿敌人减少。',3);advance();return}
  if(kind==='collect'){stage.count++;if(opt.heal)G.player.heal(opt.heal/(opt.count||1));if(stage.count>=opt.count){advance();return}clearMarkers();addMarker(stage.seed+stage.count*71,opt.object,0x8ed997);radar();return}
  if(kind==='interact'||kind==='timed')advance();
 }
 function updateNPC(dt){if(!npc||!targets[0])return;const target=targets[0].pos,near=G.player.pos.distanceTo(npc.pos)<9;if(npc.model)npc.model.update(dt,near?'walk':'idle');if(near){npc.pathTimer-=dt;if(npc.pathTimer<=0){npc.pathTimer=1;try{npc.path=P.nav.findPath(npc.pos,target)||[]}catch{npc.path=[]}}let next=npc.path[0]||target;if(npc.path.length&&npc.pos.distanceTo(next)<.8){npc.path.shift();next=npc.path[0]||target}let delta=next.clone().sub(npc.pos);delta.y=0;if(delta.length()>.1){delta.normalize();npc.group.rotation.y=Math.atan2(delta.x,delta.z);P.moveCapsule(npc.pos,delta.multiplyScalar(1.65),dt,.25,1.7,true)}}npc.attackTimer-=dt;if(npc.attackTimer<=0&&G.enemies.list.some(e=>e.alive&&e.pos.distanceTo(npc.pos)<2)){npc.attackTimer=1.2;npc.hp-=12;G.hud.warn?.(`${npc.name} 正受攻击！`,1.5)}if(npc.hp<=0){G.hud.warn?.(`${npc.name} 倒下了，正在重试本章。`,3);resetStage();return}if(npc.pos.distanceTo(target)<2.2)advance();}
 const original=G.game.update.bind(G.game);G.game.update=function(dt){if(finished&&G.game.state==='complete')return false;const out=original(dt);if(G.game.state!=='playing'||!stage||finished)return out;if(G.game.run?.queue)G.game.run.queue.length=0;dt=Math.max(0,Math.min(.25,dt));locked=Math.max(0,locked-dt);spawnTimer-=dt;const kind=stage.kind,opt=stage.opt;
  if(kind==='kill'||kind==='boss'){const cap=kind==='boss'?1:Math.min(6,stage.need-stage.count+1);if(spawnTimer<=0&&G.enemies.aliveCount()<cap){spawnTimer=kind==='boss'?4:2;spawn(opt.variant||'normal',stage.seed+Math.floor(G.game.run.time*11)+stage.count*19)}}
  if(kind==='defend'&&targets[0]){if(G.player.pos.distanceTo(targets[0].pos)<7){stage.remaining-=dt;if(spawnTimer<=0){spawnTimer=3;spawn(opt.variant||'normal',stage.seed+Math.floor(G.game.run.time*9))}if(stage.remaining<=0){advance();return out}}}
  if(kind==='timed'){stage.remaining-=dt;if(spawnTimer<=0){spawnTimer=6;spawn('runner',stage.seed+Math.floor(G.game.run.time*13))}if(stage.remaining<=0){G.hud.warn?.('时间耗尽，重新尝试本章。',3);resetStage();return out}}
  if(kind==='escort'){updateNPC(dt);if(spawnTimer<=0){spawnTimer=4;spawn(opt.variant||'normal',stage.seed+Math.floor(G.game.run.time*7))}}
  interact();renderHUD();return out;
 };
 G.game.flow.patrol={gull:0,hound:0};G.game.flow.waves=[{gull:0,hound:0},{gull:0,hound:0},{gull:0,hound:0}];G.game.flow.pursuitExtra=0;
 window.__chapterCanRelay=()=>false;window.__chapterCanDefend=()=>false;window.__chapterCanExit=()=>false;
 G.campaign={get index(){return index},get map(){return mapIndex},get part(){return part()},get goal(){return targets[0]},get goals(){return targets},get kills(){return stage?.count||0},get hold(){return stage?.remaining||0},get stage(){return stage},get npc(){return npc},get acts(){return A},load(n){load(n,true)},advance,spawnOne:spawn,debugComplete:advance,finish};
 return G.campaign;
};
})();

