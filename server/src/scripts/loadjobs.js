import fs from 'fs';
import readline from 'readline';
import path from "path";
import { fileURLToPath } from 'url';
import { Job } from '../models/job.model.js';
import connectDB from "../database/database.js"
import dotenv from "dotenv"

const REQUIRED_FIELDS = ['company_name', 'job_title', 'job_location', 'apply_link', 'job_description', 'source']

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const jobsFilePath = path.resolve(__dirname, 'jobs.jsonl')

function isValidJob(job) {
    return REQUIRED_FIELDS.every(field => {
        const value = job[field];
        return value !== null && value !== undefined && String(value).trim() !== '';
    });
}

(async () => {
    try {
        dotenv.config({ path: path.resolve(__dirname, '../../.env') })
        console.log(process.env.MONGODB_URI)
        await connectDB();
        const rl = readline.createInterface({
            input: fs.createReadStream(jobsFilePath),
            crlfDelay: Infinity,
        });

        const validJobs = []

        for await (const line of rl) {
            const job = JSON.parse(line);
            //   console.log("🚀 ~ forawait ~ job:", job)

            if (isValidJob(job)) {

                validJobs.push(job)
                // await Job.create(job); // save to DB

            }

            else {
                console.log("Skipped invalid job", job)
            }

        }

        if (validJobs.length > 1) {

            await Job.insertMany(validJobs, { ordered: false })
            console.log(`Inserted ${validJobs.length} jobs.`)

        }

    } catch (error) {
        console.error("Error in loading jobs: ", error)
    }
})();
