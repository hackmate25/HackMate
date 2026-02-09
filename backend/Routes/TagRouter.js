import express from "express";
import Tag from "../Modules/Tag.js";

const router = express.Router();

// /tags?type=skill&q=ml
router.get("/", async (req, res) => {
  try {
    const { type, q = "" } = req.query;

    const filter = {
      name: { $regex: q, $options: "i" }
    };

    if (type) filter.type = type;

    const tags = await Tag.find(filter).limit(20);

    res.json({ success: true, tags });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;