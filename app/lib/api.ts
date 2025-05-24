// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// API client with authentication
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));

    // Handle account inactive error by clearing token and redirecting to login
    if (error.error === "account_inactive" || response.status === 403) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Redirect to login page
        window.location.href = "/login";
      }
      throw new Error(error.message || "Your account is not active");
    }

    throw new Error(error.message || "API request failed");
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: "verkoper";
  }) => {
    return apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiClient("/auth/logout", {
      method: "POST",
    });
  },

  user: async () => {
    return apiClient("/auth/user");
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    return apiClient("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changeEmail: async (data: { email: string; password: string }) => {
    return apiClient("/auth/change-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Cars API
export const carsAPI = {
  // Get all cars with optional filters (optimized for listings)
  getAll: async (params?: {
    search?: string;
    vehicle_status?: string;
    post_status?: string;
    per_page?: number;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    return apiClient(`/dashboard/cars${queryString ? `?${queryString}` : ""}`);
  },

  // Get single car (with full details and all images)
  getById: async (id: string | number) => {
    return apiClient(`/dashboard/cars/${id}`);
  },

  // Create new car
  create: async (carData: CarData) => {
    return apiClient("/dashboard/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  },

  // Update car
  update: async (id: string | number, carData: Partial<CarData>) => {
    return apiClient(`/dashboard/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  },

  // Delete car
  delete: async (id: string | number) => {
    return apiClient(`/dashboard/cars/${id}`, {
      method: "DELETE",
    });
  },

  // Upload images
  uploadImages: async (
    id: string | number,
    images: File[],
    mainImageIndex?: number
  ) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images[]", image);
    });

    // Add main image index if specified
    if (mainImageIndex !== undefined && mainImageIndex >= 0) {
      formData.append("main_image_index", mainImageIndex.toString());
    }

    const token = getAuthToken();
    const response = await fetch(
      `${API_BASE_URL}/dashboard/cars/${id}/images`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Image upload failed");
    }

    return response.json();
  },

  // Set main image
  setMainImage: async (carId: string | number, mediaId: string | number) => {
    return apiClient(`/dashboard/cars/${carId}/images/${mediaId}/main`, {
      method: "PATCH",
    });
  },

  // Delete image
  deleteImage: async (carId: string | number, mediaId: string | number) => {
    return apiClient(`/dashboard/cars/${carId}/images/${mediaId}`, {
      method: "DELETE",
    });
  },

  // Toggle publish status
  togglePublishStatus: async (
    id: string | number,
    postStatus: "draft" | "published"
  ) => {
    return apiClient(`/dashboard/cars/${id}/publish`, {
      method: "PATCH",
      body: JSON.stringify({ post_status: postStatus }),
    });
  },

  // Update vehicle status
  updateVehicleStatus: async (
    id: string | number,
    vehicleStatus: "sold" | "listed" | "reserved" | "upcoming"
  ) => {
    return apiClient(`/dashboard/cars/${id}/vehicle-status`, {
      method: "PATCH",
      body: JSON.stringify({ vehicle_status: vehicleStatus }),
    });
  },
};

// Users API
export const usersAPI = {
  // Get all users with optional filters
  getAll: async (params?: {
    search?: string;
    role?: string;
    status?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    return apiClient(`/dashboard/users${queryString ? `?${queryString}` : ""}`);
  },

  // Get single user
  getById: async (id: string | number) => {
    return apiClient(`/dashboard/users/${id}`);
  },

  // Create new user
  create: async (userData: UserData) => {
    return apiClient("/dashboard/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Update user
  update: async (id: string | number, userData: Partial<UserData>) => {
    return apiClient(`/dashboard/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  delete: async (id: string | number) => {
    return apiClient(`/dashboard/users/${id}`, {
      method: "DELETE",
    });
  },

  // Activate user
  activate: async (id: string | number) => {
    return apiClient(`/dashboard/users/${id}/activate`, {
      method: "PATCH",
    });
  },

  // Deactivate user
  deactivate: async (id: string | number) => {
    return apiClient(`/dashboard/users/${id}/deactivate`, {
      method: "PATCH",
    });
  },
};

// Simplified Statistics API - single endpoint
export const statisticsAPI = {
  getStatistics: async () => {
    return apiClient("/dashboard/statistics");
  },
};

// TypeScript Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "verkoper";
  status: "active" | "inactive";
  active: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: "admin" | "verkoper";
  active?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: "verkoper";
}

export interface Statistic {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}

export interface CarListItem {
  id: number;
  brand: string;
  model: string;
  price: number;
  formatted_price?: string;
  tax_info: string;
  mileage: number;
  formatted_mileage?: string;
  year: number;
  color: string;
  transmission: string;
  fuel: string;
  power: number;
  formatted_power?: string;
  vehicle_status: "sold" | "listed" | "reserved" | "upcoming";
  post_status: "draft" | "published";
  main_image?: string;
  created_at: string;
  updated_at: string;
}

// For the detailed car view (single car)
export interface CarData {
  id?: number;
  brand: string;
  model: string;
  price: number;
  formatted_price?: string;
  tax_info: string;
  mileage: number;
  formatted_mileage?: string;
  year: number;
  color: string;
  transmission: string;
  fuel: string;
  power: number;
  formatted_power?: string;
  specifications?: {
    first_registration_date?: string;
    seats?: string;
    torque?: string;
    acceleration?: string;
    wheelbase?: string;
    cylinders?: string;
    model_date_from?: string;
    doors?: string;
    gears?: string;
    top_speed?: string;
    tank_capacity?: string;
    engine_capacity?: string;
    weight?: string;
    [key: string]: string | undefined;
  };
  highlights?: {
    content?: string;
    [key: string]: any;
  };
  options_accessories?: {
    data?: {
      exterieur?: string[];
      infotainment?: string[];
      interieur_comfort?: string[];
      extra?: string[];
    };
  };
  vehicle_status: "sold" | "listed" | "reserved" | "upcoming";
  post_status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
  images?: {
    main?: string;
    all?: Array<{
      id: number;
      url: string;
      is_main: boolean;
    }>;
  };
  // For backward compatibility with dashboard
  main_image?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from?: number;
    to?: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
