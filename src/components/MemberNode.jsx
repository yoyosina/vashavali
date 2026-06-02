import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNavigate, useParams } from 'react-router-dom';
import './MemberNode.css';

const MemberNode = ({ data }) => {
  const navigate = useNavigate();
  const { familyCode } = useParams();

  const handleProfileClick = () => {
    navigate(`/${familyCode}/profile/${data.id}`);
  };

  return (
    <div className={`member-node glass-panel ${data.isHighlighted ? 'highlighted' : ''}`} onClick={handleProfileClick}>
      <Handle type="target" position={Position.Top} className="handle" />
      
      <div className="avatar-container">
        <img src={data.imageUrl} alt={`${data.firstName} ${data.lastName}`} className="avatar" />
      </div>
      
      <div className="member-info">
        <div className="member-name">{data.firstName} {data.lastName}</div>
        <div className="member-dates">
          {data.birthYear} - {data.deathYear || 'Present'}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  );
};

export default MemberNode;
