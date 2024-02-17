import * as React from "react";
import { Linking, Image, View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-simple-toast";

type ShareProps = {
  message: string; // The text to share
};

const ShareButton: React.FC<ShareProps> = ({ message }) => {
  const share = () => {
    // Construct the WhatsApp message URI
    const whatsappMessage = `whatsapp://send?text=${encodeURIComponent(
      message
    )}`;

    // Open the WhatsApp message URI
    Linking.openURL(whatsappMessage).catch((error) => {
      Toast.show("Error Sharing try Again Later!", 1500);
    });
  };

  return (
    <TouchableOpacity
      onPress={share}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: "#105051",
        width: 100,
        justifyContent: "center",
        paddingVertical: 5,
        paddingHorizontal: 2,
        borderRadius: 20,
      }}
    >
      <Image
        source={require("../assets/whatsapp.png")}
        style={{ height: 25, width: 25, marginRight: 7 }}
      />
      <Text style={{ textAlign: "center", color: "white" }}>Share</Text>
    </TouchableOpacity>
  );
};

export default ShareButton;
