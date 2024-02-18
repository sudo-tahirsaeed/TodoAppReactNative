import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Image,
} from "react-native";
import { Avatar } from "@rneui/themed";
import Toast from "react-native-simple-toast";
import { useDispatch } from "react-redux";
import { DeleteTask, UpdateTaskStatus } from "../redux/slices/AddTask";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShareButton from "./Share";
//Creating Interface for our task status 0 means pending 1 means completed
interface Task {
  taskid: string;
  title: string;
  category: string;
  deadline: string;
  description: string;
  status: number;
}
interface TaskTilesProps {
  allTask: Task[];
  refresh: () => void;
  bydate: boolean;
}
const TaskTiles: React.FC<TaskTilesProps> = ({ allTask, refresh, bydate }) => {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const dispatch = useDispatch();
  // State variable to track the ID of the expanded task
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  // State variable to track the number of visible tasks
  const [visibleTasks, setVisibleTasks] = useState(15);
  // State variable to track whether a task was added
  const [added, setadded] = useState<boolean>(false);
  // Function to handle task press and toggle the expansion of task details
  const handleTaskPress = (taskId: any) => {
    // Configure layout animation for smooth transition
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    // Toggle expanded state of the clicked task
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  //Redering items for Tiles in flatlist for our data
  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity onPress={() => handleTaskPress(item.taskid)}>
      <View
        style={[
          styles.taskItem,
          {
            backgroundColor: "#C6D5DB",
            borderRadius: 15,
            padding: 15,
            marginBottom: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          },
        ]}
      >
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Avatar
              size={32}
              rounded
              title={item.title[0] + item.title[1]}
              containerStyle={{ backgroundColor: "#fd5c63", marginBottom: 5 }}
            />
            <Text style={styles.taskText}>
              {item.title.length > 9
                ? item.title.substring(0, 12) + "..."
                : item.title}
            </Text>
          </View>
          {bydate ? (
            <Text
              style={{
                color: "#BA0021",
                fontWeight: "500",
                marginTop: 20,
                fontStyle: "italic",
              }}
            >
              Due: {item.deadline}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              backgroundColor: item.status === 0 ? "yellow" : "#90EE90",
              borderRadius: 17,
              borderColor: "gray",
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: 5,
              textAlign: "center",
              justifyContent: "center",
              marginRight: 13,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {item.status === 0 ? "Pending" : "Completed"}
          </Text>
          {item.status == 0 ? (
            <TouchableOpacity
              onPress={() => {
                dispatch(UpdateTaskStatus(item.taskid));
                setadded(!added);
                refresh();
                Toast.show("Marked Completed", Toast.CENTER);
              }}
            >
              <Image
                source={require("../assets/check-mark.png")}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              dispatch(DeleteTask(item.taskid));
              setadded(!added);
              refresh();
              Toast.show("Task Deleted Successfully!", Toast.CENTER);
            }}
          >
            <Image
              source={require("../assets/delete.png")}
              style={{ height: 25, width: 25, marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {expandedTaskId === item.taskid && (
        <View style={styles.bottom}>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "800",
              margin: 2,
            }}
          >
            Title:
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 13,
              margin: 2,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "800",
              margin: 2,
            }}
          >
            Description:
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 13,
              margin: 2,
            }}
          >
            {item.description}
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "800",
              margin: 2,
            }}
          >
            Catagory:
          </Text>
          <Text
            style={{
              color: "red",
              fontWeight: "600",
              fontSize: 13,
              margin: 2,
              fontStyle: "italic",
            }}
          >
            {item.category}
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "800",
              margin: 2,
            }}
          >
            Deadline:
          </Text>
          <Text
            style={{
              color: "red",
              fontWeight: "600",
              fontSize: 13,
              margin: 2,
              fontStyle: "italic",
            }}
          >
            {item.deadline}
          </Text>
          <ShareButton
            message={
              "*Generated By Ropstam Todos*\nHere is My Todo Details:\n*Title:* " +
              item.title +
              "\n*Description:* " +
              item.description +
              "\n*Deadline:* " +
              item.deadline
            }
          ></ShareButton>
        </View>
      )}
    </TouchableOpacity>
  );
  // Function to load more items when end of the list is reached
  const loadMoreItems = () => {
    // Calculate the new number of visible tasks by adding 7 to the current number
    const newVisibleTasks = visibleTasks + 7;
    // Update the state to reflect the new number of visible tasks
    setVisibleTasks(newVisibleTasks);
  };
  //Threshold for flatlist 90% so it doesnt load all data initially which could lead to performance issues
  const onEndReachedThreshold = 0.9;
  // Check if there are no tasks available
  if (allTask.length < 1) {
    // Render a message indicating no tasks available
    return (
      <View style={{ flexDirection: "row", marginTop: 25 }}>
        <Image
          source={require("../assets/cancel.png")}
          style={{ height: 30, width: 30 }}
        />
        <Text style={{ fontSize: 18 }}> Oops! No Task Available</Text>
      </View>
    );
  }
  // Returns and render all availabe tasks
  return (
    <FlatList
      style={{
        width: "100%",
      }}
      data={allTask.length > 0 ? allTask.slice(0, visibleTasks) : null}
      renderItem={renderItem}
      keyExtractor={(item) => item.taskid}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
};
// Styles for component
const styles = StyleSheet.create({
  bottom: {
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#A3C1AD",
    borderColor: "white",
    borderRadius: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
  },
  taskText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default TaskTiles;
