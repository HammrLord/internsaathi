'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import initialJobs from '@/data/jobs';

const JobsContext = createContext();

export function JobsProvider({ children }) {
    const [jobs, setJobs] = useState(initialJobs);

    // Load from API on mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                } else {
                    console.error("Failed to fetch jobs");
                }
            } catch (error) {
                console.error("Error loading jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const addJob = async (newJob) => {
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob)
            });

            if (res.ok) {
                const savedJob = await res.json();
                setJobs((prevJobs) => [savedJob, ...prevJobs]);
            } else {
                console.error("Failed to add job");
                // Fallback for demo if API fails? No, better to show error or just log.
                // For MVP speed, just log.
                alert("Failed to save job to server.");
            }
        } catch (error) {
            console.error("Error adding job:", error);
            alert("Error saving job.");
        }
    };

    const deleteJob = async (id) => {
        try {
            const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
            } else {
                console.error("Failed to delete job");
                alert("Failed to delete job");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Error deleting job");
        }
    };

    return (
        <JobsContext.Provider value={{ jobs, addJob, deleteJob }}>
            {children}
        </JobsContext.Provider>
    );
}

export function useJobs() {
    return useContext(JobsContext);
}
