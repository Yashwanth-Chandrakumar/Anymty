import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
  fileName: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType, fileName }) => {
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFileContent();
  }, [fileUrl]);

  const fetchFileContent = async () => {
    try {
      setLoading(true);
      if (fileUrl.startsWith('http')) {
        setFileContent(fileUrl);
      } else {
        const fileInfo = await FileSystem.getInfoAsync(fileUrl);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }
        setFileContent(fileUrl);
      }
    } catch (err) {
      console.error('Error fetching file content:', err);
      setError('Failed to load file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async () => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUrl);
      } else {
        setError('Sharing is not available on this device');
      }
    } catch (err) {
      console.error('Error sharing file:', err);
      setError('Failed to share file. Please try again.');
    }
  };

  const renderFileContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (fileType.startsWith('image/')) {
      return (
        <Image
          source={{ uri: fileContent || '' }}
          style={styles.image}
          resizeMode="contain"
        />
      );
    } else if (fileType === 'application/pdf' || 
               fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               fileType === 'application/msword') {
      // For PDF and Word documents, we'll use a WebView with Google Docs Viewer
      const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;
      return (
        <WebView
          source={{ uri: googleDocsUrl }}
          style={styles.webView}
          onLoad={() => setLoading(false)}
        />
      );
    } else if (fileType.startsWith('text/') || fileType === 'application/json') {
      // For text files, we need to read the content
      const [textContent, setTextContent] = useState<string>('');
      useEffect(() => {
        const readTextFile = async () => {
          try {
            const content = await FileSystem.readAsStringAsync(fileUrl);
            setTextContent(content);
          } catch (err) {
            console.error('Error reading text file:', err);
            setError('Failed to read text file. Please try again.');
          }
        };
        readTextFile();
      }, []);

      return (
        <ScrollView style={styles.textContainer}>
          <Text style={styles.textContent}>{textContent}</Text>
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedText}>Unsupported file type: {fileType}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.fileName}>{fileName}</Text>
        <TouchableOpacity onPress={shareFile} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {renderFileContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fileName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  shareButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  webView: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  textContent: {
    fontSize: 16,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unsupportedText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default FileViewer;