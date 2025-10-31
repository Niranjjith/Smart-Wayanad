import Location from "../models/Location.js";

export async function getAllLocations(req, res) {
  res.json(await Location.find().sort({ createdAt: -1 }));
}

export async function createLocation(req, res) {
  res.status(201).json(await Location.create(req.body));
}

export async function updateLocation(req, res) {
  res.json(await Location.findByIdAndUpdate(req.params.id, req.body, { new: true }));
}

export async function deleteLocation(req, res) {
  await Location.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
