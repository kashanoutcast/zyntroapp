import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LineChart } from 'react-native-chart-kit';

// You'll need to install these packages:
// npm install react-native-svg
// npm install react-native-chart-kit

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vista App</Text>
          <View style={styles.dropdownIcon}>
            <Text style={styles.chevron}>▼</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {/* Time left card */}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>months</Text>
          </View>

          {/* Days left card */}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>days</Text>
          </View>

          {/* Completion circle */}
          <View style={styles.completionContainer}>
            <View style={styles.completionCircle}>
              <CircleProgress percentage={80} />
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageLabel}>Completed</Text>
                <Text style={styles.percentageValue}>80%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.chartsRow}>
          {/* Issues pie chart */}
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Issues</Text>
            <View style={styles.pieChartContainer}>
              <PieChart />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#e8e7ff' }]} />
                  <Text style={styles.legendText}>To Do</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#5652cc' }]} />
                  <Text style={styles.legendText}>In Progress</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#1a1464' }]} />
                  <Text style={styles.legendText}>Done</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Top performer card */}
          <View style={styles.performerCard}>
            <Text style={styles.cardTitle}>Top Performer</Text>
            <View style={styles.performerDetails}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require('../../assets/images/avatar-placeholder.png')}
                  style={styles.avatar}
                />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>1st</Text>
                </View>
              </View>
              <Text style={styles.performerName}>Zohaib Murtaza</Text>
              <Text style={styles.performerTitle}>Sr. Developer</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreIcon}>★</Text>
                <Text style={styles.scoreValue}>1800</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sprint Overview */}
        <View style={styles.sprintCard}>
          <View style={styles.sprintHeader}>
            <Text style={styles.cardTitle}>Sprint Overview</Text>
            <Text style={styles.lastDays}>Last 7 Days</Text>
          </View>

          <View style={styles.sprintItem}>
            <Text style={styles.sprintLabel}>User Registration</Text>
            <View style={styles.sprintBarContainer}>
              <View style={[styles.sprintBar, { width: '84%', backgroundColor: '#1a1464' }]} />
            </View>
            <Text style={styles.sprintPercentage}>84%</Text>
          </View>

          <View style={styles.sprintItem}>
            <Text style={styles.sprintLabel}>Account Deletion</Text>
            <View style={styles.sprintBarContainer}>
              <View style={[styles.sprintBar, { width: '23%', backgroundColor: '#1a1464' }]} />
            </View>
            <Text style={styles.sprintPercentage}>23%</Text>
          </View>
        </View>

        {/* Burndown Chart */}
        <View style={styles.burndownCard}>
          <Text style={styles.cardTitle}>Burndown Chart</Text>
          <View style={styles.burndownChartContainer}>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'],
                datasets: [
                  {
                    data: [-20, 5, 10, 15, 20, 22],
                    color: () => '#1a1464',
                    strokeWidth: 2
                  },
                  {
                    data: [22, 17, 20, 45, 58, 35],
                    color: () => '#1a1464', 
                    strokeWidth: 2
                  },
                  {
                    data: [10, 20, 30, 40, 50, 60],
                    color: () => '#e8e7ff',
                    strokeWidth: 2
                  }
                ]
              }}
              width={320}
              height={200}
              chartConfig={{
                backgroundColor: '#f9f9fc',
                backgroundGradientFrom: '#f9f9fc',
                backgroundGradientTo: '#f9f9fc',
                decimalPlaces: 0,
                color: () => '#1a1464',
                labelColor: () => '#888',
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '0',
                  stroke: '#1a1464'
                }
              }}
              bezier
              style={styles.burndownChart}
              withVerticalLines={false}
              withHorizontalLines={false}
            />
          </View>
        </View>
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
    <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} style={styles.svg}>
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

// Custom Pie Chart Component
const PieChart = () => {
  return (
    <Svg height="120" width="120" viewBox="0 0 100 100">
      {/* Done - 40% */}
      <Path
        d="M50,50 L50,5 A45,45 0 0,1 87.5,78 z"
        fill="#1a1464"
      />
      {/* In Progress - 35% */}
      <Path
        d="M50,50 L87.5,78 A45,45 0 0,1 12.5,78 z"
        fill="#5652cc"
      />
      {/* To Do - 25% */}
      <Path
        d="M50,50 L12.5,78 A45,45 0 0,1 50,5 z"
        fill="#e8e7ff"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 72,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1464',
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  chevron: {
    fontSize: 16,
    color: '#1a1464',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#f9f9fc',
    borderRadius: 16,
    padding: 20,
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1464',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  completionContainer: {
    width: '34%',
    alignItems: 'center',
  },
  completionCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  percentageContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentageLabel: {
    fontSize: 12,
    color: '#777',
  },
  percentageValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1464',
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  issuesCard: {
    backgroundColor: '#f9f9fc',
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  performerCard: {
    backgroundColor: '#f9f9fc',
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  cardTitle: {
    color: '#1a1464',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#777',
  },
  performerDetails: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#84b7e8',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: '#1a1464',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  performerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1464',
  },
  performerTitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreIcon: {
    color: '#777',
    marginRight: 4,
  },
  scoreValue: {
    color: '#777',
    fontSize: 12,
  },
  sprintCard: {
    backgroundColor: '#f9f9fc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lastDays: {
    fontSize: 12,
    color: '#777',
  },
  sprintItem: {
    marginBottom: 12,
  },
  sprintLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  sprintBarContainer: {
    height: 8,
    backgroundColor: '#e8e7ff',
    borderRadius: 4,
    marginBottom: 4,
  },
  sprintBar: {
    height: 8,
    borderRadius: 4,
  },
  sprintPercentage: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
  },
  burndownCard: {
    backgroundColor: '#f9f9fc',
    borderRadius: 16,
    padding: 16,
  },
  burndownChartContainer: {
    alignItems: 'center',
  },
  burndownChart: {
    marginLeft: -35,
    marginTop: 10,
    borderRadius: 16,
  },
});