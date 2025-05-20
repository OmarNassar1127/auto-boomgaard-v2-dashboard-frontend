# Auto Boomgaard Dashboard Frontend Documentation

## 📋 **Project Overview**

The Auto Boomgaard Dashboard Frontend is a comprehensive Next.js application designed to provide administrators with a powerful interface for managing car inventory. Built with modern React patterns and TypeScript, it offers a seamless experience for car dealership management operations.

**Key Features:**

- Real-time car inventory management
- Advanced image handling and galleries
- Comprehensive car editing with modular forms
- Status management (vehicle and publication status)
- Responsive design with mobile support
- Type-safe development with TypeScript

## 🏗️ **Architecture & Technologies**

### **Frontend Framework**

- **Next.js 14.1.0** - React framework with App Router
- **React 18** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development environment

### **UI & Styling**

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library with 300+ icons

### **State Management & Forms**

- **React Hooks** - Local state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### **Additional Libraries**

- **React Dropzone** - File upload with drag-and-drop
- **clsx** & **tailwind-merge** - Conditional className management
- **date-fns** - Date manipulation utilities

## 📁 **Project Structure**

```
/app
├── components/
│   ├── cars/
│   │   └── form/
│   │       ├── BasicInfoForm.tsx
│   │       ├── SpecificationsForm.tsx
│   │       ├── OptionsAccessoriesForm.tsx
│   │       ├── ImageUploadForm.tsx
│   │       ├── HighlightsForm.tsx
│   │       └── FormNavigation.tsx
│   │   └── CarForm.tsx
│   ├── dashboard/
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       └── [other UI components]
├── contexts/
│   └── AuthContext.tsx
├── dashboard/
│   ├── autos/
│   │   ├── [id]/
│   │   │   ├── bewerken/
│   │   │   │   └── page.tsx (Edit car)
│   │   │   └── page.tsx (Car details)
│   │   ├── toevoegen/
│   │   │   └── page.tsx (Add car)
│   │   └── page.tsx (Car list)
│   ├── gebruikers/
│   │   └── page.tsx (User management)
│   ├── layout.tsx (Dashboard layout)
│   └── page.tsx (Dashboard home)
├── lib/
│   ├── api.ts (API client)
│   └── utils.ts (Utility functions)
├── login/
│   └── page.tsx
└── globals.css
```

## 🔧 **Component Architecture**

### **1. Page Components**

Located in `/app/dashboard/`, these define routes and handle page-level logic:

- **`page.tsx`** - Dashboard overview with statistics
- **`autos/page.tsx`** - Car listing with filtering and pagination
- **`autos/[id]/page.tsx`** - Car detail view
- **`autos/[id]/bewerken/page.tsx`** - Car edit form
- **`autos/toevoegen/page.tsx`** - Car creation form

### **2. Layout Components**

- **`layout.tsx`** - Dashboard shell with authentication
- **`header.tsx`** - Page header with title and actions
- **`sidebar.tsx`** - Navigation sidebar

### **3. Form Components**

Modular form components for car management:

```typescript
// Each component handles specific form sections
<BasicInfoForm />        // Brand, model, price, etc.
<SpecificationsForm />   // Technical specifications
<OptionsAccessoriesForm /> // Features and options
<ImageUploadForm />      // Image management
<HighlightsForm />       // Description and notes
<FormNavigation />       // Tab navigation and submission
```

### **4. UI Components**

Reusable shadcn/ui components with consistent styling:

- Form controls (Input, Select, Textarea, Checkbox)
- Layout (Card, Tabs, Dialog, Separator)
- Navigation (Button, Badge)
- Feedback (Alert states, Loading spinners)

## 🔌 **API Integration**

### **API Client (`/app/lib/api.ts`)**

```typescript
// Centralized API client with authentication
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  // Handles authentication, error handling, and JSON parsing
}

// Car API operations
export const carsAPI = {
  getAll: (params) => // List cars with filtering
  getById: (id) =>    // Get car details
  create: (data) =>   // Create new car
  update: (id, data) => // Update car
  delete: (id) =>     // Delete car
  uploadImages: (id, files, mainIndex) => // Upload images
  setMainImage: (carId, mediaId) => // Set main image
  deleteImage: (carId, mediaId) => // Delete image
  togglePublishStatus: (id, status) => // Publish/unpublish
  updateVehicleStatus: (id, status) => // Change vehicle status
}
```

### **Type Definitions**

```typescript
// Car list item (optimized for listings)
interface CarListItem {
  id: number;
  brand: string;
  model: string;
  price: string;
  // ... basic fields
  main_image?: string;
}

// Full car data (for details and editing)
interface CarData extends CarListItem {
  specifications?: Record<string, string>;
  highlights?: { content: string };
  options_accessories?: {
    data: {
      exterieur: string[];
      infotainment: string[];
      interieur_comfort: string[];
      extra: string[];
    };
  };
  images?: {
    main?: string;
    all?: Array<{
      id: number;
      url: string;
      is_main: boolean;
    }>;
  };
}
```

## ✨ **Key Features Implemented**

### **1. Dashboard Overview**

- **Real-time statistics** calculation from API data
- **Recent cars display** with image previews
- **Quick actions** for adding new cars
- **Status breakdown** (published vs drafts, vehicle statuses)

### **2. Car Listing (`/dashboard/autos`)**

- **Advanced filtering** by vehicle status, post status, and search
- **Pagination** with configurable items per page
- **Optimized data loading** (only main images in list view)
- **Responsive table/card layout**
- **Real-time status badges**

### **3. Car Detail View (`/dashboard/autos/[id]`)**

- **Comprehensive information display** in organized tabs
- **Image gallery** with thumbnail navigation and full-screen modal
- **Status management** with inline editing
- **Quick actions** (edit, delete, status changes)
- **Specifications display** with conditional rendering
- **Options and accessories** categorized display

### **4. Car Form System (Add/Edit)**

- **Modular form components** (each under 400 lines)
- **Progressive form navigation** with validation
- **Image upload** with drag-and-drop support
- **Real-time preview** of uploaded images
- **Main image designation**
- **Form validation** with error handling
- **Auto-save draft concept**

### **5. Image Management**

- **Multiple image upload** with progress indication
- **Drag-and-drop interface** for easy uploading
- **Image preview** with thumbnail grid
- **Main image selection** with visual indicators
- **Image reordering** with move up/down controls
- **Delete functionality** with confirmation
- **Full-screen image viewer**

### **6. Authentication & Security**

- **Token-based authentication** with Laravel Sanctum
- **Automatic token refresh** handling
- **Protected routes** with redirect to login
- **Session persistence** across browser sessions
- **Logout functionality** with token cleanup

## 📊 **State Management Patterns**

### **1. Local State with useState**

```typescript
// Component-level state for forms and UI
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState<FormErrors>({});
const [formData, setFormData] = useState<CarData>(initialData);
```

### **2. Custom Hooks for API Calls**

```typescript
// Reusable data fetching patterns
const useCar = (id: string) => {
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  // ... fetch logic
  return { car, loading, error, refetch };
};
```

### **3. Context for Global State**

```typescript
// Authentication context
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials) => Promise<void>;
  logout: () => void;
}>();
```

## 🎨 **Design System**

### **Color Palette**

- **Primary**: Custom brand colors for actions and highlights
- **Secondary**: Muted tones for supporting elements
- **Status Colors**:
  - Green: Listed/Published/Success
  - Yellow: Reserved/Warning
  - Blue: Sold/Information
  - Red: Error/Destructive actions
  - Gray: Upcoming/Draft

### **Typography**

- **Headings**: Bold, clear hierarchy
- **Body**: Readable sans-serif font
- **Code**: Monospace for technical data

### **Spacing & Layout**

- **Consistent spacing** using Tailwind's spacing scale
- **Card-based layouts** for content organization
- **Responsive grid systems** for different screen sizes
- **Proper padding and margins** for visual breathing room

## 📱 **Responsive Design**

### **Breakpoints**

- **Mobile**: `sm` (640px+) - Stacked layouts, mobile navigation
- **Tablet**: `md` (768px+) - Grid adjustments, compact layouts
- **Desktop**: `lg` (1024px+) - Full layouts, multiple columns
- **Large Desktop**: `xl` (1280px+) - Expanded content areas

### **Mobile Optimizations**

- **Responsive navigation** with mobile menu
- **Touch-friendly buttons** and form controls
- **Optimized image loading** for mobile networks
- **Vertical-first layouts** that work on small screens

## 🚀 **Performance Optimizations**

### **1. Data Loading**

- **Optimized API responses** (CarListResource vs CarResource)
- **Pagination** to limit data transfer
- **Image optimization** with proper sizing
- **Lazy loading** for non-critical content

### **2. Component Optimizations**

- **React.memo** for expensive components
- **useCallback** for event handlers
- **useMemo** for computed values
- **Proper dependency arrays** in useEffect

### **3. Bundle Optimization**

- **Code splitting** with Next.js automatic splitting
- **Tree shaking** to remove unused code
- **Dynamic imports** for large libraries
- **Image optimization** with Next.js Image component

## 🛠️ **Development Workflow**

### **Setup Instructions**

```bash
# 1. Clone and install
cd /path/to/dashboard-frontend
npm install

# 2. Environment setup
cp .env.example .env.local
# Edit .env.local with your API URL
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local

# 3. Start development server
npm run dev
```

### **Available Scripts**

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
npm run type-check # Run TypeScript checks
```

### **Code Quality**

- **TypeScript** strict mode enabled
- **ESLint** with Next.js configuration
- **Prettier** for code formatting
- **Consistent naming** conventions (camelCase, PascalCase)

## 🧪 **Error Handling**

### **API Error Handling**

```typescript
try {
  const response = await carsAPI.getById(id);
  setState({ data: response.data, loading: false, error: null });
} catch (error) {
  setState({
    data: null,
    loading: false,
    error: error instanceof Error ? error.message : "Unknown error",
  });
}
```

### **Form Validation**

```typescript
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  if (!basicData.brand.trim()) newErrors.brand = "Merk is verplicht";
  // ... more validations
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### **User Feedback**

- **Loading states** with spinners and skeleton screens
- **Error boundaries** to catch React errors
- **Success messages** after successful operations
- **Confirmation dialogs** for destructive actions

## 📈 **Future Enhancements**

### **Short-term (Next Sprint)**

- **Bulk operations** for multiple cars
- **Advanced filtering** with date ranges and multiple criteria
- **Export functionality** (CSV, PDF reports)
- **Image optimization** with automatic compression

### **Medium-term (Next Quarter)**

- **Real-time updates** with WebSocket integration
- **Advanced analytics** dashboard with charts
- **User management** interface
- **Audit logs** for tracking changes

### **Long-term (Future Releases)**

- **Progressive Web App** capabilities
- **Offline support** with service workers
- **Advanced image editor** with cropping and filters
- **Integration with external services** (pricing APIs, vehicle data)

## 🔧 **Configuration**

### **Environment Variables**

```env
# Required
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Optional
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
NEXT_PUBLIC_ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp
```

### **API Configuration**

```typescript
// Customizable API settings
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  retries: 3,
  defaultPerPage: 15,
  maxUploadSize: 10 * 1024 * 1024, // 10MB
};
```

## 📝 **Best Practices**

### **Component Design**

1. **Single Responsibility** - Each component has one clear purpose
2. **Props Interface** - Well-defined TypeScript interfaces
3. **Error Boundaries** - Graceful error handling
4. **Accessibility** - ARIA labels and keyboard navigation
5. **Performance** - Memoization where appropriate

### **State Management**

1. **Local State First** - Use local state when possible
2. **Lift State Up** - Only when needed by multiple components
3. **Derived State** - Calculate from existing state when possible
4. **Immutable Updates** - Always create new objects/arrays

### **API Integration**

1. **Consistent Error Handling** - Standardized error responses
2. **Loading States** - Always show loading indicators
3. **Optimistic Updates** - Update UI before server confirmation
4. **Retry Logic** - Handle temporary network failures

## 🐛 **Known Issues & Limitations**

### **Current Limitations**

1. **File Upload Size** - Limited to 10MB per image
2. **Browser Support** - Modern browsers only (ES2020+)
3. **Offline Mode** - No offline functionality yet
4. **Real-time Updates** - Requires manual refresh for updates

### **Planned Fixes**

1. **Image Compression** - Automatic client-side compression
2. **Progressive Loading** - Better loading experience
3. **Error Recovery** - Automatic retry mechanisms
4. **Performance Monitoring** - Add performance tracking

## 📞 **Support & Maintenance**

**Created**: May 2025  
**Framework**: Next.js 14.1.0  
**React Version**: 18  
**TypeScript**: 5.x

**Development Server**: `http://localhost:3000`  
**API Integration**: `http://127.0.0.1:8000`  
**Documentation**: This file (claude_dashboard_frontend.md)

---

_This documentation covers the complete frontend implementation for Auto Boomgaard's car dealership management dashboard. The application provides a modern, type-safe, and user-friendly interface for managing car inventory with comprehensive CRUD operations, advanced image handling, and real-time status management._
