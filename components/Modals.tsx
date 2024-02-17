import React, { useState } from "react";
import {
  View,
  Modal,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from "@rneui/themed";
import { Button } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { AddTask } from "../redux/slices/AddTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import shortid from "shortid";
import Toast from "react-native-simple-toast";
//Interface for Props
interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
}
//Interface for Categories
interface Categories {
  key: string;
  value: string;
}
//Interface for NewTask
interface NewTask {
  taskid: string;
  title: string;
  category: string;
  deadline: string;
  description: string;
  status: number;
}
const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose }) => {
  // Accessing all tasks from the Redux store using useSelector
  const AllTasks = useSelector((state: any) => state.addtask);

  // Dispatch function from Redux to dispatch actions
  const dispatch = useDispatch();

  // State variables to manage input values for the new task
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [catagory, setcatagory] = useState<string>("");
  const [date, setdate] = useState<string>("");
  const [added, setadded] = useState<boolean>(false);
  //defining categoris
  const mycatagories: Categories[] = [
    { key: "1", value: "Work" },
    { key: "2", value: "Home" },
    { key: "3", value: "Study" },
    { key: "4", value: "Ropstam" },
  ];
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  React.useEffect(() => {
    saveTasks(AllTasks);
  }, [added]);

  // Function to handle the confirmation of date selection from the date picker
  const handleConfirm = (date: any) => {
    // Parse the selected date
    const parsedDate = new Date(date);

    // Extract year, month, and day from the parsed date
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();

    // Create a formatted date string with leading zeros if necessary
    const formattedDate = `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;

    // Set the formatted date to the state and hide the date picker
    setdate(formattedDate);
    setDatePickerVisibility(false);
  };
  // Function to handle changes in the task title input
  const handleTitleChange = (text: string) => {
    // Check if the length of the input text reaches the maximum limit
    if (text.length === 35) {
      // Show a toast message indicating that the maximum character limit has been reached
      Toast.show("Max Character Limit Reached", 1000);
      return; // Exit the function
    }

    // Update the state with the input text
    setTitle(text);
  };
  // Function to save tasks to AsyncStorage
  const saveTasks = async (newTask: NewTask[]) => {
    // Check if there are no tasks to save
    if (newTask.length < 1) {
      return; // Exit the function
    }

    try {
      // Convert the new task array to a JSON string and save it to AsyncStorage
      await AsyncStorage.setItem("TodoTasks", JSON.stringify(newTask));

      // Show a toast message indicating that the task was added successfully
      Toast.show("Task Added Successfully!", Toast.CENTER);
    } catch (error) {
      // Handle errors when saving tasks
      console.error("Error saving tasks", error);
    }
  };

  // Function to handle adding a new task
  const handleAdd = async () => {
    // Check if the title field is empty
    if (!title) {
      // Show a toast message prompting the user to add a title
      Toast.show("Please Add Title", Toast.CENTER);
      return; // Exit the function
    }
    // Check if the date field is empty
    else if (!date) {
      // Show a toast message prompting the user to choose a deadline
      Toast.show("Please Choose Deadline", Toast.CENTER);
      return; // Exit the function
    }
    // Check if the category field is empty
    else if (!catagory) {
      // Show a toast message prompting the user to select a category
      Toast.show("Please Select Catagory", Toast.CENTER);
      return; // Exit the function
    }

    // Create a new task object with the provided title, description, category, deadline, and status
    const newTask: NewTask = {
      title: title,
      taskid: shortid.generate(),
      description: description,
      category: catagory,
      deadline: date,
      status: 0,
    };

    try {
      // Dispatch an action to add the new task to the store
      dispatch(AddTask(newTask));

      // Toggle the added flag to trigger a re-render
      setadded(!added);
    } catch (error) {
      // Show a toast message if an error occurs while adding the task
      Toast.show("An Error Occurred. Please Try Again!", Toast.CENTER);
    }

    // Reset input fields and close the modal
    setTitle("");
    setDescription("");
    setcatagory("");
    setdate("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Add New Task </Text>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={handleTitleChange}
            multiline={true}
            maxLength={35}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "7%",
            }}
          >
            <SelectList
              placeholder="Category"
              setSelected={(catagory: string) => setcatagory(catagory)}
              data={mycatagories}
              save="value"
              dropdownStyles={{
                zIndex: 999,
                backgroundColor: "white",
                position: "absolute",
                width: 150,
                top: 35,
              }}
              boxStyles={{
                maxWidth: 140,
              }}
            />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                borderRadius: 12,
                borderColor: "black",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                paddingRight: 7,
              }}
              onPress={() => {
                setDatePickerVisibility(true);
              }}
            >
              <Icon
                style={{ alignSelf: "center" }}
                name="calendar"
                type="evilicon"
                color="red"
                size={40}
              />
              <Text style={{ fontSize: 14, fontWeight: "400" }}>
                {date != "" ? date : "Deadline"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => {
                setDatePickerVisibility(false);
              }}
              minimumDate={new Date()}
            />
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (Optional)"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Discard"
              icon={{
                name: "close",
                type: "font-awesome",
                size: 15,
                color: "white",
              }}
              onPress={() => {
                setTitle("");
                setDescription("");
                setcatagory("");
                setdate("");
                onClose();
              }}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                backgroundColor: "rgba(199, 43, 98, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30,
              }}
              containerStyle={{
                width: "45%",

                marginVertical: 10,
              }}
            />
            <Button
              title="Add Task"
              icon={{
                name: "check",
                type: "font-awesome",
                size: 15,
                color: "white",
              }}
              onPress={handleAdd}
              iconRight
              iconContainerStyle={{ marginLeft: 10 }}
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30,
              }}
              containerStyle={{
                width: "45%",

                marginVertical: 10,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  btn: {},
  header: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "500",
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: "auto",
    overflow: "scroll",
    elevation: 5, // Shadow for Android
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  textArea: {
    height: "35%",
    textAlignVertical: "top", // For multiline TextInput
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

export default TaskModal;
