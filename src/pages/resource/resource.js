import React from "react";
import {
  KeyboardAvoidingView,
  View,
  PixelRatio,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  Picker,
  Image,
  CameraRoll,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";
import { Input, Divider, Text, Button, Avatar } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import { graphql, ApolloProvider, compose } from "react-apollo";
import { API, Storage } from "aws-amplify";
import awsmobile from "../../aws-exports";
import files from "../../Utils/files";
import { colors } from "../../Utils/theme";
import RNFetchBlob from "react-native-fetch-blob";
import uuid from "react-native-uuid";
import mime from "mime-types";
import { createBlog } from "../../graphql/mutations";
import { listBlogs } from "../../graphql/queries";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const { width, height } = Dimensions.get("window");

let styles = {};

class resource extends React.Component {
  static navigationOptions = {
    title: "List an item",
    headerStyle: {
      backgroundColor: "#0D1E30",
      shadowColor: "transparent",
      elevation: 0,
      shadowOpacity: 0
    },
    headerTitleStyle: {
      color: "white"
    },
    headerTintColor: "white"
  };

  state = {
    selectedImage: {},
    selectedImageIndex: null,
    images: [],
    Resources: [],
    avatarSource: null,
    selectedGenderIndex: null,
    isSelected: false,
    modalVisible: false,
    input: {
      name: "",
      product: "",
      address: "",
      location: "",
      offering: "",
      category: "",
      city: "",
      description: "",
      number: "",
      state: "",
      zip: ""
    },
    showActivityIndicator: false
  };

  componentDidMount() {
    this.props.createBlog({ id: ``, name: "create frelief blog" });
  }
  componentWillUnmount() {}

  AddResource = async () => {
    const resourceInfo = this.state.input;
    const { node: imageNode } = this.state.selectedImage;
    this.setState({ showActivityIndicator: true });
    console.log("****selectedImage*******", this.state.selectedImage);

    this.readImage(this.state.selectedImage)
      .then(fileInfo => ({
        ...resourceInfo,
        picKey: fileInfo && fileInfo.key
      }))
      .then(this.apiSaveResource)
      .then(data => {
        this.setState({ showActivityIndicator: false });
        this.props.navigation.push("Search");
      })
      .catch(err => {
        console.log("error saving resource...", err);
        this.setState({ showActivityIndicator: false });
      });
  };

  async apiSaveResource(resource) {
    return await API.post("freeApi", "/resource", { body: resource });
  }
  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };

  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }));
  };

  readImage(imageNode = null) {
    if (imageNode === null) {
      console.log("image null");
      return Promise.resolve();
    }
    const extension = mime.extension(imageNode.type);
    const imagePath = imageNode.uri;
    const picName = `${uuid.v1()}.${extension}`;
    const key = `${picName}`;
    console.log(imagePath);
    return files
      .readFile(imagePath)
      .then(buffer =>
        Storage.put(key, buffer, {
          level: "public",
          contentType: imageNode.type
        })
          .then(fileInfo => ({ key: fileInfo.key }))
          .then(x => console.log("SAVED", x) || x)
      )
      .catch(err => console.log("********READIMAGE***********", err));
  }

  selectPhotoTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
        this.setState({
          selectedImage: response
        });
        console.log(this.state.selectedImage);
      }
    });
  };

  updateInput = (key, value) => {
    this.setState(state => ({
      input: {
        ...state.input,
        [key]: value
      }
    }));
  };
  render() {
    const {
      selectedImageIndex,
      selectedImage,
      selectedGenderIndex
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.image_view}>
            {this.state.avatarSource === null ? (
              <Avatar
                size="xlarge"
                rounded
                icon={{ name: "image", type: "font-awesome" }}
                onPress={this.selectPhotoTapped}
                activeOpacity={0.7}
                showEditButton
              />
            ) : (
              <Avatar
                size="xlarge"
                rounded
                source={this.state.avatarSource}
                onPress={this.selectPhotoTapped}
                activeOpacity={0.7}
                showEditButton
              />
            )}
          </View>
          <Input
            label="Name"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={name => this.updateInput("name", name)}
            //inputStyle is used to style input box
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            returnKeyType="next"
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            ref="name"
            textInputRef="nameInput"
            editable={true}
            value={this.state.input.name}
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: 11,
              marginBottom: 3
            }}
          >
            Address
          </Text>
          <GooglePlacesAutocomplete
            placeholder=""
            onPress={(data, details = null) => {
              this.setState(
                state => ((state.input.address = data.description), state)
              );
              this.setState(
                state => (
                  (state.input.location = details.geometry.location), state
                )
              );
            }}
            getDefaultValue={() => ""}
            listViewDisplayed="false"
            minLength={2}
            selectionColor={"white"}
            autoFocus={false}
            fetchDetails={true}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: "",
              language: "en", // language of the results
              types: "address" // default: 'geocode'
            }}
            styles={{
              container: {
                borderWidth: 1.5,
                borderRadius: 30,
                borderColor: "#d6d7da",
                marginBottom: 0
              },
              textInputContainer: {
                backgroundColor: "#0D1E30",
                padding: 5,
                width: "85%",
                marginLeft: 20
              },
              textInput: {
                width: "75%",

                color: "white",
                fontSize: 16,
                backgroundColor: "#0D1E30"
              }
            }}
            currentLocation={false}
          />
          <Input
            label="Product/Service"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={product => this.updateInput("product", product)}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            ref="product"
            textInputRef="productInput"
            value={this.state.input.product}
          />
          <Input
            label="Description"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={description =>
              this.updateInput("description", description)
            }
            //inputStyle is used to style input box

            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 15,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
            multiline={true}
            numberOfLines={4}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            ref="description"
            textInputRef="descriptionInput"
            value={this.state.input.description}
          />

          <Picker
            selectedValue={this.state.input.category}
            itemStyle={{ color: "white" }}
            style={{
              marginLeft: 12,
              color: "white",
              borderWidth: 0.5,
              shadowColor: "white",
              borderColor: "white"
            }}
            borderStyle="solid"
            onValueChange={(itemValue, itemIndex) =>
              this.updateInput("category", itemValue)
            }
          >
            <Picker.Item label="Food & Water" value="Food & Water" />
            <Picker.Item label="Clothing" value="Clothing" />
            <Picker.Item label="Shelter" value="Shelter" />
            <Picker.Item label="Medical" value="Medical" />
            <Picker.Item label="Childrens Health" value="Childrens Health" />
            <Picker.Item label="Survival" value="Survival" />
            <Picker.Item label="Tech" value="Tech" />
          </Picker>
          <Input
            label="What are you offering"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={offering => this.updateInput("offering", offering)}
            //inputStyle is used to style input box
            ref="offering"
            textInputRef="offeringInput"
            value={this.state.input.offering}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
          />
          <Input
            label="Phone Number"
            labelStyle={{ color: "white", marginBottom: 5 }}
            onChangeText={number => this.updateInput("number", number)}
            //inputStyle is used to style input box
            keyboardType="numeric"
            ref="number"
            textContentType="telephoneNumber"
            textInputRef="numberInput"
            value={this.state.input.number}
            autoCapitalize="none"
            selectionColor={"white"}
            autoCorrect={true}
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 30,
              borderColor: "#d6d7da",
              marginBottom: 0
            }}
            inputStyle={{ marginLeft: 5, color: "white" }}
          />

          <View
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20
            }}
          >
            <Button
              onPress={this.AddResource}
              title="Add Resources"
              backgroundColor="#00A3FF"
              buttonStyle={{
                borderRadius: 30,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                height: 40
              }}
            />
          </View>
        </ScrollView>
        <Modal
          visible={this.state.showActivityIndicator}
          onRequestClose={() => null}
        >
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        </Modal>
      </View>
    );
  }
}
styles = StyleSheet.create({
  buttonGroupContainer: {
    marginHorizontal: 8
  },
  addImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: "gray",
    borderColor: "white",
    borderWidth: 1.5,
    marginVertical: 14,
    borderRadius: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  addImageTitle: {
    color: "gray",
    marginTop: 3
  },
  closeModal: {
    color: "gray",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  },
  title: {
    marginLeft: 20,
    marginTop: 19,
    color: "gray",
    fontSize: 18,
    marginBottom: 15
  },
  input: {
    fontFamily: "lato"
  },
  activityIndicator: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  container: {
    paddingRight: 20,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: "#0D1E30"
  },
  image_view: {
    alignItems: "center"
  },
  avatarContainer: {
    borderColor: "#9B9B9B",
    borderWidth: 5 / PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center"
  }
});

export default (AddResourceData = compose(
  graphql(createBlog, {
    options: {
      refetchQueries: [{ query: listBlogs }],
      update: (dataProxy, { data: { createBlog } }) => {
        const query = listBlogs;
        const data = dataProxy.readQuery({ query });
        data.listBlogs.items = [
          ...data.listBlogs.items.filter(blog => blog.id !== createBlog.id),
          createBlog
        ];
        dataProxy.writeQuery({ query, data });
      }
    },
    props: ({ ownProps, mutate }) => ({
      createBlog: resource =>
        mutate({
          variables: { input: resource },
          optimisticResponse: () => ({
            createBlog: {
              ...resource,
              __typename: "Blog",
              posts: {
                __typename: "blogComments",
                items: [],
                nextToken: null
              }
            }
          })
        })
    })
  })
)(resource));
