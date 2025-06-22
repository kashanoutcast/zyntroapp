import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Sprint, Issue } from "@/lib/types";
import { useProject } from "@/providers/project-provider";
import { SERVER } from "@/lib/axios";

// Interface for our task item
interface TaskItem {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  isSubtask?: boolean;
}

// Interface for task group
interface TaskGroup {
  id: string;
  title: string;
  expanded: boolean;
  tasks: TaskItem[];
  status?: "To Do" | "In Progress" | "Done";
}

export default function BacklogScreen() {
  const { activeProject } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: sprints, isLoading: sprintsLoading } = useQuery<Sprint[]>({
    queryKey: ["sprints", activeProject?._id],
    queryFn: async () =>
      (await SERVER.get(`/sprints/${activeProject?._id}`)).data,
    enabled: !!activeProject,
  });
  console.log("🚀 ~ BacklogScreen ~ sprints:", sprints);

  const { data: issues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ["issues", activeProject?._id],
    queryFn: async () => {
      const { data } = await SERVER.get(`/issues/`, {
        params: { projectId: activeProject?._id },
      });
      return data;
    },
    enabled: !!activeProject,
  });
  console.log("🚀 ~ BacklogScreen ~ issues:", issues);

  // State for task groups
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const taskGroups = useMemo(() => {
    if (!sprints || !issues) return [];

    const sprintGroups: TaskGroup[] = sprints.map((sprint) => ({
      id: sprint._id,
      title: sprint.name,
      expanded: expandedGroups.includes(sprint._id),
      tasks: issues
        .filter((issue) => {
          if (!issue.sprint) return false;
          const sprintId =
            typeof issue.sprint === "string"
              ? issue.sprint
              : (issue.sprint as Sprint)._id;
          return sprintId === sprint._id;
        })
        .map((issue) => ({
          id: issue._id,
          title: issue.title,
          status: issue.status === "Open" ? "To Do" : issue.status,
          isSubtask: true,
        })),
    }));

    const backlogIssues: TaskGroup[] = issues
      .filter((issue) => !issue.sprint)
      .map((issue) => ({
        id: issue._id,
        title: issue.title,
        expanded: false,
        tasks: [],
        status: issue.status === "Open" ? "To Do" : issue.status,
      }));

    return [...sprintGroups, ...backlogIssues];
  }, [sprints, issues, expandedGroups]);

  const filteredTaskGroups = useMemo(() => {
    if (!searchQuery) {
      return taskGroups;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    return taskGroups.reduce((acc: TaskGroup[], group) => {
      const groupTitleMatches = group.title
        .toLowerCase()
        .includes(lowercasedQuery);

      if (group.tasks.length > 0) {
        // It's a sprint with issues
        const matchingTasks = group.tasks.filter((task) =>
          task.title.toLowerCase().includes(lowercasedQuery)
        );

        if (groupTitleMatches) {
          // If group title matches, show all original tasks and expand it
          acc.push({ ...group, expanded: true });
        } else if (matchingTasks.length > 0) {
          // If only tasks match, show only matching tasks and expand it
          acc.push({ ...group, tasks: matchingTasks, expanded: true });
        }
      } else {
        // It's a backlog issue
        if (groupTitleMatches) {
          acc.push(group);
        }
      }
      return acc;
    }, []);
  }, [searchQuery, taskGroups]);

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let color = "";
    let textColor = "";
    switch (status) {
      case "In Progress":
        color = "#FFF8E7";
        textColor = "#8B6F1A";
        break;
      case "To Do":
        color = "#F0F1FA";
        textColor = "#5652CC";
        break;
      case "Done":
        color = "#E7FAE7";
        textColor = "#1B5E20";
        break;
    }

    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: color, borderColor: textColor },
        ]}
      >
        <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
      </View>
    );
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
              <Text style={styles.numberText}>
                {parseInt(group.id) <= 2 ? "A" : "T"}
              </Text>
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

  if (sprintsLoading || issuesLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#5652CC" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Backlog"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {/* <View style={styles.sortContainer}>
          <Text style={styles.sortText}>Sort By</Text>
          <Feather
            name="filter"
            size={18}
            color="#999"
            style={styles.sortIcon}
          />
        </View> */}
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksContainer}>
        {filteredTaskGroups.map((group) => {
          if (group.tasks.length > 0) {
            return renderTaskGroup(group);
          } else {
            return renderTask({
              id: group.id,
              title: group.title,
              status: group.status || "To Do",
            });
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingTop: 72,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#dddddd",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  sortText: {
    color: "#999",
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
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  taskGroupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  taskGroupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskGroupTitle: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginLeft: 12,
  },
  numberBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  subtasksContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  subtaskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F5",
  },
  subtaskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subtaskTitle: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#5652CC",
  },
  navText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  activeNavText: {
    color: "#5652CC",
  },
});
