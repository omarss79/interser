// En alguna de tus páginas, por ejemplo: app/dashboard/accounts/page.jsx

import BankAccountsManager from "@/lib/features/BankAccounts";

export default function AccountsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Cuentas Bancarias</h1>
      <BankAccountsManager />
    </div>
  );
}
