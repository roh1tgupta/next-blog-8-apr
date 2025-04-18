import { authorInfo, Project } from '@/lib/author';

export default function AboutAuthor() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-primary mb-6">About the Author</h1>

      {/* Professional Summary */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Professional Summary</h2>
        <p className="text-secondary">{authorInfo.summary}</p>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Education</h2>
        <p className="text-secondary">
          {authorInfo.education.degree} in {authorInfo.education.field}
          <br />
          {authorInfo.education.university}, {authorInfo.education.location}
        </p>
      </section>

      {/* Skill Set */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Skill Set</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-secondary">
          <div>
            <h3 className="font-medium">Programming Languages/Frameworks</h3>
            <ul className="list-disc list-inside">
              {authorInfo.skills.programming.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Web Technologies</h3>
            <ul className="list-disc list-inside">
              {authorInfo.skills.webTechnologies.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Tools & Platforms</h3>
            <ul className="list-disc list-inside">
              {authorInfo.skills.tools.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Recent Projects</h2>
        <div className="space-y-8">
          {authorInfo.projects.map((project: Project) => (
            <div key={project.title}>
              <h3 className="text-xl font-medium text-accent">{project.title}</h3>
              <p className="text-secondary italic">{project.duration}</p>
              <p className="text-secondary">{project.description}</p>
              <h4 className="font-medium mt-2">Tech Stack:</h4>
              <ul className="list-disc list-inside text-secondary">
                {project.techStack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <h4 className="font-medium mt-2">Responsibilities:</h4>
              <ul className="list-disc list-inside text-secondary">
                {project.responsibilities.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const dynamic = 'force-static';