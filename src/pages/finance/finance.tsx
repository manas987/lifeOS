import { Outlet } from "react-router-dom";
import { FinanceSideBar } from "./finsidebar";
import { useFinanceLogic } from "./logic/logic";

export function Finances() {
  const logic = useFinanceLogic();
  const {
    addTransaction,
    categories,
    addCategory,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    updateCategory,
    deleteCategory,
    transactions,
  } = logic;
  return (
    <div className="flex">
      <FinanceSideBar
        addTransaction={addTransaction}
        categories={categories}
        addcategory={addCategory}
        accounts={accounts}
        addAccount={addAccount}
        transactions={transactions}
        updateAccount={updateAccount}
        deleteAccount={deleteAccount}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
      />
      <div className="flex-1 p-4 pl-9 overflow-visible">
        {/*/holy min width dont touch even god doesnt know how it works */}
        <Outlet context={logic} />
      </div>
    </div>
  );
}
