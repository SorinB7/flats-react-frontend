import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Trimite un mesaj și îl salvează în colecția "Messages".
 * 
 * @param {Object} messageData
 * @param {string} messageData.senderId 
 * @param {string} messageData.receiverId 
 * @param {string} messageData.flatId 
 * @param {string} messageData.message 
 * @returns {Promise<string>} - ID-ul documentului creat în Firestore.
 */
export const sendMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, "Messages"), {
      ...messageData,
      timestamp: Timestamp.now(),
      status: "unread", 
    });

    return docRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message.");
  }
};

