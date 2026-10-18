import {StudyAPI} from './api.mjs?v=3';
import {ManagementView} from './management.mjs';
const $ = id => document.getElementById(id);
function optionLabel(index){let label='',n=index+1;while(n){n--;label=String.fromCharCode(65+n%26)+label;n=Math.floor(n/26);}return label;}
const criteria = {accuracy:'Accuracy',understandability:'Understandability'};
const values = [['','Choose'],['NA','Cannot judge'],['1','1 — Very poor'],['2','2 — Poor'],['3','3 — Moderate'],['4','4 — Good'],['5','5 — Very good']];
let api, assignments=[], ratings=new Map(), current=0, profile, dirty=false, timer, queue=Promise.resolve(), conflict=false, pendingSaves=0;
let workspace=null,access={},management;
function notice(message='') { $('notice').textContent=message; }
function page(name) {
  for (const id of ['login','password','profile','study','dashboard','accounts']) $(id).hidden=id!==name;
  $('logout').hidden=name==='login';
  $('workspace-nav').hidden=['login','password','profile'].includes(name);
  $('change-password').hidden=['login','password'].includes(name);
  for(const [id,destination] of [['nav-evaluate','evaluate'],['nav-progress','dashboard'],['nav-accounts','accounts']])
    $(id).setAttribute('aria-current',workspace===destination?'page':'false');
}
function report(error) { notice(error.message || 'Unable to save. Please check your connection and try again.'); }
function progress() {
  const done=assignments.filter(a=>ratings.get(a.task_id)?.status==='submitted').length;
  const core=assignments.filter(a=>a.batch===1);
  const coreDone=core.filter(a=>ratings.get(a.task_id)?.status==='submitted').length;
  $('progress').textContent=`${coreDone} of ${core.length} target concepts completed` + (done>coreDone?` · ${done-coreDone} additional concepts completed`:'');
  $('progress-bar').max=Math.max(1,core.length);$('progress-bar').value=coreDone;
}
function render() {
  $('rating-form').hidden=!assignments.length;$('empty').hidden=!!assignments.length;
  if (!assignments.length) return;
  const assignment=assignments[current], task=assignment.annotation_tasks;
  const saved=ratings.get(assignment.task_id) || {};
  const section=assignments.filter(a=>a.batch===assignment.batch);
  const position=section.findIndex(a=>a.task_id===assignment.task_id)+1;
  $('question-position').textContent=`${assignment.batch===2?'Optional concept':'Concept'} ${position} of ${section.length} · ${task.domain.replaceAll('_',' ')}`;
  $('concept').textContent=task.concept;$('definition').textContent=task.definition;
  for (const input of $('familiarity').querySelectorAll('input[type=radio]')) input.checked=input.value===saved.familiarity;
  $('comment').value=saved.comment || '';
  const byId=new Map(task.options.map(option=>[option.id,option]));
  $('options').replaceChildren();
  assignment.option_order.forEach((oid,index)=>{
    const option=byId.get(oid);
    if (!option) throw new Error('The terms for this concept could not be loaded. Please contact the organizer.');
    const fieldset=document.createElement('fieldset'), legend=document.createElement('legend');
    legend.textContent=`${optionLabel(index)}. ${option.devanagari} `;
    const iast=document.createElement('span');iast.className='iast';iast.textContent=option.iast?`(${option.iast})`:'';legend.append(iast);fieldset.append(legend);
    const grid=document.createElement('div');grid.className='criteria';
    Object.entries(criteria).forEach(([key,title])=>{
      const group=document.createElement('fieldset');group.className='rating-row';
      const heading=document.createElement('legend');heading.textContent=title;group.append(heading);
      group.setAttribute('aria-describedby',`criterion-${key} scale-legend`);
      const choices=document.createElement('div');choices.className='radio-choices';
      values.filter(([value])=>value).forEach(([value])=>{
        const label=document.createElement('label');label.className='radio-choice';
        const input=document.createElement('input');input.type='radio';input.name=`rating-${oid}-${key}`;
        input.value=value;input.required=true;input.dataset.option=oid;input.dataset.criterion=key;
        input.checked=saved.answers?.[oid]?.[key]===value;
        input.setAttribute('aria-label',`${optionLabel(index)}: ${title}: ${value==='NA'?'Cannot judge':value}`);
        const caption=document.createElement('span');caption.textContent=value==='NA'?'Cannot judge':value;
        label.append(input,caption);choices.append(label);
      });
      group.append(choices);grid.append(group);
    });
    fieldset.append(grid);$('options').append(fieldset);
  });
  $('previous').disabled=current===0;
  $('submit').textContent=current===assignments.length-1?'Save response':'Save and next';
  $('save-status').textContent=saved.status==='submitted'?'Ratings submitted. You can return to edit them.':saved.revision?'Saved draft.':'Not yet saved.';
  dirty=false;progress();
}
async function load() {
  notice();
  if(api.currentUser) {
    const user=await api.currentUser();
    if(!user.user_metadata?.study_password_changed) { $('password-cancel').hidden=true;page('password');return; }
  }
  access=await api.rpc('study_capabilities',{});
  $('nav-evaluate').hidden=!access.annotator;
  $('nav-progress').hidden=!(access.admin||access.manager);
  $('nav-accounts').hidden=!access.admin;
  if(!workspace)workspace=(access.admin||access.manager)?'dashboard':'evaluate';
  if(workspace==='accounts'&&!access.admin)workspace='evaluate';
  if(workspace==='dashboard'&&!(access.admin||access.manager))workspace='evaluate';
  if(['dashboard','accounts'].includes(workspace)){
    management ||= new ManagementView(api,report);
    page(workspace);
    if(workspace==='dashboard')await management.showProgress();else await management.showAccounts();
    return;
  }
  const profiles=await api.query('participants','code,active,proficiency,devanagari,consented_at');
  profile=profiles[0];
  if (!profile?.active) throw new Error('This account does not have access to the study. Please contact the organizer.');
  if (!profile.consented_at) { page('profile');return; }
  const [tasks,responses]=await Promise.all([
    api.query('assignments','task_id,batch,position,option_order,annotation_tasks(concept,definition,domain,options)'),
    api.query('ratings','task_id,answers,familiarity,comment,status,revision,updated_at')
  ]);
  assignments=tasks.sort((a,b)=>a.batch-b.batch || a.position-b.position);
  ratings=new Map(responses.map(r=>[r.task_id,r]));
  const firstPending=assignments.findIndex(a=>ratings.get(a.task_id)?.status!=='submitted');
  current=Math.max(0,firstPending);conflict=false;dirty=false;
  $('participant').textContent=`Participant ${profile.code}`;
  page('study');render();
}
function collect() {
  const answers={};
  for (const input of $('options').querySelectorAll('input[type=radio]:checked')) {
    answers[input.dataset.option] ||= {};answers[input.dataset.option][input.dataset.criterion]=input.value;
  }
  return {task_id:assignments[current].task_id,answers,familiarity:$('familiarity').querySelector('input:checked')?.value || null,comment:$('comment').value};
}
function save(status='draft') {
  clearTimeout(timer);
  if (!assignments.length) return Promise.resolve(true);
  if (conflict) return Promise.resolve(false);
  if (!dirty && status==='draft') return queue;
  const snapshot=collect();dirty=false;pendingSaves++;$('save-status').textContent='Saving…';
  const operation=queue.catch(()=>{}).then(async()=>{
    if (conflict) return false;
    const previous=ratings.get(snapshot.task_id);
    // Autosaving an edited submitted response creates a draft until explicitly submitted again.
    const saved=await api.rpc('save_study_rating',{p_task_id:snapshot.task_id,p_answers:snapshot.answers,
      p_familiarity:snapshot.familiarity,p_comment:snapshot.comment,p_status:status,
      p_expected_revision:previous?.revision || 0});
    ratings.set(snapshot.task_id,{...snapshot,...saved,status});
    if (assignments[current]?.task_id===snapshot.task_id) $('save-status').textContent=status==='submitted'?'Response saved.':'Draft saved.';
    progress();return true;
  }).catch(error=>{
    dirty=true;
    if (error.code==='PT409' || error.code==='40001') { conflict=true;error.message='This response changed in another session. Download your current ratings if needed, then reload saved progress before editing.'; }
    $('save-status').textContent='Not saved. Keep this page open and retry.';report(error);return false;
  }).finally(()=>{pendingSaves--;});
  queue=operation;return operation;
}
async function move(index) { if (await save('draft')===false) return;current=index;render();window.scrollTo({top:0,behavior:'smooth'}); }
for(const [id,destination] of [['nav-evaluate','evaluate'],['nav-progress','dashboard'],['nav-accounts','accounts']]){
  $(id).addEventListener('click',async()=>{if(await save('draft')===false)return;workspace=destination;try{await load();}catch(error){report(error);}});
}
$('login-form').addEventListener('submit',async event=>{
  event.preventDefault();notice();const button=event.submitter || event.target.querySelector('button');button.disabled=true;
  try { const data=new FormData(event.target);await api.signIn(data.get('email'),data.get('password'));event.target.reset();await load(); }
  catch(error) {report(error);}finally{button.disabled=false;}
});
$('password-form').addEventListener('submit',async event=>{
  event.preventDefault();notice();
  const data=new FormData(event.target);
  if(data.get('password')!==data.get('confirm-password')) { notice('The two passwords do not match.');return; }
  const button=event.submitter || event.target.querySelector('button');button.disabled=true;
  try {await api.changePassword(data.get('password'));event.target.reset();await load();notice('Password changed. Use your new password next time you sign in.');}
  catch(error){report(error);}finally{button.disabled=false;}
});
$('change-password').addEventListener('click',async()=>{if(await save('draft')===false)return;notice();$('password-cancel').hidden=false;page('password');});
$('password-cancel').addEventListener('click',async()=>{ $('password-form').reset();try{await load();}catch(error){report(error);} });
$('profile-form').addEventListener('submit',async event=>{
  event.preventDefault();const button=event.submitter || event.target.querySelector('button');button.disabled=true;
  try {const data=new FormData(event.target);await api.rpc('save_participant_profile',{p_proficiency:data.get('proficiency'),p_devanagari:data.get('devanagari'),p_consent:data.get('consent')==='on'});await load();}
  catch(error){report(error);}finally{button.disabled=false;}
});
$('rating-form').addEventListener('input',()=>{dirty=true;clearTimeout(timer);$('save-status').textContent='Unsaved changes…';timer=setTimeout(()=>save('draft'),800);});
$('rating-form').addEventListener('submit',async event=>{
  event.preventDefault();$('submit').disabled=true;
  try {if(await save('submitted')) {if(current<assignments.length-1){const reachedTarget=assignments[current].batch===1 && assignments[current+1].batch===2 && assignments.filter(a=>a.batch===1).every(a=>ratings.get(a.task_id)?.status==='submitted');current++;render();if(reachedTarget)notice('You have completed 100 concepts. Thank you for your time. You can sign out or continue with the optional concepts.');window.scrollTo({top:0,behavior:'smooth'});}else notice('You have completed all assigned concepts. Your ratings are saved.');}}
  finally{$('submit').disabled=false;}
});
$('save-draft').addEventListener('click',()=>save('draft'));
$('previous').addEventListener('click',()=>move(current-1));
$('refresh').addEventListener('click',async()=>{if(dirty && !confirm('Reloading replaces unsaved edits with the saved response. Continue?'))return;clearTimeout(timer);await queue;try{await load();}catch(error){report(error);}});
$('logout').addEventListener('click',async()=>{if(!conflict && await save('draft')===false)return;clearTimeout(timer);try{await api.signOut();}catch(_){/* Local sign-out still completes. */}assignments=[];ratings.clear();management?.clear();workspace=null;access={};page('login');notice('Signed out on this device.');});
$('download').addEventListener('click',()=>{
  const responses=new Map(ratings);
  if(dirty && assignments.length){const draft=collect();responses.set(draft.task_id,{...draft,status:'unsaved_local_draft'});}
  const blob=new Blob([JSON.stringify({participant_code:profile.code,ratings:[...responses.values()]},null,2)],{type:'application/json'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`ratings-${profile.code}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
});
window.addEventListener('beforeunload',event=>{if(dirty || pendingSaves){event.preventDefault();event.returnValue='';}});
try {
  if(new URLSearchParams(location.search).has('preview')) {
    const module=await import('./preview.mjs');api=await module.previewAPI();
    notice('Local pilot preview: ratings are saved only in this browser.');
    await load();
  } else {api=new StudyAPI(window.STUDY_CONFIG || {});if(api.session)await load();}
}
catch(error){report(error);if(!api){for(const control of $('login-form').elements)control.disabled=true;}else page('login');}
