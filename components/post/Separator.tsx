import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function CustomSeparator(props: any) {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      {props.menu.postType === 'Rounge' ? '라운지' : '토픽'}
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/">
      {props.menu.postType === 'Rounge' ? props.menu.rounge : props.menu.topic}
    </Link>,
  ];

  return (
    <Stack spacing={2} sx={{ mt: 4, mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
