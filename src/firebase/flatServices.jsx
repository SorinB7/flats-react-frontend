import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getRandomFlatImage } from "../utils/imageUtils"; 

export const addFlat = async (flatData, userId) => {
  try {
    // Verificăm dacă câmpul "name" este valid
    if (!flatData.name || !flatData.name.trim()) {
      throw new Error("Flat name is required.");
    }

    // Generăm un URL pentru o imagine random
    const imageURL = await getRandomFlatImage();
    if (!imageURL) {
      throw new Error("Failed to generate image URL.");
    }

    // Construim documentul pentru apartament
    const flatDocument = {
      ...flatData,
      userId, 
      dateAvailable: flatData.dateAvailable
        ? Timestamp.fromDate(new Date(flatData.dateAvailable))
        : Timestamp.fromDate(new Date()), 

      imageURL, 
    };

    // Adăugăm documentul în colecția Firestore
    const docRef = await addDoc(collection(db, "Flats"), flatDocument);
    return docRef.id;
  } catch (error) {
    console.error("Error adding flat:", error);
    throw new Error("Failed to add flat.");
  }
};
