import React, { useState, useRef, useEffect, useCallback } from "react"
import axios from "axios"
import { backendURL } from "../constants"

const ResumeUpload = ({ onJobsFetched }) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    // const [loadingMore, setLoadingMore] = useState(false)
    const [predictedRole, setPredictedRole] = useState("")
    const [jobs, setJobs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMoreJobs, setHasMoreJobs] = useState(false)
    const sentinelRef = useRef(null)
    const formDataRef = useRef(null)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    };

    const handleUpload = async () => {
        if (!file) return alert("Please upload a PDF file")

        const formData = new FormData()
        formData.append("resume", file)
        formDataRef.current = formData

        setLoading(true)
        setPredictedRole("")
        setJobs([])
        setCurrentPage(1)
        setHasMoreJobs(false)

        try {
            const res = await axios.post(`${backendURL}/api/v1/jobs/resume`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            console.log("🚀 ~ handleUpload ~ res:", res)

            const jobData = res.data.data.jobResp
            const fetchedJobs = jobData.jobs || []
            const role = jobData.predictedRole?.toUpperCase()

            console.log("🚀 ~ handleUpload ~ res.data?.data?.jobResp.jobs:", res.data?.data?.jobResp.jobs)

            onJobsFetched(jobData.jobs || [])
            setHasMoreJobs(fetchedJobs.length >= 10)
            setPredictedRole(role)
            setJobs(fetchedJobs)
        } catch (err) {
            console.error(err)
            alert("Resume upload failed")
        } finally {
            setLoading(false)
        }
    }

    const loadMoreJobs = useCallback(async () => {

        // if (loadingMore || !hasMoreJobs) return

        // setLoadingMore(true)
        const nextPage = currentPage + 1
        console.log("🚀 ~ loadMoreJobs ~ nextPage:", nextPage)
        console.log("🚀 ~ loadMoreJobs ~ formDataRef.current:", formDataRef.current)
        try {
            const res = await axios.post(
                `${backendURL}/api/v1/jobs/resume?page=${nextPage}`,
                formDataRef.current
            )

            const jobData = res.data.data
            const moreJobs = jobData.jobResp?.jobs || []

            if (moreJobs.length > 0) {
                setJobs((prev) => [...prev, ...moreJobs])
                onJobsFetched((prev) => [...prev, ...moreJobs])
                setCurrentPage(nextPage)
                setHasMoreJobs(moreJobs.length >= 10)
            } else {
                setHasMoreJobs(false)
            }
        } catch (err) {
            console.error("Error fetching more jobs:", err)
        }
    }, [currentPage, onJobsFetched])

    useEffect(() => {
        console.log("🚀 ~ useEffect ~ hasMoreJobs:", hasMoreJobs)
        console.log("🚀 ~ useEffect ~ sentinelRef.current:", sentinelRef.current)
        if (!hasMoreJobs || !sentinelRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreJobs()
                }
            },
            { rootMargin: "200px" }
        )

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [hasMoreJobs, loadMoreJobs])

    return (
        <div className="p-20 mt-20 border rounded-lg shadow-lg max-w-xl mx-auto  flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold mb-4">Upload Your Resume (PDF)</h2>
            <input className= "pl-40" type="file" accept="application/pdf" onChange={handleFileChange} />
            <button
                className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload & Find Jobs"}
            </button>

            { console.log("🚀 ~ ResumeUpload ~ predictedRole:", predictedRole) }
            {predictedRole && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-green-700">
                        Predicted Role: {predictedRole}
                    </h3>
                </div>
            )}

            {/* {jobs.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">{`${predictedRole} Jobs for you`}</h4>
          <ul className="list-disc ml-5">
            {jobs.map((job) => (
              <li key={job._id}>
                <strong>{job.job_title}</strong> at {job.company_name} – {job.job_location}
              </li>
            ))}
          </ul>
        </div>
      )} */}
            <div ref={sentinelRef} className="h-10" />
        </div>
    );
};

export default ResumeUpload