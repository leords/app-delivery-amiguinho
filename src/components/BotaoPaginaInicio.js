// BotaoPaginaInicio.js
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function BotaoPaginaInicio({
  BGcolor,
  destinationPage,
  image,
  name,
}) {
  const navegacao = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: BGcolor }]}
      onPress={() => navegacao.navigate(destinationPage)}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrapper}>{image}</View>
      <Text style={styles.text} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "48%",
    height: 140,
    borderRadius: 14, // var(--radius)
    justifyContent: "space-between",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});