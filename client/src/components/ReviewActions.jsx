import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ReviewActions({ onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tooltip title="Edit">
        <IconButton size="small" color="primary" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
