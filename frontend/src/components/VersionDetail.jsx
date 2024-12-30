import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const VersionDetail = () => {
  const { version } = useParams();
  const [versionInfo, setVersionInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchVersionInfo();
  }, [version]);

  const fetchVersionInfo = async () => {
    const response = await fetch(`http://localhost:5000/api/version/${version}`);
    const data = await response.json();
    setVersionInfo(data);
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:5000/api/version/${version}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(versionInfo),
    });
    setIsEditing(false);
  };

  if (!versionInfo) return <div>Loading...</div>;

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Version {version} Details</h1>
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                  <option value="not_tested">Not Tested</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" onClick={handleUpdate}>保存</Button>
              <Button variant="secondary" className="ms-2" onClick={() => setIsEditing(false)}>取消</Button>
            </Form>
          ) : (
            <>
              <p><strong>Status:</strong> {versionInfo.status}</p>
              <p><strong>Release Date:</strong> {versionInfo.release_date}</p>
              <p><strong>Test Result:</strong> {versionInfo.test_result}</p>
              <Button variant="primary" onClick={() => setIsEditing(true)}>编辑</Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VersionDetail; 