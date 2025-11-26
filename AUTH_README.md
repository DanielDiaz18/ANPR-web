# Sistema de Autenticación con JWT

## Descripción

Sistema de autenticación implementado con JWT (JSON Web Tokens) para proteger las rutas del dashboard.

## Características

- ✅ Login con email y contraseña
- ✅ Token JWT almacenado en localStorage
- ✅ Interceptor de Axios para incluir el token en todas las peticiones
- ✅ AuthGuard para proteger rutas
- ✅ Redirección automática a login si no está autenticado
- ✅ Logout con limpieza de token y datos de usuario
- ✅ Validación automática de token al cargar la aplicación
- ✅ Manejo de token expirado (401)

## Estructura de Archivos

```
models/
  auth.model.ts              # Interfaces TypeScript para autenticación

lib/
  auth.service.ts            # Servicio de autenticación (login, logout, token)
  axiosInstance.ts           # Configuración de Axios con interceptores JWT

contexts/
  auth-context.tsx           # Context API para estado de autenticación

components/
  auth-guard.tsx             # Guard para proteger rutas
  dashboard-layout.tsx       # Layout con botón de logout

app/
  login/
    page.tsx                 # Página de login
  layout.tsx                 # Root layout con AuthProvider
  page.tsx                   # Dashboard (protegido)
  cameras/page.tsx           # Rutas protegidas
  clients/page.tsx
  services/page.tsx
  vehicles/page.tsx
```

## API Endpoints Esperados

El sistema espera que el backend tenga los siguientes endpoints:

### POST `/api/v1/auth/login`
```json
// Request
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "admin"
  }
}
```

### GET `/api/v1/auth/verify`
```json
// Headers: Authorization: Bearer <token>
// Response 200: Token válido
// Response 401: Token inválido
```

### GET `/api/v1/auth/me`
```json
// Headers: Authorization: Bearer <token>
// Response
{
  "id": "1",
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario",
  "role": "admin"
}
```

## Uso

### 1. Login

El usuario accede a `/login` y proporciona sus credenciales. El sistema:
- Envía las credenciales al backend
- Recibe el token JWT y datos del usuario
- Almacena el token en localStorage
- Redirige al usuario al dashboard

### 2. Protección de Rutas

Todas las rutas están protegidas con el componente `AuthGuard`:

```tsx
import { AuthGuard } from "@/components/auth-guard";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      {/* Contenido protegido */}
    </AuthGuard>
  );
}
```

### 3. Acceso al Usuario Autenticado

Usa el hook `useAuth()` en cualquier componente:

```tsx
import { useAuth } from "@/contexts/auth-context";

function MiComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <p>Usuario: {user?.name}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### 4. Peticiones Autenticadas

Todas las peticiones a través de `axiosInstance` incluyen automáticamente el token JWT:

```tsx
import axiosInstance from "@/lib/axiosInstance";

// El token se incluye automáticamente en el header Authorization
const response = await axiosInstance.get('/clients');
```

## Flujo de Autenticación

1. **Usuario no autenticado** → Redirigido a `/login`
2. **Login exitoso** → Token guardado → Redirigido al dashboard
3. **Usuario autenticado** → Acceso permitido a rutas protegidas
4. **Token expirado (401)** → Limpieza automática → Redirigido a `/login`
5. **Logout** → Token eliminado → Redirigido a `/login`

## Seguridad

- El token JWT se almacena en `localStorage` con la clave `auth_token`
- El interceptor de Axios incluye el token en todas las peticiones: `Authorization: Bearer <token>`
- Cuando se recibe un error 401, el sistema limpia automáticamente el token y redirige al login
- La validación del token se realiza al cargar la aplicación

## Configuración

Puedes modificar la URL base del backend en `/lib/axiosInstance.ts`:

```typescript
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Cambiar según tu backend
  // ...
});
```

## Notas Importantes

1. **SSR/SSG**: El código usa `'use client'` donde es necesario para evitar problemas con localStorage en el servidor
2. **Validación de Token**: El sistema valida el token al iniciar, verificando su expiración y validez con el backend
3. **Return URL**: El login soporta parámetros `returnUrl` para redirigir al usuario a la página que intentaba acceder
