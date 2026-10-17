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
    try { value = text ? JSON.parse(text) : null; } catch (_) { throw new Error('The server returned an unreadable response. Please try again.'); }
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
        }).catch(error => { this.remember(null); throw error; }).finally(() => { this.refreshing = null; });
    }
    await this.refreshing;
  }
  async signOut() {
    try { if (this.session) await this.send('/auth/v1/logout', {method:'POST'}); }
    finally { this.remember(null); }
  }
  query(table, select) { return this.send('/rest/v1/' + table + '?select=' + encodeURIComponent(select)); }
  rpc(name, body) { return this.send('/rest/v1/rpc/' + name, {method:'POST', body}); }
}
