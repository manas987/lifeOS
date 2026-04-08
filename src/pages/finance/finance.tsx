import { Outlet } from "react-router-dom";
import { FinanceSideBar } from "./finsidebar";
import { Mycontext } from "@/context/AppContext";
import { useContext } from "react";

export function Finances() {
  const { finance } = useContext(Mycontext);
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
  } = finance;
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
        <Outlet context={finance} />
      </div>
    </div>
  );
}
