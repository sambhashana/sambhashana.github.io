// Local preview adapter. Supabase production access remains authenticated.
export async function previewAPI(){
 const response=await fetch('/pilot-data');if(!response.ok)throw new Error('Start the in-memory pilot server to preview its terms.');
 const data=await response.json(),key='pilot-preview:'+data.study_id;
 let state=JSON.parse(localStorage.getItem(key)||'{"ratings":[],"consented":false}');
 const persist=()=>localStorage.setItem(key,JSON.stringify(state));
 const assignments=data.tasks.map((task,index)=>({task_id:task.id,batch:1,position:index,option_order:task.options.map(o=>o.id),annotation_tasks:task}));
 return {session:true,async query(table){
  if(table==='participants')return [{code:'LOCAL-PREVIEW',active:true,consented_at:state.consented?'preview':null}];
  if(table==='assignments')return assignments;if(table==='ratings')return state.ratings;throw new Error('Unknown preview table');
 },async rpc(name,p){
  if(name==='save_participant_profile'){state.consented=p.p_consent;persist();return {};}
  const old=state.ratings.find(r=>r.task_id===p.p_task_id);
  if((old?.revision||0)!==p.p_expected_revision)throw new Error('Preview changed in another tab. Reload saved progress.');
  const saved={task_id:p.p_task_id,answers:p.p_answers,familiarity:p.p_familiarity,comment:p.p_comment,status:p.p_status,revision:(old?.revision||0)+1,updated_at:new Date().toISOString()};
  state.ratings=state.ratings.filter(r=>r.task_id!==saved.task_id);state.ratings.push(saved);persist();return saved;
 },async signOut(){location.href='/';}};
}
