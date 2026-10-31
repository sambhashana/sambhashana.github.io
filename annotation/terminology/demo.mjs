// Public demonstration only. This does not authenticate to Supabase or grant database access.
const SESSION='sambhashana-terminology-demo-session:v1';
const PASSWORD_SHA256='81388cc65e5f3a49885d45c3cc43b817d3f7baf21fbad9929ade2956cc8d0ffd';
export function isDemoEmail(email){return String(email).trim().toLowerCase()==='reviewer@iscls';}
export function hasDemoSession(storage=globalThis.localStorage){return storage.getItem(SESSION)==='active';}
export async function demoAPI({storage=globalThis.localStorage,request=globalThis.fetch.bind(globalThis),email,password,restore=false}={}){
  if(restore){if(!hasDemoSession(storage))throw new Error('Please sign in to the demonstration.');}
  else{
    const digest=[...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(password))))].map(b=>b.toString(16).padStart(2,'0')).join('');
    if(!isDemoEmail(email)||digest!==PASSWORD_SHA256)throw new Error('The demo email or password is incorrect.');
  }
  const response=await request(new URL('./demo-data.json',import.meta.url));
  if(!response.ok)throw new Error('The demonstration could not be loaded. Please try again.');
  const data=await response.json(),key='sambhashana-terminology-demo-ratings:'+data.study_id;
  const assignments=data.tasks.map((task,index)=>({task_id:task.id,batch:index<100?1:2,position:index,option_order:task.options.map(o=>o.id),annotation_tasks:task}));
  const tasks=new Map(data.tasks.map(t=>[t.id,t]));
  function read(){try{return JSON.parse(storage.getItem(key)||'[]');}catch(_){return [];}}
  storage.setItem(SESSION,'active');
  return {isDemo:true,session:true,userKey:'iscls-demo:'+data.study_id,
    async query(table){
      if(table==='participants')return [{code:'ISCLS-DEMO',active:true,consented_at:'demo'}];
      if(table==='assignments')return assignments;if(table==='ratings')return read();
      throw new Error('This feature is not available in the demonstration.');
    },
    async readRating(taskId){return read().find(r=>r.task_id===taskId)||null;},
    async rpc(name,p){
      if(name==='study_capabilities')return {admin:false,manager:false,annotator:true,study_id:'iscls-demo'};
      if(name!=='save_study_rating')throw new Error('This feature is not available in the demonstration.');
      const task=tasks.get(p.p_task_id);if(!task)throw new Error('Unknown demonstration concept.');
      if(!['draft','submitted'].includes(p.p_status))throw new Error('Invalid save status.');
      if(Object.entries(p.p_answers||{}).some(([id,a])=>!task.options.some(o=>o.id===id)||Object.values(a).some(v=>!['NA','1','2','3','4','5'].includes(v))))throw new Error('Invalid ratings.');
      if(p.p_status==='submitted'&&(!['NA','0','1','2','3'].includes(p.p_familiarity)||task.options.some(o=>!p.p_answers?.[o.id]?.accuracy||!p.p_answers?.[o.id]?.understandability)))throw new Error('Complete the ratings before continuing.');
      const rows=read(),old=rows.find(r=>r.task_id===task.id);
      if((old?.revision||0)!==p.p_expected_revision){const error=new Error('The demo response changed in another tab. Reload saved progress.');error.code='PT409';throw error;}
      const saved={task_id:task.id,answers:structuredClone(p.p_answers||{}),familiarity:p.p_familiarity,comment:p.p_comment||'',status:p.p_status,revision:(old?.revision||0)+1,updated_at:new Date().toISOString()};
      storage.setItem(key,JSON.stringify(rows.filter(r=>r.task_id!==task.id).concat(saved)));return saved;
    },
    async signOut(){storage.removeItem(SESSION);this.session=null;}
  };
}
