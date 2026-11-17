import {useState,useEffect} from 'react';import {sb} from './supabase.js';
const T={projects:['Proyectos',[['title','Título'],['category','Categoría'],['year','Año','number'],['description','Descripción','area'],['credits','Ficha técnica'],['image_url','Portada','file'],['video_url','Video / tráiler','file']]],
services:['Servicios',[['title','Título'],['description','Descripción','area']]],
team:['Equipo',[['name','Nombre'],['role','Puesto'],['bio','Bio','area'],['photo_url','Foto','file']]]};
const KEYS=[['brand','Nombre de la marca'],['hero_title','Título principal'],['hero_tagline','Frase'],['hero_video','Video del hero','file'],['hero_image','Imagen del hero','file'],['about_text','Sobre nosotros','area'],['email','Correo'],['whatsapp','WhatsApp (con código país)'],['instagram','URL de Instagram']];
function Field({f,v,set}){const [k,l,t]=f,[b,setB]=useState(false);
const up=async e=>{const file=e.target.files[0];if(!file)return;setB(true);const n=Date.now()+'-'+file.name.replace(/[^\w.]/g,'_');
const {error}=await sb.storage.from('media').upload(n,file);setB(false);if(error)return alert(error.message);set(k,sb.storage.from('media').getPublicUrl(n).data.publicUrl)};
return <label>{l}{t==='area'?<textarea rows="4" value={v||''} onChange={e=>set(k,e.target.value)}/>:<input type={t==='number'?'number':'text'} value={v||''} onChange={e=>set(k,e.target.value)}/>}
{t==='file'&&<input type="file" accept="image/*,video/*" onChange={up}/>}{b&&' Subiendo…'}</label>}
function Crud({t}){const [title,fields]=T[t],[rows,setR]=useState([]),[f,setF]=useState({});
const load=async()=>{const {data}=await sb.from(t).select('*').order('created_at',{ascending:false,nullsFirst:false});setR(data||[])};useEffect(()=>{setF({});load()},[t]);
const save=async e=>{e.preventDefault();const {id,created_at,...rest}=f;const q=id?sb.from(t).update(rest).eq('id',id):sb.from(t).insert(rest);const {error}=await q;if(error)alert(error.message);else{setF({});load()}};
const del=async id=>{if(confirm('¿Eliminar?')){await sb.from(t).delete().eq('id',id);load()}};
return <div><h2>{title}</h2><form onSubmit={save}>{fields.map(x=><Field key={x[0]} f={x} v={f[x[0]]} set={(k,v)=>setF(o=>({...o,[k]:v}))}/>)}<button className="btn">{f.id?'Actualizar':'Crear'}</button></form>
{rows.map(r=><div className="item" key={r.id}><span>{r.title||r.name}</span><span><button className="btn" onClick={()=>{setF(r);scrollTo(0,0)}}>Editar</button> <button className="btn" onClick={()=>del(r.id)}>Eliminar</button></span></div>)}</div>}
function Settings(){const [v,setV]=useState({});useEffect(()=>{sb.from('settings').select('*').then(({data})=>setV(Object.fromEntries((data||[]).map(r=>[r.key,r.value]))))},[]);
const save=async e=>{e.preventDefault();const {error}=await sb.from('settings').upsert(KEYS.map(([k])=>({key:k,value:v[k]||''})));alert(error?error.message:'Guardado')};
return <form onSubmit={save}><h2>Textos y contacto</h2>{KEYS.map(x=><Field key={x[0]} f={x} v={v[x[0]]} set={(k,val)=>setV(o=>({...o,[k]:val}))}/>)}<button className="btn">Guardar</button></form>}
function Msgs(){const [r,setR]=useState([]);useEffect(()=>{sb.from('messages').select('*').order('created_at',{ascending:false}).then(({data})=>setR(data||[]))},[]);
return <div><h2>Mensajes</h2>{r.map(m=><div className="item" key={m.id} style={{display:'block'}}><b>{m.name}</b> · <a href={'mailto:'+m.email}>{m.email}</a> · {m.company} · {m.project_type} · {m.budget}<p>{m.message}</p><small className="s">{new Date(m.created_at).toLocaleString()}</small></div>)}</div>}
export default function Admin(){const [u,setU]=useState(null),[tab,setTab]=useState('projects'),[err,setErr]=useState('');
useEffect(()=>{if(!sb)return;sb.auth.getSession().then(({data})=>setU(data.session?.user||null));const {data:l}=sb.auth.onAuthStateChange((_,s)=>setU(s?.user||null));return()=>l.subscription.unsubscribe()},[]);
if(!sb)return <div className="adm"><p className="err">Faltan las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.</p></div>;
if(!u)return <div className="adm"><h2>Administración</h2><form onSubmit={async e=>{e.preventDefault();const f=new FormData(e.target);const {error}=await sb.auth.signInWithPassword({email:f.get('e'),password:f.get('p')});setErr(error?error.message:'')}}>
<input name="e" type="email" placeholder="Correo" required/><input name="p" type="password" placeholder="Contraseña" required/><button className="btn">Entrar</button>{err&&<p className="err">{err}</p>}</form><a href="#/">← Volver</a></div>;
return <div className="adm"><div className="row">{[...Object.keys(T),'settings','messages'].map(k=><button key={k} className={'btn '+(k===tab?'on':'')} onClick={()=>setTab(k)} style={k===tab?{background:'#f2ede4',color:'#000'}:{}}>{T[k]?.[0]||(k==='settings'?'Textos':'Mensajes')}</button>)}
<button className="btn" onClick={()=>sb.auth.signOut()}>Salir</button><a className="btn" href="#/">Ver web</a></div>
{T[tab]?<Crud t={tab}/>:tab==='settings'?<Settings/>:<Msgs/>}</div>}
