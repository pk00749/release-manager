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
      const response = await fetch(`http://localhost:5001/${serviceId}/${version}`);
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
      const response = await fetch(`http://localhost:5001/${serviceId}/${version}`, {
        method: 'POST',
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
      <h1 className="mb-4">{serviceId}-v{version}</h1>
      
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
                <Form.Label>UAT CR</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.uat_cr || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, uat_cr: e.target.value})}
                  placeholder="CHG"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>UAT Status</Form.Label>
                <Form.Select
                  value={versionInfo.uat_status}
                  onChange={(e) => setVersionInfo({...versionInfo, uat_status: e.target.value})}
                >
                  {Object.entries(STATUS_MAPPING).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <p>---------------------------------------------------------</p>
              <Form.Group className="mb-3">
                <Form.Label>PROD Status</Form.Label>
                <Form.Select
                  value={versionInfo.prod_status}
                  onChange={(e) => setVersionInfo({...versionInfo, prod_status: e.target.value})}
                >
                  {Object.entries(STATUS_MAPPING).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>PROD CR</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.prod_cr || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, prod_cr: e.target.value})}
                  placeholder="CHG"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Jira Issue</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.jira_issue || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, jira_issue: e.target.value})}
                  placeholder="Jira编号"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>GitHub Pull Request</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.github_pull_request || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, github_pull_request: e.target.value})}
                  placeholder="PR链接"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>SonarQube Scan</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.sonarqube_scan || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, sonarqube_scan: e.target.value})}
                  placeholder="扫描结果链接"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cyberflows SAST Scan</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.cyberflows_sast_scan || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, cyberflows_sast_scan: e.target.value})}
                  placeholder="SAST扫描结果"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cyberflows CONT Scan</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.cyberflows_cont_scan || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, cyberflows_cont_scan: e.target.value})}
                  placeholder="CONT扫描结果"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>ICE</Form.Label>
                <Form.Control
                  type="text"
                  value={versionInfo.ice || ''}
                  onChange={(e) => setVersionInfo({...versionInfo, ice: e.target.value})}
                  placeholder="ICE编号"
                />
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

              <Button variant="primary" onClick={handleUpdate}>Save</Button>
              <Button 
                variant="secondary" 
                className="ms-2" 
                onClick={() => {
                  setIsEditing(false);
                  fetchVersionInfo();
                }}
              >Cancel</Button>
            </Form>
          ) : (
            <>
              <p><strong>UAT Status:</strong> {STATUS_MAPPING[versionInfo.uat_status] || formatDisplayValue(versionInfo.uat_status)}</p>
              <p><strong>UAT CR:</strong> {versionInfo.uat_cr}<Button
                variant="secondary"
                className="ms-2"
                onClick={() => navigate(`/${serviceId}/versions`)}
              >Check</Button></p>
              <p>---------------------------------------------------------</p>
              <p><strong>PROD Status:</strong> {STATUS_MAPPING[versionInfo.prod_status] || formatDisplayValue(versionInfo.prod_status)}</p>
              <p><strong>PROD CR:</strong> {versionInfo.prod_cr}</p>
              <p><strong>Jira Issue:</strong> {versionInfo.prod_cr}</p>
              <p><strong>GitHub Pull Request:</strong> {versionInfo.github_pull_request}</p>
              <p><strong>SonarQube Scan:</strong> {versionInfo.sonarqube_scan}</p>
              <p><strong>Cyberflows SAST Scan:</strong> {versionInfo.cyberflows_sast_scan}</p>
              <p><strong>Cyberflows CONT Scan:</strong> {versionInfo.cyberflows_cont_scan}</p>
              <p><strong>ICE:</strong> {versionInfo.ice}</p>
              <p><strong>Release Date:</strong> {versionInfo.release_date}</p>
              <p><strong>Test Result:</strong> {TEST_RESULT_MAPPING[versionInfo.test_result] || formatDisplayValue(versionInfo.test_result)}</p>
              <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
              <Button 
                variant="secondary" 
                className="ms-2" 
                onClick={() => navigate(`/${serviceId}/versions`)}
              >
                Return
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VersionDetail;