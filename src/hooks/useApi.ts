/**
 * Shared hooks for common API data fetching
 * Reduces code duplication and improves performance with caching
 */

import { useState, useEffect } from "react";
import { fetchCached } from "@/lib/apiCache";

interface UseApiOptions {
  enabled?: boolean;
  ttl?: number;
}

/**
 * Generic hook for fetching API data
 */
export function useApi<T>(url: string | null, options: UseApiOptions = {}) {
  const { enabled = true, ttl } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !url) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchCached<T>(url, { ttl });
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, enabled, ttl]);

  return { data, loading, error };
}

/**
 * Hook for fetching axes
 */
export function useAxes(options: UseApiOptions = {}) {
  return useApi<
    Array<{
      _id: string;
      nom: string;
      numero: number;
      description?: string;
    }>
  >("/api/axes", options);
}

/**
 * Hook for fetching provinces
 */
export function useProvinces(options: UseApiOptions = {}) {
  return useApi<
    Array<{
      _id: string;
      nom: string;
      code?: string;
    }>
  >("/api/provinces", options);
}

/**
 * Hook for fetching indicateurs
 */
export function useIndicateurs(options: UseApiOptions = {}) {
  return useApi<
    Array<{
      _id: string;
      nom: string;
      type: string;
      axe: {
        _id: string;
        nom: string;
        numero: number;
      };
      unitesMesure?: string[];
    }>
  >("/api/indicateurs", options);
}

/**
 * Hook for fetching structures
 */
export function useStructures(options: UseApiOptions = {}) {
  return useApi<
    Array<{
      _id: string;
      nom: string;
      sigle: string;
      type: string;
      province?: { nom: string };
      email: string;
      telephone: string;
      siteWeb?: string;
      description?: string;
    }>
  >("/api/structures", options);
}

/**
 * Hook for fetching categories
 */
export function useCategories(options: UseApiOptions = {}) {
  return useApi<{
    grandesCategories: Array<{
      _id: string;
      nom: string;
      numero: number;
    }>;
    categories: Array<{
      _id: string;
      nom: string;
      numero: number;
      grandeCategorie: {
        _id: string;
        nom: string;
      };
    }>;
  }>("/api/categories", options);
}

/**
 * Hook for fetching annees
 */
export function useAnnees(options: UseApiOptions = {}) {
  return useApi<
    Array<{
      _id: string;
      annee: number;
    }>
  >("/api/annees", options);
}
