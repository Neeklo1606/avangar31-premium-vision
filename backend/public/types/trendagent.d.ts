/**
 * TrendAgent API TypeScript Definitions
 * 
 * @version 1.0
 * @date 2026-02-09
 */

// ============================================================================
// Value Objects
// ============================================================================

export interface Price {
  value: number;
  currency: 'RUB' | 'USD' | 'EUR';
  formatted: string;
}

export interface Area {
  value: number;
  unit: 'м²' | 'га' | 'сот';
  formatted: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  coordinates: Coordinates | null;
  address: string | null;
  district: string | null;
  metro: MetroStation[] | null;
}

export interface MetroStation {
  name: string;
  line: string;
  distance?: number;
  color?: string;
}

export interface Contact {
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface Developer {
  id: string;
  name: string;
  logo: string | null;
}

// ============================================================================
// Entity Types
// ============================================================================

export type ObjectType = 
  | 'blocks'
  | 'apartments'
  | 'parking'
  | 'houses'
  | 'plots'
  | 'commerce'
  | 'house_projects'
  | 'villages';

export interface BaseEntity {
  id: string;
  guid?: string;
  created_at: string | null;
  updated_at: string | null;
}

// Block (ЖК)
export interface Block extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: {
    from: Price | null;
    to: Price | null;
    has_range: boolean;
  };
  area: {
    from: Area | null;
    to: Area | null;
    has_range: boolean;
  };
  location: Location | null;
  developer: Developer | null;
  class: string | null;
  type: string | null;
  stats: {
    total_apartments?: number;
    available_apartments?: number;
    total_buildings?: number;
    floors_min?: number;
    floors_max?: number;
  };
  status: string | null;
  deadline: string | null;
  contact: Contact | null;
  features: string[];
  advantages: string[];
  images: {
    main: string | null;
    gallery: string[];
  };
}

// Apartment (Квартира)
export interface Apartment extends BaseEntity {
  number: string | null;
  price: Price | null;
  area: {
    total: Area | null;
    living: Area | null;
    kitchen: Area | null;
  };
  rooms: {
    count: number;
    is_studio: boolean;
    label: string;
  };
  floor: number | null;
  floors_total: number | null;
  section: string | null;
  building: string | null;
  block: {
    id: string;
    name: string;
  } | null;
  layout: {
    id: string | null;
    type: string | null;
  };
  decoration: string | null;
  features: string[];
  status: string | null;
  is_available: boolean;
  images: {
    plan: string | null;
    gallery: string[];
  };
}

// Parking (Паркинг)
export interface Parking extends BaseEntity {
  number: string | null;
  price: Price | null;
  area: Area | null;
  type: string | null;
  level: string | null;
  section: string | null;
  block: {
    id: string;
    name: string;
  } | null;
  features: string[];
  status: string | null;
  is_available: boolean;
  images: string[];
}

// House (Дом)
export interface House extends BaseEntity {
  number: string | null;
  price: Price | null;
  area: {
    total: Area | null;
    living: Area | null;
    kitchen: Area | null;
    land: Area | null;
  };
  rooms: {
    count: number;
    is_studio: boolean;
    label: string;
  };
  floors_total: number | null;
  location: Location | null;
  block: {
    id: string;
    name: string;
  } | null;
  utilities: string[] | null;
  decoration: string | null;
  features: string[];
  status: string | null;
  is_available: boolean;
  images: {
    plan: string | null;
    gallery: string[];
  };
}

// Plot (Участок)
export interface Plot extends BaseEntity {
  number: string | null;
  price: Price | null;
  area: Area | null;
  location: Location | null;
  village: {
    id: string;
    name: string;
  } | null;
  category: string | null;
  purpose: string | null;
  utilities: string[] | null;
  features: string[];
  status: string | null;
  is_available: boolean;
  images: string[];
}

// Commerce (Коммерция)
export interface Commerce extends BaseEntity {
  number: string | null;
  price: Price | null;
  area: Area | null;
  type: string | null;
  purpose: string | null;
  floor: number | null;
  floors_total: number | null;
  section: string | null;
  block: {
    id: string;
    name: string;
  } | null;
  location: Location | null;
  ceiling_height: number | null;
  entrance: string | null;
  features: string[];
  status: string | null;
  is_available: boolean;
  images: {
    plan: string | null;
    gallery: string[];
  };
}

// HouseProject (Проект дома)
export interface HouseProject extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  price: Price | null;
  area: {
    total: Area | null;
    living: Area | null;
  };
  rooms: number | null;
  floors: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  material: string | null;
  style: string | null;
  foundation: string | null;
  roof: string | null;
  contractor: {
    id: string;
    name: string;
  } | null;
  features: string[];
  images: {
    main: string | null;
    gallery: string[];
    plans: string[];
  };
}

// Village (Поселок)
export interface Village extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: {
    from: Price | null;
    to: Price | null;
  };
  area: {
    from: Area | null;
    to: Area | null;
  };
  location: Location | null;
  class: string | null;
  status: string | null;
  stats: {
    total_plots: number | null;
    available_plots: number | null;
  };
  developer: Developer | null;
  infrastructure: string[] | null;
  utilities: string[] | null;
  features: string[];
  advantages: string[];
  images: {
    main: string | null;
    gallery: string[];
  };
}

// Union type для любой Entity
export type Entity = 
  | Block 
  | Apartment 
  | Parking 
  | House 
  | Plot 
  | Commerce 
  | HouseProject 
  | Village;

// ============================================================================
// API Response Types
// ============================================================================

// Catalog Response
export interface CatalogMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_more: boolean;
  object_type: ObjectType;
  city: string;
}

export interface CatalogResponse<T = Entity> {
  data: T[];
  meta: CatalogMeta;
  filters: Record<string, any>;
  dictionaries: Record<string, any> | null;
}

// Detail Response
export interface Media {
  photos: any[];
  videos: any[];
  documents: any[];
  plans: any[];
  progress: any[];
  has_content: boolean;
}

export interface DetailMeta {
  object_type: ObjectType;
  id: string;
  is_complete: boolean;
  failed_endpoints: string[];
  dictionaries_used: string[];
}

export interface DetailResponse<T = Entity> {
  data: T;
  media: Media;
  related: Record<string, any>;
  meta: DetailMeta;
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface BaseFilters {
  price_from?: number;
  price_to?: number;
  area_from?: number;
  area_to?: number;
  district?: string;
}

export interface ApartmentFilters extends BaseFilters {
  rooms?: number[];
  floor_from?: number;
  floor_to?: number;
  block_id?: string;
}

export interface BlockFilters extends BaseFilters {
  class?: string;
  status?: string;
  deadline_from?: string;
  deadline_to?: string;
}

export type Filters = BaseFilters | ApartmentFilters | BlockFilters;

// ============================================================================
// API Client Types
// ============================================================================

export interface CatalogParams {
  page?: number;
  per_page?: number;
  filter?: Filters;
  with_dictionaries?: boolean;
}

export interface DetailParams {
  with_media?: boolean;
  with_aggregation?: boolean;
}

export interface SearchParams {
  types: ObjectType[];
  filters?: Filters;
  page?: number;
  per_page?: number;
}

// ============================================================================
// Helper Types
// ============================================================================

export type EntityByType<T extends ObjectType> = 
  T extends 'blocks' ? Block :
  T extends 'apartments' ? Apartment :
  T extends 'parking' ? Parking :
  T extends 'houses' ? House :
  T extends 'plots' ? Plot :
  T extends 'commerce' ? Commerce :
  T extends 'house_projects' ? HouseProject :
  T extends 'villages' ? Village :
  never;
