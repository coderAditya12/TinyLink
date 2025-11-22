// import shortid from "shortid";
// import prisma from "../config/db.js";
// const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;
// // validate URL
// function isValidUrl(url) {
//   try {
//     const u = new URL(url);
//     return u.protocol === "http:" || u.protocol === "https:";
//   } catch {
//     return false;
//   }
// }
// export const createLinks = async (req, res) => {
//   const { targetUrl } = req.body;
//   if (!targetUrl) {
//     return res.status(400).json({ message: "Target URL is required" });
//   }
//   if (!isValidUrl(targetUrl)) {
//     return res.status(400).json({ message: "Invalid URL format" });
//   }
//   //generate short code
//   try {
//     const shortCode = shortid.generate();
//     const result = await prisma.link.create({
//       data: {
//         originalUrl: targetUrl,
//         shortUrl: shortCode,
//       },
//     });
//     console.log(result);
//     return res.status(201).json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };
// export const visitedLinks = async (req, res) => {
//   const { shortencode } = req.params;
//   if (shortencode.trim() === "") {
//     return res.status(400).json({ message: "Short code is required" });
//   }
//   try {
//     const result = await prisma.link.findUnique({
//       where: {
//         shortUrl: shortencode,
//       },
//     });
//     if (!result) {
//       return res.status(404).json({ message: "short link not found " });
//     }
//     const vistedCount = result.visitCount + 1;
//     const updateCount = await prisma.link.update({
//       where: {
//         shortUrl: shortencode,
//       },
//       data: {
//         visitCount: vistedCount,
//       },
//     });
//     console.log(updateCount);
//     return res.status(200).redirect(updateCount.originalUrl);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.messages });
//   }
// };

// export const getAllLinks = async (req, res) => {
//   try {
//     const linksData = await prisma.link.findMany();
//     console.log(linksData);
//     return res.status(200).json(linksData);
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };
// export const deleteLink = async (req, res) => {
//   const { id } = req.params;
//   try {
//     if (id.trim() === "") {
//       return res.status(400).json({ message: "ID is required" });
//     }
//     const deleteLink = await prisma.link.delete({
//       where: {
//         shortUrl: id,
//       },
//     });
//     return res.status(200).json({ message: "Link deleted successfully" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };
import prisma from "../config/db.js";

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// Validate URL
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Generate random 6-character code
function generateCode() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/links - Create new link
export const createLinks = async (req, res) => {
  try {
    const { targetUrl, customCode } = req.body;

    // Validate target URL
    if (!targetUrl) {
      return res.status(400).json({ error: "Target URL is required" });
    }

    if (!isValidUrl(targetUrl)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let code = customCode;

    // If custom code provided, validate it
    if (customCode) {
      if (!CODE_REGEX.test(customCode)) {
        return res.status(400).json({
          error: "Code must be 6-8 alphanumeric characters",
        });
      }

      // Check if code already exists - RETURN 409!
      const existing = await prisma.link.findUnique({
        where: { code: customCode },
      });

      if (existing) {
        return res.status(409).json({ error: "Code already exists" });
      }
    } else {
      // Generate random unique code
      let attempts = 0;
      while (attempts < 10) {
        code = generateCode();
        const existing = await prisma.link.findUnique({
          where: { code },
        });
        if (!existing) break;
        attempts++;
      }

      if (attempts === 10) {
        return res.status(500).json({
          error: "Failed to generate unique code",
        });
      }
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        code,
        targetUrl,
      },
    });

    return res.status(201).json(link);
  } catch (error) {
    console.error("Error creating link:", error);
    return res
      .status(500)
      .json({ error: "Server Error", message: error.message });
  }
};

// GET /api/links - Get all links
export const getAllLinks = async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return res
      .status(500)
      .json({ error: "Server Error", message: error.message });
  }
};

// GET /api/links/:code - Get stats for single link
export const getLinkStats = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    return res.status(200).json(link);
  } catch (error) {
    console.error("Error fetching link:", error);
    return res
      .status(500)
      .json({ error: "Server Error", message: error.message });
  }
};

// DELETE /api/links/:code - Delete a link
export const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;

    if (code.trim() === "") {
      return res.status(400).json({ error: "Code is required" });
    }

    // Check if link exists
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Delete the link
    await prisma.link.delete({
      where: { code },
    });

    return res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return res
      .status(500)
      .json({ error: "Server Error", message: error.message });
  }
};

// GET /:code - Redirect to original URL (this goes in your main routes, not /api/links)
export const redirectLink = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Update clicks and lastClicked
    const clickCount = link.clicks +1;
    await prisma.link.update({
      where: { code },
      data: {
        clicks: clickCount,
        lastClicked: new Date(),
      },
    });

    return res.redirect(302, link.targetUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return res
      .status(500)
      .json({ error: "Server Error", message: error.message });
  }
};