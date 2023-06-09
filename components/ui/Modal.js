import {
  SafeAreaView,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useEffect, useContext, useReducer } from "react";
import ExpenseContext from "../../store/expense-context";
import Button from "./Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Fontisto } from "@expo/vector-icons";
import { database } from '../../firebaseConfig';
import { ref, set, update } from "firebase/database";
import moment from "moment";


const initialState = {
  title: "",
  price: "",
  date: "",
  comments: "",
  errors: {},
};

const reducerFn = (state, action) => {
  switch (action.type) {
    case "SET_ALL_VALUES":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_FIELD_VALUE":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_ERROS":
      return {
        ...state,
        errors: action.errors,
      };
    case "CLEAR_FORM":
      return initialState;
    default:
      return state;
  }
};

const ExtendedModal = () => {

  const { isAddExpenseModalVisible, setIsAddExpenseModalVisible, setExpenses, expense, updateExpense, setExpense } =
    useContext(ExpenseContext);
  const [date, setDate] = useState(new Date());

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [state, dispatch] = useReducer(reducerFn, initialState);

  useEffect(() => {
    if(Object.keys(expense).length !== 0) {
      const expenseDate = moment(expense.date, 'MMM D, YYYY').toDate();
      setDate(expenseDate);
      dispatch({
        type: "SET_ALL_VALUES",
        payload: {
          title: expense.title,
          price: expense.price,
          date: expense.date,
          comments: expense.comments
        }
      });
    } 
    else {
      setDate(new Date());
      dispatch({
        type: "SET_ALL_VALUES",
        payload: {
          title: '',
          price:'',
          date: formatDate(new Date()),
          comments: ''
        }
      });
    }

  }, [isAddExpenseModalVisible, expense]);

  const handleDatePickerChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    dispatch({
      type: "SET_FIELD_VALUE",
      field: "date",
      value: formatDate(selectedDate),
    });
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
    setShow(!show);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
    1;
  };

  const handleFormFields = (fieldName) => (value) => {
    dispatch({ type: "SET_FIELD_VALUE", field: fieldName, value });
  };

  const handleValidateForm = () => {
    const errors = {};
    if (!state.title) {
      errors.title = "Title is required";
    }
    if (!state.price) {
      errors.price = "Price is required";
    }
    if (!state.comments) {
      errors.comments = "Comments are required";
    }
    return errors;
  };

  const handleSubmit = () => {
    const errors = handleValidateForm();
    if(Object.keys(expense).length !== 0 && Object.keys(errors).length === 0) {
      dispatch({
        type: "SET_FIELD_VALUE",
        field: "date",
        value: formatDate(date),
      });
      dispatch({ type: "CLEAR_FORM" });
      setIsAddExpenseModalVisible(false);
      update(ref(database, 'expenses/' + expense.id), {...state, id: expense.id, date: formatDate(date)});
      updateExpense({...state, id: expense.id, date: formatDate(date)});
    }else if (Object.keys(expense).length === 0  && Object.keys(errors).length === 0) {
      dispatch({ type: "CLEAR_FORM" });
      setIsAddExpenseModalVisible(false);
      const id = Date.now().toString(36);
      setExpenses([{...state, id}])
      set(ref(database, 'expenses/' + id), {...state, id});
    } else {
      dispatch({ type: "SET_ERROS", errors });
    }
  };

  return (
    <Modal
      visible={isAddExpenseModalVisible}
      animationType={"side"}
      transparent={true}
      onRequestClose={() => {
        setExpenses({});
        setIsAddExpenseModalVisible(false);
      }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={[styles.text, {margin: 30, textAlign: 'center'}]}>Add Expense</Text>
          <SafeAreaView>
            <TextInput
              placeholder="Enter Expense title"
              style={styles.textInput}
              value={state.title}
              onChangeText={handleFormFields("title")}
              placeholderTextColor="gray"
            />
            {state.errors.title && (
              <Text style={styles.errorText}>{state.errors.title}</Text>
            )}
            <TextInput
              placeholder="Enter Expense Price"
              placeholderTextColor="gray"
              style={styles.textInput}
              keyboardType={"numeric"}
              value={state.price}
              onChangeText={handleFormFields("price")}
            />
            {state.errors.price && (
              <Text style={styles.errorText}>{state.errors.price}</Text>
            )}
            <SafeAreaView style={styles.datePickerContainer}>
              <SafeAreaView style={styles.datePickerTextContainer}>
                <TextInput
                  value={formatDate(date)}
                  style={[styles.dateTextInput]}
                  editable={false}
                />
              </SafeAreaView>
              <SafeAreaView style={styles.datePickerButtonContainer}>
                <Fontisto
                  name="date"
                  size={24}
                  color="white"
                  onPress={showDatepicker}
                />
              </SafeAreaView>
            </SafeAreaView>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display={"inline"}
                onChange={handleDatePickerChange}
                textColor="green"
              />
            )}

            <TextInput
              style={styles.textArea}
              placeholder="Comments"
              value={state.comments}
              onChangeText={handleFormFields("comments")}
              placeholderTextColor="gray"
            />
            {state.errors.comments && (
              <Text style={styles.errorText}>{state.errors.comments}</Text>
            )}
          </SafeAreaView>
          <SafeAreaView style={styles.buttonsContainer}>
            <SafeAreaView style={styles.buttonContainer}>
              <Button
                style={{ backgroundColor: "#CED9DA", borderColor: "#CED9DA" }}
                textStyle={{ color: "#000000" }}
                onPress={() => setIsAddExpenseModalVisible(false)}
              >
                Cancel
              </Button>
            </SafeAreaView>
            <SafeAreaView style={styles.buttonContainer}>
              <Button onPress={handleSubmit}>{Object.keys(expense).length !== 0 ? 'Update Expense' : 'Add Expense'}</Button>
            </SafeAreaView>
          </SafeAreaView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#373737",
  },
  textInput: {
    borderWidth: 1,
    width: 380,
    height: 40,
    padding: 10,
    margin: 10,
    borderColor: "gray",
    color: "white",
  },
  textArea: {
    borderWidth: 1,
    width: 380,
    height: 70,
    padding: 10,
    margin: 10,
    borderColor: "gray",
    color: "white",
  },
  dateTextInput: {
    borderWidth: 1,
    width: "105%",
    height: 40,
    padding: 10,
    margin: 10,
    borderColor: "gray",
    color: "white",
  },
  datePicker: {
    width: 400,
    height: 40,
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
  },
  datePickerContainer: {
    flexDirection: "row",
  },
  datePickerTextContainer: {
    width: "75%",
  },
  datePickerButtonContainer: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#DE0000",
    paddingHorizontal: 12,
  },
});

export default ExtendedModal;
