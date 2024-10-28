/**
 * Generic function to check for duplicates based on model and fields
 * @param {Object} model - The mongoose model to search
 * @param {Object} fields - Object storing keys and values checked
 * @param {Object} response - The express response object
 * @returns {boolean} - True if duplicate is found, else null
 */

export async function checkDuplicate(model, fields, response) {
  const query = {};
  for (const [key, value] of Object.entries(fields)) {
    query[key] =
      typeof value === "string"
        ? { $regex: new RegExp(`^${value}$`, "i") }
        : value;
  }
  const existingRecord = await model.findOne(query);
  if (existingRecord) {
    response
      .status(409)
      .json({ error: "A record with the specified fields already exists." });
    return true;
  }
  return false;
}
