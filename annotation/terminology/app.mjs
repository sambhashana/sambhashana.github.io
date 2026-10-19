import {StudyAPI,saveRating} from './api.mjs?v=4';
import {groupOptions,copyUnanswered} from './term-groups.mjs';
import {ManagementView} from './management.mjs';
import {orderWithDeferred,deferToEnd,nextUnfinished,deferredKey,readDeferred,writeDeferred} from './study-queue.mjs';
const $ = id => document.getElementById(id);
function optionLabel(index){let label='',n=index+1;while(n){n--;label=String.fromCharCode(65+n%26)+label;n=Math.floor(n/26);}return label;}
const criteria = {accuracy:'Accuracy',understandability:'Understandability'};
const values = [['','Choose'],['NA','Cannot judge'],['1','1 — Very poor'],['2','2 — Poor'],['3','3 — Moderate'],['4','4 — Good'],['5','5 — Very good']];
let api, assignments=[], ratings=new Map(), current=0, profile, dirty=false, timer, queue=Promise.resolve(), conflict=false, pendingSaves=0;
let workspace=null,access={},management,deferred=[],deferredStorageKey='',navigating=false,saveNotice='';
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
  const postponed=assignments.filter(a=>deferred.includes(a.task_id)&&ratings.get(a.task_id)?.status!=='submitted');
  const targetDeferred=postponed.filter(a=>a.batch===1).length;
  $('deferred-progress').textContent=postponed.length?`${postponed.length} ${postponed.length===1?'concept':'concepts'} deferred, including ${targetDeferred} target ${targetDeferred===1?'concept':'concepts'}.`:'';
  $('review-deferred').disabled=navigating||!postponed.length;
}
function render() {
  $('rating-form').hidden=!assignments.length;$('empty').hidden=!!assignments.length;
  if (!assignments.length) return;
  const assignment=assignments[current], task=assignment.annotation_tasks;
  const saved=ratings.get(assignment.task_id) || {};
  $('question-position').textContent=`Concept ${current+1} of ${assignments.length} · ${assignment.batch===2?'Optional concept':'Target concept'} · ${task.domain.replaceAll('_',' ')}`;
  $('concept').textContent=task.concept;$('definition').textContent=task.definition;
  for (const input of $('familiarity').querySelectorAll('input[type=radio]')) input.checked=input.value===saved.familiarity;
  $('comment').value=saved.comment || '';
  const byId=new Map(task.options.map(option=>[option.id,option]));
  $('options').replaceChildren();
  const groups=groupOptions(task.options,assignment.option_order);
  let index=0;
  for(const members of groups){
    const container=document.createElement('section');container.className='spelling-group';
    if(members.length>1){
      container.classList.add('has-variants');
      const heading=document.createElement('p');heading.className='group-label';heading.textContent='Similar spellings';container.append(heading);
    }
    members.forEach((oid,memberIndex)=>{
      const option=byId.get(oid),label=optionLabel(index++);
      if(!option)throw new Error('The terms for this concept could not be loaded. Please contact the organizer.');
      const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');fieldset.className='term-card';
      legend.id='term-'+oid;legend.textContent=`${label}. ${option.devanagari} `;
      if(option.iast){const iast=document.createElement('span');iast.className='iast';iast.textContent=`(${option.iast})`;legend.append(iast);}
      fieldset.append(legend);
      const grid=document.createElement('div');grid.className='criteria';
      Object.entries(criteria).forEach(([key,title])=>{
        const group=document.createElement('div');group.className='rating-row';group.setAttribute('role','radiogroup');
        const heading=document.createElement('span');heading.className='criterion-label';heading.id=`label-${oid}-${key}`;heading.textContent=title;group.append(heading);
        group.setAttribute('aria-labelledby',`${legend.id} ${heading.id}`);
        group.setAttribute('aria-describedby',`criterion-${key} scale-legend`);
        const choices=document.createElement('div');choices.className='radio-choices';
        values.filter(([value])=>value).forEach(([value])=>{
          const choice=document.createElement('label');choice.className='radio-choice';
          const input=document.createElement('input');input.type='radio';input.name=`rating-${oid}-${key}`;
          input.value=value;input.required=true;input.dataset.option=oid;input.dataset.criterion=key;
          input.checked=saved.answers?.[oid]?.[key]===value;
          input.setAttribute('aria-label',`${label}: ${title}: ${value==='NA'?'Cannot judge':value}`);
          const caption=document.createElement('span');caption.textContent=value==='NA'?'Cannot judge':value;
          choice.append(input,caption);choices.append(choice);
        });
        group.append(choices);grid.append(group);
      });
      fieldset.append(grid);
      if(memberIndex>0){
        const copy=document.createElement('button');copy.type='button';copy.className='copy-ratings';
        copy.textContent='Copy ratings from above';copy.dataset.copyFrom=members[memberIndex-1];copy.dataset.copyTo=oid;
        copy.setAttribute('aria-label',`Copy unanswered ratings from ${byId.get(members[memberIndex-1]).devanagari} to ${option.devanagari}`);
        copy.addEventListener('click',()=>{
          const result=copyUnanswered(collect().answers,copy.dataset.copyFrom,oid);
          if(!result.copied.length)return;
          for(const key of result.copied){
            const value=result.answers[oid][key];
            $('options').querySelector(`input[data-option="${oid}"][data-criterion="${key}"][value="${value}"]`).checked=true;
          }
          $('rating-form').dispatchEvent(new Event('input',{bubbles:true}));
        });
        fieldset.append(copy);
      }
      container.append(fieldset);
    });
    $('options').append(container);
  }
  updateCopyButtons();
  $('submit').textContent='Save and next';
  $('save-status').textContent=saved.status==='submitted'?'Ratings submitted. You can return to edit them.':saved.revision?'Saved draft.':'Not yet saved.';
  dirty=false;progress();updateControls();
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
  const userId=api.session?.user?.id||api.userKey||profile.code;
  deferredStorageKey=deferredKey(api.url||'preview',userId,access.study_id||'terminology');
  deferred=readDeferred(globalThis.localStorage,deferredStorageKey).filter(id=>assignments.some(a=>a.task_id===id));
  assignments=orderWithDeferred(assignments,deferred);
  const firstPending=nextUnfinished(assignments,ratings);
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
function updateCopyButtons(){
  for(const button of $('options').querySelectorAll('[data-copy-from]')){
    const source=$('options').querySelectorAll(`input[data-option="${button.dataset.copyFrom}"]:checked`).length;
    const destination=$('options').querySelectorAll(`input[data-option="${button.dataset.copyTo}"]:checked`).length;
    button.disabled=navigating||source<2||destination===2;
  }
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
    const saved=await saveRating(api,{p_task_id:snapshot.task_id,p_answers:snapshot.answers,
      p_familiarity:snapshot.familiarity,p_comment:snapshot.comment,p_status:status,
      p_expected_revision:previous?.revision || 0});
    ratings.set(snapshot.task_id,{...snapshot,...saved});
    if(assignments[current]?.task_id===snapshot.task_id&&!dirty)$('save-status').textContent=saved.status==='submitted'?'Response saved.':'Draft saved.';
    if(saveNotice&&$('notice').textContent===saveNotice)notice();saveNotice='';progress();return true;
  }).catch(error=>{
    dirty=true;
    if (error.code==='PT409' || error.code==='40001') { conflict=true;error.message='This response changed in another session. Download your current ratings if needed, then reload saved progress before editing.'; }
    $('save-status').textContent=error.code==='SAVE_UNCONFIRMED'?'Save not confirmed. Keep this page open and try saving again.':'Not saved. Keep this page open and retry.';report(error);saveNotice=$('notice').textContent;return false;
  }).finally(()=>{pendingSaves--;});
  queue=operation;return operation;
}
function updateControls(){
  $('previous').disabled=navigating||current===0;
  $('submit').disabled=navigating;
  $('defer').disabled=navigating||!assignments.length||(!dirty&&ratings.get(assignments[current]?.task_id)?.status==='submitted');
  updateCopyButtons();progress();
}
async function navigate(action){
  if(navigating)return;
  navigating=true;
  const controls=[...document.querySelectorAll('#rating-form input,#rating-form textarea,#rating-form button,#workspace-nav button,#refresh,#download,#change-password,#logout,#review-deferred')].map(node=>[node,node.disabled]);
  for(const [node] of controls)node.disabled=true;
  try{await action();}catch(error){report(error);}
  finally{
    navigating=false;
    for(const [node,disabled] of controls)if(node.isConnected)node.disabled=disabled;
    updateControls();
  }
}
async function move(index){
  if(index<0||index>=assignments.length)return;
  await navigate(async()=>{if(await save('draft')===false)return;current=index;render();window.scrollTo({top:0,behavior:'smooth'});});
}
for(const [id,destination] of [['nav-evaluate','evaluate'],['nav-progress','dashboard'],['nav-accounts','accounts']]){
  $(id).addEventListener('click',()=>navigate(async()=>{if(await save('draft')===false)return;workspace=destination;await load();}));
}
$('defer').addEventListener('click',()=>navigate(async()=>{
  const id=assignments[current].task_id,start=current;
  if(await save('draft')===false)return;
  deferred=deferToEnd(deferred,id);
  const remembered=writeDeferred(globalThis.localStorage,deferredStorageKey,deferred);
  assignments=orderWithDeferred(assignments,deferred);
  const next=nextUnfinished(assignments,ratings,start,id);
  current=next<0?assignments.findIndex(a=>a.task_id===id):next;
  render();
  notice((next<0?'This is your last unfinished concept. It is at the end of the queue.':'Concept moved to the end of the queue.')+
    (remembered?'':' This browser could not remember the new order.'));
  window.scrollTo({top:0,behavior:'smooth'});
}));
$('review-deferred').addEventListener('click',()=>{
  const index=assignments.findIndex(a=>deferred.includes(a.task_id)&&ratings.get(a.task_id)?.status!=='submitted');
  if(index>=0)move(index);
});
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
$('rating-form').addEventListener('input',()=>{dirty=true;updateControls();clearTimeout(timer);$('save-status').textContent='Unsaved changes…';timer=setTimeout(()=>save('draft'),800);});
$('rating-form').addEventListener('submit',event=>{
  event.preventDefault();
  navigate(async()=>{
    const targetWasComplete=assignments.filter(a=>a.batch===1).every(a=>ratings.get(a.task_id)?.status==='submitted');
    if(await save('submitted')===false)return;
    const targetComplete=assignments.filter(a=>a.batch===1).every(a=>ratings.get(a.task_id)?.status==='submitted');
    const next=nextUnfinished(assignments,ratings,current+1);
    if(next>=0){current=next;render();window.scrollTo({top:0,behavior:'smooth'});}
    else notice('You have completed all assigned concepts. Your ratings are saved.');
    if(!targetWasComplete&&targetComplete)notice('You have completed 100 target concepts. Thank you for your time. Any remaining concepts are optional.');
  });
});
$('save-draft').addEventListener('click',()=>navigate(()=>save('draft')));
$('previous').addEventListener('click',()=>move(current-1));
$('refresh').addEventListener('click',()=>navigate(async()=>{if(dirty&&!confirm('Reloading replaces unsaved edits with the saved response. Continue?'))return;clearTimeout(timer);await queue;await load();}));
$('logout').addEventListener('click',()=>navigate(async()=>{if(!conflict && await save('draft')===false)return;clearTimeout(timer);try{await api.signOut();}catch(_){/* Local sign-out still completes. */}assignments=[];ratings.clear();management?.clear();workspace=null;access={};page('login');deferred=[];deferredStorageKey='';notice('Signed out on this device.');}));
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
