import { Router } from "express"
import { getMetaFilters } from "../controllers/meta.controller.js"

const router = Router()

router.route("/filters").get(getMetaFilters)

export default router