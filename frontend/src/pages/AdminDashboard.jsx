import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance";  // Import your custom axios instance

const AdminDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login if no token is found
        }

        axiosInstance
            .get("/auth/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setUserData(response.data);
            })
            .catch(() => {
                navigate("/login"); // Redirect to login if error occurs
            });

        // Fetch all users (admin feature)
        axiosInstance
            .get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setUsersList(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch users:", error);
            });
    }, [navigate]);

    return (
        <div className="dashboard">
            <h2>Welcome to Admin Dashboard</h2>
            {userData ? (
                <div>
                    <h3>Admin Information</h3>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                    {/* Add more admin-specific features */}
                </div>
            ) : (
                <p>Loading admin data...</p>
            )}

            <h3>Manage Users</h3>
            {usersList.length > 0 ? (
                <ul>
                    {usersList.map((user) => (
                        <li key={user.id}>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            {/* Add actions like Edit, Delete for admin */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default AdminDashboard;
