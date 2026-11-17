import {useState,useEffect,useRef} from 'react';import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';import {sb} from './supabase.js';
gsap.registerPlugin(ScrollTrigger);
const DEMO={projects:[{id:'d1',title:'Proyecto de ejemplo 1',category:'Cortometraje',year:2025,description:'Ejemplo demostrativo (ficticio). Reemplazalo desde el panel.',image_url:'',video_url:'',credits:'Dirección: —'},
{id:'d2',title:'Proyecto de ejemplo 2',category:'Comercial',year:2025,description:'Ejemplo demostrativo (ficticio).',image_url:'',video_url:'',credits:''},
{id:'d3',title:'Proyecto de ejemplo 3',category:'Videoclip',year:2024,description:'Ejemplo demostrativo (ficticio).',image_url:'',video_url:'',credits:''}],
services:[{id:'s1',title:'Producción cinematográfica',description:'Ejemplo: de la idea a la pantalla.'},{id:'s2',title:'Postproducción y color',description:'Ejemplo: edición, VFX, sonido y color grading.'},{id:'s3',title:'Publicidad y marcas',description:'Ejemplo: comerciales y contenido para redes.'}],team:[],settings:{}};
const STEPS=['Concepto y desarrollo','Preproducción','Planificación y guion','Rodaje y producción','Edición y postproducción','Entrega final'];
const reduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
export default function App(){
const [d,setD]=useState(DEMO),[pre,setPre]=useState(true),[cat,setCat]=useState('Todos'),[open,setOpen]=useState(null),[st,setSt]=useState(''),root=useRef();
useEffect(()=>{(async()=>{if(!sb)return;try{const [p,s,t,c]=await Promise.all(['projects','services','team','settings'].map(x=>sb.from(x).select('*')));
setD({projects:p.data?.length?p.data:DEMO.projects,services:s.data?.length?s.data:DEMO.services,team:t.data||[],settings:Object.fromEntries((c.data||[]).map(r=>[r.key,r.value]))})}catch(e){console.error(e)}})();
const t=setTimeout(()=>setPre(false),reduce()?100:1400);return()=>clearTimeout(t)},[]);
useEffect(()=>{if(pre||reduce())return;const ctx=gsap.context(()=>{
gsap.from('.hero h1,.hero p,.hero .btn',{y:60,opacity:0,duration:1.1,stagger:.15,ease:'power3.out'});
gsap.utils.toArray('.rv').forEach(e=>gsap.from(e,{y:50,opacity:0,duration:.9,ease:'power2.out',scrollTrigger:{trigger:e,start:'top 88%'}}));
gsap.to('.hero .bg,.hero video',{yPercent:15,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}})},root.current);return()=>ctx.revert()},[pre,d,cat]);
const S=d.settings,cats=['Todos',...new Set(d.projects.map(p=>p.category).filter(Boolean))],list=d.projects.filter(p=>cat==='Todos'||p.category===cat);
const send=async e=>{e.preventDefault();if(!sb){setSt('error:El envío no está configurado (faltan variables de Supabase).');return}
const f=Object.fromEntries(new FormData(e.target));if(f.web)return;delete f.web;setSt('Enviando…');
const {error}=await sb.from('messages').insert(f);if(error)setSt('error:No se pudo enviar. Probá de nuevo.');else{setSt('ok:¡Gracias! Recibimos tu propuesta.');e.target.reset()}};
return <div ref={root}>
{pre&&<div className="pre" role="status">{S.brand||'PRODUCTORA'}</div>}
<nav><b>{S.brand||'PRODUCTORA'}</b><div><a href="#obra">Obra</a><a href="#servicios">Servicios</a><a href="#equipo">Equipo</a><a href="#contacto">Contacto</a></div></nav>
<header className="hero" style={{paddingBottom:'6rem'}}>
{S.hero_video?<video src={S.hero_video} poster={S.hero_image} autoPlay muted loop playsInline preload="metadata"/>:<div className="bg" style={S.hero_image?{background:`url(${S.hero_image}) center/cover`}:{}}/>}
<h1>{S.hero_title||'Historias que se ven y se sienten'}</h1><p>{S.hero_tagline||'Productora cinematográfica y audiovisual.'}</p>
<div><a className="btn" href="#obra">Ver proyectos</a><a className="btn" href="#contacto">Contacto</a></div><span className="scroll">SCROLL</span></header>
<section id="nosotros"><h2 className="rv">Sobre nosotros</h2><p className="rv" style={{maxWidth:'46rem',fontSize:'1.2rem'}}>{S.about_text||'Texto de presentación editable desde el panel de administración.'}</p></section>
<section id="servicios"><h2 className="rv">Servicios</h2><div className="grid">{d.services.map(s=><article className="card rv" key={s.id}><h3>{s.title}</h3><p className="s">{s.description}</p></article>)}</div></section>
<section id="obra"><h2 className="rv">Obra</h2><div className="filters">{cats.map(c=><button key={c} className={'btn '+(c===cat?'on':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
<div className="grid">{list.map(p=><button className="proj rv" key={p.id} onClick={()=>setOpen(p)}>{p.image_url&&<img src={p.image_url} alt={p.title} loading="lazy"/>}<span><small className="tag">{p.category} · {p.year}</small><h3>{p.title}</h3></span></button>)}</div></section>
<section id="proceso"><h2 className="rv">Proceso creativo</h2>{STEPS.map((s,i)=><div className="step rv" key={s}><b>0{i+1}</b><h3>{s}</h3></div>)}</section>
{d.team.length>0&&<section id="equipo"><h2 className="rv">Equipo</h2><div className="grid team">{d.team.map(m=><article className="rv" key={m.id}>{m.photo_url&&<img src={m.photo_url} alt={m.name} loading="lazy"/>}<h3>{m.name}</h3><p className="a">{m.role}</p><p className="s">{m.bio}</p></article>)}</div></section>}
<section id="contacto"><h2 className="rv">Contacto</h2>
<form onSubmit={send}><input name="web" tabIndex="-1" autoComplete="off" style={{display:'none'}}/>
<input name="name" placeholder="Nombre" required maxLength="120" aria-label="Nombre"/><input name="email" type="email" placeholder="Correo electrónico" required maxLength="160" aria-label="Correo"/>
<input name="company" placeholder="Empresa" maxLength="120" aria-label="Empresa"/>
<select name="project_type" aria-label="Tipo de proyecto">{['Cortometraje','Largometraje','Comercial','Videoclip','Documental','Animación / VFX','Otro'].map(o=><option key={o}>{o}</option>)}</select>
<input name="budget" placeholder="Presupuesto estimado" maxLength="60" aria-label="Presupuesto"/><textarea name="message" rows="5" placeholder="Contanos tu proyecto" required minLength="5" maxLength="4000" aria-label="Mensaje"/>
<button className="btn">Enviar propuesta</button>{st&&<p className={st.startsWith('error')?'err':'ok'} role="alert">{st.replace(/^(error|ok):/,'')}</p>}</form>
<p className="s" style={{marginTop:'2rem'}}>{S.email&&<a href={'mailto:'+S.email}>{S.email}</a>} {S.whatsapp&&<> · <a href={'https://wa.me/'+S.whatsapp.replace(/\D/g,'')}>WhatsApp</a></>} {S.instagram&&<> · <a href={S.instagram}>Instagram</a></>}</p></section>
<footer><span>© {new Date().getFullYear()} {S.brand||'Productora'}</span><a href="#/admin">Admin</a></footer>
{open&&<div className="modal" role="dialog" aria-modal="true"><div><button className="btn" onClick={()=>setOpen(null)}>Cerrar</button><h2 style={{marginTop:'1rem'}}>{open.title}</h2><small className="tag">{open.category} · {open.year}</small>
{open.video_url?<video src={open.video_url} poster={open.image_url} controls playsInline/>:open.image_url&&<img src={open.image_url} alt={open.title}/>}<p>{open.description}</p>{open.credits&&<p className="s">Ficha técnica: {open.credits}</p>}</div></div>}
</div>}
