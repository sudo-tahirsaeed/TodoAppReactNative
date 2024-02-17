import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SearchBar } from "@rneui/themed";
import { Chip } from "@rneui/themed";
import TaskModal from "../components/Modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import { AddTask } from "../redux/slices/AddTask";
import TaskTiles from "../components/TaskTiles";
import styles from "../Styles/MyStyles";
//Creating Interface for our task, status 0 for pending 1 for completed
interface Tasks {
  taskid: string;
  title: string;
  category: string;
  deadline: string;
  description: string;
  status: number;
}
export default function Main() {
  // AllTasks state obtained from Redux store
  var AllTasks = useSelector((state: any) => state.addtask);
  // State to store tasks locally
  const [mytasks, setmyTasks] = React.useState(AllTasks);
  // Redux dispatch function
  const dispatch = useDispatch();
  // State to store search input value
  const [value, setValue] = React.useState("");
  // State to control the visibility of modal
  const [showModal, setShowModal] = React.useState<boolean>(false);
  // State to store selected chip value
  const [chipVal, setChip] = React.useState<number>(3);
  // State to control loading state
  const [load, setload] = React.useState<boolean>(false);
  // State to control sorting tasks by date
  const [bydate, setbydate] = React.useState<boolean>(false);
  //Loading Tasks Initially
  React.useEffect(() => {
    loadTasks();
  }, []);
  //Updates whenever filter changes or search
  React.useEffect(() => {
    modifyTasks(chipVal);
  }, [chipVal, load, value]);
  // Function to modify tasks based on filters
  const modifyTasks = (val: number) => {
    // Resetting the 'bydate' state to false
    setbydate(false);
    // If a search query exists, filter tasks based on the search query
    if (value) {
      // Resetting the chip filter to 'All' while searching
      setChip(3);
      // Filtering tasks based on the search query
      const filteredData = AllTasks.filter((task: Tasks) =>
        task.title.toLowerCase().includes(value.toLowerCase())
      );
      // Updating the state to display the filtered tasks
      setmyTasks(filteredData);
    } else {
      // Filter for 'All' tasks
      if (val === 3) {
        // Set the tasks to display all tasks
        setmyTasks(AllTasks);
        return;
      }
      // Filter for sorting tasks by date, newest first
      if (val == 4) {
        // Format deadline dates and sort tasks by deadline
        const tasksWithFormattedDates = AllTasks.map((task: Tasks) => {
          const parts = task.deadline.split("-");
          const formattedDeadline = `${parts[0]}-${parts[1]}-${parts[2]}`;
          return {
            ...task,
            deadline: formattedDeadline,
          };
        });
        const sortedTasks = [...tasksWithFormattedDates].sort((a, b) => {
          const dateA = new Date(b.deadline);
          const dateB = new Date(a.deadline);
          return dateB.getTime() - dateA.getTime();
        });
        // Update the state to display sorted tasks by date
        setmyTasks(sortedTasks);
        // Set the 'bydate' state to true
        setbydate(true);
        return;
      }
      // Filter tasks based on status (Pending/Completed)
      const filteredTasks = AllTasks.filter(
        (task: Tasks) => task.status === val
      );
      // Update the state to display filtered tasks
      setmyTasks(filteredTasks);
    }
  };
  // Function to load tasks from AsyncStorage and dispatch to redux
  const loadTasks = async () => {
    try {
      // Load tasks from AsyncStorage
      const storedTasks = await AsyncStorage.getItem("TodoTasks");
      if (storedTasks) {
        // Parse the stored tasks and dispatch to Redux store
        const taskArray: Tasks[] = JSON.parse(storedTasks);
        dispatch(AddTask(taskArray));
        // Toggle the 'load' state to trigger re-render
        setload(!load);
      }
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };
  //Our Main Screen with necessary components
  return (
    <View style={styles.container}>
      <TaskModal
        visible={showModal}
        onClose={() => {
          setShowModal(!showModal);
          setload(!load);
        }}
      ></TaskModal>
      <View style={styles.card}>
        <Text style={styles.header}>Welcome to Ropstam Todos </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setShowModal(true);
        }}
        style={styles.addButtonr}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 36 }}>
          +
        </Text>
      </TouchableOpacity>
      <SearchBar
        platform="default"
        clearIcon={{
          name: "close",
          color: "#D03632",
          size: 25,
        }}
        containerStyle={{
          width: "100%",
          borderRadius: 35,
          marginBottom: 7,
          backgroundColor: "white",
          padding: 10,
          borderTopColor: "white",
          borderBottomColor: "white",
          borderColor: "gray",
          borderWidth: 1,
          paddingVertical: 2,
          marginTop: 5,
        }}
        inputContainerStyle={{
          backgroundColor: "white",
          borderRadius: 10,
        }}
        inputStyle={{}}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{ margin: 10 }} // Change to a number without quotes
        lightTheme
        loadingProps={{}}
        onChangeText={(newVal) => setValue(newVal)}
        placeholder="Search Task"
        placeholderTextColor="#888"
        round
        value={value}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 7,
          flexWrap: "wrap",
        }}
      >
        <Chip
          title="All"
          onPress={() => setChip(3)}
          type="solid"
          containerStyle={{
            marginVertical: 5,
            borderRadius: 5,
            width: "20%",
          }}
          buttonStyle={{
            backgroundColor: chipVal === 3 ? "#AE2B27" : "white",
            borderRadius: 5,
            borderColor: "gray",
            borderWidth: 1,
            marginRight: "5%",
          }}
          titleStyle={{
            color: chipVal === 3 ? "white" : "black",
            fontSize: 12,
          }}
        />
        <Chip
          title="Pending"
          onPress={() => setChip(0)}
          type="solid"
          containerStyle={{
            marginVertical: 5,
            borderRadius: 5,
            width: "25%",
          }}
          buttonStyle={{
            backgroundColor: chipVal === 0 ? "yellow" : "white",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            marginRight: "5%",
          }}
          titleStyle={{ color: "black", fontSize: 12 }}
        />
        <Chip
          title="Completed"
          onPress={() => setChip(1)}
          type="solid"
          containerStyle={{
            marginVertical: 5,
            borderRadius: 5,
            width: "30%",
          }}
          buttonStyle={{
            backgroundColor: chipVal === 1 ? "#90EE90" : "white",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            marginRight: "5%",
          }}
          titleStyle={{ color: "black", fontSize: 12 }}
        />
        <Chip
          title="By Date"
          onPress={() => setChip(4)}
          type="solid"
          containerStyle={{
            marginVertical: 5,
            borderRadius: 5,
            width: "25%",
          }}
          buttonStyle={{
            backgroundColor: chipVal === 4 ? "#318CE7" : "white",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            marginRight: "10%",
          }}
          titleStyle={{
            color: chipVal === 4 ? "white" : "black",
            fontSize: 12,
          }}
        />
      </View>
      <TaskTiles
        allTask={[...mytasks].reverse()}
        refresh={() => {
          setload(!load);
        }}
        bydate={bydate}
      />
    </View>
  );
}
