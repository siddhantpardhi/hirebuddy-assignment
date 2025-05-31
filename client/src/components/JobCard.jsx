import React from 'react'

const JobCard = ({ job }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mb-6 border border-gray-100 hover:shadow-lg transition-all">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-800">{job.job_title}</h2>
        <p className="text-sm text-gray-600">{job.company_name} • {job.job_location}</p>
        <p className="text-sm text-gray-500 line-clamp-3">{job.description}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            {job.source}
          </span>
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Apply
          </a>
        </div>
      </div>
    </div>
  )
}

export default JobCard
