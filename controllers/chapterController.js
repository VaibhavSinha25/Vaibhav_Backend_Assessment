// Controller for chapter-related operations: create, read, and bulk upload

import Chapter from "../models/Chapter.js";
import redis from "../init/redis.js";

/**
  This function fetches all chapters from the database based on optional filters.
  Results are paginated and cached in Redis for improved performance.
 */

const getAllChapters = async (req, res) => {
  try {
    // Destructure filters and pagination options from query parameters
    const {
      class: className,
      unit,
      subject,
      status,
      isWeakChapter,
      page = 1,
      limit = 10,
    } = req.query;

    // Generate a unique cache key based on query parameters
    const cacheKey = `chapters:${JSON.stringify(req.query)}`;

    // Check if cached data exists in Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
      // If cached, return the parsed response
      return res.status(200).json(JSON.parse(cached));
    }

    // Build MongoDB query object based on provided filters
    const query = {};
    if (className) query.class = className;
    if (unit) query.unit = unit;
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (typeof isWeakChapter !== "undefined") {
      // Convert string to boolean
      query.isWeakChapter = isWeakChapter === "true";
    }

    // Count total number of documents matching the query
    const total = await Chapter.countDocuments(query);

    // Fetch the documents with pagination (skip and limit)
    const chapters = await Chapter.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Structure the response object
    const response = {
      total,
      page: Number(page),
      limit: Number(limit),
      chapters,
    };

    // Store the result in Redis cache for 1 hour (3600 seconds)
    await redis.set(cacheKey, JSON.stringify(response), "EX", 3600);

    // Return the response
    return res.status(200).json(response);
  } catch (err) {
    // Handle any unexpected server error
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Get a chapter by its ID
 */
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params; // Extract chapter ID from request parameters
    const chapter = await Chapter.findById(id); // Find chapter by ID

    // If chapter not found, return 404 error
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    return res.status(200).json(chapter);
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Invalid ID or error fetching chapter" });
  }
};

/**
 This function uploads multiple chapters
 It validates and saves each chapter, tracks successes and failures, and clears the related Redis cache.
*/

const uploadChapters = async (req, res) => {
  try {
    const data = req.body; // Expecting an array of chapter objects in the request body

    // Validate the input format: it must be an array
    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Invalid format. Expected an array." });
    }

    // Arrays to track successful and failed uploads
    const successful = [];
    const failed = [];

    // Loop through each chapter entry and attempt to save it
    for (const entry of data) {
      try {
        const chapter = new Chapter(entry); // Create a new Chapter instance
        await chapter.validate(); // Validate the schema
        await chapter.save(); // Save to database
        successful.push(chapter); // Track successful upload
      } catch (err) {
        // If any error occurs (validation or DB error), track it in the failed list
        failed.push({ entry, error: err.message });
      }
    }

    // Invalidate any Redis cache related to chapters
    const keys = await redis.keys("chapters:*");
    if (keys.length > 0) {
      await redis.del(...keys); // Remove all cached chapter data
    }

    // Compose an appropriate response message based on number of successful uploads
    const message =
      successful.length === 1
        ? "Chapter uploaded successfully."
        : `${successful.length} chapters uploaded successfully.`;

    // Return a 201 response with success message and failed uploads (if any)
    return res.status(201).json({ message, failed });
  } catch (err) {
    // Catch any unexpected errors and respond with a 500 error
    console.error("Error uploading chapters:", err);
    return res.status(500).json({ error: "Failed to upload chapters" });
  }
};

export { uploadChapters, getAllChapters, getChapterById };
