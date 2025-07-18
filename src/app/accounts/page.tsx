import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
import AccountTable from '@/features/accounts/components/AccountTable';
import AccountForm from '@/features/accounts/components/AccountForm';
import type { AccountDTO } from '@/features/accounts/services/accountsService';

export default function AccountsPage() {
  const { accounts, refresh } = useAccounts();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<(AccountDTO & { id?: string }) | null>(null);

  const handleEdit = (account: AccountDTO & { id: string }) => {
    setEditData(account);
    setOpen(true);
  };

  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <Header
        periodInfo={{ periodLabel: 'Contas', productLabel: '' }}
        totals={{ revenue: 0, profit: 0, expenses: 0, refunds: 0 }}
      />
      <Button onClick={() => setOpen(true)}>Nova Conta</Button>
      <AccountTable data={accounts} onRefresh={refresh} onEdit={handleEdit} />
      <AccountForm open={open} onClose={handleClose} onSuccess={refresh} initialData={editData || undefined} />
    </DashboardLayout>
  );
} 