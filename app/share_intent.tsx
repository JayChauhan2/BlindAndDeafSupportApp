import { Button, Image, StyleSheet, Text, View } from "react-native";

import {
  ShareIntent,
  ShareIntentFile,
  useShareIntent,
} from "expo-share-intent";
import { Fragment } from "react";

const API_URL = 'https://endotrophic-conflictingly-kaydence.ngrok-free.dev';

const WebUrlComponent = ({ shareIntent }: { shareIntent: ShareIntent }) => {
  return (
    <View
      style={[
        styles.gap,
        styles.row,
        { borderWidth: 1, borderRadius: 5, height: 102 },
      ]}
    >
      <Image
        source={
          shareIntent.meta?.["og:image"]
            ? { uri: shareIntent.meta?.["og:image"] }
            : undefined
        }
        style={[styles.icon, styles.gap, { borderRadius: 5 }]}
      />
      <View style={{ flexShrink: 1, padding: 5 }}>
        <Text style={[styles.gap]}>
          {shareIntent.meta?.title || "<NO TITLE>"}
        </Text>
        <Text style={styles.gap}>{shareIntent.webUrl}</Text>
      </View>
    </View>
  );
};

export default function App() {

    const uploadImage = async (imageUri) => {
        const formData = new FormData();

        // Extract filename
        const uriParts = imageUri.split('/');
        const fileName = uriParts[uriParts.length - 1];

        formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg', // or 'image/png'
        } as any);
        try {
        const response = await fetch(`${API_URL}/describe-scene`, {
            method: 'POST',
            body: formData,
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        const data = await response.json(); //stuff returned from backend
        Speech.speak(data.model_text_response); //say the response aloud
        } catch (error) {
        console.error('Error sending signal:', error);
        console.log('Failed to send signal. Check console and IP address.');
        }
    };
  const { hasShareIntent, shareIntent, resetShareIntent, error } =
    useShareIntent({
      debug: true,
      resetOnBackground: true,
    });

  return (
    <View style={styles.container}>
      {/* <Image
        source={require("./assets/icon.png")}
        style={[styles.logo, styles.gap]}
      /> */}
      <Text style={[styles.gap, styles.bold]}>
        {hasShareIntent ? "SHARE INTENT FOUND !" : "NO SHARE INTENT DETECTED"}
      </Text>

      {/* TEXT and URL */}
      {!!shareIntent.text && <Text style={styles.gap}>{shareIntent.text}</Text>}
      {shareIntent?.type === "weburl" && (
        <WebUrlComponent shareIntent={shareIntent} />
      )}

      {/* FILES */}
      {shareIntent?.files?.map((file) => (
        <Fragment key={file.path}>
          {file.mimeType.startsWith("image/") && (
            <Image source={{ uri: file.path }} style={[styles.image]} />
          )}

            <Button title="Hello" onPress={() => uploadImage(file.path)}></Button>
          <FileMeta file={file} />
        </Fragment>
      ))}

      {/* FOOTER */}
      {!!shareIntent && (
        <Button onPress={() => resetShareIntent()} title="Reset" />
      )}
      <Text style={[styles.error]}>{error}</Text>
    </View>
  );
}

function FileMeta({ file }: { file: ShareIntentFile }) {
  return (
    <View style={[styles.gap, styles.meta]}>
      <Text style={styles.bold}>{file.fileName}</Text>
      <Text>
        {file.mimeType} ({Math.round((file.size || 0) / 1024)}
        ko)
      </Text>
      {file.width && (
        <Text>
          {file.width} x {file.height}
        </Text>
      )}
      {file.duration && <Text>{file.duration}ms</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    backgroundColor: "lightgray",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  gap: {
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  meta: {
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
});