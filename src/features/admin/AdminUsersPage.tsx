import { useState, useEffect } from 'react';
import {
  PageHeader,
  Button,
  Badge,
  TableWrapper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  MaterialIcon,
  FormField,
  Input,
  Select,
} from '../../components/ui';
import { useTheme } from '../../theme/ThemeProvider';
import { adminMessages } from '../../i18n/messages';
import { repositories } from '../../repositories';
import { User, UserRole } from '../../domain';

export function AdminUsersPage() {
  const { direction } = useTheme();
  const isRtl = direction === 'rtl';
  const copy = adminMessages[isRtl ? 'ar' : 'en'].users;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  // Form State for New User
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'doctor' as UserRole,
    specialty: '',
    tenantId: 'tenant-demo-01',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await repositories.users.list();
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setNotice({
        text: isRtl ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill all required fields',
        error: true,
      });
      return;
    }

    try {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        tenantId: formData.tenantId,
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        role: formData.role,
        phone: formData.phone.trim() || undefined,
        specialty: formData.specialty.trim() || undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      await repositories.users.save(newUser);

      // If patient, also add to patient repository
      if (newUser.role === 'patient') {
        await repositories.patients.save({
          id: `pat-${Date.now()}`,
          tenantId: newUser.tenantId,
          medicalRecordNumber: `#MRN-${Math.floor(1000 + Math.random() * 9000)}`,
          nationalId: `NAT-${Date.now().toString().slice(-8)}`,
          fullNameAr: newUser.fullName,
          fullNameEn: newUser.fullName,
          dateOfBirth: '1990-01-01',
          gender: 'male',
          phone: newUser.phone || '+966500000000',
          whatsappOptIn: true,
          allergies: [],
          chronicConditions: [],
          status: 'stable',
          createdAt: new Date().toISOString(),
        });
      }

      await repositories.auditLogs.append({
        tenantId: newUser.tenantId,
        actorId: 'usr-admin-01',
        actorRole: 'super_admin',
        action: 'CREATE_USER',
        entityType: 'auth',
        entityId: newUser.id,
        details: { email: newUser.email, role: newUser.role, fullName: newUser.fullName },
      });

      setNotice({
        text: isRtl ? `تم إنشاء حساب ${newUser.fullName} بنجاح` : `User ${newUser.fullName} created successfully`,
        error: false,
      });
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'doctor',
        specialty: '',
        tenantId: 'tenant-demo-01',
      });
      await loadUsers();
    } catch (err) {
      console.error(err);
      setNotice({
        text: isRtl ? 'حدث خطأ أثناء إنشاء المستخدم' : 'Failed to create user',
        error: true,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to remove this user?')) {
      await repositories.users.delete(userId);
      await loadUsers();
      setNotice({
        text: isRtl ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully',
        error: false,
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filterRole === 'all') return true;
    return u.role === filterRole;
  });

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
      case 'super-admin':
        return 'error';
      case 'doctor':
        return 'brand';
      case 'assistant':
        return 'warning';
      case 'patient':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    if (isRtl) {
      switch (role) {
        case 'super_admin':
          return 'مدير النظام العام';
        case 'doctor':
          return 'طبيب استشاري';
        case 'assistant':
          return 'تمريض / مساعد سريري';
        case 'patient':
          return 'مريض';
        default:
          return role;
      }
    }
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'doctor':
        return 'Doctor';
      case 'assistant':
        return 'Assistant / Nurse';
      case 'patient':
        return 'Patient';
      default:
        return role;
    }
  };

  return (
    <div className="admin-page__section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        kicker={copy.kicker}
        title={copy.title}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ minWidth: '160px' }}
            >
              <option value="all">{isRtl ? 'جميع الأدوار' : 'All Roles'}</option>
              <option value="super_admin">{isRtl ? 'مديرو النظام' : 'Super Admins'}</option>
              <option value="doctor">{isRtl ? 'الأطباء' : 'Doctors'}</option>
              <option value="assistant">{isRtl ? 'التمريض والمساعدين' : 'Assistants'}</option>
              <option value="patient">{isRtl ? 'المرضى' : 'Patients'}</option>
            </Select>
            <Button
              variant="primary"
              size="md"
              icon="person_add"
              onClick={() => setIsModalOpen(true)}
              title={copy.inviteStaffTitle}
            >
              {isRtl ? 'إضافة / دعوة مستخدم' : 'Add / Invite User'}
            </Button>
          </div>
        }
      />

      {notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: notice.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: notice.error ? 'var(--color-danger-text)' : 'var(--color-success-text)',
            border: `1px solid ${notice.error ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <MaterialIcon name={notice.error ? 'error' : 'check_circle'} />
          <span>{notice.text}</span>
        </div>
      )}

      <TableWrapper>
        <Table hover>
          <TableHead>
            <TableRow>
              <TableHeaderCell>{copy.thPerson}</TableHeaderCell>
              <TableHeaderCell>{copy.thRole}</TableHeaderCell>
              <TableHeaderCell>{isRtl ? 'البريد / الهاتف' : 'Contact / Phone'}</TableHeaderCell>
              <TableHeaderCell>{isRtl ? 'التخصص / القسم' : 'Specialty / Dept'}</TableHeaderCell>
              <TableHeaderCell>{copy.thStatus}</TableHeaderCell>
              <TableHeaderCell textAlign="end">{isRtl ? 'إجراءات' : 'Actions'}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} textAlign="center">
                  <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                    {isRtl ? 'جاري تحميل المستخدمين من قاعدة البيانات...' : 'Loading users from database...'}
                  </span>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} textAlign="center">
                  <span style={{ color: 'var(--text-tertiary)', padding: '2rem 0', display: 'inline-block' }}>
                    {isRtl ? 'لا يوجد مستخدمون يطابقون هذا الفلتر' : 'No users found matching this filter'}
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{user.fullName}</strong>
                      <small style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>ID: {user.id}</small>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8125rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
                      {user.phone && <span style={{ color: 'var(--text-tertiary)' }}>{user.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {user.specialty || (isRtl ? '—' : 'N/A')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'neutral'} dot>
                      {user.isActive ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell textAlign="end">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title={isRtl ? 'حذف المستخدم' : 'Delete user'}
                      style={{ color: 'var(--color-danger-text)' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableWrapper>

      {/* Interactive Modal to Create / Invite User */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface-container)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '540px',
              width: '100%',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(8, 116, 67, 0.1)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcon name="person_add" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    {isRtl ? 'إضافة مستخدم جديد للنظام' : 'Add New System User'}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', margin: 0 }}>
                    {isRtl
                      ? 'إنشاء وتوثيق مستخدم جديد بصلاحيات محددة في قاعدة البيانات'
                      : 'Provision user account with strict RBAC in the database'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="close"
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormField label={isRtl ? 'الاسم الكامل' : 'Full Name'} required>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={isRtl ? 'مثال: د. عبد الله السعيد' : 'e.g. Dr. Abdullah Al-Saeed'}
                  required
                  iconStart="person"
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField label={isRtl ? 'البريد الإلكتروني' : 'Email Address'} required>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@aegishealth.com"
                    required
                    iconStart="mail"
                  />
                </FormField>

                <FormField label={isRtl ? 'رقم الهاتف (واتساب)' : 'WhatsApp Phone'}>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 50 123 4567"
                    iconStart="phone"
                  />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField label={isRtl ? 'الدور والصلاحيات' : 'Role & RBAC'} required>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  >
                    <option value="doctor">{isRtl ? 'طبيب استشاري (Doctor)' : 'Doctor'}</option>
                    <option value="assistant">{isRtl ? 'تمريض / مساعد (Assistant)' : 'Assistant / Nurse'}</option>
                    <option value="super_admin">{isRtl ? 'مدير نظام (Super Admin)' : 'Super Admin'}</option>
                    <option value="patient">{isRtl ? 'مريض (Patient)' : 'Patient'}</option>
                  </Select>
                </FormField>

                <FormField label={isRtl ? 'التخصص / القسم' : 'Specialty / Dept'}>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder={isRtl ? 'أمراض القلب، الباطنة...' : 'Cardiology, Internal Medicine...'}
                    iconStart="medical_services"
                  />
                </FormField>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit" variant="primary" size="md" icon="check">
                  {isRtl ? 'حفظ وتفعيل الحساب' : 'Save & Provision Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
