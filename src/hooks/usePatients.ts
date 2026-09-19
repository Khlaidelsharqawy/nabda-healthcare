import { useState, useEffect, useCallback } from 'react';
import { Patient, TenantId } from '../domain';
import { repositories } from '../repositories';
import { container } from '../di/container';
import { RegisterPatientCommand, RegisterPatientResult } from '../application';

export function usePatients(tenantId: TenantId = 'tenant-demo-01') {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repositories.patients.list(tenantId, query);
      setPatients(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const registerPatient = async (command: Omit<RegisterPatientCommand, 'tenantId'>): Promise<RegisterPatientResult> => {
    try {
      const result = await container.registerPatientUseCase.execute({
        ...command,
        tenantId,
      });
      // Refresh list after registration
      await fetchPatients();
      return result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  return {
    patients,
    isLoading,
    error,
    refresh: fetchPatients,
    registerPatient,
  };
}
