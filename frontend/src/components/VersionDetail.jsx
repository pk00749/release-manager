import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

// 状态映射对象
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

// 格式转换函数
const formatDisplayValue = (value) => {
  return value.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const VersionDetail = () => {
  const { serviceId, version } = useParams();
  const navigate = useNavigate();
  const [versionInfo, setVersionInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchVersionInfo = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/versions/${serviceId}/${version}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVersionInfo(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching version info:', error);
      setError('无法获取版本信息');
    }
  }, [serviceId, version]);

  useEffect(() => {
    fetchVersionInfo();
  }, [fetchVersionInfo]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/versions/${serviceId}/${version}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSaveSuccess(true);
      setIsEditing(false);
      setError(null);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating version:', error);
      setError('保存失败，请重试');
    }
  };

  if (!versionInfo) return <Container className="main-container"><div>Loading...</div></Container>;

  return (
    <Container className="main-container">
      <h1 className="mb-4">v{version}</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert variant="success" className="mb-4">
          保存成功！
        </Alert>
      )}

      <Card>
        <Card.Body>
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={versionInfo.status}
                  onChange={(e) => setVersionInfo({...versionInfo, status: e.target.value})}
                >
                  {Object.entries(STATUS_MAPPING).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Release Date</Form.Label>
                <Form.Control
                  type="date"
                  value={versionInfo.release_date}
                  onChange={(e) => setVersionInfo({...versionInfo, release_date: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Test Result</Form.Label>
                <Form.Select
                  value={versionInfo.test_result}
                  onChange={(e) => setVersionInfo({...versionInfo, test_result: e.target.value})}
                >
                  {Object.entries(TEST_RESULT_MAPPING).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button variant="primary" onClick={handleUpdate}>保存</Button>
              <Button 
                variant="secondary" 
                className="ms-2" 
                onClick={() => {
                  setIsEditing(false);
                  fetchVersionInfo();
                }}
              >
                取消
              </Button>
            </Form>
          ) : (
            <>
              <p><strong>Status:</strong> {STATUS_MAPPING[versionInfo.status] || formatDisplayValue(versionInfo.status)}</p>
              <p><strong>Release Date:</strong> {versionInfo.release_date}</p>
              <p><strong>Test Result:</strong> {TEST_RESULT_MAPPING[versionInfo.test_result] || formatDisplayValue(versionInfo.test_result)}</p>
              <Button variant="primary" onClick={() => setIsEditing(true)}>编辑</Button>
              <Button 
                variant="secondary" 
                className="ms-2" 
                onClick={() => navigate(`/${serviceId}/versions`)}
              >
                返回列表
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VersionDetail; 