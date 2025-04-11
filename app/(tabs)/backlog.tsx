import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Interface for our task item
interface TaskItem {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  isSubtask?: boolean;
}

// Interface for task group
interface TaskGroup {
  id: string;
  title: string;
  expanded: boolean;
  tasks: TaskItem[];
}

export default function BacklogScreen() {
  // State for task groups
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
    {
      id: '1',
      title: 'As a new user, I want to be able to create an account.',
      expanded: true,
      tasks: [
        { id: '1-1', title: 'Design the registration form', status: 'In Progress', isSubtask: true },
        { id: '1-2', title: 'Design the registration form', status: 'To Do', isSubtask: true },
      ],
    },
    {
      id: '2',
      title: 'As a new user, I want to be able to create an account.',
      expanded: true,
      tasks: [
        { id: '2-1', title: 'Design the registration form', status: 'Done', isSubtask: true },
        { id: '2-2', title: 'Design the registration form', status: 'In Progress', isSubtask: true },
      ],
    },
    {
      id: '3',
      title: 'Design the registration form',
      expanded: false,
      tasks: [],
    },
    {
      id: '4',
      title: 'Design the registration form',
      expanded: false,
      tasks: [],
    },
    {
      id: '5',
      title: 'Design the registration form',
      expanded: false,
      tasks: [],
    },
    {
      id: '6',
      title: 'Design the registration form',
      expanded: false,
      tasks: [],
    },
    {
      id: '7',
      title: 'Design the registration form',
      expanded: false,
      tasks: [],
    },
  ]);

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setTaskGroups(
      taskGroups.map((group) => {
        if (group.id === groupId) {
          return { ...group, expanded: !group.expanded };
        }
        return group;
      })
    );
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return (
          <View style={styles.inProgressBadge}>
            <Text style={styles.inProgressText}>In Progress</Text>
            <Ionicons name="chevron-down" size={14} color="#8B6F1A" />
          </View>
        );
      case 'To Do':
        return (
          <View style={styles.todoBadge}>
            <Text style={styles.todoText}>To Do</Text>
            <Ionicons name="chevron-down" size={14} color="#5652CC" />
          </View>
        );
      case 'Done':
        return (
          <View style={styles.doneBadge}>
            <Text style={styles.doneText}>Done</Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Render a task group
  const renderTaskGroup = (group: TaskGroup) => {
    return (
      <View style={styles.taskGroupContainer} key={group.id}>
        <TouchableOpacity
          style={styles.taskGroupHeader}
          onPress={() => toggleGroupExpansion(group.id)}
        >
          <View style={styles.taskGroupHeaderLeft}>
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{parseInt(group.id) <= 2 ? "A" : "T"}</Text>
            </View>
            <Text style={styles.taskGroupTitle}>{group.title}</Text>
          </View>
          <Ionicons 
            name={group.expanded ? "chevron-down" : "chevron-forward"} 
            size={20} 
            color="#333" 
          />
        </TouchableOpacity>

        {group.expanded && (
          <View style={styles.subtasksContainer}>
            {group.tasks.map((task) => (
              <View style={styles.subtaskItem} key={task.id}>
                <View style={styles.subtaskLeft}>
                  <View style={styles.numberBox}>
                    <Text style={styles.numberText}>T</Text>
                  </View>
                  <Text style={styles.subtaskTitle}>{task.title}</Text>
                </View>
                {renderStatusBadge(task.status)}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Render individual task
  const renderTask = (task: TaskItem) => {
    return (
      <View style={styles.taskItem} key={task.id}>
        <View style={styles.taskLeft}>
          <View style={styles.numberBox}>
            <Text style={styles.numberText}>T</Text>
          </View>
          <Text style={styles.taskTitle}>{task.title}</Text>
        </View>
        {renderStatusBadge(task.status)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Backlog"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>Sort By</Text>
          <Feather name="filter" size={18} color="#999" style={styles.sortIcon} />
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksContainer}>
        {taskGroups.map((group) => {
          if (group.tasks.length > 0) {
            return renderTaskGroup(group);
          } else {
            return renderTask({ id: group.id, title: group.title, status: 'To Do' });
          }
        })}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingTop: 72,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  sortText: {
    color: '#999',
    fontSize: 14,
    marginRight: 4,
  },
  sortIcon: {
    marginLeft: 4,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskGroupContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  taskGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  taskGroupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskGroupTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  numberBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtasksContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  subtaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  subtaskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subtaskTitle: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  todoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F1FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5652CC',
  },
  todoText: {
    fontSize: 12,
    color: '#5652CC',
    marginRight: 4,
  },
  inProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8E7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9CA63',
  },
  inProgressText: {
    fontSize: 12,
    color: '#8B6F1A',
    marginRight: 4,
  },
  doneBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E7FAE7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  doneText: {
    fontSize: 12,
    color: '#1B5E20',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#5652CC',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeNavText: {
    color: '#5652CC',
  },
});