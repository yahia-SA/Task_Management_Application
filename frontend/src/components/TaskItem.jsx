const TaskItem = ({ task, onUpdate, onDelete }) => {
    const getStatusBadge = (status) => {
        const styles = {
            pending: { color: '#f59e0b', fontWeight: 'bold' },
            in_progress: { color: '#3b82f6', fontWeight: 'bold' },
            done: { color: '#10b981', fontWeight: 'bold' }
        };
        const labels = {
            pending: 'Pending',
            in_progress: 'In Progress',
            done: 'Done'
        };
        return <span style={styles[status] || {}}>{labels[status] || status}</span>;
    };

    return (
        <div className="task-item">
            <div>
                <h4 style={{ margin: '0 0 0.5rem 0', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                    {task.title}
                </h4>
                <p style={{ margin: 0, color: '#666' }}>{task.description}</p>
                <small>Status: {getStatusBadge(task.status)}</small>
            </div>
            <div className="task-actions">
                {task.status === 'pending' && (
                    <button 
                        onClick={() => onUpdate(task.id, 'in_progress')}
                        style={{ backgroundColor: '#3b82f6' }}
                    >
                        Start
                    </button>
                )}
                {task.status === 'in_progress' && (
                    <button 
                        onClick={() => onUpdate(task.id, 'done')}
                        style={{ backgroundColor: '#10b981' }}
                    >
                        Complete
                    </button>
                )}
                {task.status === 'done' && (
                    <button 
                        className="secondary"
                        onClick={() => onUpdate(task.id, 'pending')}
                    >
                        Reopen
                    </button>
                )}
                <button className="danger" onClick={() => onDelete(task.id)}>Delete</button>
            </div>
        </div>
    );
};

export default TaskItem;
