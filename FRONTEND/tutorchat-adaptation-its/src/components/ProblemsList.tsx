import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { IProblem } from "../interfaces/IProblem";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import React from "react";
import Pagination from "@mui/material/Pagination"; // Importamos el componente de paginación

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.success.main,
		color: theme.palette.common.white,
		fontSize: 18,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 16,
		alignItems: "center",
	},
}));

const StyledTableRow = styled(TableRow)(() => ({
	"&:last-child td, &:last-child th": {
		border: 0,
	},
	cursor: "pointer",
}));

const abbreviateText = (text: string) => {
	if (text.length < 42) return text;
	else return text.substring(0, 20) + "...";
};

interface IProblemRow {
	row: IProblem;
	handleOnClick: any;
}

function Row({ row, handleOnClick }: Readonly<IProblemRow>) {
	const [open, setOpen] = React.useState(true);
	return (
		<React.Fragment>
			<StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<StyledTableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon />
						)}
					</IconButton>
				</StyledTableCell>
				<StyledTableCell
					component="th"
					scope="row"
					onClick={() => handleOnClick(row.id)}>
					{row.id}
				</StyledTableCell>
				<StyledTableCell
					align="right"
					onClick={() => handleOnClick(row.id)}>
					{row.name}
				</StyledTableCell>
				{/* <StyledTableCell
					align="right"
					onClick={() => handleOnClick(row.id)}>
					{abbreviateText(row.texts[0].text)}
				</StyledTableCell> */}
			</StyledTableRow>
			<TableRow>
				<StyledTableCell
					style={{ paddingBottom: 0, paddingTop: 0 }}
					colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
					<Box 
						sx={{ 
							margin: 1, 
							padding: 2, 
							backgroundColor: "#f9f9f9", 
							borderRadius: "8px", 
							boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" 
						}}
					>
						<Typography 
							variant="h6" 
							gutterBottom 
							component="div" 
							sx={{ fontWeight: "bold", color: "#4caf50" }}
						>
							PROBLEM STATEMENT
						</Typography>
						<Typography 
							variant="body1" 
							component="p" 
							sx={{ color: "#333", lineHeight: 1.6 }}
						>
							{row.texts[0].text}
						</Typography>
					</Box>
					</Collapse>
				</StyledTableCell>
			</TableRow>
		</React.Fragment>
	);
}

export default function ProblemsList({ handleOnClick }) {
	const [rows, setRows] = useState<Array<IProblem>>([{"id": 0, "name": "How many potatoes?", "texts": [{"id": 0, "language": "english", "text": "We have two containers with 396 kg and 117 kg of potatoes, respectively. For sale, they must be packaged in bags containing 9 kg each. How many bags will be needed?"}]  }]);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(1);
	const totalItems = 1;

	return (
		<div style={{ width: "100%" }}>
			<TableContainer component={Paper}>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<StyledTableCell />
							<StyledTableCell align="left">ID</StyledTableCell>
							<StyledTableCell align="right">
								Name
							</StyledTableCell>
							{/* <StyledTableCell align="center">
								Problem Statement
							</StyledTableCell> */}
							<StyledTableCell align="left"></StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row) => (
								<Row
									row={row}
									handleOnClick={handleOnClick}
									key={row.id}
								/>
							))
						) : (
							<StyledTableRow>
								<StyledTableCell colSpan={5} align="center">
									No data available
								</StyledTableCell>
							</StyledTableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Pagination
				count={Math.ceil(totalItems / pageSize)}
				page={page}
				color="primary"
				style={{
					marginTop: "20px",
					display: "flex",
					justifyContent: "center",
				}}
			/>
		</div>
	);
}
