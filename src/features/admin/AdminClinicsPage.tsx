import { useState, useEffect } from 'react';
import { MaterialIcon, PageHeader, Button, Badge, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';
import { repositories } from '../../repositories';
import { Clinic } from '../../domain';

export function AdminClinicsPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].clinics;

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await repositories.clinics.list();
        setClinics(list);
      } catch (e) {
        console.error('Failed to load clinics', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href="/admin/clinics/provision"
              className="ui-btn ui-btn--primary ui-btn--md"
              style={{ textDecoration: 'none' }}
              title={copy.addTenantTitle}
            >
              <MaterialIcon name="add_business" />
              <span>{copy.addTenant}</span>
            </a>
          </div>
        }
      />

      <TableWrapper>
        <Table hover>
          <TableHead>
            <TableRow>
              <TableHeaderCell>{copy.thClinic}</TableHeaderCell>
              <TableHeaderCell>{copy.thRegion}</TableHeaderCell>
              <TableHeaderCell>{copy.thStatus}</TableHeaderCell>
              <TableHeaderCell>{copy.thPlan}</TableHeaderCell>
              <TableHeaderCell textAlign="center">{copy.thUsers}</TableHeaderCell>
              <TableHeaderCell>{copy.thLastSync}</TableHeaderCell>
              <TableHeaderCell textAlign="end">{copy.thAction}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} textAlign="center">
                  <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                    {isRtl ? 'جاري تحميل العيادات من قاعدة البيانات...' : 'Loading clinics from database...'}
                  </span>
                </TableCell>
              </TableRow>
            ) : clinics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} textAlign="center">
                  <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                    {isRtl ? 'لا توجد عيادات مسجلة حالياً' : 'No clinics registered currently'}
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell>
                    <a
                      href={`/admin/clinics/${clinic.id}`}
                      style={{ fontWeight: 700, color: 'var(--brand-primary)', textDecoration: 'none' }}
                    >
                      {isRtl ? clinic.nameAr : clinic.name}
                    </a>
                  </TableCell>
                  <TableCell>{isRtl ? `${clinic.cityAr} - ${clinic.districtAr}` : `${clinic.city} - ${clinic.district}`}</TableCell>
                  <TableCell>
                    <Badge variant={clinic.isVerified ? 'success' : 'warning'} dot>
                      {clinic.isVerified ? copy.statusHealthy : copy.statusReview}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">Enterprise</Badge>
                  </TableCell>
                  <TableCell textAlign="center">{clinic.doctorCount * 8}</TableCell>
                  <TableCell>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>{copy.syncTimes.twoMin}</span>
                  </TableCell>
                  <TableCell textAlign="end">
                    <a
                      href={`/admin/clinics/${clinic.id}`}
                      className="ui-btn ui-btn--ghost ui-btn--sm"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>{copy.open}</span>
                      <MaterialIcon name={isRtl ? 'arrow_back' : 'arrow_forward'} />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableWrapper>
    </div>
  );
}
