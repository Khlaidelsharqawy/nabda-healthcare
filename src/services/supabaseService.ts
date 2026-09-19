/**
 * Supabase Synchronization & Cloud Persistence Service
 * Connects frontend repository layer directly to Supabase PostgreSQL backend.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Clinic, Doctor, PlatformService } from '../domain';

export class SupabaseService {
  private static instance: SupabaseService;

  private constructor() {}

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  /**
   * Fetches published clinics from Supabase if configured.
   */
  public async getPublishedClinics(): Promise<Clinic[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('show_on_public_site', true)
        .eq('is_published', true);

      if (error || !data || data.length === 0) return null;

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        nameAr: row.name_ar,
        tagline: row.tagline,
        taglineAr: row.tagline_ar,
        description: row.description,
        descriptionAr: row.description_ar,
        address: row.address,
        addressAr: row.address_ar,
        city: row.city,
        cityAr: row.city_ar,
        district: row.district,
        districtAr: row.district_ar,
        phone: row.phone,
        email: row.email,
        rating: Number(row.rating) || 5.0,
        reviewCount: row.review_count || 0,
        specialties: row.specialties || [],
        specialtiesAr: row.specialties_ar || [],
        operatingHours: row.operating_hours,
        operatingHoursAr: row.operating_hours_ar,
        isVerified: row.is_verified,
        doctorCount: row.doctor_count || 0,
        consultationFeeRange: row.consultation_fee_range || '200 – 350 SAR',
        consultationFeeRangeAr: row.consultation_fee_range_ar || '٢٠٠ – ٣٥٠ ر.س',
        emergencyAvailable: row.emergency_available,
        isDemo: false,
        showOnPublicSite: row.show_on_public_site,
        isPublished: row.is_published,
        mapCoordinates: {
          latApprox: 30.0444,
          lngApprox: 31.2357,
          label: row.name,
        },
      }));
    } catch (e) {
      console.warn('Supabase fetch clinics fallback to local store', e);
      return null;
    }
  }

  /**
   * Toggles clinic visibility in Supabase
   */
  public async setClinicVisibility(id: string, isVisible: boolean): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ show_on_public_site: isVisible })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Toggles doctor visibility in Supabase
   */
  public async setDoctorVisibility(id: string, isVisible: boolean): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ show_on_public_site: isVisible })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Toggles service visibility in Supabase
   */
  public async setServiceVisibility(id: string, isVisible: boolean): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase
        .from('platform_services')
        .update({ show_on_public_site: isVisible })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseService = SupabaseService.getInstance();
