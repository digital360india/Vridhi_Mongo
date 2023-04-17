import Property from "../mongodb/models/property.js";
import User from '../mongodb/models/user.js';

const createProperty = async (req, res) => {
  try {
    const {
      title,
      address,
      flatNo,
      area,
      balcony,
      marketValue,
      others,
      photos,
      video,
      noOfTokens,
      tokenValue,
    } = req.body;

    const newProperty = await Property.create({
      title,
      address,
      flatNo,
      area,
      balcony,
      marketValue,
      others,
      photos,
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
            area,
            balcony,
            marketValue,
            others,
            photos,
            video,
            noOfTokens,
            tokenValue,
          } = req.body;

          const updatedProperty = await Property.findByIdAndUpdate({ _id: id }, {
            title,
            address,
            flatNo,
            area,
            balcony,
            marketValue,
            others,
            photos,
            video,
            noOfTokens,
            tokenValue,
          });

          return res.status(200).json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPropertyInfoById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById({ _id: id });

        if(property){
            res.status(200).json(property);
        }else{
            res.status(404).json({ message: "Property not found!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find();

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getActiveBids = async (req, res) => {
  try {
      const { id } = req.params;

      const user = await User.findById({ _id: id });

      const propertyIds = new Set(user.properties);
      var properties = [];

      for(let i=0; i<propertyIds.length; i++){
        const property = Property.findById({ _id: propertyIds[i] });
        properties.push(property);
      }

      res.status(200).json({ properties });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

export { createProperty, updateProperty, getPropertyInfoById, getAllProperties, getActiveBids };
