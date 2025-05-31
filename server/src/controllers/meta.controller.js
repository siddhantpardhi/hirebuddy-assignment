import { Job } from "../models/job.model.js"
import { ApiResponse } from "../utils/ApiResponses.js"
import redisClient from "../utils/redisClient.js"

export const getMetaFilters = async (req, res) => {

    const cacheKey = "meta:filters"
    try {

        const cached = await redisClient.get(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            return res.status(200).json(new ApiResponse(200, data, "Filter metadata loaded (cached)"));
        }

        const [location, sources] = await Promise.all([
            Job.distinct("job_location"),
            Job.distinct("source")
        ])

        const responseData = { location, sources }

        await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 })

        res
            .status(200)
            .json(new ApiResponse(200, { location, sources }, `Filter Metadata loaded`))
    } catch (error) {
        console.error("Error while fetching Meta Data: ", error)
        res.status(500).json({ error: error.message })
    }
}