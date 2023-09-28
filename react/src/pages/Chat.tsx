// // // Chat.tsx
// import React, { useState } from 'react';

// // interface ChatProps {
// //   user: string | null;
// // }

// // const Chat: React.FC<ChatProps> = ({ user }) => {
// //   const [messages, setMessages] = useState<string[]>([]);
// //   const [message, setMessage] = useState<string>('');

// //   const handleSendMessage = () => {
// //     if (!message) return;

// //     // Mesajı göndermek için bir işlev ekleyin (örneğin, Socket.io kullanabilirsiniz)

// //     // Gönderilen mesajı yerel olarak görüntüleme
// //     setMessages([...messages, `${user}: ${message}`]);

// //     setMessage('');
// //   };

// //   return (
// //     <div className="chat-container">
// //       <div className="chat-messages">
// //         {messages.map((msg, index) => (
// //           <div key={index} className="chat-message">
// //             {msg}
// //           </div>
// //         ))}
// //       </div>
// //       {user && (
// //         <div className="chat-input">
// //           <input
// //             type="text"
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //             placeholder="Mesajınızı buraya yazın"
// //           />
// //           <button onClick={handleSendMessage}>Gönder</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Chat;

// interface ChatProps {
//   user: string | null;
// }
// const Chat = () => {

// const Chat: React.FC<ChatProps> = ({ user }) => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [message, setMessage] = useState<string>('');

//   const handleSendMessage = () => {
//     if (!message) return;

//     // Mesajı göndermek için bir işlev ekleyin (örneğin, Socket.io kullanabilirsiniz)

//     // Gönderilen mesajı yerel olarak görüntüleme
//     setMessages([...messages, `${user}: ${message}`]);

//     setMessage('');
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className="chat-message">
//             {msg}
//           </div>
//         ))}
//       </div>
//       {user && (
//         <div className="chat-input">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Mesajınızı buraya yazın"
//           />
//           <button onClick={handleSendMessage}>Gönder</button>
//         </div>
//       )}
//     </div>
//   );
// }
// export default Chat;
