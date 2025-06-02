import { Job } from "../models/job.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponses.js"
import redisClient from "../utils/redisClient.js"
import { predictJobRole } from "../utils/predictJobRole.js"
import { extractTextFromPdf } from "../utils/extractText.js"
import fs from "fs"

export const searchJobs = async (req, res) => {
    const { query, location, source, page } = req.query

    if(( query && typeof query !== "string") || (location && typeof location !== "string") || (source && typeof source !== "string")) {
        throw new ApiError(400, "Incorrect Data Type")
    }

    const parsedPage= Math.max(parseInt(page) || 0, 1)
    console.log("🚀 ~ searchJobs ~ req.query.page:", req.query.page)
    const pageSize = 10
    const cacheKey = `search:${query || ''}:${location || ''}:${source || ''}:page${parsedPage}`
    
    try {
        // Check cache
        const cachedResultRaw = await redisClient.get(cacheKey)
        if (cachedResultRaw) {
            
            const cachedResult = JSON.parse(cachedResultRaw)
            
            if (req?.body?.functioncall) {
                return cachedResult
            }
            
            return res
            .status(200)
            .json(new ApiResponse(200, cachedResult, `${cachedResult.jobs.length ? `Jobs Fetched Successfully` : `No Jobs Found`}`))
        }
        
        // MongoDB aggregate query
        const result = await Job.aggregate([
            {
                $match: {
                    ...(query ? { $text: { $search: query } } : {}),
                    ...(location ? { job_location: location } : {}),
                    ...(source ? { source } : {})
                }
            },
            {
                $facet: {
                    results: [
                        { $sort: query ? { score: { $meta: "textScore" } } : { _id: -1 } },
                        { $skip: (parsedPage - 1) * pageSize },
                        { $limit: pageSize }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ])
        
        const jobs = result[0].results
        const count = result[0].totalCount[0]?.count || 0
        const response = { jobs, count }
        
        // Cache response for 5 minutes
        await redisClient.set(cacheKey, JSON.stringify(response), { EX: 300 })

        if (req?.body?.functioncall) {
            return response
        }
        res
            .status(200)
            .json(new ApiResponse(200, response, `${response.jobs.length ? `Jobs Fetched Successfully` : `No Jobs Found`}`))

    } catch (err) {
        console.error('Search Error:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const uploadResume = async (req, res) => {
    try {

        // console.log("🚀 ~ uploadResume ~ req.file:", req.file)
        const pdfPath = req.file.path
        // console.log("🚀 ~ uploadResume ~ pdfPath:", pdfPath)

        console.time("Extract Text")
        const resumeText = await extractTextFromPdf(pdfPath)
        console.timeEnd("Extract Text")
        // console.log("🚀 ~ uploadResume ~ resumeText:", resumeText)

        console.time("Predict Job Role")
        const predictedRole = await predictJobRole(resumeText)
        console.timeEnd("Predict Job Role")

        console.log("🚀 ~ uploadResume ~ predictedRole:", predictedRole)

        fs.unlink(pdfPath, err => {
            if (err) console.error("Failed to delete resume:", err)
          })

        const newReq = {
            query: {
                query: predictedRole,
                page: req.query.page
            },
            body: {
                functioncall: true
            }
        }

        const jobResp = await searchJobs(newReq)

        res
            .status(200)
            .json(new ApiResponse(200, { jobResp, predictedRole }, `${jobResp.jobs.length ? `${predictedRole.toUpperCase()} JOBS FOR YOU` : "NO JOBS FOUND"}`))
    } catch (err) {
        console.error('Resume upload failed:', err)
        res.status(400).json({ error: err.message || 'Resume processing failed' })
    }
}