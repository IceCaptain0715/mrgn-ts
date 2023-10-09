import React, { FC } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { groupedNumberFormatterDyn } from "@mrgnlabs/mrgn-common";
import { LeaderboardRow } from "@mrgnlabs/marginfi-v2-ui-state";

interface PointsLeaderBoardProps {
  leaderboardData: LeaderboardRow[];
  currentUserId?: string;
}

export const PointsLeaderBoard: FC<PointsLeaderBoardProps> = ({ leaderboardData, currentUserId }) => {
  return (
    <TableContainer component={Paper} className="h-full w-4/5 sm:w-full bg-[#131619] rounded-xl overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              className="text-white text-base font-aeonik border-none pl-2"
              style={{ fontWeight: 500 }}
            >
              Rank
            </TableCell>
            <TableCell className="text-white text-base font-aeonik border-none" style={{ fontWeight: 500 }}>
              User
            </TableCell>
            <TableCell
              className="text-white text-base font-aeonik border-none"
              align="right"
              style={{ fontWeight: 500 }}
            >
              Lending Points
            </TableCell>
            <TableCell
              className="text-white text-base font-aeonik border-none"
              align="right"
              style={{ fontWeight: 500 }}
            >
              Borrowing Points
            </TableCell>
            <TableCell
              className="text-white text-base font-aeonik border-none"
              align="right"
              style={{ fontWeight: 500 }}
            >
              Referral Points
            </TableCell>
            <TableCell
              className="text-white text-base font-aeonik border-none"
              align="right"
              style={{ fontWeight: 500 }}
            >
              Social Points
            </TableCell>
            <TableCell
              className="text-white text-base font-aeonik border-none"
              align="right"
              style={{ fontWeight: 500 }}
            >
              Total Points
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboardData.map((row: LeaderboardRow, index: number) => (
            <TableRow key={row.id} className={`${row.id === currentUserId ? "glow" : ""}`}>
              <TableCell
                align="center"
                className={`${index <= 2 ? "text-2xl" : "text-base"} border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
              >
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
              </TableCell>
              <TableCell
                className={`text-base border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
                style={{ fontWeight: 400 }}
              >
                <a
                  href={`https://solscan.io/account/${row.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                  className="hover:text-[#7fff00]"
                >
                  {`${row.id.slice(0, 5)}...${row.id.slice(-5)}`}
                  <style jsx>{`
                    a:hover {
                      text-decoration: underline;
                    }
                  `}</style>
                </a>
              </TableCell>
              <TableCell
                align="right"
                className={`text-base border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
                style={{ fontWeight: 400 }}
              >
                {groupedNumberFormatterDyn.format(Math.round(row.total_activity_deposit_points))}
              </TableCell>
              <TableCell
                align="right"
                className={`text-base border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
                style={{ fontWeight: 400 }}
              >
                {groupedNumberFormatterDyn.format(Math.round(row.total_activity_borrow_points))}
              </TableCell>
              <TableCell
                align="right"
                className={`text-base border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
                style={{ fontWeight: 400 }}
              >
                {groupedNumberFormatterDyn.format(
                  Math.round(row.total_referral_deposit_points + row.total_referral_borrow_points)
                )}
              </TableCell>
              <TableCell
                align="right"
                className={`text-base border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
                style={{ fontWeight: 400 }}
              >
                {groupedNumberFormatterDyn.format(Math.round(row.socialPoints ? row.socialPoints : 0))}
              </TableCell>
              <TableCell
                align="right"
                className={`text-base border-none font-aeonik ${
                  row.id === currentUserId ? "text-[#DCE85D]" : "text-white"
                }`}
                style={{ fontWeight: 400 }}
              >
                {groupedNumberFormatterDyn.format(
                  Math.round(
                    row.total_deposit_points + row.total_borrow_points + (row.socialPoints ? row.socialPoints : 0)
                  )
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};