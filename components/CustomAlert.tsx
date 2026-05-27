import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/produtosStyles";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: Props) {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: 22,
            padding: 24,
          }}
        >

          <View
            style={{
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#ffe5e5",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons
                name="archive-outline"
                size={30}
                color="#E57373"
              />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#444",
                marginBottom: 8,
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                textAlign: "center",
                color: "#777",
                lineHeight: 22,
              }}
            >
              {message}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 14,
                backgroundColor: "#f3f3f3",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: "#666",
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 14,
                backgroundColor: "#E57373",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}