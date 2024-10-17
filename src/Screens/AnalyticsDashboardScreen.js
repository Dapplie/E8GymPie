import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faUsers, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';


const Dashboard = () => {

const navigation = useNavigation(); // Hook to access navigation object

  // Function to navigate to BranchDetailScreen with branchId
  const navigateToBranchDetail = (branchId) => {
    navigation.navigate('BranchDetailScreen', { branchId });
  };

    // Dummy data for demonstration
    const totalSales = 10000;
    const conversionRate = 0.05;
    const userEngagement = 80;

    // Function to handle filter selection
    const handleFilterSelection = (filter) => {
        // Logic to apply filter and update data
        console.log("Selected filter:", filter);
    };

    // Dummy recommendation for demonstration
    const recommendation = "Consider running targeted marketing campaigns to increase user engagement.";

    const gymData = [
        {
            gymName: 'Gym A',
            totalUsers: 500,
            activeUsers: 300,
            churnRate: 0.1,
            retentionRate: 0.9,
            sessionDuration: '45 min',
            pageViews: 2000,
            clickThroughRate: '5%',
        },
        {
            gymName: 'Gym B',
            totalUsers: 700,
            activeUsers: 400,
            churnRate: 0.08,
            retentionRate: 0.92,
            sessionDuration: '50 min',
            pageViews: 2500,
            clickThroughRate: '6%',
        },
        {
            gymName: 'Gym C',
            totalUsers: 600,
            activeUsers: 350,
            churnRate: 0.12,
            retentionRate: 0.88,
            sessionDuration: '40 min',
            pageViews: 1800,
            clickThroughRate: '4%',
        },
    ];

    const totalRevenue = 50000;
    const averageRevenuePerTransaction = 100;
    const revenueGrowthRate = 0.1;

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            data: [5000, 7000, 10000, 12000, 8000, 9000],
        }]
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Dashboard</Text>

                <View style={styles.analyticsContainer}>
                    <FontAwesomeIcon icon={faChartLine} style={styles.analyticsIcon} />
                    <Text style={styles.analyticsHeader}>Analytics Overview</Text>
                    <Text>This is where you can view your analytics data.</Text>
                    <View style={styles.dataSummary}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Sales</Text>
                            <Text style={styles.summaryValue}>{totalSales}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Conversion Rate</Text>
                            <Text style={styles.summaryValue}>{(conversionRate * 100).toFixed(2)}%</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>User Engagement</Text>
                            <Text style={styles.summaryValue}>{userEngagement}%</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handleFilterSelection('timePeriod')} style={styles.filterButton}>
                        <Text style={styles.filterButtonText}>Filter by Time Period</Text>
                    </TouchableOpacity>
                    <Text style={styles.recommendation}>{recommendation}</Text>
                </View>
                <View style={styles.analyticsContainer}>
                <Text style={styles.title}>User Statistics</Text>

        {gymData.map((gym, index) => (
    <View key={index} style={styles.analyticsContainer}>
        <FontAwesomeIcon icon={faUsers} style={styles.analyticsIcon} />
        <Text style={styles.analyticsHeader}>{gym.gymName}</Text>
        <Text style={styles.analyticsText}>Total Users: {gym.totalUsers}</Text>
        <Text style={styles.analyticsText}>Active Users: {gym.activeUsers}</Text>
        <Text style={styles.analyticsText}>Churn Rate: {gym.churnRate}</Text>
        <Text style={styles.analyticsText}>Retention Rate: {gym.retentionRate}</Text>
        <Text style={styles.analyticsText}>Session Duration: {gym.sessionDuration}</Text>
        <Text style={styles.analyticsText}>Page Views: {gym.pageViews}</Text>
        <Text style={styles.analyticsText}>Click-Through Rate: {gym.clickThroughRate}</Text>
    </View>
        ))}
</View>

        <View style={styles.analyticsContainer}>
            
            <FontAwesomeIcon icon={faMoneyBillAlt} style={styles.analyticsIcon} />
            <Text style={styles.analyticsHeader}>Revenue Analysis</Text>

            {/* Key Revenue Metrics */}
            <View style={styles.keyMetricsContainer}>
                <Text style={styles.keyMetricLabel}>Total Revenue</Text>
                <Text style={styles.keyMetricValue}>{totalRevenue}</Text>
            </View>
            <View style={styles.keyMetricsContainer}>
                <Text style={styles.keyMetricLabel}>Average Revenue per Transaction</Text>
                <Text style={styles.keyMetricValue}>{averageRevenuePerTransaction}</Text>
            </View>
            <View style={styles.keyMetricsContainer}>
                <Text style={styles.keyMetricLabel}>Revenue Growth Rate</Text>
                <Text style={styles.keyMetricValue}>{(revenueGrowthRate * 100).toFixed(2)}%</Text>
            </View>

                 {/* Sales Trend Chart */}
                 <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Sales Trend</Text>
                <ScrollView horizontal={true}>
                    <View style={{ width: 600 }}>
                        <BarChart
                            data={data}
                            width={400}
                            height={250}
                            yAxisLabel="$"
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                    
                                },
                            }}
                            verticalLabelRotation={30}
                            style={{ marginBottom: 20 }}
                        />
                    </View>
                </ScrollView>
            </View>
            
            {/* Revenue Breakdown */}
            {/* Insert revenue breakdown component here */}
        </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        top:10,
        marginBottom: 40,
        color: '#333',
    },
    analyticsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        bottom:10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    analyticsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    analyticsText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    analyticsIcon: {
        fontSize: 30,
        marginBottom: 10,
        color: '#f90',
    },
    dataSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    filterButton: {
        backgroundColor: '#f90',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    recommendation: {
        fontSize: 16,
        color: '#666',
    },
    keyMetricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    keyMetricLabel: {
        fontSize: 16,
        color: '#666',
    },
    keyMetricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    chartContainer: {
        marginTop: 20,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
});

export default Dashboard;
