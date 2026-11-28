import { dashboardApi } from '@/api/dashboardApi';
import AppFooter from '@/components/common/AppFooter';
import AppTopBar from '@/components/layout/AppTopBar';
import { DASHBOARD_MENU_ITEMS } from '@/config/appContent';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { platform } from '@/theme/platform';
import { spacing } from '@/theme/spacing';
import { DashboardError, DashboardErrorCode, PDashboardResponseDto } from '@/types/dashboard';
import { canAssignRoles, canAssignVolunteers, canManageSettings, canManageUsers, canViewDonors, isAdminRole } from '@/utils/roleUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Animated,
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DRAWER_WIDTH = 280;

interface StatCardConfig {
  label: string;
  field: keyof PDashboardResponseDto['notifications'];
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
}

const STAT_CARDS: StatCardConfig[] = [
  { label: 'Pending PUC Apps',          field: 'pendingPUC',          icon: 'school-outline',         route: '/approval/puc' },
  { label: 'Pending Payana Apps',       field: 'pendingPayana',        icon: 'bicycle-outline',        route: '/approval/payana' },
  { label: 'Pending Prof Apps',         field: 'pendingProfessional',  icon: 'briefcase-outline',      route: '/approval/professional' },
  { label: 'Pending Semi Prof Apps',    field: 'pendingSemiProfessional', icon: 'book-outline',        route: '/approval/semi-professional' },
];

// Admin / Admin(CEO) body cards — web-exact admin menu (no approval stats)
const ADMIN_CARDS = [
  { label: 'Manage Users',        icon: 'people-outline' as const,     route: '/admin/users' },
  { label: 'Assign Role',         icon: 'person-add-outline' as const, route: '/admin/assign-role' },
  { label: 'Update Last Date',    icon: 'calendar-outline' as const,   route: '/admin/update-last-date' },
  { label: 'Semi-Prof Courses',   icon: 'school-outline' as const,     route: '/admin/semi-prof-courses' },
  { label: 'Student Tracking',    icon: 'search-outline' as const,     route: '/my-applications' },
];

interface DrawerNavItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  badge: number;
  route: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function SkeletonCard() {
  return <View style={styles.skeletonCard} />;
}

interface DrawerProps {
  open: boolean;
  slideAnim: Animated.Value;
  backdropAnim: Animated.Value;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  user: { UserName: string; Role: string; District: string } | null;
  dashboard: PDashboardResponseDto | null;
}

function DrawerSidebar({
  open,
  slideAnim,
  backdropAnim,
  onClose,
  onNavigate,
  onLogout,
  user,
  dashboard,
}: DrawerProps) {
  const n = dashboard?.notifications;
  const isAdmin = isAdminRole(user?.Role);

  // Approval/Reject grids — Program Manager sees all 13 per web parity
  const approvalItems: DrawerNavItem[] = [
    { icon: 'school-outline',     label: 'PUC Student Approval',              badge: n?.pendingPUC ?? 0,                   route: '/approval/puc' },
    { icon: 'bicycle-outline',    label: 'Payana Student Approval',           badge: n?.pendingPayana ?? 0,                route: '/approval/payana' },
    { icon: 'briefcase-outline',  label: 'New Professional Approval',         badge: n?.pendingProfessional ?? 0,          route: '/approval/professional' },
    { icon: 'book-outline',       label: 'Semi Professional Approval',        badge: n?.pendingSemiProfessional ?? 0,      route: '/approval/semi-professional' },
    { icon: 'document-outline',   label: 'Format 1.1 PUC Approval',           badge: 0,                                    route: '/approval/format11-puc' },
    { icon: 'document-outline',   label: 'Format 1.1 Professional Approval',  badge: 0,                                    route: '/approval/format11-professional' },
    { icon: 'home-outline',       label: 'PUC House Visit Approval',          badge: n?.pendingHousePUC ?? 0,              route: '/approval/house-visit/puc' },
    { icon: 'home-outline',       label: 'Payana House Visit Approval',       badge: n?.pendingHousePayana ?? 0,           route: '/approval/house-visit/payana' },
    { icon: 'home-outline',       label: 'Prof House Visit Approval',         badge: n?.pendingHouseProfessional ?? 0,     route: '/approval/house-visit/professional' },
    { icon: 'home-outline',       label: 'Semi Prof House Visit Approval',    badge: n?.pendingHouseSemiProfessional ?? 0, route: '/approval/house-visit/semi-professional' },
    { icon: 'refresh-outline',    label: 'PUC Renewal Approval',              badge: n?.pendingPUCRenewal ?? 0,            route: '/approval/renewal-puc' },
    { icon: 'refresh-outline',    label: 'Payana Renewal Approval',           badge: n?.pendingPayanaRenewal ?? 0,         route: '/approval/renewal-payana' },
    { icon: 'refresh-outline',    label: 'Prof Renewal Approval',             badge: n?.pendingProfessionalRenewal ?? 0,   route: '/approval/renewal-professional' },
  ];

  const initials = getInitials(user?.UserName ?? 'VP');

  if (!open) return null;

  const renderNavItem = (item: { icon: any; label: string; route: string; badge?: number }, iconColor: string = colors.primary) => (
    <TouchableOpacity
      key={item.route + item.label}
      style={styles.drawerItem}
      onPress={() => onNavigate(item.route)}
      activeOpacity={0.7}
    >
      <Ionicons name={item.icon} size={20} color={iconColor} />
      <Text style={styles.drawerItemLabel}>{item.label}</Text>
      {(item.badge ?? 0) > 0 && (
        <View style={styles.drawerBadge}>
          <Text style={styles.drawerBadgeText}>
            {item.badge! > 99 ? '99+' : String(item.badge)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.drawerHeader}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.drawerName}>{user?.UserName ?? '—'}</Text>
          <Text style={styles.drawerRole}>{user?.Role ?? '—'}</Text>
          <Text style={styles.drawerDistrict}>Global View</Text>
        </View>

        <ScrollView style={styles.drawerNav} showsVerticalScrollIndicator={false}>
          {isAdmin ? (
            <>
              {/* Web-exact Admin / Admin(CEO) menu — admin functions only */}
              <Text style={styles.drawerSectionLabel}>USER APPROVAL &amp; CREDENTIALS</Text>
              {renderNavItem({ icon: 'people-outline', label: 'Manage Users', route: '/admin/users' })}
              {canAssignRoles(user?.Role) &&
                renderNavItem({ icon: 'person-add-outline', label: 'Assign Role', route: '/admin/assign-role' })}
              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionLabel}>APPLICATION SETTINGS</Text>
              {renderNavItem({ icon: 'calendar-outline', label: 'Update Last Date', route: '/admin/update-last-date' })}
              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionLabel}>SEMI PROFESSIONAL COURSES</Text>
              {renderNavItem({ icon: 'school-outline', label: 'Manage Courses', route: '/admin/semi-prof-courses' })}
              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionLabel}>STUDENT TRACKING</Text>
              {renderNavItem({ icon: 'search-outline', label: 'Track Students', route: '/my-applications' })}
              <View style={styles.drawerDivider} />
            </>
          ) : (
            <>
              {/* Program Manager — full operational menu per web parity */}
              <Text style={styles.drawerSectionLabel}>APPROVAL / REJECT</Text>
              {approvalItems.map((item) => renderNavItem(item))}
              <View style={styles.drawerDivider} />

              {canManageUsers(user?.Role) && (
                <>
                  <Text style={styles.drawerSectionLabel}>USER APPROVAL &amp; CREDENTIALS</Text>
                  {renderNavItem({ icon: 'people-outline', label: 'Manage Users', route: '/admin/users' })}
                  <View style={styles.drawerDivider} />
                </>
              )}

              <Text style={styles.drawerSectionLabel}>PAYANA STUDENTS</Text>
              {renderNavItem({ icon: 'star-outline', label: 'New Payana Application', route: '/form-engine?formType=payana' })}
              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionLabel}>FORMAT 1.1</Text>
              {[
                { icon: 'school-outline' as const,    label: 'PUC Format 1.1',          route: '/form-engine?formType=pucFormat11' },
                { icon: 'briefcase-outline' as const, label: 'Professional Format 1.1', route: '/form-engine?formType=professional' },
              ].map((item) => renderNavItem(item))}
              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionLabel}>RENEWAL FORMS</Text>
              {[
                { ...DASHBOARD_MENU_ITEMS.renewalPuc, icon: 'refresh-outline' as const },
                { ...DASHBOARD_MENU_ITEMS.renewalProfessional, icon: 'refresh-outline' as const },
                { ...DASHBOARD_MENU_ITEMS.renewalPayana, icon: 'refresh-outline' as const },
              ].map((item) => renderNavItem(item, colors.success))}
              <View style={styles.drawerDivider} />

              {canAssignVolunteers(user?.Role) && (
                <>
                  <Text style={styles.drawerSectionLabel}>ASSIGN VOLUNTEERS</Text>
                  {[
                    { label: 'PUC',               route: '/volunteer-assignment/puc',               icon: 'school-outline' as const },
                    { label: 'Payana',            route: '/volunteer-assignment/payana',            icon: 'bicycle-outline' as const },
                    { label: 'Professional',      route: '/volunteer-assignment/professional',      icon: 'briefcase-outline' as const },
                    { label: 'Semi Professional', route: '/volunteer-assignment/semi-professional', icon: 'book-outline' as const },
                  ].map((item) => renderNavItem(item))}
                  <View style={styles.drawerDivider} />
                </>
              )}

              {canViewDonors(user?.Role) && (
                <>
                  <Text style={styles.drawerSectionLabel}>DONOR MANAGEMENT</Text>
                  {renderNavItem({ icon: 'gift-outline', label: 'Manage Donors', route: '/admin/donors' })}
                  <View style={styles.drawerDivider} />
                </>
              )}

              {canManageSettings(user?.Role) && (
                <>
                  <Text style={styles.drawerSectionLabel}>APPLICATION SETTINGS</Text>
                  {renderNavItem({ icon: 'calendar-outline', label: 'Update Last Date', route: '/admin/update-last-date' })}
                  {renderNavItem({ icon: 'school-outline', label: 'Semi-Prof Courses', route: '/admin/semi-prof-courses' })}
                  <View style={styles.drawerDivider} />
                </>
              )}
            </>
          )}

          {/* Diagnostics */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => onNavigate('/diagnostics')}
            activeOpacity={0.7}
          >
            <Ionicons name="bug-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.drawerItemLabel}>Diagnostics</Text>
          </TouchableOpacity>

          <View style={styles.drawerDivider} />

          <TouchableOpacity style={styles.drawerItem} onPress={onLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.drawerItemLabel, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

export default function PDashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dashboard, setDashboard] = useState<PDashboardResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [slideAnim] = useState(() => new Animated.Value(-DRAWER_WIDTH));
  const [backdropAnim] = useState(() => new Animated.Value(0));

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, backdropAnim]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 240, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(() => setDrawerOpen(false));
  }, [slideAnim, backdropAnim]);

  const handleDrawerNavigate = useCallback(
    (route: string) => {
      closeDrawer();
      setTimeout(() => (router.push as any)(route), 260);
    },
    [closeDrawer, router],
  );

  const handleDrawerLogout = useCallback(() => {
    closeDrawer();
    setTimeout(() => {
      logout();
      router.replace('/');
    }, 260);
  }, [closeDrawer, logout, router]);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await dashboardApi.getPDashboard();
      setDashboard(data);
    } catch (e) {
      if (e instanceof DashboardError) {
        if (
          e.code === DashboardErrorCode.SESSION_EXPIRED ||
          e.code === DashboardErrorCode.SESSION_INVALID
        ) {
          logout();
          router.replace('/');
          return;
        }
        setError(e.message);
      } else {
        setError('Unable to load dashboard. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout, router]);

  useEffect(() => {
    void Promise.resolve().then(fetchDashboard);
  }, [fetchDashboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, [fetchDashboard]);

  const isAdmin = isAdminRole(user?.Role);

  const getCountForCard = (field: StatCardConfig['field']): number => {
    return dashboard?.notifications?.[field] ?? 0;
  };

  const renderStatCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={() => (router.push as any)(item.route)}
      activeOpacity={0.75}
    >
      <Ionicons name={item.icon} size={24} color={colors.primary} style={styles.statIcon} />
      {item.field !== undefined ? (
        <Text style={styles.statCount}>
          {loading ? '—' : String(getCountForCard(item.field))}
        </Text>
      ) : null}
      <Text style={[styles.statLabel, item.field === undefined && { marginTop: spacing.sm, fontWeight: '600' }]}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} style={styles.statChevron} />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          {user?.Role ?? '—'} Dashboard
        </Text>
        <Text style={styles.welcomeSub}>
          Welcome, {user?.UserName ?? '—'}!  ·  Global View
        </Text>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchDashboard} style={styles.retryButton} activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !refreshing && (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      )}

      {!loading && !error && (
        <Text style={styles.sectionTitle}>Pending Approvals</Text>
      )}
    </>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {/* Admin / Admin(CEO): administration shortcuts below the pending stats,
          matching the web admin dashboard which shows both. */}
      {isAdmin && !loading && !error && (
        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>Administration</Text>
          <View style={styles.adminGrid}>
            {ADMIN_CARDS.map((item) => (
              <View key={item.label} style={styles.adminGridItem}>
                {renderStatCard({ item })}
              </View>
            ))}
          </View>
        </View>
      )}
      <AppFooter compact />
      <Text style={styles.footerCopyright}>Copyright © Vidya Poshak 2026</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppTopBar variant="menu" onMenuPress={openDrawer} />

      <View style={styles.mainContent}>
        <FlatList
          data={!loading && !error ? STAT_CARDS : []}
          keyExtractor={(item) => item.label}
          renderItem={renderStatCard}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          style={styles.flatList}
        />
      </View>

      <DrawerSidebar
        open={drawerOpen}
        slideAnim={slideAnim}
        backdropAnim={backdropAnim}
        onClose={closeDrawer}
        onNavigate={handleDrawerNavigate}
        onLogout={handleDrawerLogout}
        user={user}
        dashboard={dashboard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  brandContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  drawerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  drawerBrandText: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  topBarIcon: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  welcomeTitle: {
    fontSize: platform.normalize.fontSize.h2,
    lineHeight: platform.normalize.lineHeight.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  welcomeSub: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  statIcon: { marginBottom: spacing.xs },
  statCount: {
    fontSize: platform.normalize.fontSize.h1,
    lineHeight: platform.normalize.lineHeight.h1,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statChevron: { marginTop: spacing.xs },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  skeletonCard: {
    width: '47%',
    height: 100,
    backgroundColor: colors.border,
    borderRadius: 12,
    opacity: 0.5,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: colors.error,
  },
  retryButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.error,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: platform.normalize.fontSize.caption,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerCopyright: {
    fontSize: platform.normalize.fontSize.small,
    lineHeight: platform.normalize.lineHeight.small,
    color: colors.textSecondary,
  },
  adminSection: {
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  adminGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  adminGridItem: {
    width: '48%',
  },
  // ── Drawer ──────────────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.card,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.18, shadowRadius: 16 },
      android: { elevation: 16 },
    }),
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  drawerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  drawerAvatarText: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
  drawerName: {
    fontSize: platform.normalize.fontSize.h3,
    lineHeight: platform.normalize.lineHeight.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  drawerRole: {
    fontSize: platform.normalize.fontSize.body,
    lineHeight: platform.normalize.lineHeight.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  drawerDistrict: {
    fontSize: platform.normalize.fontSize.caption,
    lineHeight: platform.normalize.lineHeight.caption,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    textAlign: 'center',
  },
  drawerNav: { flex: 1, paddingTop: spacing.sm },
  drawerSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.md,
    minHeight: 48,
  },
  drawerItemLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  drawerBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  drawerBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  quickActionLabel: {
    flex: 1,
    fontSize: platform.normalize.fontSize.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
