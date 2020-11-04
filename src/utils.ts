export default function getAuthInfo() {
	const authInfo = localStorage.getItem("authInfo");
	return authInfo ? JSON.parse(authInfo) : null;
}
