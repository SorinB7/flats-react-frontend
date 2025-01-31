import { useState, useEffect } from "react";
import PropTypes from "prop-types"; 
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/MessageButton.module.css";

const MessageButton = ({ flatId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch mesaje pentru apartamentul curent
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, "Messages"),
          where("flatId", "==", flatId)
        );
        const querySnapshot = await getDocs(q);
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);

        // Contorizare mesaje necitite
        const unreadCount = messagesData.filter(
          (msg) => !msg.viewedBy?.includes(currentUser.uid)
        ).length;
        setUnreadMessagesCount(unreadCount);
      } catch (err) {
        console.error("Eroare la preluarea mesajelor:", err);
        setError("Nu s-au putut prelua mesajele. Încercați din nou.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [flatId, currentUser.uid]);

  // Trimite mesaj nou
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setError("Mesajul nu poate fi gol.");
      return;
    }

    try {
      const messageData = {
        flatId,
        senderId: currentUser.uid,
        senderName: currentUser.name || currentUser.email || "Anonymous", 
        content: newMessage,
        timestamp: Timestamp.fromDate(new Date()),
        viewedBy: [], 
      };

      const docRef = await addDoc(collection(db, "Messages"), messageData);

      setMessages((prev) => [...prev, { id: docRef.id, ...messageData }]);
      setNewMessage(""); 
      setError(null); 
      setUnreadMessagesCount((prev) => prev + 1); 
    } catch (err) {
      console.error("Eroare la trimiterea mesajului:", err);
      setError("Nu s-a putut trimite mesajul. Încercați din nou.");
    }
  };

  // Deschide modalul și marchează mesajele ca vizualizate
  const handleModalOpen = async () => {
    setIsModalOpen(true);

    const updatedMessages = messages.map((msg) => {
      if (!msg.viewedBy?.includes(currentUser.uid)) {
        const messageRef = doc(db, "Messages", msg.id);

        updateDoc(messageRef, {
          viewedBy: [...(msg.viewedBy || []), currentUser.uid],
        }).catch((err) => console.error("Eroare la actualizarea mesajului:", err));
      }
      return { ...msg, viewedBy: [...(msg.viewedBy || []), currentUser.uid] };
    });

    setMessages(updatedMessages);
    setUnreadMessagesCount(0); 
  };

  return (
    <div className={styles.messageButtonContainer}>
      <button
        type="button"
        className={styles.messageButton}
        onClick={handleModalOpen}
      >
        💬 {unreadMessagesCount}
      </button>

      {isModalOpen && (
        <div className={styles.messageModal}>
          <div className={styles.modalHeader}>
            <h3>Mesaje</h3>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className={styles.messageList}>
            {loading ? (
              <p>Se încarcă mesajele...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : messages.length === 0 ? (
              <p>Nu există mesaje.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={styles.messageItem}>
                  <strong>
                    {message.senderId === currentUser.uid ? "Tu" : message.senderName}:
                  </strong>
                  <p>{message.content}</p>
                  <span className={styles.timestamp}>
                    {new Date(message.timestamp?.seconds * 1000).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            className={styles.messageInput}
            maxLength={500} 
          />
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={loading}
            >
              {loading ? "Se trimite..." : "Trimite"}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
};

MessageButton.propTypes = {
  flatId: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string, 
  }).isRequired,
};

export default MessageButton;
