import Location from "../models/Location.js";

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new location
export const addLocation = async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Filter by type
export const getByType = async (req, res) => {
  try {
    const type = req.params.type;
    const locations = await Location.find({ type });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
