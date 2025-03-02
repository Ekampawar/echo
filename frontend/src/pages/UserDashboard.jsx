import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
    const [profile, setProfile] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profileResponse = await axios.get('/api/user/profile');
                const blogsResponse = await axios.get('/api/user/blogs');
                setProfile(profileResponse.data);
                setBlogs(blogsResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>User Dashboard</h2>
            <div>
                <h3>Profile</h3>
                <p>Username: {profile.username}</p>
                <p>Email: {profile.email}</p>
                <img src={profile.profilePhoto} alt="Profile" width="100" />
            </div>
            <div>
                <h3>Your Blogs</h3>
                {blogs.map((blog) => (
                    <div key={blog._id}>
                        <h4>{blog.title}</h4>
                        <p>{blog.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;