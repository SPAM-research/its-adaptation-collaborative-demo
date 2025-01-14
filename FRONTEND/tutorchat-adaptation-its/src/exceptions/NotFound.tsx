import { Link } from "react-router-dom";
import "../styles/NotFound.css";
import Avatar from "@mui/material/Avatar";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
export default function NotFound() {
	return (
		<main className="main-container">
			<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
				<ErrorOutlineOutlinedIcon />
			</Avatar>
			<div className="content-container">
				<h1 className="title">404 Page not found</h1>
				<p className="description">
					Sorry, we couldn’t find the page you’re looking for.
				</p>
				<div className="button-container">
					<Link to="/hints/" className="back-home-button">
						Go back home
					</Link>
				</div>
			</div>
		</main>
	);
}
