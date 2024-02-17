import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2EAEB",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 25,
    paddingHorizontal: 15,

    borderTopWidth: 10,
  },
  addButtonr: {
    position: "absolute",
    bottom: 70, // Adjust this value as needed for the distance from the bottom
    right: 20, // Adjust this value as needed for the distance from the right
    backgroundColor: "#AE2B27",
    width: 50,
    height: 50,
    borderRadius: 50, // To make it a circle
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // For shadow (Android)
    shadowColor: "#000", // For shadow (iOS)
    shadowOpacity: 0.3, // For shadow (iOS)
    shadowRadius: 3, // For shadow (iOS)
    shadowOffset: { width: 0, height: 2 }, // For shadow (iOS)

    color: "white",
    zIndex: 999,
  },
  header: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "500",
    color: "white",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#2B5279",
    paddingTop: 10,
    paddingHorizontal: 25,
    paddingBottom: 10,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 19,
    borderBottomLeftRadius: 25,
    color: "white",
  },
});
export default styles;
