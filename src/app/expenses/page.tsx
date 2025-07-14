export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Despesas</h1>
        <p className="text-gray-600 mb-6">
          Gerencie suas despesas e mantenha o controle dos seus gastos.
        </p>
        
        <div className="text-center text-gray-500 py-12">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-xl font-semibold mb-2">Nenhuma despesa registrada</h2>
          <p className="text-sm">Adicione sua primeira despesa para começar</p>
        </div>
      </div>
    </div>
  );
} 