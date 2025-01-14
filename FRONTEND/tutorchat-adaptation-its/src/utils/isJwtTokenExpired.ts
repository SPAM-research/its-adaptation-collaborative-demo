export function isJwtTokenExpired(token: string) {
	try {
		const decodedJwt = JSON.parse(atob(token.split(".")[1]));
		return decodedJwt.exp * 1000 < Date.now();
	} catch (e) {
		return true;
	}
}
