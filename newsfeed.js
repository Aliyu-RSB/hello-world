const express = require("express")
const router = express.Router();


router.get("/posts", (req, res)=>{
    res.send("This is list of posts")
})

module.exports = router;
