import {StudyAPI} from './api.mjs?v=2';
const $ = id => document.getElementById(id);
function optionLabel(index){let label='',n=index+1;while(n){n--;label=String.fromCharCode(65+n%26)+label;n=Math.floor(n/26);}return label;}
const criteria = {accuracy:'Accuracy',understandability:'Understandability'};
const explanations={accuracy:'How well does this term express the concept given in the definition?',understandability:'How easy would this term be for a learner with basic Sanskrit knowledge to understand when introduced with the definition?'};
const values = [['','Choose'],['NA','Cannot judge'],['1','1 — Very poor'],['2','2 — Poor'],['3','3 — Moderate'],['4','4 — Good'],['5','5 — Very good']];
let api, assignments=[], ratings=new Map(), current=0, profile, dirty=false, timer, queue=Promise.resolve(), conflict=false, pendingSaves=0;
function notice(message='') { $('notice').textContent=message; }
function page(name) { for (const id of ['login','profile','study']) $(id).hidden=id!==name; $('logout').hidden=name==='login'; }
function report(error) { notice(error.message || 'Unable to save. Please check your connection and try again.'); }
function progress() {
  const done=assignments.filter(a=>ratings.get(a.task_id)?.status==='submitted').length;
  $('progress').textContent=`${done} of ${assignments.length} questions completed`;
  $('progress-bar').max=Math.max(1,assignments.length);$('progress-bar').value=done;
}
function render() {
  $('rating-form').hidden=!assignments.length;$('empty').hidden=!!assignments.length;
  if (!assignments.length) return;
  const assignment=assignments[current], task=assignment.annotation_tasks;
  const saved=ratings.get(assignment.task_id) || {};
  $('question-position').textContent=`Concept ${current+1} of ${assignments.length} · ${task.domain.replaceAll('_',' ')}`;
  $('concept').textContent=task.concept;$('definition').textContent=task.definition;
  for (const input of $('familiarity').querySelectorAll('input[type=radio]')) input.checked=input.value===saved.familiarity;
  $('comment').value=saved.comment || '';
  const byId=new Map(task.options.map(option=>[option.id,option]));
  $('options').replaceChildren();
  assignment.option_order.forEach((oid,index)=>{
    const option=byId.get(oid);
    if (!option) throw new Error('This question is not configured correctly. Please contact the organizer.');
    const fieldset=document.createElement('fieldset'), legend=document.createElement('legend');
    legend.textContent=`${optionLabel(index)}. ${option.devanagari} `;
    const iast=document.createElement('span');iast.className='iast';iast.textContent=option.iast?`(${option.iast})`:'Transliteration pending review';legend.append(iast);fieldset.append(legend);
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
  $('save-status').textContent=saved.status==='submitted'?'Response submitted. You may revise your own ratings.':saved.revision?'Saved draft.':'Not yet saved.';
  dirty=false;progress();
}
async function load() {
  notice();
  const profiles=await api.query('participants','code,active,proficiency,devanagari,consented_at');
  profile=profiles[0];
  if (!profile?.active) throw new Error('There is no active study assignment for this account. Please contact the organizer.');
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
$('login-form').addEventListener('submit',async event=>{
  event.preventDefault();notice();const button=event.submitter || event.target.querySelector('button');button.disabled=true;
  try { const data=new FormData(event.target);await api.signIn(data.get('email'),data.get('password'));event.target.reset();await load(); }
  catch(error) {report(error);}finally{button.disabled=false;}
});
$('profile-form').addEventListener('submit',async event=>{
  event.preventDefault();const button=event.submitter || event.target.querySelector('button');button.disabled=true;
  try {const data=new FormData(event.target);await api.rpc('save_participant_profile',{p_proficiency:data.get('proficiency'),p_devanagari:data.get('devanagari'),p_consent:data.get('consent')==='on'});await load();}
  catch(error){report(error);}finally{button.disabled=false;}
});
$('rating-form').addEventListener('input',()=>{dirty=true;clearTimeout(timer);$('save-status').textContent='Unsaved changes…';timer=setTimeout(()=>save('draft'),800);});
$('rating-form').addEventListener('submit',async event=>{
  event.preventDefault();$('submit').disabled=true;
  try {if(await save('submitted')) {if(current<assignments.length-1){current++;render();window.scrollTo({top:0,behavior:'smooth'});}else notice('Your response is saved. You may take a break or return to review earlier questions.');}}
  finally{$('submit').disabled=false;}
});
$('save-draft').addEventListener('click',()=>save('draft'));
$('previous').addEventListener('click',()=>move(current-1));
$('refresh').addEventListener('click',async()=>{if(dirty && !confirm('Reloading replaces unsaved edits with the saved response. Continue?'))return;clearTimeout(timer);await queue;try{await load();}catch(error){report(error);}});
$('logout').addEventListener('click',async()=>{if(!conflict && await save('draft')===false)return;clearTimeout(timer);try{await api.signOut();}catch(_){/* Local sign-out still completes. */}assignments=[];ratings.clear();page('login');notice('Signed out on this device.');});
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
