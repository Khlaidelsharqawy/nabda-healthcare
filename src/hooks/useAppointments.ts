import { useState, useEffect, useCallback } from 'react';
import { Appointment, AppointmentStatus, TenantId } from '../domain';
import { repositories } from '../repositories';
import { container } from '../di/container';
import { BookAppointmentCommand } from '../application';

export function useAppointments(tenantId: TenantId = 'tenant-demo-01') {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (date?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repositories.appointments.listByTenant(tenantId, date);
      setAppointments(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const bookAppointment = async (command: Omit<BookAppointmentCommand, 'tenantId'>): Promise<Appointment> => {
    try {
      const result = await container.bookAppointmentUseCase.execute({
        ...command,
        tenantId,
      });
      await fetchAppointments();
      return result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const updateStatus = async (appointmentId: string, status: AppointmentStatus): Promise<void> => {
    try {
      await repositories.appointments.updateStatus(appointmentId, status, tenantId);
      await fetchAppointments();
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  return {
    appointments,
    isLoading,
    error,
    refresh: fetchAppointments,
    bookAppointment,
    updateStatus,
  };
}
