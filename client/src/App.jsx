import { useState } from 'react'
import axios from "axios"
import WelcomeBanner from './components/WelcomeBanner.jsx'
import SearchBar from './components/SearchBar.jsx'
import ResumeUpload from './components/ResumeUpload.jsx'
import JobCard from './components/JobCard.jsx'


function App() {
  const [jobs, setJobs] = useState([])
  const handleSearch = async ({ query, location, source }) => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/jobs/search", {
        params: {
          query,
          location,
          source,
        }
      });

      console.log("🚀 ~ handleSearch ~ res:", res.data)
      const foundJobs = res.data?.data?.jobs || []
      setJobs(foundJobs)
    } catch (err) {
      console.error("Search failed:", err)
      setJobs([])
    }
  }
  return (
    <>
    <br />

      <WelcomeBanner />
      <SearchBar onSearch={handleSearch}/>
      <ResumeUpload onJobsFetched={setJobs} />

      <div className="mt-6 ml-60 mr-60 mb-6 space-y-4">
        {console.log("🚀 ~ App ~ jobs:", jobs)}
        {jobs.length > 0 ? (
          jobs.map((job, index) => <JobCard key={index} job={job} />)
        ) : (
          <p className="text-gray-500 text-center">No Jobs to display, Search/Upload Resume to Explore Jobs</p>
        )}
      </div>
    </>
  )
}

export default App
