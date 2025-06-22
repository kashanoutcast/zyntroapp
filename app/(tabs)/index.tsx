import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { LineChart } from "react-native-chart-kit";
import { useProject } from "@/providers/project-provider";
import { getTimeLeft } from "@/utils/getTimeLeft";
import { useQuery } from "@tanstack/react-query";
import { IssueSummary, LeaderboardEntry, SprintSummary } from "@/lib/types";
import { SERVER } from "@/lib/axios";
import WebView from "react-native-webview";
import CircularProgressChart from "@/components/CircularProgressChart";

// You'll need to install these packages:
// npm install react-native-svg
// npm install react-native-chart-kit

export default function HomeScreen() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    projects,
    setActiveProject,
    activeProject,
    loading: projectsLoading,
    switchProject,
  } = useProject();

  const [daysLeft, monthsLeft] = getTimeLeft(
    activeProject?.actualEndDate ||
      activeProject?.estimatedEndDate ||
      new Date()
  );

  const { data: issuesSummary, isLoading: issuesSummaryLoading } =
    useQuery<IssueSummary>({
      queryKey: ["issuesSummary", activeProject?._id],
      queryFn: async () => {
        const response = await SERVER.get(
          `/issues/${activeProject?._id}/summary`
        );
        return response.data;
      },
      enabled: !!activeProject?._id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    });

  const { data: sprintSummary, isLoading: sprintSummaryLoading } = useQuery<
    SprintSummary[]
  >({
    queryKey: ["sprintSummary", activeProject?._id],
    queryFn: async () => {
      const response = await SERVER.get(
        `/sprints/summary/${activeProject?._id}`
      );
      return response.data;
    },
    enabled: !!activeProject?._id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<
    LeaderboardEntry[]
  >({
    queryKey: ["leaderboard", activeProject?._id],
    queryFn: async () => {
      const response = await SERVER.get(
        `/users/leaderboard/${activeProject?._id}`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const topPerformer = leaderboard?.[0];

  const renderStartRow = () => (
    <View style={styles.statsRow}>
      {/* Time left card */}
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{monthsLeft}</Text>
        <Text style={styles.statLabel}>Months</Text>
      </View>

      {/* Days left card */}
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{daysLeft}</Text>
        <Text style={styles.statLabel}>Days</Text>
      </View>

      {/* Completion circle */}
      <View style={styles.completionContainer}>
        <View style={styles.completionCircle}>
          <CircleProgress percentage={activeProject?.progress || 0} />
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageValue}>
              {activeProject?.progress || 0}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderIssuesChart = () => {
    return (
      <View style={styles.issuesCard}>
        <Text style={styles.cardTitle}>Issues</Text>
        {issuesSummary?.issuesCountByStatus.length === 0 ? (
          <Text style={styles.issuesCard}>No issues to display</Text>
        ) : (
          <View style={styles.pieChartContainer}>
            <CircularProgressChart
              data={
                issuesSummary?.issuesCountByStatus.map((issue) => ({
                  name: issue.name,
                  color: issue.color,
                  value: issue.value,
                })) || []
              }
            />
          </View>
        )}
      </View>
    );
  };

  const renderTopPerformerCard = () => {
    if (!topPerformer) return null;
    return (
      <View style={styles.performerCard}>
        <Text style={styles.cardTitle}>Top Performer</Text>
        <View style={styles.performerDetails}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.avatar}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1st</Text>
            </View>
          </View>
          <Text style={styles.performerName}>
            {topPerformer.assigneeDetails.name}
          </Text>
          <Text style={styles.performerTitle}>
            {topPerformer.assigneeDetails.occupation}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreIcon}>★</Text>
            <Text style={styles.scoreValue}>{topPerformer.totalPoints}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSprintOverview = () => (
    <View style={styles.sprintCard}>
      <View style={styles.sprintHeader}>
        <Text style={styles.cardTitle}>Sprint Overview</Text>
        <Text style={styles.lastDays}>Last 7 Days</Text>
      </View>

      {sprintSummary?.length === 0 ? (
        <Text style={styles.sprintCard}>No sprints to display</Text>
      ) : (
        sprintSummary?.map((sprint, index) => (
          <View style={styles.sprintItem} key={index}>
            <Text style={styles.sprintLabel}>{sprint.sprint.name}</Text>
            <View style={styles.sprintBarContainer}>
              <View
                style={[
                  styles.sprintBar,
                  { width: "84%", backgroundColor: "#1a1464" },
                ]}
              />
            </View>
            <Text style={styles.sprintPercentage}>
              {sprint.percentageDone.toFixed(2)}%
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const renderBurndownChart = () => (
    <View style={styles.burndownCard}>
      <Text style={styles.cardTitle}>Burndown Chart</Text>
      <View style={styles.burndownChartContainer}>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun"],
            datasets: [
              {
                data: [-20, 5, 10, 15, 20, 22],
                color: () => "#1a1464",
                strokeWidth: 2,
              },
              {
                data: [22, 17, 20, 45, 58, 35],
                color: () => "#1a1464",
                strokeWidth: 2,
              },
              {
                data: [10, 20, 30, 40, 50, 60],
                color: () => "#e8e7ff",
                strokeWidth: 2,
              },
            ],
          }}
          width={320}
          height={200}
          chartConfig={{
            backgroundColor: "#f9f9fc",
            backgroundGradientFrom: "#f9f9fc",
            backgroundGradientTo: "#f9f9fc",
            decimalPlaces: 0,
            color: () => "#1a1464",
            labelColor: () => "#888",
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "0",
              stroke: "#1a1464",
            },
          }}
          bezier
          style={styles.burndownChart}
          withVerticalLines={false}
          withHorizontalLines={false}
        />
      </View>
    </View>
  );

  if (
    projectsLoading ||
    issuesSummaryLoading ||
    sprintSummaryLoading ||
    leaderboardLoading
  ) {
    return (
      <ActivityIndicator
        size="large"
        color="#1a1464"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.headerTitle}>
              {projectsLoading
                ? "Loading..."
                : activeProject?.name || "Select Project"}
            </Text>
            <View style={styles.dropdownIcon}>
              <Text style={styles.chevron}>{isDropdownOpen ? "▲" : "▼"}</Text>
            </View>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {projects.map((project, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    switchProject(project._id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {project.name} ({project.progress}%)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {activeProject ? (
          <>
            {renderStartRow()}
            {renderIssuesChart()}
            {renderTopPerformerCard()}
            {renderSprintOverview()}
            {renderBurndownChart()}
          </>
        ) : (
          <View style={styles.noProjectLabel}>
            <Text style={styles.noProjectLabelText}>No project selected</Text>
            <Text style={styles.noProjectLabelText}>
              Please select a project to continue
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Custom Circle Progress Component
const CircleProgress = ({ percentage }: { percentage: number }) => {
  const radius = 35;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg
      width={radius * 2 + strokeWidth}
      height={radius * 2 + strokeWidth}
      style={styles.svg}
    >
      <Circle
        cx={radius + strokeWidth / 2}
        cy={radius + strokeWidth / 2}
        r={radius}
        fill="transparent"
        stroke="#e8e7ff"
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={radius + strokeWidth / 2}
        cy={radius + strokeWidth / 2}
        r={radius}
        fill="transparent"
        stroke="#1a1464"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 72,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1464",
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  chevron: {
    fontSize: 16,
    color: "#1a1464",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e8e7ff",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e8e7ff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1a1464",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#f9f9fc",
    borderRadius: 16,
    padding: 20,
    width: "28%",
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1464",
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
  },
  completionContainer: {
    width: "34%",
    alignItems: "center",
  },
  completionCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    transform: [{ rotate: "-90deg" }],
  },
  percentageContainer: {
    position: "absolute",
    alignItems: "center",
  },
  percentageLabel: {
    fontSize: 10,
    color: "#777",
  },
  percentageValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1464",
  },
  chartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  issuesCard: {
    backgroundColor: "#f9f9fc",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 16,
  },
  performerCard: {
    backgroundColor: "#f9f9fc",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 16,
  },
  cardTitle: {
    color: "#1a1464",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
    color: "#777",
  },
  performerDetails: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#84b7e8",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: -5,
    backgroundColor: "#1a1464",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  performerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1464",
  },
  performerTitle: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreIcon: {
    color: "#777",
    marginRight: 4,
  },
  scoreValue: {
    color: "#777",
    fontSize: 12,
  },
  sprintCard: {
    backgroundColor: "#f9f9fc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sprintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  lastDays: {
    fontSize: 12,
    color: "#777",
  },
  sprintItem: {
    marginBottom: 12,
  },
  sprintLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  sprintBarContainer: {
    height: 8,
    backgroundColor: "#e8e7ff",
    borderRadius: 4,
    marginBottom: 4,
  },
  sprintBar: {
    height: 8,
    borderRadius: 4,
  },
  sprintPercentage: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
  },
  burndownCard: {
    backgroundColor: "#f9f9fc",
    borderRadius: 16,
    padding: 16,
  },
  burndownChartContainer: {
    alignItems: "center",
  },
  burndownChart: {
    marginLeft: -35,
    marginTop: 10,
    borderRadius: 16,
  },
  noProjectLabel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProjectLabelText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
});
