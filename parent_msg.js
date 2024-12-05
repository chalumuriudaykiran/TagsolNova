
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import io from 'socket.io-client';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
// Replace this with the actual socket server address
const socket = io('http://50.6.194.240:5000/LiveChat');

const ParentMessage = () => {

  

  const navigation = useNavigation();
  const route = useRoute();
  const { studentName,className } = route.params || {};
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  // const [studentName, setStudentName] = useState('');
  const scrollViewRef = useRef();

  console.log("Received Data:", { className, studentName });

  useEffect(() => {
    if (className) {
      axios
        .get(`http://50.6.194.240:5000/LiveChat/contacts`, { params: { class_name: className } })
        .then((response) => {
          setContacts(response.data); // Set the dynamic contacts data
        })
        .catch((error) => {
          console.error("Error fetching contacts:", error);
        });
    }
  }, [className]);
  


  const loadMessages = (contact) => {
    setCurrentContact(contact); // Set the selected contact
    setShowContacts(false); // Hide the contacts list
    setMessages([]); // Clear existing messages to avoid confusion
    setLoadingMessages(true); // Show loading indicator while fetching messages

    axios
      .get(
        `http://50.6.194.240:5000/LiveChat/messages/${encodeURIComponent(
          studentName
        )}/${encodeURIComponent(contact)}`
      )
      .then((response) => {
        setMessages(response.data); // Update messages with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setMessages([]); // Reset messages on error
      })
      .finally(() => {
        setLoadingMessages(false); // Stop loading indicator
      });
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      const messageData = {
        contact: currentContact,
        sender: studentName,
        text: messageText,
      };

      axios.post('http://50.6.194.240:5000/LiveChat/messagess', messageData)
        .then(() => {
          // Immediately update the messages state with the new message
          const newMessage = {
            sender: studentName,
            text: messageText,
            contact: currentContact,
          };

          setMessages(prevMessages => [...prevMessages, newMessage]);  // Add the new message to the state
          setMessageText('');  // Clear the input field after sending
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  };
 


  useEffect(() => {
    if (currentContact) {
      // Set up the socket listener for incoming messages
      const receiveMessageHandler = (messageData) => {
        if (
          messageData.contact === currentContact &&
          messageData.sender !== studentName
        ) {
          setMessages((prevMessages) => [...prevMessages, messageData]);
        }
      };

      socket.on("receiveMessage", receiveMessageHandler);

      // Cleanup function to remove the listener when currentContact changes
      return () => {
        socket.off("receiveMessage", receiveMessageHandler);
      };
    }
  }, [currentContact]);


  useEffect(() => {
    if (currentContact) {
      // Fetch messages for the current contact
      axios.get(`http://50.6.194.240:5000/messages/${encodeURIComponent(currentContact)}`)
        .then(response => setMessages(response.data))
        .catch(error => {
          if (error.response && error.response.status === 404) {
            console.log('No messages found for this contact.');
            setMessages([]);  // Set empty messages if none are found
          } else {
            console.error('Error fetching messages:', error);
          }
        });

      // Set up the socket listener for incoming messages
      const receiveMessageHandler = (messageData) => {
        // Only add the message if it was not sent by the current user
        if (messageData.contact === currentContact && messageData.sender !== studentName) {
          setMessages(prevMessages => [...prevMessages, messageData]);
        }
      };

      socket.on('receiveMessage', receiveMessageHandler);

      // Cleanup function to remove the listener when currentContact changes
      return () => {
        socket.off('receiveMessage', receiveMessageHandler);
      };
    }
  }, [currentContact]);

  // const loadMessages = (contact) => {
  //   setCurrentContact(contact);
  //   setShowContacts(false);  // Hide contacts list
  //   setLoadingMessages(true);

  //   axios.get(`http://192.168.0.104:5000/LiveChat/messages/${encodeURIComponent(studentName)}/${encodeURIComponent(contact)}`)
  //     .then(response => {
  //       setMessages(response.data);
  //       setLoadingMessages(false);
  //     })
  //     .catch(error => {
  //       setLoadingMessages(false);
  //       console.error('Error fetching messages:', error);
  //     });
  // };


  const toggleContacts = () => {
    setShowContacts(!showContacts);
  }

  return (
    <View style={styles.mobileFrame}>
      {/* Header Section */}
      <View style={styles.mainHeader}>

        

        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleContacts} style={{ marginRight: 20 }}>
            <Icon name="person" type="material" size={wp('10%')} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
            <Icon name="home" type="material" size={wp('10%')} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

      {/* Body Section */}
      {showContacts ? (
        <View style={styles.contactsContainer}>
          <Text style={styles.contactsHeader}>Contacts</Text>
          <ScrollView style={styles.contactsList}>
            {contacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactItem}
                onPress={() => loadMessages(contact.name)} // Load messages for the selected contact
              >
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : currentContact ? (
        <View style={styles.chatContainer}>
          <Text style={styles.chatHeader}>Chat with {currentContact}</Text>
          {loadingMessages ? (
            <Text>Loading messages...</Text> // Show loading indicator
          ) : (
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chatBubble,
                      msg.sender === studentName
                        ? styles.sentMessage
                        : styles.receivedMessage,
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: msg.sender === studentName ? "#fff" : "#000",
                      }}
                    >
                      {msg.text}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No messages yet.</Text>
              )}
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Select a contact to start chatting.
          </Text>
        </View>
      )}
      {currentContact && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type your message..."
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mobileFrame: {
    flex: 1,
    backgroundColor: '#f0f0f0',
   
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1.5%'),  // Responsive padding
    paddingHorizontal: wp('4%'),  // Responsive padding
    height: hp('12%'),  // Responsive height
    marginBottom: wp('3%'),  // Responsive margin bottom
  },
  logo: {
    width: wp('15%'),  // Responsive width
    height: wp('15%'),  // Responsive height
  },
  subHeader: {
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1%'),  // Responsive padding
    alignItems: 'center',
    height: hp('3%'),  // Responsive height
  },
  subHeaderText: {
    fontSize: wp('5%'),  // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contactsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },
  contactsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactsList: {
    maxHeight: 400,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactRole: {
    fontSize: 14,
    color: '#666',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },
  chatHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',  // Align sent messages to the right
    backgroundColor: '#003153',  // Blue background for sent messages
  },
  receivedMessage: {
    alignSelf: 'flex-start',  // Align received messages to the left
    backgroundColor: '#e1e1e1',  // Grey background for received messages
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
});

export default ParentMessage;

