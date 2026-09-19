import { PageHeader, Button, Badge, TableWrapper, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';

type ClinicUser = {
  name: string;
  role: string;
  access: string;
  status: string;
  isActive: boolean;
};

export function AdminClinicUsersPage({ clinicId }: { clinicId: string }) {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].clinicUsers;

  const users: ClinicUser[] = [
    { name: isRtl ? 'نادية هادي' : 'Nadia Hadi', role: copy.roles.opsLead, access: copy.access.fullAdmin, status: copy.statusActive, isActive: true },
    { name: isRtl ? 'يوسف رحال' : 'Yousef Rahal', role: copy.roles.clinicalSupport, access: copy.access.limitedConsent, status: copy.statusActive, isActive: true },
    { name: isRtl ? 'مريم صلاح' : 'Mariam Salah', role: copy.roles.patientAdvocate, access: copy.access.readOnly, status: copy.statusPending, isActive: false },
  ];

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={`${clinicId} ${copy.usersSuffix}`}
        actions={
          <Button variant="primary" size="md" icon="person_add" disabled title={copy.inviteUserTitle}>
            {copy.inviteUser}
          </Button>
        }
      />

      <TableWrapper>
        <Table hover>
          <TableHead>
            <TableRow>
              <TableHeaderCell>{copy.thPerson}</TableHeaderCell>
              <TableHeaderCell>{copy.thRole}</TableHeaderCell>
              <TableHeaderCell>{copy.thAccess}</TableHeaderCell>
              <TableHeaderCell textAlign="end">{copy.thStatus}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.name}>
                <TableCell>
                  <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.access}</TableCell>
                <TableCell textAlign="end">
                  <Badge variant={user.isActive ? 'success' : 'warning'} dot>
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </div>
  );
}
