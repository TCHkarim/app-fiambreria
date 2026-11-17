# Plataforma web para productora cinematográfica
React + Vite + GSAP, backend en **Supabase** (base de datos, login, almacenamiento). Todo corre en planes gratuitos.

## 1. Supabase (gratis)
1. Creá un proyecto en supabase.com.
2. SQL Editor → pegá y ejecutá `supabase.sql`.
3. Authentication → Users → *Add user* (tu correo y contraseña de admin). Luego en Authentication → Providers → Email, desactivá **"Allow new users to sign up"** (importante: así solo vos podés entrar).
4. Project Settings → API: copiá la *Project URL* y la clave *anon public*.

## 2. Probar local
```
npm install
cp .env.example .env   # completá las 2 variables
npm run dev
```
Panel admin: `/#/admin`.

## 3. Publicar gratis (Netlify, Vercel o Cloudflare Pages)
Subí la carpeta a un repositorio de GitHub, conectalo al hosting y configurá:
- Build command: `npm run build`  ·  Output: `dist`
- Variables de entorno: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

(Usa rutas con `#`, así no necesita reglas especiales de redirección.)
Los videos pesados: el plan gratis de Supabase limita archivos a 50 MB; comprimilos (H.264, 1080p) o pegá enlaces.
