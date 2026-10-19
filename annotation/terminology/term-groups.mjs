// Display grouping only. Every candidate keeps its own ID and two ratings.
export function levenshtein(left,right){
  const a=Array.from(left.normalize('NFC')),b=Array.from(right.normalize('NFC'));
  let previous=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=0;i<a.length;i++){
    const row=[i+1];
    for(let j=0;j<b.length;j++)row.push(Math.min(row[j]+1,previous[j+1]+1,previous[j]+(a[i]===b[j]?0:1)));
    previous=row;
  }
  return previous[b.length];
}
export function similarity(a,b){
  const length=Math.max(Array.from(a.normalize('NFC')).length,Array.from(b.normalize('NFC')).length);
  return length?1-levenshtein(a,b)/length:1;
}
const compare=(a,b)=>a<b?-1:a>b?1:0;
export function groupOptions(options,order,threshold=.8){
  const byId=new Map(options.map(o=>[o.id,o]));
  if(order.length!==options.length||new Set(order).size!==order.length||order.some(id=>!byId.has(id)))throw Error('Candidate order is incomplete.');
  let groups=options.map(o=>[o.id]).sort((a,b)=>compare(byId.get(a[0]).devanagari,byId.get(b[0]).devanagari)||compare(a[0],b[0]));
  const score=new Map();
  const pairScore=(a,b)=>{
    const key=[a,b].sort().join(':');
    if(!score.has(key))score.set(key,similarity(byId.get(a).devanagari,byId.get(b).devanagari));
    return score.get(key);
  };
  while(true){
    let best=null;
    for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){
      const value=Math.min(...groups[i].flatMap(a=>groups[j].map(b=>pairScore(a,b))));
      if(value+Number.EPSILON<threshold)continue;
      const tie=groups[i].concat(groups[j]).map(id=>byId.get(id).devanagari+':'+id).sort().join('\0');
      if(!best||value>best.value||value===best.value&&tie<best.tie)best={i,j,value,tie};
    }
    if(!best)break;
    const merged=groups[best.i].concat(groups[best.j]);
    groups=groups.filter((_,index)=>index!==best.i&&index!==best.j);groups.push(merged);
  }
  const positions=new Map(order.map((id,index)=>[id,index]));
  groups.sort((a,b)=>Math.min(...a.map(id=>positions.get(id)))-Math.min(...b.map(id=>positions.get(id))));
  return groups.map(group=>group.sort((a,b)=>compare(byId.get(a).devanagari,byId.get(b).devanagari)||compare(a,b)));
}

export function copyUnanswered(answers,from,to){
  const next=JSON.parse(JSON.stringify(answers)),copied=[];
  for(const criterion of ['accuracy','understandability']){
    if(!next[to]?.[criterion]&&next[from]?.[criterion]){
      next[to]||={};next[to][criterion]=next[from][criterion];copied.push(criterion);
    }
  }
  return {answers:next,copied};
}
