import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, Modal } from 'react-native';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';


// Custom Header Component
const CustomHeader = ({ leftComponent, centerComponent, rightComponent }) => {
    return (
        <View style={styles.mainHeader}>
            {leftComponent}
            {centerComponent}
            {rightComponent}
        </View>
    );
};

const ManagementFeeUpload = () => {
    const navigation = useNavigation();
    const [students, setStudents] = useState([]);
    const [installments, setInstallments] = useState([]);
    const [classValue, setClassValue] = useState('');
    const [sectionValue, setSectionValue] = useState('');
    const [completeFee, setCompleteFee] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [paymentClassValue, setPaymentClassValue] = useState('');
    const [paymentSectionValue, setPaymentSectionValue] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalInput, setModalInput] = useState('');
    const [updatedFeeWithFine, setUpdatedFeeWithFine] = useState(0);

    useEffect(() => {
        addInstallmentField();
    }, []);

    useEffect(() => {
        if (paymentClassValue && paymentSectionValue) {
            loadStudents();
        }
    }, [paymentClassValue, paymentSectionValue]);

    const addInstallmentField = () => {
        if (installments.length < 5) { // Restrict to 5 installments
            setInstallments([...installments, { amount: '', deadline: new Date(), fine: '500', totalWithFine: 0 }]);
        } else {
            Alert.alert('Limit Reached', 'You can only add up to 5 installments.');
        }
    };

    const removeInstallment = (index) => {
        const newInstallments = installments.filter((_, i) => i !== index);
        setInstallments(newInstallments);
        calculateUpdatedFeeWithFine(newInstallments);
    };

    const handleInstallmentChange = (index, key, value) => {
        const updatedInstallments = [...installments];
        updatedInstallments[index][key] = value;

        const amount = parseFloat(updatedInstallments[index].amount || 0);
        const fine = parseFloat(updatedInstallments[index].fine || 0);
        updatedInstallments[index].totalWithFine = amount + fine;

        setInstallments(updatedInstallments);
        calculateUpdatedFeeWithFine(updatedInstallments);
    };

    const calculateUpdatedFeeWithFine = (installments) => {
        const totalWithFine = installments.reduce((sum, inst) => sum + (parseFloat(inst.totalWithFine) || 0), 0);
        setUpdatedFeeWithFine(totalWithFine);
    };

    const validateInstallments = () => {
        const totalInstallmentAmount = installments.reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0);
        return totalInstallmentAmount === parseFloat(completeFee || 0);
    };

    const loadStudents = async () => {
        if (paymentClassValue && paymentSectionValue) {
            try {
                const response = await fetch('http://50.6.194.240:5000/api/stu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ className: paymentClassValue, section: paymentSectionValue }),
                });

                const data = await response.json();
                if (response.ok) {
                    if (data.length === 0) {
                        Alert.alert('Info', 'No students found in this class and section.');
                    } else {
                        setStudents(data.map((student) => ({ id: student.id.toString(), name: student.name, balance: student.balance })));
                    }
                } else {
                    Alert.alert('Error', 'Failed to fetch students. Please try again later.');
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch students. Please try again.');
            }
        } else {
            Alert.alert('Error', 'Please select both class and section.');
        }
    };

    const handleStudentIconClick = (studentId) => {
        setSelectedStudent(studentId);
        setModalInput('');
        setShowModal(true);
    };

    const handleModalSubmit = async () => {
        const student = students.find(s => s.id === selectedStudent);
        const paidAmount = parseFloat(modalInput);

        if (!student || paidAmount <= 0 || paidAmount > student.balance) {
            Alert.alert('Error', 'Invalid payment amount.');
            return;
        }

        const data = {
            studentName: student.name,
            paidAmount,
            className: paymentClassValue,
            section: paymentSectionValue,
        };

        try {
            const response = await fetch('http://50.6.194.240:5000/api/api/record-fee-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (result.success) {
                Alert.alert('Success', result.message);
                loadStudents(); // Reload students to get updated balances
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to record payment.');
        } finally {
            setShowModal(false);
        }
    };

    const handleFeeUpload = () => {
        if (!validateInstallments()) {
            Alert.alert('Error', 'Installment amounts must match the complete fee.');
            return;
        }

        const data = {
            FeeClass: classValue,
            FeeSection: sectionValue,
            CompleteFee: completeFee,
            Installments: installments.map((inst, index) => ({
                [`Installment${index + 1}_Amount`]: inst.amount,
                [`Installment${index + 1}_Deadline_Date`]: inst.deadline,
                [`Installment${index + 1}_Fine`]: inst.fine,
            })),
            Class_name: classValue,
            section: sectionValue,
            StudentName: selectedStudent,
            Paid_Amount: parseFloat(paidAmount),
            Final_Amount: updatedFeeWithFine,
        };
        

        fetch('http://50.6.194.240:5000/api/api/upload-fee-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Alert.alert('Success', 'Fee details successfully uploaded!');
                } else {
                    Alert.alert('Error', 'Error uploading fee details, please try again.');
                }
            })
            .catch(() => {
                setResponseMessage('Error uploading fee details, please try again.');
            });
    };

    const handlePaymentAmountChange = (text) => {
        setPaidAmount(text);
        const amount = parseFloat(text) || 0;
        if (updatedFeeWithFine) {
            setRemainingBalance(updatedFeeWithFine - amount);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.mobileFrame}>
                <View style={styles.mainHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('ManagementDashboard')}>
                        <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.navigate('ManagementDashboard')}>
                        <Icon name="home" type="material" size={60} color="#000" />
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.uploadFeeDetails}>
                    <Text style={styles.sectionTitle}>Upload Fee Details</Text>
                </View>

                <Text style={styles.labelText}>Class:</Text>
                <Picker
                    selectedValue={classValue}
                    onValueChange={(itemValue) => setClassValue(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Class" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="10" value="10" />
                </Picker>

                <Text style={styles.labelText}>Section:</Text>
                <Picker
                    selectedValue={sectionValue}
                    onValueChange={(itemValue) => setSectionValue(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Section" value="" />
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="B" value="B" />
                    <Picker.Item label="C" value="C" />
                </Picker>

                <Text style={styles.labelText}>Complete Fee:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Total Fee"
                    keyboardType="numeric"
                    value={completeFee}
                    onChangeText={setCompleteFee}
                />
                <Text style={styles.labelText}>Updated Fee with Fine:</Text>
                <TextInput
                    style={styles.input}
                    value={`₹${updatedFeeWithFine}`}
                    editable={false}
                />

                {installments.map((installment, index) => (
                    <View key={index} style={styles.installment}>
                        <Text style={styles.labelText}>Installment {index + 1}:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Amount"
                            keyboardType="numeric"
                            value={installment.amount}
                            onChangeText={text => handleInstallmentChange(index, 'amount', text)}
                        />
                        <Text style={styles.labelText}>Deadline:</Text>
                        <TouchableOpacity
                            onPress={() =>
                                handleInstallmentChange(index, 'showPicker', !installment.showPicker)
                            }
                        >
                            <Text style={styles.dateText}>
                                {installment.deadline.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                        {installment.showPicker && (
                            <DateTimePicker
                                value={installment.deadline}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    handleInstallmentChange(index, 'deadline', selectedDate || installment.deadline);
                                    handleInstallmentChange(index, 'showPicker', false);
                                }}
                            />
                        )}
                        <Text style={styles.labelText}>Fine Amount:</Text>
                        <Picker
                            selectedValue={installment.fine}
                            onValueChange={(value) => handleInstallmentChange(index, 'fine', value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="₹0" value="0" />
                            <Picker.Item label="₹500" value="500" />
                            <Picker.Item label="₹1000" value="1000" />
                            <Picker.Item label="₹2000" value="2000" />
                        </Picker>
                        <Text style={styles.fineText}>Total (with fine): ₹{installment.totalWithFine}</Text>

                        <TouchableOpacity
                            style={styles.removeInstallmentButton}
                            onPress={() => removeInstallment(index)}
                        >
                            <Text style={styles.removeInstallmentButtonText}>Remove Installment</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.addInstallmentButton} onPress={addInstallmentField}>
                    <Text style={styles.addInstallmentButtonText}>Add Installment</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={handleFeeUpload}>
                    <Text style={styles.uploadButtonText}>Upload Fee Details</Text>
                </TouchableOpacity>
                <Text>{responseMessage}</Text>

                <Text style={styles.sectionTitle}>Record Fee Payment</Text>
                <Text style={styles.labelText}>Class:</Text>
                <Picker selectedValue={paymentClassValue} onValueChange={setPaymentClassValue} style={styles.picker}>
                    <Picker.Item label="Select Class" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="6" value="6" />
                    <Picker.Item label="7" value="7" />
                    <Picker.Item label="8" value="8" />
                    <Picker.Item label="9" value="9" />
                    <Picker.Item label="10" value="10" />

                </Picker>
                <Text style={styles.labelText}>Section:</Text>
                <Picker selectedValue={paymentSectionValue} onValueChange={setPaymentSectionValue} style={styles.picker}>
                    <Picker.Item label="Select Section" value="" />
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="B" value="B" />
                    <Picker.Item label="C" value="C" />

                </Picker>
                <TouchableOpacity style={[styles.loadButton, { backgroundColor: 'rgb(160, 180,182)' }]} onPress={loadStudents}>
                    <Text style={styles.loadButtonText}>Load Students</Text>
                </TouchableOpacity>


                {students.length > 0 ? (
                    <View style={styles.studentCirclesContainer}>
                        {students.map((student) => (
                            <TouchableOpacity
                                key={student.id}
                                style={styles.studentCircleWrapper}
                                onPress={() => handleStudentIconClick(student.id)}
                            >
                                <Text style={styles.studentName}>{student.name}</Text>
                                <View style={styles.studentCircle}>
                                    <Icon
                                        name="person"
                                        type="material"
                                        size={40}
                                        color="#fff"
                                        style={styles.studentIcon}
                                    />
                                </View>
                                <Text style={styles.remainingFeeText}>
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noStudentsText}>No students loaded. Please select a class and section.</Text>
                )}


                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Enter Paid Amount for {students.find(student => student.id === selectedStudent)?.name}
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter Paid Amount"
                                value={modalInput}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setModalInput(numericValue);
                                }}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity onPress={handleModalSubmit} style={styles.modalSubmitButton}>
                                <Text style={styles.modalSubmitButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalCloseButton}>
                                <Text style={styles.modalCloseButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        marginLeft: 8,
    },
    mainHeader: {
        backgroundColor: 'rgb(160, 180, 182)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    logo: {
        width: 80,
        height: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    subHeader: {
        height: 10,
        backgroundColor: '#34495e',
    },
    sectionTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    picker: {
        height: 50,  // Adjust the height
        marginVertical: 10,  // Vertical margin between the Picker and other elements
        backgroundColor: '#f0f0f0',  // Light background color
        borderRadius: 8,  // Rounded corners
        borderWidth: 1,  // Border around the Picker
        borderColor: '#ccc',  // Border color
        paddingHorizontal: 10,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    labelText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    fineText: {
        fontSize: 16,
        marginTop: 10,
        color: 'green',
    },
    addInstallmentButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
        marginVertical: 20,
    },
    addInstallmentButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    uploadButton: {
        backgroundColor: 'rgb(160, 180,182)',
        padding: 15,
        alignItems: 'center',
        marginVertical: 20,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    removeInstallmentButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    removeInstallmentButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    loadButton: {
        backgroundColor: '#8e44ad',
        padding: 15,
        alignItems: 'center',
        marginVertical: 10,
    },
    loadButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    studentCirclesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    studentCircleWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    studentName: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginBottom: 5,
    },
    studentCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgb(160, 180,182)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    studentIcon: {
        width: 40,
        height: 40,
    },
    noStudentsText: {
        fontSize: 14,
        color: '#e74c3c',
        textAlign: 'center',
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalInput: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginVertical: 10,
    },
    modalSubmitButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalSubmitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalCloseButton: {
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    emptyHeader: {
        height: 30,
        backgroundColor: 'rgb(160, 180, 182)',
        marginTop: 2,
        elevation: 2,
    },

});

export default ManagementFeeUpload;
