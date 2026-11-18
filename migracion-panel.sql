-- Ejecutar UNA vez en Supabase > SQL Editor (con el traductor del navegador desactivado)
alter table projects add column if not exists client text, add column if not exists status text default 'Desarrollo', add column if not exists budget numeric;
alter table messages add column if not exists status text default 'Nuevo';
