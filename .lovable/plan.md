

# Plan: MVP - Auth + Gestao de Alunos con Supabase

## Resumen

Conectar el modulo de Alunos a datos reales en Supabase, agregar autenticacion (login/registro), y proteger rutas. La base de datos ya tiene las tablas `profiles` y `students` con RLS configurado, y el trigger `on_auth_user_created` ya crea perfiles automaticamente.

---

## 1. Pagina de Login/Registro

**Archivo nuevo:** `src/pages/Auth.tsx`

- Formulario con dos tabs: "Entrar" y "Registrar"
- Login: `supabase.auth.signInWithPassword({ email, password })`
- Registro: `supabase.auth.signUp({ email, password, options: { data: { name } } })`
- Loading states en botones, mensajes de error con toast
- Redirige a `/` al autenticar exitosamente

**Ruta nueva en** `src/App.tsx`:
- Agregar `<Route path="/login" element={<Auth />} />`

---

## 2. Contexto de Autenticacion

**Archivo nuevo:** `src/hooks/useAuth.tsx`

- Hook/context que usa `supabase.auth.onAuthStateChange` + `getSession`
- Expone: `user`, `session`, `loading`, `signOut`
- Maneja estado de carga inicial

**Archivo nuevo:** `src/components/ProtectedRoute.tsx`

- Wrapper que verifica sesion activa
- Si no hay sesion, redirige a `/login`
- Muestra loading spinner mientras verifica

**Actualizar** `src/App.tsx`:
- Envolver la ruta `/` con `ProtectedRoute`

---

## 3. Modulo StudentsModule - CRUD Real

**Reescribir** `src/modules/StudentsModule.tsx`:

- Eliminar todo mock data
- Usar `@tanstack/react-query` para fetch:
  - `useQuery` para listar students (`select * from students order by created_at desc`)
  - Los contadores (Total, Ativos, Novos no mes, Pendentes) se calculan desde los datos reales
- Filtros de busqueda por nombre/email aplican client-side sobre los datos cargados

**Acciones CRUD con `useMutation`:**
- **Crear:** `supabase.from('students').insert({ trainer_id: user.id, name, email, status, plan, modality, due_date })`
- **Editar:** `supabase.from('students').update({...}).eq('id', studentId)`
- **Eliminar:** `supabase.from('students').delete().eq('id', studentId)`
- Cada mutacion invalida la query para refrescar la lista

**Componente nuevo:** `src/components/StudentFormDialog.tsx`
- Dialog/modal reutilizable para crear y editar alunos
- Campos: nome (requerido), email (opcional, validacion formato), status, plan, modalidade, data de vencimento
- Loading state en boton de submit

**Componente nuevo:** `src/components/DeleteStudentDialog.tsx`
- AlertDialog de confirmacion antes de eliminar
- Loading state durante la operacion

---

## 4. UX y Estados

- Skeleton/loading en la tabla mientras carga
- Toast de exito al crear/editar/eliminar
- Toast de error si falla alguna operacion
- Validacion: nombre obligatorio, email con formato valido si se ingresa
- Estado vacio cuando no hay alunos (invitando a crear el primero)

---

## Seccion Tecnica

### Base de Datos (sin cambios necesarios)
- Tabla `students` ya existe con columnas: id, trainer_id, name, email, status, plan, modality, due_date, created_at
- RLS ya configurado: cada trainer solo ve/edita/elimina sus propios alunos
- Tabla `profiles` con trigger `on_auth_user_created` ya activo
- No se necesitan migraciones SQL

### Archivos a crear:
1. `src/pages/Auth.tsx` - Pagina login/registro
2. `src/hooks/useAuth.tsx` - Hook de autenticacion
3. `src/components/ProtectedRoute.tsx` - Proteccion de rutas
4. `src/components/StudentFormDialog.tsx` - Modal crear/editar
5. `src/components/DeleteStudentDialog.tsx` - Confirmacion eliminar

### Archivos a modificar:
1. `src/App.tsx` - Agregar ruta /login y ProtectedRoute
2. `src/modules/StudentsModule.tsx` - Reescribir con CRUD real

### Flujo de datos:
- Login -> session almacenada en localStorage -> ProtectedRoute verifica -> StudentsModule consulta con RLS automatico (trainer_id = auth.uid())
- Todas las queries pasan por RLS, no se necesita filtrar manualmente por trainer_id en el SELECT

