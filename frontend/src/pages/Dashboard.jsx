import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('/api/user-role');
                setRole(response.data.role);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {role === 'admin' && <AdminDashboard />}
            {role === 'user' && <UserDashboard />}
        </div>
    );
};

export default Dashboard;