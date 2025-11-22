import shortid from "shortid";
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
// validate URL
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
export const createLinks = async (req, res) => {
  const { targetUrl } = req.body;
  if (!targetUrl) {
    return res.status(400).json({ message: "Target URL is required" });
  }
  if (!isValidUrl(targetUrl)) {
    return res.status(400).json({ message: "Invalid URL format" });
  }
  //generate short code
  const shortCode = shortid.generate();
  console.log(shortCode);
  return res.status(201).json({ shortCode, targetUrl });
};
