import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Expenses from "../screens/Expenses";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import RecentExpenses from "../screens/RecentExpenses";
import Settings from "../screens/Settings";
import ExpenseContext from "../store/expense-context";
import { useContext } from "react";
import OverView from "../screens/OverView";
import MonthlyExpenses from "../screens/MonthlyExpenses";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const { setIsAddExpenseModalVisible, setExpense } =
    useContext(ExpenseContext);
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="RecentExpenses"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#02494D",
          },
          headerTintColor: "white",
          headerRight: (color, size) => (
            <MaterialIcons
              name="add"
              size={24}
              color={"white"}
              style={{ padding: 10 }}
              onPress={() => {
                setExpense({});
                setIsAddExpenseModalVisible(true);
              }}
            />
          ),
          tabBarStyle: {
            backgroundColor: "#02494D",
          },
          tabBarActiveTintColor: "white",
        }}
      >
        <Tab.Screen
          name="Overview"
          component={OverView}
          options={{
            title: "Overview",
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="RecentExpenses"
          component={RecentExpenses}
          options={{
            title: "Recent Expenses",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="timer-sand"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="AllExpenses"
          component={Expenses}
          options={{
            title: "All Expenses",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="finance"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="MonthlyCredits"
          component={MonthlyExpenses}
          options={{
            title: "Monthly Credits",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="cash"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
