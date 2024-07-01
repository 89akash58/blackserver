const Sector = require("../model/Model");
const path = require("path");
const fs = require("fs");
const getAllSector = async (req, res) => {
  try {
    const allSector = await Sector.find();
    res.status(200).json({
      status: "success",
      result: allSector.length,
      data: allSector,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error getting the data",
      status: "error",
    });
  }
};

const uploadData = async (req, res) => {
  try {
    console.log("Current directory:", __dirname);
    const jsonPath = path.join(__dirname, "..", "jsondata.json");
    console.log("JSON file path:", jsonPath); // Log the file path

    // Check if file exists
    if (!fs.existsSync(jsonPath)) {
      throw new Error("JSON file not found");
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log("JSON data parsed successfully");

    await Sector.deleteMany({});
    console.log("Existing data deleted");

    const result = await Sector.insertMany(jsonData);
    console.log(`${result.length} documents inserted`);

    res.status(200).json({
      status: "success",
      message: `${result.length} documents inserted`,
    });
  } catch (err) {
    console.error("Error in uploadData:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while uploading data",
      error: err.message,
      stack: err.stack,
    });
  }
};

const filterData = async (req, res) => {
  try {
    const filters = {
      end_year: req.query.end_year,
      topic: req.query.topic,
      sector: req.query.sector,
      region: req.query.region,
      pestle: req.query.pestle,
      source: req.query.source,
      country: req.query.country,
      city: req.query.city,
      swot: req.query.swot,
    };

    const query = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        if (["intensity", "likelihood", "relevance"].includes(key)) {
          acc[key] = Number(value);
        } else if (key === "end_year" || key === "start_year") {
          acc[key] = value.toString();
        } else {
          acc[key] = new RegExp(value, "i"); // Case-insensitive search
        }
      }
      return acc;
    }, {});

    const filteredData = await Sector.find(query);

    res.status(200).json({
      status: "success",
      result: filteredData.length,
      data: filteredData,
    });
  } catch (err) {
    console.error("Error in filterData:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while filtering data",
      error: err.message,
    });
  }
};

module.exports = { getAllSector, uploadData, filterData };
