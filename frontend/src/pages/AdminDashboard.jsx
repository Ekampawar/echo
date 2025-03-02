import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const usersResponse = await axios.get('/api/admin/users');
                const blogsResponse = await axios.get('/api/admin/blogs');
                setUsers(usersResponse.data);
                setBlogs(blogsResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin! Here you can manage users, blogs, and more.</p>
            <div>
                <h3>Users</h3>
                {users.map((user) => (
                    <div key={user._id}>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        {/* Add buttons for updating role, banning user, etc. */}
                    </div>
                ))}
            </div>
            <div>
                <h3>Blogs</h3>
                {blogs.map((blog) => (
                    <div key={blog._id}>
                        <h4>{blog.title}</h4>
                        <p>{blog.content}</p>
                        <p>Author: {blog.author.username}</p>
                        {/* Add buttons for updating or deleting blog */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;