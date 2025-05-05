import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';

const STATUS_MAPPING = {
  'not_started': 'Not Started',
  'in_progress': 'In Progress',
  'released': 'Released',
  'pvt': 'PVT'
};

const TEST_RESULT_MAPPING = {
  'not_tested': 'Not Tested',
  'passed': 'Passed',
  'failed': 'Failed',
  'partially_passed': 'Partially Passed'
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'not_started':
      return 'secondary';
    case 'in_progress':
      return 'info';
    case 'released':
      return 'success';
    case 'pvt':
      return 'warning';
    default:
      return 'secondary';
  }
};

const getTestResultVariant = (result) => {
  switch (result) {
    case 'not_tested':
      return 'secondary';
    case 'passed':
      return 'success';
    case 'failed':
      return 'danger';
    case 'partially_passed':
      return 'warning';
    default:
      return 'secondary';
  }
};

const ServiceVersion = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVersions();
  }, [serviceId]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(`http://localhost:5001/${serviceId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const versionList = await response.json();
      
      // 获取每个版本的详细信息
      const versionDetails = await Promise.all(
        versionList.map(async (version) => {
          const detailResponse = await fetch(`http://localhost:5001/${serviceId}/${version}`);
          if (!detailResponse.ok) {
            throw new Error(`Error fetching version details: ${detailResponse.status}`);
          }
          return await detailResponse.json();
        })
      );

      // 按版本号排序（倒序）
      const sortedVersions = versionDetails.sort((a, b) => {
        const aParts = a.version.split('.').map(Number);
        const bParts = b.version.split('.').map(Number);
        
        for (let i = 0; i < aParts.length; i++) {
          if (aParts[i] !== bParts[i]) {
            return bParts[i] - aParts[i];
          }
        }
        return 0;
      });
      
      setVersions(sortedVersions);
      setError(null);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setError('无法连接到服务器，请确保后端服务正在运行。');
    }
  };

  const handleVersionClick = (version) => {
    navigate(`/${serviceId}/${version}`);
  };

  return (
    <Container className="main-container">
      <h1 className="mb-4">{serviceId}</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Table hover responsive>
        <thead>
          <tr>
            <th>Version</th>
            <th>UAT Status</th>
            <th>PROD Status</th>
            <th>Release Date</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.version}>
              <td>
                <span 
                  className="version-link"
                  onClick={() => handleVersionClick(version.version)}
                  title="Click to view details"
                >
                  <i className="fas fa-external-link-alt me-1" style={{ fontSize: '0.8em' }}></i>
                  {version.version}
                </span>
              </td>
              <td>
                <Badge bg={getStatusVariant(version.status)}>
                  {STATUS_MAPPING[version.status] || version.status}
                </Badge>
              </td>
              <td>
                <Badge bg={getStatusVariant(version.status)}>
                  {STATUS_MAPPING[version.status] || version.status}
                </Badge>
              </td>
              <td>{version.release_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ServiceVersion; 