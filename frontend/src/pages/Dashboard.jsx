import { useState, useEffect } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async (page = 1, status = 'all') => {
        setLoading(true);
        try {
            const response = await api.get(`/tasks?page=${page}&limit=5&status=${status}`);
            setTasks(response.data.data);
            setTotalPages(response.data.meta.totalPages);
            setCurrentPage(response.data.meta.page);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(currentPage, filterStatus);
    }, [currentPage, filterStatus]);

    const addTask = async (taskData) => {
        try {
            await api.post('/tasks', taskData);
            fetchTasks(currentPage, filterStatus); // Refresh list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            await api.put(`/tasks/${id}`, { status });
            fetchTasks(currentPage, filterStatus); // Refresh to respect filters
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            if (tasks.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                fetchTasks(currentPage, filterStatus);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    return (
        <div className="container">
            <h2>My Tasks</h2>
            <TaskForm onTaskAdded={addTask} />
            
            <div className="controls" style={{ margin: '1rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label>
                    Filter by Status:
                    <select value={filterStatus} onChange={handleFilterChange} style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </label>
            </div>

            <div className="card">
                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found.</p>
                ) : (
                    <>
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onUpdate={updateTaskStatus}
                                onDelete={deleteTask}
                            />
                        ))}
                        
                        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
