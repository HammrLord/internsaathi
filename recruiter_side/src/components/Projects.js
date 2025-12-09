'use client';

import { ExternalLink, Github, Folder } from 'lucide-react';

export default function Projects({ projects }) {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Projects</h2>
            <div className="grid gap-4">
                {projects.map((project, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Folder size={18} className="text-primary" />
                                {project.title}
                            </h3>
                            <div className="flex gap-2">
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                                        <Github size={18} />
                                    </a>
                                )}
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
