const $=id=>document.getElementById(id);
const textCell=value=>{const cell=document.createElement('td');cell.textContent=value;return cell;};

export function coverageBuckets(terms){
  const counts=[0,0,0,0,0,0];
  for(const term of terms)counts[Math.min(5,term.submitted)]++;
  return counts.map((count,index)=>({label:index===5?'5 or more':String(index),count}));
}
export function filterTerms(terms,query='',domain='',unrated=false){
  const search=query.trim().toLocaleLowerCase();
  return terms.filter(t=>(!domain||t.domain===domain)&&(!unrated||t.submitted===0)&&
    (!search||[t.concept,t.devanagari,t.iast||''].some(v=>v.toLocaleLowerCase().includes(search))));
}

export class ManagementView{
  constructor(api,report){
    this.api=api;this.report=report;this.terms=[];this.offset=0;this.pageSize=50;
    $('dashboard-refresh').addEventListener('click',()=>this.showProgress().catch(report));
    for(const id of ['progress-search','progress-domain','progress-unrated'])$(id).addEventListener('input',()=>{this.offset=0;this.renderTerms();});
    $('terms-previous').addEventListener('click',()=>{this.offset=Math.max(0,this.offset-this.pageSize);this.renderTerms();});
    $('terms-next').addEventListener('click',()=>{this.offset+=this.pageSize;this.renderTerms();});
    $('download-counts').addEventListener('click',()=>this.downloadCounts());
    $('accounts-refresh').addEventListener('click',()=>this.showAccounts().catch(report));
  }
  async showProgress(){
    this.terms=[];$('term-counts').replaceChildren();$('coverage-chart').replaceChildren();
    $('dashboard-status').textContent='Loading counts…';
    const data=await this.api.rpc('get_study_progress',{});
    this.terms=data.terms;this.offset=0;
    for(const [id,value] of Object.entries({
      'total-concepts':data.summary.concepts,'total-terms':data.summary.terms,
      'total-annotators':data.summary.annotators,'submitted-concepts':data.summary.submitted_concepts
    }))$(id).textContent=Number(value).toLocaleString();
    const domain=$('progress-domain'),selected=domain.value;
    domain.replaceChildren(new Option('All domains',''));
    for(const value of [...new Set(this.terms.map(t=>t.domain))].sort())domain.append(new Option(value.replaceAll('_',' '),value));
    domain.value=[...domain.options].some(o=>o.value===selected)?selected:'';
    const buckets=coverageBuckets(this.terms),max=Math.max(1,...buckets.map(b=>b.count));
    $('coverage-chart').replaceChildren();
    for(const bucket of buckets){
      const row=document.createElement('div');row.className='coverage-row';
      const label=document.createElement('span');label.textContent=bucket.label;
      const track=document.createElement('div');track.className='coverage-track';track.setAttribute('aria-hidden','true');
      const bar=document.createElement('div');bar.className='coverage-fill';bar.style.width=`${100*bucket.count/max}%`;track.append(bar);
      const count=document.createElement('span');count.textContent=bucket.count.toLocaleString();
      row.append(label,track,count);$('coverage-chart').append(row);
    }
    this.renderTerms();
    $('dashboard-status').textContent=`Updated ${new Date(data.summary.updated_at).toLocaleString()} · ${data.summary.draft_concepts} concepts saved as drafts`;
  }
  filtered(){return filterTerms(this.terms,$('progress-search').value,$('progress-domain').value,$('progress-unrated').checked);}
  renderTerms(){
    const filtered=this.filtered();
    if(this.offset>=filtered.length)this.offset=Math.max(0,Math.floor((filtered.length-1)/this.pageSize)*this.pageSize);
    $('term-counts').replaceChildren();
    for(const term of filtered.slice(this.offset,this.offset+this.pageSize)){
      const row=document.createElement('tr'),concept=textCell(term.concept),domain=document.createElement('small');
      domain.textContent=term.domain.replaceAll('_',' ');concept.append(domain);
      const spelling=textCell(term.devanagari);
      if(term.iast){const iast=document.createElement('small');iast.textContent=term.iast;spelling.append(iast);}
      row.append(concept,spelling,textCell(term.submitted),
        textCell(`${term.accuracy} rated; ${term.accuracy_cannot_judge} cannot judge`),
        textCell(`${term.understandability} rated; ${term.understandability_cannot_judge} cannot judge`),
        textCell(term.target_assigned));$('term-counts').append(row);
    }
    const end=Math.min(filtered.length,this.offset+this.pageSize);
    $('terms-page').textContent=filtered.length?`${this.offset+1}–${end} of ${filtered.length} terms`:'No matching terms';
    $('terms-previous').disabled=this.offset===0;$('terms-next').disabled=end>=filtered.length;
  }
  async showAccounts(){
    $('account-rows').replaceChildren();
    $('accounts-status').textContent='Loading accounts…';
    const people=await this.api.rpc('list_study_accounts',{});
    $('account-rows').replaceChildren();
    for(const person of people){
      const row=document.createElement('tr');
      row.append(textCell(person.code),textCell(person.email),textCell(person.admin?'Administrator':person.active?'Active':'Inactive'));
      const role=document.createElement('td');
      if(person.admin)role.textContent='All tasks';
      else{
        const label=document.createElement('label');label.className='check';
        const input=document.createElement('input');input.type='checkbox';input.checked=person.manager;
        input.disabled=(!person.active||!person.password_chosen)&&!person.manager;
        input.setAttribute('aria-label',`Manager access for ${person.email}`);
        label.append(input,document.createTextNode('Manager'));role.append(label);
        if(!person.password_chosen){const note=document.createElement('small');note.textContent='Must choose a password first';role.append(note);}
        input.addEventListener('change',async()=>{
          const enabled=input.checked;input.disabled=true;
          try{await this.api.rpc('set_study_manager',{p_user_id:person.user_id,p_enabled:enabled});person.manager=enabled;$('accounts-status').textContent=`Manager access ${enabled?'granted to':'removed from'} ${person.email}.`;}
          catch(error){input.checked=!enabled;this.report(error);}
          finally{input.disabled=(!person.active||!person.password_chosen)&&!person.manager;}
        });
      }
      row.append(role,textCell(person.target_assigned?`${person.target_completed} of ${person.target_assigned}`:'Not assigned'));
      $('account-rows').append(row);
    }
    $('accounts-status').textContent=`${people.length} accounts`;
  }
  downloadCounts(){
    const columns=['concept','domain','devanagari','iast','submitted','accuracy','accuracy_cannot_judge','understandability','understandability_cannot_judge','target_assigned','assigned','task_id','option_id'];
    const quote=value=>'"'+String(value??'').replaceAll('"','""')+'"';
    const csv=[columns.join(','),...this.filtered().map(t=>columns.map(c=>quote(t[c])).join(','))].join('\r\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
    link.download='terminology-rating-counts.csv';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  }
  clear(){
    this.terms=[];this.offset=0;
    for(const id of ['term-counts','coverage-chart','account-rows'])$(id).replaceChildren();
    for(const id of ['total-concepts','total-terms','total-annotators','submitted-concepts'])$(id).textContent='—';
    for(const id of ['dashboard-status','accounts-status','terms-page'])$(id).textContent='';
  }
}
