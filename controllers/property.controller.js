import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";

import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createProperty = async (req, res) => {
  try {
    const {
      title,
      address,
      flatNo,
      type,
      area,
      balcony,
      marketValue,
      others,
      photos,
      video,
      noOfTokens,
      tokenValue,
    } = req.body;

    var photoUrls = [];
    for (let i = 0; i < photos.length; i++) {
      const photoUrl = await cloudinary.uploader.upload(photos[i]);
      photoUrls.push(photoUrl.url);
    }

    const newProperty = await Property.create({
      title,
      address,
      flatNo,
      type,
      area,
      balcony,
      marketValue,
      others,
      photos: photoUrls,
      video,
      noOfTokens,
      tokenValue,
    });

    return res.status(200).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      address,
      flatNo,
      type,
      area,
      balcony,
      marketValue,
      others,
      photos,
      video,
      noOfTokens,
      tokenValue,
    } = req.body;

    var photoUrls = [];
    for (let i = 0; i < photos.length; i++) {
      const photoUrl = await cloudinary.uploader.upload(photos[i]);
      photoUrls.push(photoUrl.url);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        address,
        flatNo,
        type,
        area,
        balcony,
        marketValue,
        others,
        photos: photoUrls,
        video,
        noOfTokens,
        tokenValue,
      }
    );

    return res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById({ _id: id });

    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ message: "Property not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActiveBids = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById({ _id: id });

    const props = user.properties;
    var propertyIds = props.map((property) => {
      return property.propertyId;
    });
    var properties = [];

    for (let i = 0; i < propertyIds.length; i++) {
      const property = await Property.findById({ _id: propertyIds[i] });
      properties.push(property);
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createProperty,
  updateProperty,
  getPropertyInfoById,
  getAllProperties,
  getActiveBids,
};
