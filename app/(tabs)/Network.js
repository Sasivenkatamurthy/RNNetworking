import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, FlatList, Platform, StatusBar, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function Network() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postBody, setPostBody] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (limit = 50) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
      const data = await response.json();
      setPostList(data);
      setIsLoading(false);
      setError("");
    } catch (error) {
      console.log("Error fetching data", error);
      setIsLoading(false);
      setError("Failed to fetch list");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(90);
    setRefreshing(false);
  };

  const addPost = async () => {
    setIsPosting(true);

    const newPost = {
      title: postTitle,
      body: postBody,
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();
      setPostList((prevPosts) => [data, ...prevPosts]);
      setPostTitle('');
      setPostBody('');
    } catch (error) {
      console.error("Error adding post: ", error);
      console.log("Error adding new post");
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={Styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Styles.Container}>
      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <>
          <View style={Styles.inputContainer}>
            <TextInput 
              style={Styles.input} 
              placeholder='Post Title' 
              value={postTitle} 
              onChangeText={setPostTitle} 
            />
            <TextInput 
              style={Styles.input} 
              placeholder='Post Body' 
              value={postBody} 
              onChangeText={setPostBody} 
            />
            <Button 
              title={isPosting ? "Adding..." : "Add Post"} 
              onPress={addPost} 
              disabled={isPosting} 
            />
          </View>
          <View style={Styles.listContainer}>
            <FlatList
              data={postList}
              renderItem={({ item }) => {
                return (
                  <View style={Styles.card}>
                    <Text style={Styles.titleText}>{item.title}</Text>
                    <Text style={Styles.body}>{item.body}</Text>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={{ height: 16 }} />
              )}
              ListEmptyComponent={<Text>No Data Posted</Text>}
              ListHeaderComponent={<Text style={Styles.listHeader}>Post List</Text>}
              ListFooterComponent={<Text style={Styles.list}>End of List</Text>}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  body: {
    fontSize: 24,
    color: '#666666',
  },
  titleText: {
    fontSize: 30,
    color: 'blue',
  },
  listHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    backgroundColor: 'white',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 9,
  },
  list: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});
