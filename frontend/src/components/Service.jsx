import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import services from '../data/service.json';

const STATUS_MAPPING = {
  'pending': '待发布',
  'in_progress': '进行中',
  'completed': '已完成',
  'cancelled': '已取消'
};

const TEST_RESULT_MAPPING = {
  'not_tested': '未测试',
  'passed': '通过',
  'failed': '失败',
  'partially_passed': '部分通过'
};

const Service = () => {
  const { serviceId } = useParams();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);
  const service = services.services.find(s => s.id === serviceId);

  const fetchVersions = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/${serviceId}/versions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileList = await response.json();
      
      // 获取每个版本的详细信息
      const versionDetails = await Promise.all(
        fileList.map(async (filename) => {
          // 从文件名中直接获取版本号（不需要分割和替换）
          const version = filename.replace('.json', '');
          const detailResponse = await fetch(`http://localhost:5000/api/${serviceId}/${version}`);
          if (!detailResponse.ok) {
            throw new Error(`Error fetching version details: ${detailResponse.status}`);
          }
          return await detailResponse.json();
        })
      );

      // 按版本号排序
      const sortedVersions = versionDetails.sort((a, b) => {
        const aParts = a.version.split('.').map(Number);
        const bParts = b.version.split('.').map(Number);
        
        for (let i = 0; i < aParts.length; i++) {
          if (bParts[i] !== aParts[i]) {
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
  }, [serviceId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  if (!service) {
    return <Container className="mt-5"><Alert variant="danger">服务不存在</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">{service.name}</h1>
      <p className="text-muted">{service.description}</p>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        {versions.map((version) => (
          <Col key={version.version} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Version {version.version}</Card.Title>
                <Card.Text>
                  <Badge bg="info" className="me-2">
                    {STATUS_MAPPING[version.status] || version.status}
                  </Badge>
                  <Badge bg={version.test_result === 'passed' ? 'success' : 'warning'}>
                    {TEST_RESULT_MAPPING[version.test_result] || version.test_result}
                  </Badge>
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    计划发布日期: {version.release_date}
                  </small>
                </Card.Text>
                <Link to={`/${serviceId}/${version.version}`} className="btn btn-primary">
                  查看详情
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Service; 