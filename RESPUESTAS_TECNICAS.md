# 🎯 Respuestas Técnicas - Preguntas Frecuentes

Este documento contiene respuestas profesionales para preguntas técnicas comunes sobre el proyecto Finance Tracker.

---

## 📐 ARQUITECTURA Y DECISIONES TÉCNICAS

### ¿Por qué elegiste Next.js 16 con App Router?

**Respuesta:**
"Elegí Next.js 16 con App Router por varias razones estratégicas:

1. **Server-Side Rendering (SSR)**: Mejora el SEO y el rendimiento de carga inicial, importante para una aplicación financiera donde la confianza es clave.

2. **File-based Routing**: El sistema de rutas basado en archivos hace que la estructura del proyecto sea intuitiva y fácil de mantener.

3. **Optimizaciones Automáticas**: Next.js maneja automáticamente code splitting, optimización de imágenes y lazy loading, lo que mejora el rendimiento sin esfuerzo adicional.

4. **TypeScript Nativo**: Excelente soporte para TypeScript out-of-the-box, lo que me permitió mantener type safety en todo el proyecto.

5. **API Routes**: Aunque en este proyecto usé mocks, la estructura permite integrar fácilmente un backend real usando API routes de Next.js.

**Trade-offs considerados:**
- El App Router tiene una curva de aprendizaje, pero los beneficios de SSR y mejor rendimiento justifican la inversión.
- Algunas limitaciones con React Server Components en aplicaciones client-heavy, pero para este proyecto el balance fue positivo."

---

### ¿Cómo estructuraste el proyecto? ¿Por qué esta organización?

**Respuesta:**
"Implementé una arquitectura modular basada en features y responsabilidades:

```
src/
├── app/              # Next.js App Router (páginas y rutas)
├── components/       # Componentes reutilizables organizados por dominio
├── store/            # Estado global (Zustand stores)
├── hooks/            # Custom hooks para lógica reutilizable
├── utils/            # Funciones puras y helpers
├── types/            # Definiciones TypeScript compartidas
├── i18n/             # Configuración de internacionalización
└── theme/            # Configuración de temas MUI
```

**Razones:**
- **Separación de responsabilidades**: Cada carpeta tiene un propósito claro
- **Escalabilidad**: Fácil agregar nuevas features sin afectar código existente
- **Mantenibilidad**: Código organizado facilita el debugging y refactoring
- **Testabilidad**: Estructura clara facilita escribir tests unitarios
- **Colaboración**: Otros desarrolladores pueden navegar el código fácilmente"

---

## 🗄️ STATE MANAGEMENT

### ¿Por qué elegiste Zustand sobre Redux o Context API?

**Respuesta:**
"Elegí Zustand después de evaluar las opciones disponibles:

**Ventajas de Zustand:**
1. **Simplicidad**: Menos boilerplate que Redux, código más limpio y fácil de leer
2. **TypeScript**: Excelente inferencia de tipos sin configuración adicional
3. **Persistence**: Middleware integrado para localStorage, perfecto para este proyecto
4. **Performance**: Ligero y rápido, sin overhead innecesario
5. **Developer Experience**: API intuitiva, fácil de aprender y usar

**Comparación con alternativas:**
- **vs Redux**: Redux requiere más configuración (actions, reducers, middleware). Zustand es más directo para proyectos de este tamaño.
- **vs Context API**: Context API puede causar re-renders innecesarios. Zustand permite suscripciones selectivas, mejorando performance.

**Implementación:**
- Separé el estado en dos stores: `authStore` (autenticación) y `financeStore` (datos financieros)
- Usé el middleware `persist` para guardar datos en localStorage
- Implementé computed values como métodos del store para estado derivado

**Cuándo usar cada uno:**
- Zustand: Proyectos medianos/grandes, estado global complejo
- Context API: Estado simple, pocos componentes
- Redux: Proyectos muy grandes, equipos grandes, necesidad de DevTools avanzados"

---

### ¿Cómo manejas la persistencia de datos?

**Respuesta:**
"Implementé persistencia usando el middleware `persist` de Zustand:

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... estado y acciones
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
```

**Estrategia:**
1. **Selective Persistence**: Solo persisto datos necesarios (no funciones ni datos temporales)
2. **Separación por Store**: Cada store tiene su propia key en localStorage
3. **Serialización Automática**: Zustand maneja JSON.stringify/parse automáticamente

**Consideraciones:**
- **Limitaciones**: localStorage tiene ~5-10MB, suficiente para este demo
- **Producción**: En producción usaría un backend con base de datos
- **Sincronización**: Actualmente es browser-specific, en producción implementaría sync multi-dispositivo

**Migración a Backend:**
La estructura actual permite migrar fácilmente: solo reemplazar las acciones del store con llamadas API, manteniendo la misma interfaz."

---

## ⚛️ REACT Y HOOKS

### ¿Cómo manejas los re-renders y optimizas el rendimiento?

**Respuesta:**
"Implementé varias estrategias de optimización:

**1. Zustand Selectors:**
```typescript
// ❌ Mal: causa re-render en cualquier cambio del store
const user = useAuthStore(state => state.user);

// ✅ Bien: solo re-render cuando user cambia
const user = useAuthStore(state => state.user);
```

**2. React.memo para componentes pesados:**
- Componentes de listas grandes (transacciones, presupuestos)
- Componentes con props que no cambian frecuentemente

**3. useMemo y useCallback:**
- Para cálculos costosos (reportes, agregaciones)
- Para callbacks que se pasan como props a componentes memoizados

**4. Code Splitting:**
- Next.js hace code splitting automático por ruta
- Lazy loading de componentes pesados (gráficos, modales)

**5. Virtualización (futuro):**
- Para listas muy largas, implementaría react-window o react-virtualized

**Métricas que monitorearía:**
- React DevTools Profiler para identificar componentes lentos
- Lighthouse para métricas de rendimiento
- Bundle size analysis para optimizar imports"

---

### ¿Cómo manejas la autenticación y rutas protegidas?

**Respuesta:**
"Implementé un sistema de autenticación con rutas protegidas:

**1. Componente ProtectedRoute:**
```typescript
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
```

**2. Flujo de Autenticación:**
- Login valida credenciales contra store mock
- Estado de autenticación persiste en localStorage
- Rutas protegidas verifican `isAuthenticated` antes de renderizar
- Logout limpia estado y redirige a login

**3. Seguridad:**
- Validación client-side (UX)
- En producción: validación server-side obligatoria
- Tokens JWT para sesiones seguras
- Refresh tokens para renovación automática

**4. Mejoras Futuras:**
- 2FA (autenticación de dos factores)
- OAuth (Google, Apple, Facebook)
- Session management (historial de sesiones activas)"

---

## 🧪 TESTING

### ¿Qué estrategia de testing implementaste?

**Respuesta:**
"Implementé una estrategia de testing en capas:

**1. Tests Unitarios (Vitest + React Testing Library):**
- **Stores**: Lógica de negocio, autenticación, cálculos financieros
- **Utilidades**: Funciones puras (formateo, validaciones)
- **Hooks**: Custom hooks (keyboard shortcuts)
- **Componentes**: Componentes críticos (Login, ProtectedRoute)

**2. Filosofía:**
- **Testing Library**: Tests centrados en comportamiento del usuario, no en implementación
- **Aislamiento**: Cada test es independiente, con setup/teardown
- **Mocks**: Dependencias externas (Next.js router, i18next)

**3. Cobertura:**
- Funcionalidades críticas: autenticación, validaciones, cálculos
- Casos de éxito y error
- Edge cases (valores límite, datos inválidos)

**4. Herramientas:**
- **Vitest**: Framework rápido, compatible con Vite
- **React Testing Library**: Enfoque en UX, no en detalles de implementación
- **@testing-library/user-event**: Simulación realista de interacciones

**5. Próximos Pasos:**
- Tests de integración para flujos completos
- Tests E2E con Playwright o Cypress
- Aumentar cobertura en componentes complejos"

---

### ¿Cómo pruebas componentes que dependen de Zustand?

**Respuesta:**
"Para testear componentes con Zustand, uso un patrón de test utilities:

**1. Test Utilities:**
```typescript
// test/testUtils.tsx
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider theme={lightTheme}>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </ThemeProvider>
  );
}
```

**2. Reset del Store:**
```typescript
beforeEach(() => {
  const store = useAuthStore.getState();
  store.logout(); // Reset antes de cada test
  localStorage.clear();
});
```

**3. Testing de Stores Directamente:**
```typescript
it('should login successfully', async () => {
  const result = await useAuthStore.getState().login('email', 'password');
  expect(result.success).toBe(true);
  expect(useAuthStore.getState().isAuthenticated).toBe(true);
});
```

**4. Testing de Componentes:**
- Los componentes usan hooks de Zustand normalmente
- El store se resetea entre tests para evitar side effects
- Verifico el comportamiento, no el estado interno"

---

## 🌐 INTERNACIONALIZACIÓN

### ¿Cómo implementaste el sistema multi-idioma?

**Respuesta:**
"Implementé i18next con react-i18next:

**1. Configuración:**
```typescript
// i18n/config.ts
i18n
  .use(LanguageDetector)
  .init({
    resources: { en, es, fr, zh },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
```

**2. Estructura de Traducciones:**
- Archivos JSON organizados por namespace
- Estructura jerárquica (common, dashboard, transactions, etc.)
- 4 idiomas: Inglés, Español, Francés, Chino

**3. Uso en Componentes:**
```typescript
const { t } = useTranslation();
<Typography>{t('dashboard.title')}</Typography>
```

**4. Detección Automática:**
- Detecta idioma del navegador
- Permite cambio manual desde UI
- Persiste preferencia en localStorage

**5. Mejoras:**
- Formateo de fechas y números según región
- RTL support para idiomas que lo requieren
- Lazy loading de traducciones para mejor performance"

---

## 🎨 UI/UX Y MATERIAL-UI

### ¿Por qué Material-UI? ¿Cómo lo personalizaste?

**Respuesta:**
"Elegí Material-UI (MUI) v7 por:

**Ventajas:**
1. **Accesibilidad**: Componentes con ARIA labels y navegación por teclado
2. **Theming**: Sistema de temas poderoso para dark/light mode
3. **Componentes**: Biblioteca completa y bien documentada
4. **Customización**: Flexible con `sx` prop y theme overrides
5. **Comunidad**: Gran ecosistema y soporte

**Personalización:**
```typescript
// theme/theme.ts
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c3aed' }, // Violet
    secondary: { main: '#f59e0b' }, // Amber
  },
  typography: {
    fontFamily: 'var(--font-inter)',
    // Custom typography config
  },
});
```

**Características:**
- Tema claro/oscuro con toggle
- Tipografía personalizada (Inter + JetBrains Mono)
- Paleta de colores custom (violet/amber)
- Componentes override para consistencia

**Responsive Design:**
- Breakpoints de MUI para mobile/tablet/desktop
- Componentes adaptativos (Drawer en mobile, Sidebar en desktop)
- Grid system para layouts flexibles"

---

## 🔒 SEGURIDAD

### ¿Qué medidas de seguridad implementaste?

**Respuesta:**
"Implementé varias capas de seguridad:

**1. Client-Side:**
- Validación de formularios (prevención de datos inválidos)
- Sanitización de inputs
- Protected routes (prevención de acceso no autorizado)
- XSS protection (React escapa automáticamente)

**2. Autenticación:**
- Validación de credenciales
- Sesiones persistentes seguras
- Logout que limpia estado

**3. En Producción (a implementar):**
- **HTTPS**: Comunicación encriptada
- **JWT Tokens**: Autenticación stateless segura
- **CORS**: Control de acceso cross-origin
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **CSRF Protection**: Tokens CSRF en formularios
- **Input Validation Server-Side**: Validación en backend (nunca confiar solo en client)
- **SQL Injection Prevention**: Prepared statements, ORM
- **XSS Prevention**: Sanitización de inputs, Content Security Policy

**4. Datos Sensibles:**
- No almacenar contraseñas en texto plano (hashing con bcrypt)
- Encriptación de datos financieros sensibles
- Tokens de acceso con expiración"

---

## ⚡ PERFORMANCE Y OPTIMIZACIÓN

### ¿Qué optimizaciones implementaste?

**Respuesta:**
"Implementé múltiples optimizaciones:

**1. Next.js Optimizations:**
- **Code Splitting**: Automático por ruta
- **Image Optimization**: Next.js Image component
- **Static Generation**: Donde es posible
- **Dynamic Imports**: Para componentes pesados

**2. React Optimizations:**
- **Memoization**: useMemo, useCallback donde es necesario
- **React.memo**: Para componentes que no cambian frecuentemente
- **Lazy Loading**: Componentes pesados cargados bajo demanda

**3. State Management:**
- **Selective Subscriptions**: Zustand permite suscribirse solo a slices específicos
- **Computed Values**: Cálculos derivados como métodos del store

**4. Bundle Optimization:**
- **Tree Shaking**: Eliminación de código no usado
- **Dynamic Imports**: Carga bajo demanda de librerías pesadas
- **Font Optimization**: Next.js font optimization para Inter y JetBrains Mono

**5. Runtime Performance:**
- **Debouncing**: En búsquedas y filtros
- **Virtualization**: Para listas largas (futuro)
- **Memoization**: Cálculos costosos cacheados

**6. Métricas:**
- Lighthouse score objetivo: 90+
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 200KB (gzipped)"

---

## 📱 RESPONSIVE DESIGN

### ¿Cómo manejas el diseño responsive?

**Respuesta:**
"Implementé un diseño mobile-first:

**1. Breakpoints de MUI:**
```typescript
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
```

**2. Componentes Adaptativos:**
- **Navbar**: Drawer en mobile, Sidebar en desktop
- **Grid System**: Layouts que se adaptan automáticamente
- **Tables**: Scroll horizontal en mobile, tabla completa en desktop
- **Modals**: Full screen en mobile, centrados en desktop

**3. Hooks de MUI:**
```typescript
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

**4. Estrategia:**
- Mobile-first approach
- Progressive enhancement
- Touch-friendly targets (min 44x44px)
- Gestos táctiles optimizados

**5. Testing:**
- Chrome DevTools device emulation
- Testing en dispositivos reales
- Verificación de diferentes tamaños de pantalla"

---

## 🔄 GESTIÓN DE ERRORES

### ¿Cómo manejas los errores en la aplicación?

**Respuesta:**
"Implementé un sistema de manejo de errores en múltiples capas:

**1. Error Boundaries (futuro):**
```typescript
// Para capturar errores de React
class ErrorBoundary extends React.Component {
  // Captura errores en el árbol de componentes
}
```

**2. Try-Catch en Operaciones Async:**
```typescript
try {
  const result = await store.login(email, password);
  if (!result.success) {
    setError(result.error);
  }
} catch (error) {
  setError('An unexpected error occurred');
}
```

**3. Validación de Formularios:**
- Validación client-side con mensajes claros
- Feedback inmediato al usuario
- Prevención de envío de datos inválidos

**4. User-Friendly Messages:**
- Mensajes de error claros y accionables
- No exponer detalles técnicos al usuario
- Sugerencias de solución cuando es posible

**5. Logging (en producción):**
- Logs estructurados para debugging
- Error tracking (Sentry, LogRocket)
- Monitoring de errores en producción"

---

## 🚀 DEPLOYMENT

### ¿Cómo desplegarías esta aplicación en producción?

**Respuesta:**
"Mi estrategia de deployment incluye:

**1. Plataforma: Vercel (recomendado para Next.js)**
- Deploy automático desde Git
- Optimizaciones de Next.js out-of-the-box
- CDN global para mejor performance
- SSL automático

**2. Proceso:**
```bash
# Build de producción
npm run build

# Verificación local
npm start

# Deploy a Vercel
vercel --prod
```

**3. Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENV=production
DATABASE_URL=...
JWT_SECRET=...
```

**4. CI/CD Pipeline:**
- Tests automáticos antes de deploy
- Linting y type checking
- Build verification
- Deploy a staging primero
- Deploy a producción después de aprobación

**5. Monitoring:**
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring
- Log aggregation

**6. Backup y Recovery:**
- Backups automáticos de base de datos
- Version control de código
- Rollback strategy"

---

## 🛠️ HERRAMIENTAS Y TECNOLOGÍAS

### ¿Por qué TypeScript y no JavaScript?

**Respuesta:**
"TypeScript ofrece beneficios significativos:

**1. Type Safety:**
- Detecta errores en tiempo de desarrollo
- Autocompletado mejorado en IDE
- Refactoring más seguro

**2. Documentación Implícita:**
- Los tipos documentan el código
- Facilita onboarding de nuevos desarrolladores
- Reduce necesidad de comentarios

**3. Mejor Developer Experience:**
- IntelliSense más preciso
- Detección temprana de errores
- Mejor soporte de herramientas

**4. Escalabilidad:**
- Proyectos grandes se benefician más
- Facilita mantenimiento a largo plazo
- Reduce bugs en producción

**5. Ecosistema:**
- Next.js tiene excelente soporte para TypeScript
- Librerías populares tienen tipos
- Comunidad activa y bien mantenida"

---

## 📊 DATOS Y PERSISTENCIA

### ¿Por qué usaste localStorage en lugar de una base de datos?

**Respuesta:**
"Para este proyecto demo, localStorage fue la elección correcta:

**Ventajas para Demo:**
1. **Simplicidad**: No requiere backend ni base de datos
2. **Rapidez**: Setup inmediato, sin configuración
3. **Portabilidad**: Funciona en cualquier navegador
4. **Persistence**: Datos persisten entre sesiones

**Limitaciones (conocidas):**
- ~5-10MB de límite
- Solo en el navegador (no sync entre dispositivos)
- No es seguro para datos sensibles
- No escalable para múltiples usuarios

**Migración a Producción:**
La arquitectura está preparada para migrar fácilmente:
1. Reemplazar acciones del store con llamadas API
2. Mantener la misma interfaz de store
3. Agregar autenticación JWT
4. Implementar sincronización

**En Producción Usaría:**
- PostgreSQL o MongoDB para base de datos
- API REST o GraphQL
- Redis para cache
- S3 para archivos estáticos"

---

## 🎯 MEJORES PRÁCTICAS

### ¿Qué mejores prácticas seguiste en el desarrollo?

**Respuesta:**
"Seguí varias mejores prácticas:

**1. Código Limpio:**
- Nombres descriptivos y significativos
- Funciones pequeñas y con responsabilidad única
- DRY (Don't Repeat Yourself)
- Comentarios solo cuando es necesario

**2. TypeScript:**
- Strict mode habilitado
- Tipos explícitos, evito `any`
- Interfaces bien definidas
- Type safety en todo el proyecto

**3. Componentes:**
- Componentes pequeños y reutilizables
- Props bien tipadas
- Separación de lógica y presentación
- Custom hooks para lógica reutilizable

**4. Testing:**
- Tests para funcionalidades críticas
- Tests mantenibles y legibles
- Aislamiento de tests
- Mocks apropiados

**5. Git:**
- Commits descriptivos
- Branches por feature
- Code review (si trabajo en equipo)

**6. Performance:**
- Optimizaciones desde el inicio
- Profiling regular
- Bundle size monitoring

**7. Accesibilidad:**
- Semantic HTML
- ARIA labels donde es necesario
- Navegación por teclado
- Contraste adecuado"

---

## 🔮 FUTURO Y MEJORAS

### ¿Qué mejoras implementarías a futuro?

**Respuesta:**
"Tengo un roadmap claro de mejoras:

**Corto Plazo:**
1. **Backend Real**: API REST con Node.js/Python, base de datos PostgreSQL
2. **Autenticación Real**: JWT tokens, refresh tokens, 2FA
3. **Tests E2E**: Playwright o Cypress para flujos completos
4. **PWA**: Service Worker, offline support, instalable

**Medio Plazo:**
5. **Integraciones**: Open Banking, importación desde bancos
6. **Analytics Avanzados**: Machine Learning para predicciones
7. **Notificaciones**: Push notifications, email alerts
8. **Sincronización**: Multi-dispositivo en tiempo real

**Largo Plazo:**
9. **App Móvil**: React Native para iOS/Android
10. **IA/ML**: Categorización automática, detección de anomalías
11. **Colaboración**: Presupuestos compartidos en tiempo real
12. **Reportes Avanzados**: Constructor de reportes personalizados

**Priorización:**
- Basada en valor de negocio
- Feedback de usuarios
- Métricas de uso
- ROI de cada feature"

---

## 💡 PREGUNTAS ESPECÍFICAS DEL PROYECTO

### ¿Cómo funciona el sistema de presupuestos compartidos?

**Respuesta:**
"Implementé un sistema básico de compartir presupuestos:

**1. Generación de Link:**
- Cada presupuesto puede generar un token único
- Link compartible con el token
- Permisos de solo lectura o edición

**2. Almacenamiento:**
- Tokens almacenados en `financeStore`
- Asociados al presupuesto original
- Validación de permisos

**3. Flujo:**
```typescript
// Generar link
const shareLink = generateShareLink(budgetId, permissions);

// Acceder con link
const budget = getSharedBudget(token);
```

**4. Mejoras Futuras:**
- Página dedicada para ver presupuestos compartidos
- Notificaciones cuando alguien comparte
- Control de acceso más granular
- Expiración de links"

---

### ¿Cómo calculas los reportes financieros?

**Respuesta:**
"Los reportes se calculan dinámicamente desde el store:

**1. Agregaciones:**
```typescript
getMonthlyReport: (year, month) => {
  const transactions = get().transactions.filter(/* por fecha */);
  return {
    income: sum(incomeTransactions),
    expenses: sum(expenseTransactions),
    byCategory: groupByCategory(transactions)
  };
}
```

**2. Optimización:**
- Cálculos on-demand (no pre-calculados)
- Memoización para evitar recálculos innecesarios
- Filtrado eficiente con métodos de array

**3. Tipos de Reportes:**
- Mensual: Agregación por mes
- Anual: Breakdown mensual del año
- Por Categoría: Agrupación y suma
- Comparación: Entre períodos

**4. Performance:**
- Para grandes volúmenes, implementaría:
  - Indexación de datos
  - Cálculos en background
  - Cache de reportes frecuentes"

---

## 🎓 APRENDIZAJES Y EXPERIENCIA

### ¿Qué aprendiste desarrollando este proyecto?

**Respuesta:**
"Este proyecto fue una excelente oportunidad de aprendizaje:

**Técnico:**
1. **Next.js App Router**: Dominé el nuevo sistema de routing
2. **Zustand**: Aprendí state management moderno y eficiente
3. **Testing**: Implementé tests unitarios con Vitest y React Testing Library
4. **TypeScript Avanzado**: Mejoré en tipos complejos y generics
5. **i18n**: Implementé sistema multi-idioma completo

**Arquitectura:**
1. **Diseño Escalable**: Aprendí a estructurar proyectos para crecer
2. **Separación de Concerns**: Lógica, UI, y estado bien separados
3. **API Design**: Pensé en cómo sería la integración con backend

**Soft Skills:**
1. **Problem Solving**: Resolví problemas complejos paso a paso
2. **Documentación**: Aprendí la importancia de documentar decisiones
3. **Code Quality**: Mejoré en escribir código mantenible

**Próximos Pasos:**
- Profundizar en testing avanzado
- Aprender más sobre performance optimization
- Explorar arquitecturas más complejas"

---

## 📝 NOTAS FINALES

### Consejos para Responder Preguntas Técnicas:

1. **Sé Honesto**: Si no sabes algo, admítelo y muestra cómo lo investigarías
2. **Explica el "Por Qué"**: No solo qué hiciste, sino por qué elegiste esa solución
3. **Menciona Trade-offs**: Muestra que consideraste alternativas
4. **Habla de Mejoras**: Muestra que piensas en el futuro del proyecto
5. **Usa Ejemplos**: Referencias a código específico cuando sea posible
6. **Mantén Calma**: Tómate tu tiempo para pensar antes de responder

---

**¡Buena suerte en tu presentación! 🚀**
