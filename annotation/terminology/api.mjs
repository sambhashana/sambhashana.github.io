// Small Supabase Auth/PostgREST client; no administrator credentials are used.
export class StudyAPI {
  constructor(config, storage = globalThis.localStorage, request = globalThis.fetch.bind(globalThis)) {
    this.url = (config.supabaseUrl || '').replace(/\/$/, '');
    this.key = config.publishableKey || '';
    this.storage = storage;
    this.request = request;
    this.refreshing = null;
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(this.url)) throw new Error('The study is not available yet. Please contact the organizer.');
    let role = '';
    try { role = JSON.parse(atob(this.key.split('.')[1].replaceAll('-','+').replaceAll('_','/'))).role; } catch (_) { /* New publishable keys are not JWTs. */ }
    if (!this.key.startsWith('sb_publishable_') && role !== 'anon') throw new Error('The study is not available yet. Please contact the organizer.');
    this.storageKey = 'sambhashana-study-session:' + this.url;
    try { this.session = JSON.parse(this.storage.getItem(this.storageKey) || 'null'); } catch (_) { this.session = null; }
  }
  remember(value) {
    this.session = value;
    if (value) this.storage.setItem(this.storageKey, JSON.stringify(value));
    else this.storage.removeItem(this.storageKey);
  }
  async send(path, {method='GET', body, authenticated=true} = {}) {
    if (authenticated) await this.refresh();
    const headers = {apikey: this.key, 'Content-Type': 'application/json'};
    if (authenticated) {
      if (!this.session?.access_token) throw new Error('Please sign in again.');
      headers.Authorization = 'Bearer ' + this.session.access_token;
    }
    const response = await this.request(this.url + path, {method, headers, body: body === undefined ? undefined : JSON.stringify(body)});
    const text = await response.text();
    let value;
    try { value = text ? JSON.parse(text) : null; } catch (_) {
      const error=new Error('The server returned an unreadable response. Please try again.');error.code='BAD_RESPONSE';throw error;
    }
    if (!response.ok) {
      const error = new Error(value?.message || value?.msg || value?.error_description || 'Unable to connect to the study.');
      error.code = value?.code;
      error.status = response.status;
      throw error;
    }
    return value;
  }
  async signIn(email, password) {
    const data = await this.send('/auth/v1/token?grant_type=password', {method:'POST', body:{email,password}, authenticated:false});
    this.remember({...data, expires_at: data.expires_at || Math.floor(Date.now()/1000) + data.expires_in});
    return this.session;
  }
  async refresh() {
    if (!this.session || this.session.expires_at > Date.now()/1000 + 60) return;
    if (!this.refreshing) {
      this.refreshing = this.send('/auth/v1/token?grant_type=refresh_token', {method:'POST', authenticated:false,
        body:{refresh_token:this.session.refresh_token}}).then(data => {
          this.remember({...data, expires_at:data.expires_at || Math.floor(Date.now()/1000) + data.expires_in});
        }).catch(error => {
          // A dropped connection does not mean the refresh token was rejected.
          if(error.status===400||error.status===401)this.remember(null);
          throw error;
        }).finally(() => { this.refreshing = null; });
    }
    await this.refreshing;
  }
  async signOut() {
    try { if (this.session) await this.send('/auth/v1/logout', {method:'POST'}); }
    finally { this.remember(null); }
  }
  async currentUser() {
    const user = await this.send('/auth/v1/user');
    this.remember({...this.session, user});
    return user;
  }
  async changePassword(password) {
    const user = await this.send('/auth/v1/user', {method:'PUT',
      body:{password, data:{study_password_changed:true}}});
    this.remember({...this.session, user});
    return user;
  }
  query(table, select) { return this.send('/rest/v1/' + table + '?select=' + encodeURIComponent(select)); }
  async readRating(taskId) {
    const select='task_id,answers,familiarity,comment,status,revision,updated_at';
    const rows=await this.send('/rest/v1/ratings?select='+encodeURIComponent(select)+'&task_id=eq.'+encodeURIComponent(taskId));
    return rows[0]||null;
  }
  rpc(name, body) { return this.send('/rest/v1/rpc/' + name, {method:'POST', body}); }
}

const canonical=value=>JSON.stringify(value&&typeof value==='object'&&!Array.isArray(value)
  ?Object.keys(value).sort().map(key=>[key,canonical(value[key])])
  :Array.isArray(value)?value.map(canonical):value);
export function sameRating(row,body){
  return canonical(row.answers)===canonical(body.p_answers)&&
    (row.familiarity??null)===(body.p_familiarity??null)&&(row.comment||'')===(body.p_comment||'');
}

export async function saveRating(api,body){
  const request={...body};
  for(let attempt=0;attempt<3;attempt++){
    try{
      const saved=await api.rpc('save_study_rating',request);
      if(!Number.isInteger(saved?.revision)||saved.revision<1){const error=new Error('Save confirmation was unreadable.');error.code='BAD_RESPONSE';throw error;}
      return {...saved,status:request.p_status};
    }
    catch(error){
      const conflict=['PT409','40001'].includes(error.code);
      const uncertain=error instanceof TypeError||error.name==='AbortError'||error.status>=500||error.code==='BAD_RESPONSE';
      if(!conflict&&!uncertain)throw error;
      let row;
      try{row=api.readRating?await api.readRating(request.p_task_id):
        (await api.query('ratings','task_id,answers,familiarity,comment,status,revision,updated_at')).find(r=>r.task_id===request.p_task_id);}
      catch(_){
        const unconfirmed=new Error('Could not confirm the save. Your ratings are still on this page. Check your connection and try saving again.');
        unconfirmed.code='SAVE_UNCONFIRMED';throw unconfirmed;
      }
      if(row&&sameRating(row,request)){
        if(row.status===request.p_status||row.status==='submitted'&&request.p_status==='draft')
          return {revision:row.revision,updated_at:row.updated_at,status:row.status,reconciled:true};
        // Identical answers already saved as a draft: only change its submission state.
        request.p_expected_revision=row.revision;
      }else if((row?.revision||0)!==request.p_expected_revision){
        const changed=new Error('This response changed in another session. Reload saved progress before editing.');
        changed.code='PT409';throw changed;
      }
      if(attempt===2){
        const unconfirmed=new Error('Could not confirm the save. Keep this page open and try saving again.');
        unconfirmed.code='SAVE_UNCONFIRMED';throw unconfirmed;
      }
    }
  }
}
