import React from "react";

import { ActionType, ExtendedBankInfo } from "@mrgnlabs/marginfi-v2-ui-state";
import { MarginfiAccountWrapper } from "@mrgnlabs/marginfi-client-v2";

import { RepayType, YbxType } from "~/utils";
import { useActionBoxStore } from "~/hooks/useActionBoxStore";
import { useMrgnlendStore, useUiStore } from "~/store";

import { Input } from "~/components/ui/input";
import { ActionBoxTokens } from "~/components/common/ActionBox/components";

import { InputHeader } from "./Components";
import { InputAction } from "./Components/InputAction";
import { useConnection } from "~/hooks/useConnection";
import { YbxInput } from "./Components/YbxInput";
import { ActiveGroup } from "~/store/tradeStore";

type ActionBoxInputProps = {
  walletAmount: number | undefined;
  amountRaw: string;
  maxAmount: number;
  selectedAccount: MarginfiAccountWrapper | null;
  showCloseBalance?: boolean;
  isDialog?: boolean;
  isTokenSelectable?: boolean;
  tokensOverride?: ExtendedBankInfo[];
  activeGroup: ActiveGroup | null;
};

export const ActionBoxInput = ({
  walletAmount,
  maxAmount,
  showCloseBalance,
  selectedAccount,
  isDialog,
  isTokenSelectable,
  tokensOverride,
  activeGroup,
}: ActionBoxInputProps) => {
  const [isActionBoxInputFocussed, platformFeeBps, setIsActionBoxInputFocussed, priorityFee] = useUiStore((state) => [
    state.isActionBoxInputFocussed,
    state.platformFeeBps,
    state.setIsActionBoxInputFocussed,
    state.priorityFee,
  ]);
  const [
    actionMode,
    repayMode,
    ybxMode,
    selectedBank,
    selectedRepayBank,
    amountRaw,
    repayAmountRaw,
    selectedStakingAccount,
    setAmountRaw,
    setRepayAmountRaw,
    setSelectedBank,
    setRepayBank,
    setRepayMode,
    setActionMode,
  ] = useActionBoxStore(isDialog)((state) => [
    state.actionMode,
    state.repayMode,
    state.ybxMode,
    state.selectedBank,
    state.selectedRepayBank,
    state.amountRaw,
    state.repayAmountRaw,
    state.selectedStakingAccount,
    state.setAmountRaw,
    state.setRepayAmountRaw,
    state.setSelectedBank,
    state.setRepayBank,
    state.setRepayMode,
    state.setActionMode,
  ]);

  const { connection } = useConnection();

  const amountInputRef = React.useRef<HTMLInputElement>(null);

  const showYbxInput = React.useMemo(
    () => actionMode === ActionType.MintYBX && (ybxMode === YbxType.AddCollat || ybxMode == YbxType.WithdrawCollat),
    [actionMode, ybxMode]
  );

  const numberFormater = React.useMemo(() => new Intl.NumberFormat("en-US", { maximumFractionDigits: 10 }), []);

  const isInputDisabled = React.useMemo(
    () => (maxAmount === 0 && !showCloseBalance) || !!selectedStakingAccount,
    [maxAmount, showCloseBalance, selectedStakingAccount]
  );

  const isRepayWithCollat = React.useMemo(
    () => actionMode === ActionType.Repay && repayMode === RepayType.RepayCollat,
    [actionMode, repayMode]
  );

  const inputAmount = React.useMemo(() => {
    if (isRepayWithCollat) {
      return repayAmountRaw;
    } else {
      return amountRaw;
    }
  }, [repayAmountRaw, amountRaw, isRepayWithCollat]);

  const formatAmount = React.useCallback(
    (newAmount: string, bank: ExtendedBankInfo | null) => {
      let formattedAmount: string, amount: number;
      // Remove commas from the formatted string
      const newAmountWithoutCommas = newAmount.replace(/,/g, "");
      let decimalPart = newAmountWithoutCommas.split(".")[1];
      const mintDecimals = bank?.info.state.mintDecimals ?? 9;

      if (
        (newAmount.endsWith(",") || newAmount.endsWith(".")) &&
        !newAmount.substring(0, newAmount.length - 1).includes(".")
      ) {
        amount = isNaN(Number.parseFloat(newAmountWithoutCommas)) ? 0 : Number.parseFloat(newAmountWithoutCommas);
        formattedAmount = numberFormater.format(amount).concat(".");
      } else {
        const isDecimalPartInvalid = isNaN(Number.parseFloat(decimalPart));
        if (!isDecimalPartInvalid) decimalPart = decimalPart.substring(0, mintDecimals);
        decimalPart = isDecimalPartInvalid
          ? ""
          : ".".concat(Number.parseFloat("1".concat(decimalPart)).toString().substring(1));
        amount = isNaN(Number.parseFloat(newAmountWithoutCommas)) ? 0 : Number.parseFloat(newAmountWithoutCommas);
        formattedAmount = numberFormater.format(amount).split(".")[0].concat(decimalPart);
      }

      if (amount > maxAmount) {
        return numberFormater.format(maxAmount);
      } else {
        return formattedAmount;
      }
    },
    [maxAmount, numberFormater]
  );

  const handleInputChange = React.useCallback(
    (newAmount: string) => {
      if (isRepayWithCollat) {
        if (selectedAccount)
          setRepayAmountRaw(
            selectedAccount,
            formatAmount(newAmount, selectedRepayBank),
            connection,
            platformFeeBps,
            priorityFee
          );
      } else {
        setAmountRaw(formatAmount(newAmount, selectedBank));
      }
    },
    [
      isRepayWithCollat,
      selectedAccount,
      setRepayAmountRaw,
      formatAmount,
      selectedRepayBank,
      connection,
      platformFeeBps,
      setAmountRaw,
      selectedBank,
    ]
  );

  return (
    <>
      {/* Contains 'max' button and input title */}
      <InputHeader
        isDialog={isDialog}
        changeRepayType={(type) => setRepayMode(type)}
        changeActionType={(type) => setActionMode(type)}
      />
      {showYbxInput ? (
        <YbxInput
          isDialog={isDialog}
          maxAmount={maxAmount}
          setAmountRaw={(amount) => setAmountRaw(formatAmount(amount, selectedBank))}
        />
      ) : (
        <div className="bg-accent rounded-lg p-2.5 mb-6">
          <div className="flex justify-center gap-1 items-center font-medium text-3xl">
            <div className="w-full flex-auto max-w-[162px]">
              <ActionBoxTokens
                isDialog={isDialog}
                setRepayTokenBank={(tokenBank) => {
                  setRepayBank(tokenBank);
                }}
                setTokenBank={(tokenBank) => {
                  setSelectedBank(tokenBank);
                }}
                tokensOverride={tokensOverride}
                isTokenSelectable={isTokenSelectable}
                activeGroup={activeGroup}
              />
            </div>
            <div className="flex-auto">
              <Input
                type="text"
                ref={amountInputRef}
                inputMode="decimal"
                value={inputAmount}
                disabled={isInputDisabled}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsActionBoxInputFocussed(true)}
                onBlur={() => setIsActionBoxInputFocussed(false)}
                placeholder="0"
                className="bg-transparent shadow-none min-w-[130px] text-right outline-none focus-visible:outline-none focus-visible:ring-0 border-none text-base font-medium"
              />
            </div>
          </div>
          <InputAction
            walletAmount={walletAmount}
            maxAmount={maxAmount}
            isDialog={isDialog}
            onSetAmountRaw={(amount) => handleInputChange(amount)}
          />
        </div>
      )}
    </>
  );
};
