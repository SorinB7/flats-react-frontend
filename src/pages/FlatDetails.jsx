import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sendMessage } from "../firebase/messageServices";
import styles from "../styles/FlatDetails.module.css";

const FlatDetails = () => {
  const { flatId } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("LogedUser")) || {};

  useEffect(() => {
    const fetchFlatDetails = async () => {
      if (!flatId) {
        console.error("Flat ID is missing!");
        return;
      }

      try {
        const docRef = doc(db, "Flats", flatId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const flatData = docSnap.data();
          setFlat(flatData);
          setIsOwner(flatData.userId === currentUser?.uid);
        } else {
          console.error("No such document!");
          setFlat(null);
        }
      } catch (error) {
        console.error("Error fetching flat details:", error.message);
        setFlat(null);
      }
    };

    fetchFlatDetails();
  }, [flatId, currentUser?.uid]);

  const handleSendMessage = async () => {
    if (!flatId) {
      console.error("Flat ID is missing.");
      setSuccess(false);
      return;
    }

    if (!message.trim()) {
      setSuccess(false);
      console.error("Message is empty.");
      return;
    }

    try {
      await sendMessage({
        senderId: currentUser.uid,
        receiverId: flat?.userId,
        flatId,
        message,
      });
      setSuccess(true);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setSuccess(false);
    }
  };

  const handleEditFlat = () => {
    navigate(`/edit-flat/${flatId}`);
  };

  if (!flat) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.flatDetailsContainer}>
      <h1 className={styles.premiumDetailsTitle}>
        {flat.name || "Apartment Details"}
      </h1>
      <div className={styles.flatImage}>
        <img
          src={
            flat.imageURL?.src ||
            "https://via.placeholder.com/600x400?text=No+Image"
          }
          alt={flat.imageURL?.alt || "No description available"}
          className={styles.limitedImage}
        />
      </div>
      <div className={styles.premiumDetails}>
        <h2 className={styles.premiumDetailsTitle}>Apartment Details</h2>
        <div className={styles.detailsColumn}>
          <p>
            <span className={styles.detailIcon}>🏡</span> <strong>Name:</strong>{" "}
            {flat.name}
          </p>
          <p>
            <span className={styles.detailIcon}>📍</span> <strong>City:</strong>{" "}
            {flat.city}
          </p>
          <p>
            <span className={styles.detailIcon}>🏢</span> <strong>Street:</strong>{" "}
            {flat.streetName}, {flat.streetNumber}
          </p>
          <p>
            <span className={styles.detailIcon}>📐</span> <strong>Area:</strong>{" "}
            {flat.areaSize} m²
          </p>
        </div>
        <div className={styles.detailsColumn}>
          <p>
            <span className={styles.detailIcon}>📅</span>{" "}
            <strong>Year Built:</strong> {flat.yearBuilt}
          </p>
          <p>
            <span className={styles.detailIcon}>💵</span>{" "}
            <strong>Rent Price:</strong> ${flat.rentPrice}
          </p>
          <p>
            <span className={styles.detailIcon}>📆</span>{" "}
            <strong>Available From:</strong>{" "}
            {flat.dateAvailable?.seconds
              ? new Date(flat.dateAvailable.seconds * 1000).toLocaleDateString()
              : "Unknown"}
          </p>
          <p>
            <span className={styles.detailIcon}>❄️</span>{" "}
            <strong>Air Conditioning:</strong>{" "}
            {flat.hasAC ? "Yes" : "No"}
          </p>
        </div>
      </div>
      {isOwner ? (
        <button className={styles.editButton} onClick={handleEditFlat}>
          Edit Flat
        </button>
      ) : (
        <div
          className={`${styles.messageSection} ${
            flat.isPremium ? styles.premiumMessageSection : ""
          }`}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message to the owner..."
            className={styles.messageInput}
          />
          <button
            className={styles.messageButton}
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send Message
          </button>
          {success !== null && (
            <p
              className={
                success ? styles.successMessage : styles.errorMessage
              }
            >
              {success
                ? "Message sent successfully!"
                : "Failed to send the message. Please try again."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FlatDetails;
