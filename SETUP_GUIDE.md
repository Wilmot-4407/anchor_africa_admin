# Anchor Africa Admin - Redux & Backend Integration Setup

## ✅ Completed Implementation

### 1. **Redux State Management**

- ✅ Redux Store configured with Redux Toolkit
- ✅ Actions for all CRUD operations (Auth, Blog, Services, Team, About, WhyChooseUs)
- ✅ Reducers handling loading, error, and success states
- ✅ Complete TypeScript type definitions

### 2. **Authentication System**

- ✅ Login/Register actions with JWT token handling
- ✅ Token persistence in localStorage
- ✅ Automatic token validation on app init
- ✅ Protected routes with automatic redirect
- ✅ Sign out functionality
- ✅ Axios interceptors for automatic token injection

### 3. **Backend Integration**

- ✅ Axios API client with base URL configuration
- ✅ API endpoints for:
  - Blog posts (GET all, GET single, POST, PUT, DELETE)
  - Services (GET all, GET single, POST, PUT, DELETE)
  - Team members (GET all, GET single, POST, PUT, DELETE)
  - About content (GET, POST/upsert, DELETE)
  - Why Choose Us (GET, POST/upsert, DELETE)
  - Authentication (login, register, logout, getMe)

### 4. **UI Pages with CRUD**

- ✅ **BlogEditor** (`/blog`) - Manage blog posts with search functionality
- ✅ **ServicesEditor** (`/services`) - Manage services with type filtering (clinic/institute)
- ✅ **TeamEditor** (`/team`) - Manage team members
- ✅ **AboutEditor** (`/about`) - Edit About and Why Choose Us sections
- ✅ **Authentication Pages** - SignIn with Redux integration

### 5. **User Experience Features**

- ✅ Skeleton loaders for loading states
- ✅ Empty state displays when no data available
- ✅ Error state displays with retry functionality
- ✅ Loading indicators on buttons and forms
- ✅ Proper error messages from API
- ✅ Navigation context maintained for breadcrumbs
- ✅ User profile display in topbar

### 6. **Navigation**

- ✅ React Router integration for client-side routing
- ✅ Updated Sidebar with new CRUD pages
- ✅ Breadcrumb navigation
- ✅ Logout functionality in sidebar
- ✅ Protected routes with authentication checks

---

## 🚀 Getting Started

### Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Adjust the port based on your backend server.

### Installation

Dependencies have been installed:

- `redux` - State management
- `react-redux` - React bindings for Redux
- `@reduxjs/toolkit` - Redux utilities and create slice
- `redux-thunk` - Async action handling
- `axios` - HTTP client
- `react-router-dom` - Routing
- `jwt-decode` - JWT token decoding

### Running Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or as shown in terminal)

---

## 📁 Project Structure

```
src/
├── redux/
│   ├── store.ts               # Redux store configuration
│   ├── types.ts              # TypeScript interfaces for all states
│   ├── actions/              # Async thunks (auth, blog, services, team, about, whyChooseUs)
│   └── slices/               # Redux slice definitions (reducers + actions)
├── utils/
│   └── api.ts                # Axios instance with interceptors
├── pages/
│   ├── SignInView.tsx        # Authentication page
│   ├── DashboardView.tsx     # Dashboard
│   ├── BlogEditor.tsx        # Blog CRUD
│   ├── ServicesEditor.tsx    # Services CRUD
│   ├── TeamEditor.tsx        # Team CRUD
│   ├── AboutEditor.tsx       # About/Why Choose Us CRUD
│   └── SettingsView.tsx      # Settings
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── CommandPalette.tsx
│   │   └── ToastContainer.tsx
│   └── common/
│       ├── SkeletonLoader.tsx      # Loading states
│       └── StateComponents.tsx     # Empty/Error states
└── App.tsx                   # Main routing and auth logic
```

---

## 🔄 Redux Flow

### Example: Fetching Blog Posts

1. **Component dispatches action:**

```tsx
dispatch(fetchBlogPosts());
```

2. **Action async thunk:**

- Sets loading state to true
- Calls API endpoint
- On success: stores data and clears error
- On error: stores error message

3. **Component subscribes to state:**

```tsx
const { posts, isLoading, error } = useSelector((state) => state.blog);
```

4. **Component renders appropriately:**

- While loading: Shows skeleton loaders
- If error: Shows error state with retry button
- If empty: Shows empty state message
- If data exists: Renders the list

---

## 🔐 Authentication Flow

1. **User logs in** on SignInView
2. **Redux action sends credentials** to `/api/v1/auth/login`
3. **Server returns JWT token**
4. **Token stored** in localStorage and Redux state
5. **Axios interceptor** automatically adds token to all requests
6. **Protected routes** check `isAuthenticated` before rendering
7. **Token expiry** checked on app initialization

### Logout

- Clears Redux auth state
- Removes token from localStorage
- Redirects to login page
- Axios interceptor 401 errors trigger automatic re-routing

---

## 📝 API Configuration

All API calls are made through `src/utils/api.ts`:

```typescript
// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);
```

---

## 🛣️ Available Routes

- `/` - SignIn page (public)
- `/dashboard` - Dashboard (protected)
- `/blog` - Blog management (protected)
- `/services` - Services management (protected)
- `/team` - Team management (protected)
- `/about` - About/Why Choose Us (protected)
- `/settings` - Settings (protected)

---

## 🧪 Testing Redux

### Check Store State in Console:

```javascript
// In browser console after logging in
localStorage.getItem("token");
// Should return JWT token
```

### Dispatch Actions Manually:

```javascript
// In browser console
import store from "./redux/store";
store.getState().auth;
// Should show auth state with user and token
```

---

## ⚠️ Notes & Requirements

### Backend Requirements

Your backend API should return responses in this format:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    /* resource data */
  }
}
```

### Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### API Base URL

Update `.env.local` VITE_API_BASE_URL to match your backend server port/domain.

---

## 🚀 Next Steps

1. **Configure Backend URL** in `.env.local`
2. **Test Authentication** by logging in
3. **Test CRUD Operations** in each editor page
4. **Implement Edit/Create Forms** (currently showing list view with delete)
5. **Add More Pages** using the same Redux pattern
6. **Deploy** to production

---

## 📚 Redux Patterns Used

### Async Thunks (Redux Toolkit)

```typescript
export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/blog");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
```

### Slices (Redux Toolkit)

```typescript
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {}, // Synchronous actions
  extraReducers: (builder) => {
    // Handle async thunk actions
  },
});
```

### Using in Components

```typescript
const { posts, isLoading, error } = useSelector(
  (state: RootState) => state.blog,
);
const dispatch = useDispatch<AppDispatch>();

useEffect(() => {
  dispatch(fetchBlogPosts());
}, [dispatch]);
```

---

## 🐛 Troubleshooting

### Module Not Found Errors

- ✅ Run `npm install` to ensure all dependencies are installed
- ✅ Restart development server after new package installations
- ✅ Clear `.next` or build cache if building

### CORS Issues

- Ensure backend has CORS enabled for your frontend URL
- Check `VITE_API_BASE_URL` in `.env.local`

### Token Not Persisting

- Open DevTools → Application → Local Storage
- Verify `token` key exists after login
- Check Axios interceptor in `src/utils/api.ts`

### Pages Not Loading

- Check Redux DevTools (install browser extension)
- Verify state is being populated correctly
- Check console for API errors

---

## ✨ Key Features Implemented

1. **Full Authentication** - Login/Logout with JWT
2. **State Persistence** - Token persists across page refreshes
3. **Error Handling** - User-friendly error messages
4. **Loading States** - Skeleton loaders during data fetch
5. **Empty States** - Helpful messages when no data
6. **CRUD Lists** - View all items with search/filter
7. **Type Safety** - Full TypeScript coverage
8. **API Integration** - Automatic token injection via interceptors
9. **Protected Routes** - Prevents access to auth pages when logged in
10. **Responsive UI** - Works on desktop and mobile

---

## 📖 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Axios Documentation](https://axios-http.com/)
- [React Router Documentation](https://reactrouter.com/)
