import type { Entity } from './common';

export interface Place extends Entity {
  name: string;
  rating: number | null;
}

export interface PlaceCreateInput {
  name: string;
  rating: number | null;
}

export interface PlaceUpdateInput extends PlaceCreateInput {}
