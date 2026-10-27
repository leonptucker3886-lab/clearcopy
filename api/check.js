// ClearCopy v0.1 - serverless page checker
const COMMON={teh:"the",recieve:"receive",seperate:"separate",definately:"definitely",occured:"occurred",untill:"until",wich:"which",accomodate:"accommodate",alot:"a lot",thier:"their",becuase:"because",enviroment:"environment",neccessary:"necessary",begining:"beginning",independant:"independent",noticable:"noticeable",succesful:"successful",tommorow:"tomorrow",writting:"writing"};
const strip=h=>h.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
function syl(w){w=w.toLowerCase().replace(/[^a-z]/g,"");if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,"").replace(/^y/,"");const m=w.match(/[aeiouy]{1,2}/g);return m?m.length:1;}
function analyze(html,url){
 const issues=[];const add=(sev,type,msg,fix)=>issues.push({sev,type,msg,fix});
 const title=((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||"").trim();
 const dm=html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)||html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
 const h1=(html.match(/<h1[\s>]/gi)||[]).length;
 if(!title)add("high","seo","Missing <title>","Add a 30-60 character title.");else if(title.length>60)add("low","seo",`Title is ${title.length} chars`,"Shorten to 60.");
 if(!dm)add("med","seo","Missing meta description","Add 70-160 characters.");else if(dm[1].length>160)add("low","seo",`Meta description is ${dm[1].length} chars`,"Trim to 160.");
 if(!h1)add("med","structure","No H1","Add one H1.");else if(h1>1)add("low","structure",`${h1} H1 headings`,"Use exactly one H1.");
 const text=strip(html);const words=text.match(/[A-Za-z']+/g)||[];const lw=words.map(w=>w.toLowerCase());
 for(const[b,g]of Object.entries(COMMON)){const n=lw.filter(w=>w===b).length;if(n)add("med","spelling",`"${b}" x${n}`,`Change to "${g}".`);}
 const d=[...new Set((text.match(/\b([a-z]+)\s+\1\b/gi)||[]).map(x=>x.toLowerCase()))].filter(x=>!/^(that that|had had)$/.test(x));
 d.slice(0,10).forEach(x=>add("med","grammar",`Repeated word: "${x}"`,"Remove the duplicate."));
 if(/\w\s+[,;!?](\s|$)/.test(text))add("low","punctuation","Space before punctuation","Remove the space.");
 const ai=html.search(/href=["'][^"']*(amzn\.to|amazon\.[a-z.]+\/)/i);
 if(ai>=0){const re=/(affiliate|amazon associate|may earn|commission)/i;
  if(!re.test(text))add("high","disclosure","Amazon links but no affiliate disclosure","Add a disclosure before the first affiliate link.");
  else if(!re.test(strip(html.slice(0,ai))))add("high","disclosure","Disclosure appears after the first Amazon link","Move it above the first affiliate link.");}
 const sents=text.split(/[.!?]+\s/).filter(s=>s.split(" ").length>2);
 const sy=words.reduce((a,w)=>a+syl(w),0);
 const g=words.length&&sents.length?+(0.39*(words.length/sents.length)+11.8*(sy/words.length)-15.59).toFixed(1):null;
 const ls=sents.filter(s=>s.split(" ").length>35).length;
 if(ls)add("low","readability",`${ls} sentence(s) over 35 words`,"Split them.");
 if(g!==null&&g>12)add("low","readability",`Reading grade ${g}`,"Aim for 9 or below.");
 const pen={high:15,med:6,low:2};
 return{url,title,wordCount:words.length,readingGrade:g,score:Math.max(0,100-issues.reduce((a,i)=>a+pen[i.sev],0)),issues};
}
const UA={headers:{"user-agent":"ClearCopyBot/0.1"},redirect:"follow"};
module.exports=async(req,res)=>{try{const q=req.query||{};let urls=q.url?[q.url]:[];
 if(q.sitemap){const x=await(await fetch(q.sitemap,UA)).text();urls=[...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m=>m[1]).slice(0,Math.min(+q.limit||20,40));}
 if(!urls.length)return res.status(400).json({error:"Pass ?url= or ?sitemap="});
 const results=await Promise.all(urls.map(async u=>{try{if(!/^https?:\/\//.test(u))throw new Error("bad url");const r=await fetch(u,UA);if(!r.ok)return{url:u,error:"HTTP "+r.status};return analyze(await r.text(),u);}catch(e){return{url:u,error:String(e.message||e)};}}));
 res.setHeader("cache-control","no-store");res.json({checked:results.length,results});}catch(e){res.status(500).json({error:String(e.message||e)});}};
module.exports.analyze=analyze;
