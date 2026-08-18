// types/global.ts
export interface Genre {
    id: number;
    name: string;
}

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type CreditsType = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};

export type VideoType = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface MovieType {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    tagline: string | null;
    release_date: string;
    runtime: number;
    genres: Genre[];
    vote_average: number;
    vote_count: number;
    poster_path: string | null;
    backdrop_path: string | null;
    original_language: string;
    popularity: number;
    status: string;
    adult: boolean;
    budget: number;
    revenue: number;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
}

export interface TvType {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
}