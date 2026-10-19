// Deferral is a browser preference; assignments and target membership stay intact.
export function orderWithDeferred(assignments,deferred){
  const byId=new Map(assignments.map(a=>[a.task_id,a]));
  const tail=[...new Set(deferred)].filter(id=>byId.has(id));
  const moved=new Set(tail);
  return assignments.filter(a=>!moved.has(a.task_id)).concat(tail.map(id=>byId.get(id)));
}
export function deferToEnd(deferred,taskId){
  return deferred.filter(id=>id!==taskId).concat(taskId);
}
export function nextUnfinished(assignments,ratings,start=0,exclude=null){
  for(let offset=0;offset<assignments.length;offset++){
    const index=(Math.max(0,start)+offset)%assignments.length;
    const id=assignments[index].task_id;
    if(id!==exclude&&ratings.get(id)?.status!=='submitted')return index;
  }
  return -1;
}
export function deferredKey(url,userId,studyId){
  return 'sambhashana-deferred:'+JSON.stringify([url,userId,studyId]);
}
export function readDeferred(storage,key){
  try{
    const value=JSON.parse(storage.getItem(key)||'[]');
    return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'))]:[];
  }catch(_){return [];}
}
export function writeDeferred(storage,key,deferred){
  try{storage.setItem(key,JSON.stringify(deferred));return true;}catch(_){return false;}
}
