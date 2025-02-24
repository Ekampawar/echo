import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <h2>Welcome, {user?.username}</h2>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default UserDashboard;