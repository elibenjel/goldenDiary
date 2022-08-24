const NoOp = ({ children }) => <>{children}</>;
const NoHook = () => ({});

const DiaryProvider = NoOp;
const SpendingProvider = NoOp;
const useDiary = () => null;

const useSpendingActions = NoHook;
const useSpendingHistory = NoHook;

export { DiaryProvider, useDiary };
export { SpendingProvider, useSpendingHistory, useSpendingActions };