
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import analyzeService from '../../services/analyzeService';
import backgroundImage from '../../images/mediback.jpg';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analyze = () => {
  const [appointmentData, setAppointmentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyzeService.getLastWeekAppointmentCount();
        setAppointmentData(data);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: appointmentData.map(item => `${item._id.date} ${item._id.interval}`),
    datasets: [
      {
        label: 'Appointment Count',
        data: appointmentData.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Last Week Appointment Analysis',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date/Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Patient Count'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="analyze-container">
      <h1 style={styles.title}>Appointment Analysis</h1>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      fontSize: '40px',
      marginBottom: '10px',
      marginTop: '10px',
      marginLeft: '10px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '30px',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    chartContainer: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    backgroundImage: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
    },
    contentContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '30px',
    },
   
  };

  

export default Analyze;
