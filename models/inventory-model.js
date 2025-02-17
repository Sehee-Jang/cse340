const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    if (!data.rows || data.rows.length === 0) {
      throw new Error("No vehicles found for this classification.");
    }

    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get details of a specific vehicle by ID
 * ************************** */
async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [vehicle_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

/* ***************************
 *  Add classification
 * ************************** */
async function addClassification(classification_name) {
  const query = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *;`;
  const values = [classification_name];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding classification:", error);
    throw error;
  }
}

/* ***************************
 *  Add inventory item
 * ************************** */
async function addInventoryItem(newData) {
  const query = `
      INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
  `;

  const values = [
    newData.inv_make,
    newData.inv_model,
    newData.inv_year,
    newData.inv_description,
    newData.inv_image,
    newData.inv_thumbnail,
    newData.inv_price,
    newData.inv_miles,
    newData.inv_color,
    newData.classification_id,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */
async function updateInventoryItem(inv_id, updatedData) {
  const query = `
    UPDATE public.inventory
    SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, 
        inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, 
        inv_color = $9, classification_id = $10
    WHERE inv_id = $11
    RETURNING *;
  `;

  const values = [
    updatedData.inv_make,
    updatedData.inv_model,
    updatedData.inv_year,
    updatedData.inv_description,
    updatedData.inv_image,
    updatedData.inv_thumbnail,
    updatedData.inv_price,
    updatedData.inv_miles,
    updatedData.inv_color,
    updatedData.classification_id,
    inv_id,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventoryItem,
};
