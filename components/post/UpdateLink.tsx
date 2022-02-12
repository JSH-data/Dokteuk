import Link from 'next/link';

import { Box, Button } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useState } from 'react';

export default function UpdateLink(props: any) {
  function editChange() {
    props.setEditOpen(true);
  }

  return (
    <Box sx={{ ml: 2 }}>
      <Button size="large" onClick={editChange}>
        <DriveFileRenameOutlineIcon sx={{ mr: 1 }} />
        수정하기
      </Button>
    </Box>
  );
}
