import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IP_ADDRESS } from '../../config';
import moment from 'moment-timezone';

const ClassSpecsScreen = ({ route, navigation }) => {
    const { theClass, from, branch } = route.params;
    console.error(theClass)
    const [className, setClassName] = useState(theClass.className)
    const [instructor, setInstructor] = useState(theClass.instructor)
    const [schedule, setSchedule] = useState(new Date(theClass.startDate))
    const [scheduleEnd, setScheduleEnd] = useState(theClass.endDate ? new Date(theClass.endDate) : new Date(theClass.the_time))
    const [days, setDays] = useState(theClass.days || 'Monday')
    const [the_date, setTheDate] = useState(theClass.the_date)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showDateEndPicker, setShowDateEndPicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [availability, setAvailability] = useState(theClass.availability)
    const [dateChanged, setDateChanged] = useState(false);
    const [timeChanged, setTimeChanged] = useState(false);
    const [description, setDescription] = useState(theClass.description || "")
    const [capacity, setCapacity] = useState(theClass.capacity || 10)
    const [participants, setParticipants] = useState(theClass.participants)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const [newTime, setNewTime] = useState(new Date());
    const [showNewTimePicker, setShowNewTimePicker] = useState(false);
    // const addTime = () => {
    //     if (Array.isArray(the_date) && the_date.length > 0) {
    //         setTheDate([newTime]);
    //         // setTheDate([...the_date, newTime]);
    //     } else {
    //         setTheDate([newTime]);
    //     }

    //     setNewTime(new Date());
    // }
    const addTime = () => {
        // Append new time to the existing `the_date` array
        setTheDate([...the_date, newTime]);

        // Reset the new time state for the next selection
        setNewTime(new Date());
    }


    const removeTime = (index) => {
        const updatedTimes = the_date.filter((_, i) => i !== index);
        setTheDate(updatedTimes);
    }



    useEffect(() => {
        if (theClass.availability == "Available") {
            setIsEnabled(true)
        } else {
            setIsEnabled(false)
        }
    }, [theClass])
    useEffect(() => {
        if (isEnabled) {
            setAvailability("Available")
        } else {
            setAvailability("Locked")
        }
    }, [isEnabled])
    console.log("The Class => ")
    console.log(theClass)
    console.log("From => ")
    console.log(from)
    console.log("Branch => ")
    console.log(branch)
    console.log("===========================================")
    // const handleSubmit = () => {
    //     the_startdate = new Date(Date.UTC(schedule.getUTCFullYear(), schedule.getUTCMonth(), schedule.getUTCDate(), 10, 10));
    //     // console.log(`The Date Before Send = ${the_date}`)
    //     the_startdate = the_startdate.toISOString()

    //     the_timeEnd = new Date(Date.UTC(scheduleEnd.getUTCFullYear(), scheduleEnd.getUTCMonth(), scheduleEnd.getUTCDate(), 10, 10));
    //     the_timeEnd = the_timeEnd.toISOString()
    //     // console.log(`Sending The Date As  = ${the_date}`)
    //     //&schedule=${the_date}
    //     fetch(`${IP_ADDRESS}/update_classNew`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: JSON.stringify({
    //             'className': className,
    //             'instructor': instructor,
    //             'id': theClass.id,
    //             'availability': availability,
    //             'startDate': the_startdate,
    //             'endDate': the_timeEnd,
    //             'description': description,
    //             'capacity': capacity,
    //             'days': days,
    //             'branch': branch,
    //             'the_date': the_date
    //         }),
    //         /* className=${className}
    //           instructor=${instructor}
    //           id=${theClass.id}
    //           availability=${availability}
    //           description=${description}
    //           capacity=${capacity}
    //           schedule=${the_date}`
    //         */

    //     })
    //         .then(res => {
    //             if (res.status == 200) {
    //                 navigation.navigate(from, { branch, refresh: Math.random() });
    //             }
    //         }).catch(err => {
    //             console.log(err)
    //         })
    // }
    
    const handleSubmit = () => {
        // Detect user's timezone
        const userTimeZone = "Asia/Beirut"; // Adjust as needed for other UTC+2 zones
       // const userTimeZone = moment.tz.guess();   PierreTimeEdit
        console.log("User's Time Zone:", userTimeZone);

        // Convert startDate to the user's timezone
        const the_startdate = moment
            .utc(schedule) // Parse as UTC
            .tz(userTimeZone) // Convert to user's timezone
            .format();

        console.log("Converted Start Date (the_startdate):", the_startdate);

        // Convert endDate to the user's timezone
        const the_timeEnd = moment
            .utc(scheduleEnd) // Parse as UTC
            .tz(userTimeZone) // Convert to user's timezone
            .format();

        console.log("Converted End Date (the_timeEnd):", the_timeEnd);

        // Convert 'the_date' array to ISO strings in user's timezone
        const theDateInUserTimezone = Array.isArray(the_date)
            ? the_date.map(date =>
                moment.utc(date).tz(userTimeZone).format() // Convert each date to ISO string in user's timezone
            )
            : moment.utc(the_date).tz(userTimeZone).format(); // If the_date is a single date

        console.log("Converted Dates Array (the_date):", theDateInUserTimezone);

        // Prepare the payload
        const payload = {
            className: className,
            instructor: instructor,
            id: theClass.id,
            availability: availability,
            startDate: the_startdate,
            endDate: the_timeEnd,
            description: description,
            capacity: capacity,
            days: days,
            branch: branch,
            the_date: theDateInUserTimezone, // Sending as UNIX timestamps
        };

        console.log("Updating Class with Payload:", JSON.stringify(payload));

        // Make the API request
        fetch(`${IP_ADDRESS}/update_classNew`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (res.status === 200) {
                    navigation.navigate(from, { branch, refresh: Math.random() });
                }
            })
            .catch(err => {
                console.error("Error updating class:", err);
            });
    };


    return (
        <LinearGradient colors={["#666", "#000"]} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ ...styles.formContainer, paddingBottom: 150, marginTop: 90 }}>
                <Text style={styles.formTitle}>Updating Class</Text>
                <Text style={styles.formTitle}>{className}</Text>

                {/* <Text style={styles.label}>Class Name:</Text> */}
                {/* <TextInput
                    style={styles.input}
                    placeholder="Class Name"
                    placeholderTextColor="#777"
                    value={className}
                    onChangeText={(text) => setClassName(text)}
                /> */}

                {/* <Text style={styles.label}>Instructor:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Instructor"
                    placeholderTextColor="#777"
                    value={instructor}
                    onChangeText={(text) => setInstructor(text)}
                /> */}

                {/* <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    placeholderTextColor="#777"
                    value={description || ''}
                    multiline={true}
                    onChangeText={(text) => setDescription(text)}
                /> */}

                {/* <Text style={styles.label}>Capacity:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Capacity"
                    placeholderTextColor="#777"
                    value={String(capacity)}
                    inputMode='numeric'
                    onChangeText={(text) => setCapacity(parseInt(text) || 10)}
                    keyboardType='numeric'
                /> */}

                {/* <Text style={styles.label}>Registered:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Participants"
                    placeholderTextColor="#777"
                    value={String(participants)}
                    inputMode='numeric'
                    keyboardType='numeric'
                    editable={false}
                /> */}

                <Text style={styles.label}>Starting Date:</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePicker}
                >
                    <FontAwesome
                        name="calendar"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                    <Text style={styles.dateText}>
                        {schedule ? `${String(schedule.getDate()).padStart(2, '0')}-${String(schedule.getMonth() + 1).padStart(2, '0')}-${String(schedule.getFullYear())}` : "Select Date"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Ending Date:</Text>
                <TouchableOpacity
                    onPress={() => setShowDateEndPicker(true)}
                    style={styles.datePicker}
                >
                    <FontAwesome
                        name="calendar"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                    <Text style={styles.dateText}>
                        {scheduleEnd ? `${String(scheduleEnd.getDate()).padStart(2, '0')}-${String(scheduleEnd.getMonth() + 1).padStart(2, '0')}-${String(scheduleEnd.getFullYear())}` : "Select Date"}
                    </Text>
                </TouchableOpacity>

                <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Times:</Text>
                    {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {Array.isArray(the_date) && the_date.length > 0 ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                                <Text style={{ color: '#E0E0E0', marginRight: 5 }}>
                                    {(() => {

                                        const time = new Date(the_date[0]);
                                        return (`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`);
                                    })()}
                                </Text>
                                <TouchableOpacity onPress={() => removeTime(0)}>
                                    <FontAwesome name="trash" size={16} color="red" />
                                </TouchableOpacity>
                            </View>
                        )
                            : (
                                <Text style={{ fontSize: 14, color: '#E0E0E0' }}>No times available</Text>
                            )}
                    </View> */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {Array.isArray(the_date) && the_date.length > 0 ? (
                            the_date.map((date, index) => {
                                const time = new Date(date);
                                // Check if time is valid
                                if (isNaN(time.getTime())) {
                                    return null; // If the date is invalid, skip rendering
                                }
                                const hours = time.getHours();
                                const minutes = time.getMinutes();
                                const formattedHours = String(hours % 12 || 12).padStart(2, '0');
                                const formattedMinutes = String(minutes).padStart(2, '0');
                                const period = hours >= 12 ? 'PM' : 'AM';

                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                                        <Text style={{ color: '#E0E0E0', marginRight: 5 }}>
                                            {`${formattedHours}:${formattedMinutes} ${period}`}
                                        </Text>
                                        <TouchableOpacity onPress={() => removeTime(index)}>
                                            <FontAwesome name="trash" size={16} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={{ fontSize: 14, color: '#E0E0E0' }}>No times available</Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                        <TouchableOpacity
                            onPress={() => setShowNewTimePicker(true)}
                            style={{
                                flex: 1,
                                borderColor: '#303030',
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 15,
                                backgroundColor: '#1E1E1E',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginRight: 10,
                            }}
                        ><FontAwesome name="hourglass" size={20} color="white" />
                            {/* <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                                {`${String(newTime.getHours()).padStart(2, '0')}:${String(newTime.getMinutes()).padStart(2, '0')}`}
                            </Text> */}

                            <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                                {`${String(newTime.getHours() % 12 || 12).padStart(2, '0')}:${String(newTime.getMinutes()).padStart(2, '0')} ${newTime.getHours() >= 12 ? 'PM' : 'AM'}`}
                            </Text>

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={addTime}
                            style={{
                                flex: 1,
                                borderColor: '#303030',
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 15,
                                backgroundColor: '#1E1E1E',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text style={{ flex: 1, color: '#E0E0E0', fontSize: 16, textAlign: 'center' }}>Add Time</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.label}>Every:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={days}
                    onValueChange={(itemValue) => setDays(itemValue)}
                >
                    <Picker.Item label="Select Day" value={null} />
                    {daysOfWeek.map((value, index) => (
                        <Picker.Item key={index} value={value} label={value} />
                    ))}
                </Picker>

                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Class {isEnabled ? "Available" : "Locked"} :</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: 'gray' }}
                        thumbColor={isEnabled ? '#f4f3f4' : 'gray'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={schedule ? schedule : new Date()}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            setDateChanged(true);
                            setSchedule(selectedDate || schedule);
                        }}
                    />
                )}

                {showDateEndPicker && (
                    <DateTimePicker
                        testID="dateEndPicker"
                        value={scheduleEnd ? scheduleEnd : new Date()}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDateEndPicker(false);
                            setDateChanged(true);
                            setScheduleEnd(selectedDate || scheduleEnd);
                        }}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={schedule ? schedule : new Date()}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            setTimeChanged(true);
                            setTime(selectedDate || schedule);
                        }}
                    />
                )}
                {showNewTimePicker && (
                    <DateTimePicker
                        testID="newTimePicker"
                        value={newTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowNewTimePicker(false);
                            if (selectedDate) {
                                setNewTime(selectedDate);
                            }
                        }}
                        onCancel={() => setShowNewTimePicker(false)}
                    />
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const ClassSpecsScreenSuperAdmin = ({ route, navigation }) => {
    const { theClass, from, branch } = route.params;
    console.error(theClass)
    const [className, setClassName] = useState(theClass.className)
    const [instructor, setInstructor] = useState(theClass.instructor)
    const [startDate, setStartDate] = useState(new Date(theClass.startDate))
    const [endDate, setEndDate] = useState(theClass.endDate ? new Date(theClass.endDate) : new Date(theClass.the_time))
    const [days, setDays] = useState(theClass.days || 'Monday')
    const [the_date, setTheDate] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showDateEndPicker, setShowDateEndPicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [availability, setAvailability] = useState(theClass.availability)
    const [dateChanged, setDateChanged] = useState(false);
    const [timeChanged, setTimeChanged] = useState(false);
    const [description, setDescription] = useState(theClass.description || "")
    const [capacity, setCapacity] = useState(theClass.capacity || 10)
    const [participants, setParticipants] = useState(theClass.participants)
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [showNewTimePicker, setShowNewTimePicker] = useState(false);
    const [theDates, setTheDates] = useState([])
    const [newTime, setNewTime] = useState(new Date());
    const addTime = () => {
        // Append new time to the existing `the_date` array
        setTheDate([...the_date, newTime]);

        // Reset the new time state for the next selection
        setNewTime(new Date());
    }

    const removeTime = (index) => {
        const updatedTimes = the_date.filter((_, i) => i !== index);
        setTheDate(updatedTimes);
    }
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']



    useEffect(() => {
        if (theClass.availability == "Available") {
            setIsEnabled(true)
        } else {
            setIsEnabled(false)
        }
    }, [theClass])
    useEffect(() => {
        if (isEnabled) {
            setAvailability("Available")
        } else {
            setAvailability("Locked")
        }
    }, [isEnabled])

    useEffect(() => {
        setStartDate(new Date(theClass.startDate))
        setEndDate(new Date(theClass.endDate))
        setDays(theClass.days)
        setTheDate(theClass.the_date)
        setDescription(theClass.description)
        setCapacity(theClass.capacity)
        setParticipants(theClass.participants)
        setAvailability(theClass.availability)
        setIsEnabled(theClass.availability == "Available")
    }, [theClass])
    console.log(theClass)
    console.log(from)
    console.log(branch)
    // const handleSubmit = () => {
    //     the_dates = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 10, 10));
    //     // console.log(`The Date Before Send = ${the_date}`)
    //     the_dates = the_dates.toISOString()

    //     the_timeEnd = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 10, 10));
    //     the_timeEnd = the_timeEnd.toISOString()
    //     // console.log(`Sending The Date As  = ${the_date}`)
    //     //&schedule=${the_date}
    //     console.log('Updating Class ')
    //     console.log(JSON.stringify({
    //         'className': className,
    //         'instructor': instructor,
    //         'id': theClass.id,
    //         'availability': availability,
    //         'startDate': the_dates,
    //         'endDate': the_timeEnd,
    //         'description': description,
    //         'capacity': capacity,
    //         'days': days,
    //         'branch': branch.branchID,
    //         'the_date': the_date
    //     }))
    //     fetch(`${IP_ADDRESS}/update_classNew`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: JSON.stringify({
    //             'className': className,
    //             'instructor': instructor,
    //             'id': theClass.id,
    //             'availability': availability,
    //             'startDate': the_dates,
    //             'endDate': the_timeEnd,
    //             'description': description,
    //             'capacity': capacity,
    //             'days': days,
    //             'branch': branch.branchID,
    //             'the_date': the_date
    //         }),
    //         /* className=${className}
    //           instructor=${instructor}
    //           id=${theClass.id}
    //           availability=${availability}
    //           description=${description}
    //           capacity=${capacity}
    //           schedule=${the_date}`
    //         */

    //     })
    //         .then(res => {
    //             if (res.status == 200) {
    //                 navigation.navigate(from, { branch, refresh: Math.random() });
    //             }
    //         }).catch(err => {
    //             console.log(err)
    //         })
    // }

    const handleSubmit = () => {
        // Detect user's current timezone
        const userTimeZone = moment.tz.guess();
        console.log("User's Time Zone:", userTimeZone);

        // Convert startDate to user's timezone
        const the_dates = moment
            .utc(startDate) // Parse as UTC
            .tz(userTimeZone) // Convert to user's timezone
            .format();

        console.log("Converted Start Date (the_dates):", the_dates);

        // Convert endDate to user's timezone
        const the_timeEnd = moment
            .utc(endDate) // Parse as UTC
            .tz(userTimeZone) // Convert to user's timezone
            .format();

        console.log("Converted End Date (the_timeEnd):", the_timeEnd);

        // Convert the_date array to user's timezone
        const convertedDates = the_date.map(date =>
            moment.utc(date).tz(userTimeZone).format()
        );

        console.log("Converted Dates Array (the_date):", convertedDates);

        // Prepare the payload
        const payload = {
            className: className,
            instructor: instructor,
            id: theClass.id,
            availability: availability,
            startDate: the_dates,
            endDate: the_timeEnd,
            description: description,
            capacity: capacity,
            days: days,
            branch: branch.branchID,
            the_date: convertedDates,
        };

        console.log("Updating Class with Payload:", JSON.stringify(payload));

        // Send the updated data
        fetch(`${IP_ADDRESS}/update_classNew`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (res.status === 200) {
                    navigation.navigate(from, { branch, refresh: Math.random() });
                }
            })
            .catch(err => {
                console.error("Error updating class:", err);
            });
    };

    return (
        <LinearGradient colors={["#000", "#333"]} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ ...styles.formContainer, paddingBottom: 150, marginTop: 90 }}>
                <Text style={styles.formTitle}>Updating Class</Text>
                <Text style={styles.formTitle}>{className}</Text>

                {/* <Text style={styles.label}>Class Name:</Text> */}
                {/* <TextInput
                    style={styles.input}
                    placeholder="Class Name"
                    placeholderTextColor="#777"
                    value={className}
                    onChangeText={(text) => setClassName(text)}
                /> */}

                {/* <Text style={styles.label}>Instructor:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Instructor"
                    placeholderTextColor="#777"
                    value={instructor}
                    onChangeText={(text) => setInstructor(text)}
                /> */}

                <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    placeholderTextColor="#777"
                    value={description || ''}
                    multiline={true}
                    onChangeText={(text) => setDescription(text)}
                />

                <Text style={styles.label}>Capacity:</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Capacity"
                    placeholderTextColor="#777"
                    value={String(capacity)}
                    inputMode='numeric'
                    onChangeText={(text) => setCapacity(parseInt(text) || '')}
                    keyboardType='numeric'
                />
                {/* <TextInput
                    style={styles.input}
                    placeholder="Capacity"
                    placeholderTextColor="#777"
                    value={String(capacity)}
                    inputMode='numeric'
                    onChangeText={(text) => setCapacity(parseInt(text) || 10)}
                    keyboardType='numeric'
                /> */}

                {/* <Text style={styles.label}>Registered:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Participants"
                    placeholderTextColor="#777"
                    value={String(participants)}
                    inputMode='numeric'
                    keyboardType='numeric'
                    editable={false}
                /> */}

                <Text style={styles.label}>Starting Date:</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePicker}
                >
                    <FontAwesome
                        name="calendar"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                    <Text style={styles.dateText}>
                        {startDate ? `${String(startDate.getDate()).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getFullYear())}` : "Select Date"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Ending Date:</Text>
                <TouchableOpacity
                    onPress={() => setShowDateEndPicker(true)}
                    style={styles.datePicker}
                >
                    <FontAwesome
                        name="calendar"
                        size={24}
                        color="white"
                        style={styles.icon}
                    />
                    <Text style={styles.dateText}>
                        {endDate ? `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getFullYear())}` : "Select Date"}
                    </Text>
                </TouchableOpacity>

                <View style={{ marginBottom: 25 }}>
                    <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Times:</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {Array.isArray(the_date) && the_date.length > 0 ? (
                            the_date.map((date, index) => {
                                const time = new Date(date);
                                // Check if time is valid
                                if (isNaN(time.getTime())) {
                                    return null; // If the date is invalid, skip rendering
                                }
                                const hours = time.getHours();
                                const minutes = time.getMinutes();
                                const formattedHours = String(hours % 12 || 12).padStart(2, '0');
                                const formattedMinutes = String(minutes).padStart(2, '0');
                                const period = hours >= 12 ? 'PM' : 'AM';

                                return (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                                        <Text style={{ color: '#E0E0E0', marginRight: 5 }}>
                                            {`${formattedHours}:${formattedMinutes} ${period}`}
                                        </Text>
                                        <TouchableOpacity onPress={() => removeTime(index)}>
                                            <FontAwesome name="trash" size={16} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={{ fontSize: 14, color: '#E0E0E0' }}>No times available</Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                        {/* Button to select and add new time */}
                        <TouchableOpacity
                            onPress={setShowNewTimePicker.bind(this, true)}
                            style={{
                                flex: 1,
                                borderColor: '#303030',
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 15,
                                backgroundColor: '#1E1E1E',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginRight: 10,
                            }}
                        >
                            <FontAwesome name="hourglass" size={20} color="white" />
                            <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                                {`${String(newTime.getHours() % 12 || 12).padStart(2, '0')}:${String(newTime.getMinutes()).padStart(2, '0')} ${newTime.getHours() >= 12 ? 'PM' : 'AM'}`}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={addTime}
                            style={{
                                flex: 1,
                                borderColor: '#303030',
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 15,
                                backgroundColor: '#1E1E1E',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text style={{ flex: 1, color: '#E0E0E0', fontSize: 16, textAlign: 'center' }}>Add Time</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <Text style={styles.label}>Every:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={days}
                    onValueChange={(itemValue) => setDays(itemValue)}
                >
                    <Picker.Item label="Select Day" value={null} />
                    {daysOfWeek.map((value, index) => (
                        <Picker.Item key={index} value={value} label={value} />
                    ))}
                </Picker>

                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Class {isEnabled ? "Available" : "Locked"} :</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: 'gray' }}
                        thumbColor={isEnabled ? '#f4f3f4' : 'gray'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={startDate ? startDate : new Date()}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            setDateChanged(true);
                            setStartDate(selectedDate || startDate);
                        }}
                    />
                )}

                {showDateEndPicker && (
                    <DateTimePicker
                        testID="dateEndPicker"
                        value={endDate ? endDate : new Date()}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDateEndPicker(false);
                            setDateChanged(true);
                            setEndDate(selectedDate || endDate);
                        }}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        testID="timePicker"
                        value={startDate ? startDate : new Date()}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            setTimeChanged(true);
                            setTime(selectedDate || schedule);
                        }}
                    />
                )}
                {showNewTimePicker && (
                    <DateTimePicker
                        testID="newTimePicker"
                        value={newTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowNewTimePicker(false);
                            if (selectedDate) {
                                setNewTime(selectedDate);
                            }
                        }}
                        onCancel={() => setShowNewTimePicker(false)}
                    />
                )}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flexGrow: 1,
        padding: 20,
        marginBottom: 300,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        color: 'white',
        backgroundColor: '#222',
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#222',
        borderRadius: 5,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    dateText: {
        color: 'white',
    },
    picker: {
        height: 50,
        color: 'white',
        backgroundColor: '#222',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    switchLabel: {
        color: 'white',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#444',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ClassSpecsScreen;
export { ClassSpecsScreenSuperAdmin };
