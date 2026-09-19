import { useState, useEffect, useCallback } from 'react';
import { Prescription, TenantId, PatientId } from '../domain';
import { repositories } from '../repositories';
import { container } from '../di/container';
import { CreatePrescriptionCommand } from '../application';

export function usePrescriptions(patientId?: PatientId, tenantId: TenantId = 'tenant-demo-01') {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (patientId) {
        const data = await repositories.prescriptions.listByPatient(patientId, tenantId);
        setPrescriptions(data);
      } else {
        setPrescriptions([]);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  }, [patientId, tenantId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const createPrescription = async (command: Omit<CreatePrescriptionCommand, 'tenantId'>): Promise<Prescription> => {
    try {
      const result = await container.createPrescriptionUseCase.execute({
        ...command,
        tenantId,
      });
      await fetchPrescriptions();
      return result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  return {
    prescriptions,
    isLoading,
    error,
    refresh: fetchPrescriptions,
    createPrescription,
  };
}
