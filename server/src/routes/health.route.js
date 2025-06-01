import { Router } from "express"

const router = Router()

router.route("/ping").get((_req, res) => {
    res.status(200).send('OK')
  })

export default router