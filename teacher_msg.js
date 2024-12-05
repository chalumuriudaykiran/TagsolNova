import React, { useState,useContext, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import io from 'socket.io-client';
import { UserContext } from './UserContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const socket = io('http://50.6.194.240:5000');  // Connect to your backend server

const TeacherMessage = () => {
  const { username } = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showContacts, setShowContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true); 
  const[teacherName,setTeacherName]=useState('');// Loading state for contacts
  const scrollViewRef = useRef();

  // Fetch contacts who sent messages to the teacher

 // Update teacherName whenever username changes
  useEffect(() => {
    if (username) {
      setTeacherName(username); // Set teacherName to username
    }
  }, [username]);

  const navigation = useNavigation();

  // useEffect(() => {
  //   const fetchContacts = async () => {
  //     try {
  //       const response = await axios.get(`http://192.168.0.104:5000/LiveChat/messagess/teacher/${teacherName}`);
  //       if (response.data.error) {
  //         // If there is an error message from the server, display it
  //         console.log(response.data.error);
  //         setContacts([]); // Clear contacts if no messages found
  //       } else {
  //         const contactsWithMessages = response.data.map(contact => contact.contact);
  //         setContacts(contactsWithMessages);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching contacts:', error);
  //     } finally {
  //       setLoadingContacts(false);
  //     }
  //   };
  
  //   fetchContacts();
  // }, [teacherName]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`http://192.168.0.104:5000/LiveChat/messagess/teacher/${teacherName}`);
        if (response.data.error) {
          console.log(response.data.error);
          setContacts([]); // Clear contacts if no messages found
        } else {
          // Extract the sender names from the response
          const contactsWithMessages = response.data.map(item => item.sender);
          setContacts(contactsWithMessages);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };
  
    if (teacherName) {
      fetchContacts();
    }
  }, [teacherName]);
    



  console.log(username+"hfisdgfg");
  
  // Fetch messages for the selected contact
  const loadMessages = (contact) => {
    setCurrentContact(contact);
    setShowContacts(false);  // Hide contacts list
    setLoadingMessages(true);

    axios.get(`http://50.6.194.240:5000/LiveChat/messages/${encodeURIComponent(teacherName)}/${encodeURIComponent(contact)}`)
      .then(response => {
        setMessages(response.data);
        setLoadingMessages(false);
      })
      .catch(error => {
        setLoadingMessages(false);
        console.error('Error fetching messages:', error);
      });
  };

  // Send message to the current contact
  const sendMessage = () => {
    if (messageText.trim()) {
      const messageData = {
        contact: currentContact,
        sender: teacherName,  // Using teacherName as sender
        text: messageText,
      };
  
      axios.post('http://50.6.194.240:5000/LiveChat/messagess', messageData)
        .then(() => {
          // Immediately update the messages state with the new message
          const newMessage = {
            sender: teacherName,
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
  
  

  // Handle new incoming messages from socket
  useEffect(() => {
    socket.on('new_message', (message) => {
      if (message.contact === currentContact) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => socket.off('new_message');  // Cleanup on unmount
  }, [currentContact]);

 
  

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);  // Re-run whenever messages change
  


  const toggleContacts = () => {
    setShowContacts(!showContacts);
    setCurrentContact(null); // Clear the current contact
    setMessages([]);         // Clear the messages list
    setShowContacts(true);   // Show the contacts list
    setMessageText('');   
  };


  return (
    <View style={styles.mobileFrame}>
      {/* Header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleContacts} style={{ marginRight: 20 }}>
            <Icon name="person" type="material" size={wp('10%')} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}> 
            <Icon name="home" type="material" size={wp('10%')} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

      {/* Contacts or Chat */}
      {showContacts ? (
        <View style={styles.contactsContainer}>
          <Text style={styles.contactsHeader}>Contacts</Text>
          {loadingContacts ? (
            <ActivityIndicator size="large" color="#007aff" />
          ) : (
            <ScrollView style={styles.contactsList}>
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactItem}
                    onPress={() => loadMessages(contact)}  // Load messages for the selected contact
                  >
                    <Text style={styles.contactName}>{contact}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No contacts found.</Text>
              )}
            </ScrollView>
          )}
        </View>
      ) : currentContact ? (
        <View style={styles.chatContainer}>
          <Text style={styles.chatHeader}>Chat with {currentContact}</Text>
       
          <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
            {loadingMessages ? (
              <ActivityIndicator size="large" color="#007aff" />
            ) : (
              messages.length > 0 ? (
                messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[styles.chatBubble, msg.sender === teacherName ? styles.sentMessage : styles.receivedMessage]}
                  >
                    {/* Ensure msg.text is a valid string */}
                    <Text style={{ fontSize: 16, color: '#000' }}>
                      {typeof msg.text === 'string' ? msg.text : 'Invalid message'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No messages yet.</Text> 
              )
            )}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Select a contact to start chatting.</Text>
        </View>
      )}

      {/* Input field for sending messages */}
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
    padding: wp('5%'),          // Responsive padding
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: wp('2.5%'),         // Responsive margin
  },
  contactsHeader: {
    fontSize: wp('6%'),         // Responsive font size
    fontWeight: 'bold',
    marginBottom: hp('2%'),     // Responsive margin
  },
  contactsList: {
    maxHeight: hp('50%'),       // Responsive height for the contact list
  },
  contactItem: {
    padding: wp('3%'),          // Responsive padding
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: wp('5%'),         // Responsive font size
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: wp('5%'),          // Responsive padding
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: wp('2.5%'),         // Responsive margin
    borderWidth: 1,
  },
  chatHeader: {
    fontSize: wp('6%'),         // Responsive font size
    fontWeight: 'bold',
    marginBottom: hp('2%'),     // Responsive margin
  },
  chatBubble: {
    padding: wp('3%'),          // Responsive padding
    marginVertical: hp('0.5%'), // Responsive vertical margin
    borderRadius: 15,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#d3d3d3',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: wp('3%'),          // Responsive padding
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: wp('3%'),          // Responsive padding
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  sendButton: {
    backgroundColor: '#007aff',
    paddingVertical: hp('1.5%'),// Responsive vertical padding
    paddingHorizontal: wp('4%'),// Responsive horizontal padding
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2.5%'),     // Responsive margin
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: wp('5%'),         // Responsive font size
    fontWeight: 'bold',
  },
});

export default TeacherMessage;
