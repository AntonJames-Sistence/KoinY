import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '10px',
        },
      }}
    >
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        style={{ position: 'absolute', right: 14, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {React.cloneElement(
        children as React.ReactElement<{ onClose: () => void }>,
        { onClose }
      )}
    </Dialog>
  );
};

export default Modal;
