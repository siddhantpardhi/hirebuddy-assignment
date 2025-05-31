import { Router } from "express"
import { searchJobs, uploadResume } from "../controllers/job.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/search").get(searchJobs)
router.route("/resume").post(upload.single("resume"),uploadResume)

export default router