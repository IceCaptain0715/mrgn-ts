import React from "react";

import Image from "next/image";

import { ActionType } from "@mrgnlabs/marginfi-v2-ui-state";
import { numeralFormatter, usdFormatter } from "@mrgnlabs/mrgn-common";

import { getTokenImageURL } from "~/utils";
import { useTradeStore } from "~/store";

import { ActionBoxDialog } from "~/components/common/ActionBox";
import { Table, TableBody, TableHead, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export const PositionList = () => {
  const [initialized, selectedAccount, banks, banksIncludingUSDC] = useTradeStore((state) => [
    state.initialized,
    state.selectedAccount,
    state.banks,
    state.banksIncludingUSDC,
  ]);

  if (!initialized || !selectedAccount) return null;
  return (
    <div className="rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Position</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>USD Value</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Liquidation price</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banks.map((bank, index) => {
            if (!bank.isActive) return null;

            const collateralBank = banksIncludingUSDC.find((bank, i) => {
              if (!bank || i === banksIncludingUSDC.length - 1) return false;
              return bank.address.equals(bank.address);
            });

            return (
              <TableRow key={index} className="even:bg-background-gray hover:even:bg-background-gray">
                <TableCell>
                  {bank.position.isLending ? (
                    <Badge className="bg-success uppercase font-medium">long</Badge>
                  ) : (
                    <Badge>short</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Image
                      src={getTokenImageURL(bank.meta.tokenSymbol)}
                      width={24}
                      height={24}
                      alt={bank.meta.tokenSymbol}
                      className="rounded-full"
                    />{" "}
                    {bank.meta.tokenSymbol}
                  </div>
                </TableCell>
                <TableCell>{bank.position.amount < 0.01 ? "0.01" : numeralFormatter(bank.position.amount)}</TableCell>
                <TableCell>{usdFormatter.format(bank.position.usdValue)}</TableCell>
                <TableCell>{usdFormatter.format(bank.info.oraclePrice.priceRealtime.price.toNumber())}</TableCell>
                <TableCell>
                  {bank.position.liquidationPrice ? (
                    <>
                      {bank.position.liquidationPrice > 0.01
                        ? usdFormatter.format(bank.position.liquidationPrice)
                        : `$${bank.position.liquidationPrice.toExponential(2)}`}
                    </>
                  ) : (
                    "n/a"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2">
                    {collateralBank && (
                      <ActionBoxDialog requestedAction={ActionType.Deposit} requestedBank={collateralBank}>
                        <Button variant="secondary" size="sm">
                          Add collateral
                        </Button>
                      </ActionBoxDialog>
                    )}
                    <Button variant="destructive" size="sm">
                      Close position
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};