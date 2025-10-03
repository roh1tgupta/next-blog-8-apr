import { authorInfo, Project } from '@/lib/author';
import BgArt1 from './svgs/BgArt1';
import BgArt from './svgs/BgArt';

export default function AboutAuthor() {
  return (
    <div id="precision_media_about" className="font-sans bg-white">
      <div className="relative">
        {/* Hero Section */}
        <div style={{ 'clipPath': 'polygon(0% 100%, 100% 70%, 100% 0%, 0% 0%)' }}
          className="bg-blue-700 clip-path-polygon w-full h-full absolute top-0 left-0 flex">

          <div>
            <BgArt1 />
          </div>
          <div className="w-full pl-16">
            <BgArt />
          </div>
        </div>

        <div style={{ 'clipPath': 'polygon(0% 100%, 100% 16px, 100% 0%, 0% calc(100% - 16px))' }}
          className="bg-blue-400 clip-path-polygon w-full h-[calc(30%+16px)] absolute bottom-[-16px] left-0"></div>

        <div className="relative px-[144px] pt-20 pb-32">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <h1 className="text-white text-5xl font-extrabold mb-4">About the Author</h1>
              <p className="text-[#B8C9FB] text-gray-50 text-lg font-medium leading-7">
                {authorInfo.summary_one}
              </p>
              <br />
              <p className="text-[#B8C9FB] text-gray-50 text-lg font-medium leading-7">
                {authorInfo.summary_two}
              </p>
            </div>
            <div className="col-span-4 flex flex-col justify-center items-end">
              <div className="bg-white rounded-lg p-6 shadow-lg w-full invisible">
                <h3 className="text-[#0E2656] text-xl font-bold mb-2">Education</h3>
                <p className="text-[#565757]">
                  {authorInfo.education.degree} in {authorInfo.education.field}
                </p>
                <p className="text-[#565757]">
                  {authorInfo.education.university}, {authorInfo.education.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Set Section */}
      <div className="px-[144px] mb-20">
        <p className="text-center text-[#0E2656] text-4xl font-bold mb-4">Professional Skills</p>
        <p className="text-center text-[#565757] text-lg font-medium leading-7 max-w-4xl mx-auto">
          Comprehensive expertise across multiple technology domains
        </p>

        <div className="grid grid-cols-12 gap-6 mt-12">
          <div className="col-span-4 bg-white shadow-lg rounded-[30px] p-8">
            <h3 className="text-xl font-bold text-[#0E2656] mb-4">Programming Languages</h3>
            <ul className="space-y-2 text-[#565757]">
              {authorInfo.skills.programming.map((skill) => (
                <li key={skill} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 bg-white shadow-lg rounded-[30px] p-8">
            <h3 className="text-xl font-bold text-[#0E2656] mb-4">Web Technologies</h3>
            <ul className="space-y-2 text-[#565757]">
              {authorInfo.skills.webTechnologies.map((skill) => (
                <li key={skill} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 bg-white shadow-lg rounded-[30px] p-8">
            <h3 className="text-xl font-bold text-[#0E2656] mb-4">Tools & Platforms</h3>
            <ul className="space-y-2 text-[#565757]">
              {authorInfo.skills.tools.map((skill) => (
                <li key={skill} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="px-[144px] mb-20">
        <p className="text-center text-[#0E2656] text-4xl font-bold mb-4">Recent Projects</p>
        <p className="text-center text-[#565757] text-lg font-medium leading-7 max-w-4xl mx-auto">
          Highlighting key contributions and technical implementations
        </p>

        <div className="space-y-12 mt-12">
          {authorInfo.projects.map((project: Project) => (
            <div key={project.title} className="grid grid-cols-12 gap-6">
              <div className="col-span-5 bg-white shadow-lg rounded-[30px] p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#0E2656] mb-2">{project.title}</h3>
                <p className="text-[#565757] italic mb-4">{project.duration}</p>
                <p className="text-[#565757] mb-4">{project.description}</p>
              </div>

              <div className="col-span-7 bg-white shadow-lg rounded-[30px] p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-[#0E2656] mb-3">Tech Stack</h4>
                    <ul className="space-y-2 text-[#565757]">
                      {project.techStack.map((tech) => (
                        <li key={tech} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#0E2656] mb-3">Responsibilities</h4>
                    <ul className="space-y-2 text-[#565757]">
                      {project.responsibilities.map((resp) => (
                        <li key={resp} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-4 border-blue-400">
        <div className="bg-blue-700 text-white py-12 px-[144px]">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">Connect with Me</p>
              <p className="mt-2"><span className='font-bold'>Email</span>: <span className='text-gray-100'>{authorInfo.email} </span> </p>
            </div>
            <div>
              <p className="text-lg">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';